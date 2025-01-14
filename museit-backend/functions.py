import datetime
import shutil

import praw
import pandas as pd
from spotipy import Spotify, SpotifyClientCredentials
from tqdm import tqdm

import yaml

with open('secrets.yaml', 'r', encoding="utf-8") as file:
    secrets = yaml.safe_load(file)

spotify_client_id = secrets['spotify_client_id']
spotify_client_secret = secrets['spotify_client_secret']
reddit_client_id = secrets['reddit_client_id']
reddit_client_secret = secrets['reddit_client_secret']

spotify = Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=spotify_client_id, client_secret=spotify_client_secret))
reddit = praw.Reddit(client_id=reddit_client_id, client_secret=reddit_client_secret, user_agent="datacollection",check_for_async=False)   

###########################################################################
########################## reddit query functions #########################
###########################################################################
###########################################################################
########## get user from comments and try anonymyzing it as well ##########
###########################################################################
def initial_freq_given_query(query):
    print("Reddit API called from Function initial_freq_given_query")
    freq = {}
    for submission in reddit.subreddit("all").search(query,limit=None):
        subreddit = submission.subreddit.display_name
        freq[subreddit] = freq.get(subreddit, 0) + 1
    return sorted(freq.items(), key=lambda x: x[1], reverse=True)
def get_comments_for_submission(submission):
    comments = []
    submission.comments.replace_more(limit=None)
    for comment in submission.comments.list():
        comments.append(comment.body)
    return comments
def subreddits_posts_and_comments_given_query(query, list_of_subreddits, start_date, end_date,comments_flag=False):
    # Return the data as a DataFrame

    print("Reddit API called from Function subreddits_posts_and_comments_given_query")
    posts = pd.DataFrame()
    all_subs = "+".join(list_of_subreddits)
    if comments_flag:
        print("with comments")
    print("searching reddit in r/: ", "\n-".join(list_of_subreddits))
    for submission in tqdm(reddit.subreddit(all_subs).search(query, limit=None)):
        created_utc = datetime.datetime.fromtimestamp(submission.created_utc)
        if start_date <= created_utc.date() <= end_date:
            if comments_flag:
                comments = get_comments_for_submission(submission)
            else:
                comments=[]
            posts = posts.append({
                'subreddit': submission.subreddit.display_name,
                'title': submission.title,
                'body': submission.selftext,
                'url': submission.url,
                'created_utc': created_utc,
                'num_comments': submission.num_comments,
                'comments': comments
            }, ignore_index=True)
    return posts

###########################################################################
########################### tweetnlp and models ###########################
###########################################################################
def generate_metadata(df):
    import tweetnlp
    print("Processing Metadata from TweetNLP")
    sentiment_model = tweetnlp.load_model('sentiment')
    emotion_model = tweetnlp.load_model('emotion')
    topic_twit_model  = tweetnlp.load_model('topic_classification', multi_label=False)
    sentimentl=[]
    emotionl=[]
    topicl=[]
    for i in tqdm(range(len(df))):
        sentence=df["title"][i]
        if sentence == sentence:
            tp=topic_twit_model.topic(sentence)
            topicl.append(tp["label"])
            st=sentiment_model.sentiment(sentence)
            sentimentl.append(st["label"])
            em=emotion_model.emotion(sentence)
            emotionl.append(em["label"])
        else:
            topicl.append("NA")
            sentimentl.append("NA")
            emotionl.append("NA")
    df["topics"]=topicl
    df["sentiment"]=sentimentl
    df["emotion"]=emotionl
    try:
        df = process_text_to_spotify_links(df)
    except ValueError:
        print("--- No results for the given filter! ---")
    return df

###########################################################################
####################### links processing and spotipy ######################
###########################################################################
from urlextract import URLExtract

def extract_spotify_data(df, url_column):
    print("Extracting Spotify Data")
    df['ArtistNames'] = [[] for _ in range(len(df))]
    df['TrackNames'] = [[] for _ in range(len(df))]
    df['SpotifyURIs'] = [[] for _ in range(len(df))]
    df['AudioFeatures'] = [[] for _ in range(len(df))]
    for index, row in tqdm(df.iterrows(), total=df.shape[0]):
        url_list = row[url_column]
        for url in url_list:
            parts = url.split("/")
            if len(parts) < 2:
                continue
            spotify_type = parts[-2]
            spotify_id = parts[-1].split("?")[0]

            try:
                if spotify_type == 'track':
                    track_info = spotify.track(spotify_id)
                    df.at[index, 'ArtistNames'].append(track_info['artists'][0]['name'])
                    df.at[index, 'TrackNames'].append(track_info['name'])
                    df.at[index, 'SpotifyURIs'].append(track_info['uri'])

                elif spotify_type in ['playlist', 'album']:
                    if spotify_type == 'playlist':
                        playlist_info = spotify.playlist(spotify_id)
                        tracks = playlist_info['tracks']['items']
                    else:
                        album_info = spotify.album(spotify_id)
                        tracks = album_info['tracks']['items']

                    for item in tracks:
                        track = item['track'] if spotify_type == 'playlist' else item
                        if track:
                            df.at[index, 'ArtistNames'].append(track['artists'][0]['name'])
                            df.at[index, 'TrackNames'].append(track['name'])
                            df.at[index, 'SpotifyURIs'].append(track['uri'])
            except Exception as e:
                print(f"Error processing Spotify URL: {url}. Error: {e}")

    return df
def process_text_to_spotify_links(df, columns_to_merge=["title","body","url"]):
    print("Processing Spotify Links from Text")
    if not all(col in df.columns for col in columns_to_merge):
        raise ValueError("One or more specified columns do not exist in the DataFrame.")
    df['merged_text'] = df[columns_to_merge].apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)
    df["merged_text"] = df["merged_text"].str.replace(r"[", " ")
    df["merged_text"] = df["merged_text"].str.replace(r"]", " ")
    df["merged_text"] = df["merged_text"].str.replace(r"(", " ")
    df["merged_text"] = df["merged_text"].str.replace(r")", " ")
    extractor = URLExtract()
    tqdm.pandas(desc="Extracting URLs")
    df['all_links'] = df['merged_text'].progress_apply(lambda text: extractor.find_urls(text, only_unique=True))
    df['spotify_links'] = df['all_links'].apply(lambda urls: [url for url in urls if 'spotify.com' in url])
    df.drop(["merged_text"],axis=1)
    #df=extract_spotify_data(df, 'spotify_links')
    return df

###########################################################################
############################ plotting functions ###########################
###########################################################################
import plotly.express as px
import plotly.graph_objs as go
def plot_category_percentage(df, column_name):
    category_count = df[column_name].value_counts()
    category_percentage = (category_count / df.shape[0]) * 100
    colors = px.colors.qualitative.Plotly
    if len(category_percentage) > len(colors):
        colors = colors * (len(category_percentage) // len(colors) + 1)
    colors = colors[:len(category_percentage)]
    fig = px.bar(
        x=category_percentage.index,
        y=category_percentage.values,
        labels={'y':'Percentage', 'x':column_name},
        title=f"Percentage Distribution of {column_name}",
        color=category_percentage.index,  # This assigns a unique color based on the category
        color_discrete_sequence=colors    # This uses the list of colors defined above
    )
    return fig
def plot_histogram(df, column_name, title='Top 10 Histogram'):
    value_counts = df[column_name].value_counts().reset_index()
    value_counts.columns = [column_name, 'Count']
    top_10_values = value_counts.sort_values(by='Count', ascending=False).head(10)
    fig = px.bar(top_10_values, x=column_name, y='Count', title=title)
    return fig
def plot_time_series(df, date_column, category_column, freq='M'):
    df[date_column]=pd.to_datetime(df[date_column])
    grouped = df.groupby([pd.Grouper(key=date_column, freq=freq), category_column]).size().reset_index(name='counts')
    fig = px.line(
        grouped,
        x=date_column,
        y='counts',
        color=category_column,
        title=f"Time Series of {category_column} Counts",
        labels={'counts': 'Number of occurrences'}
    )
    return fig
from wordcloud import WordCloud, STOPWORDS
import matplotlib.pyplot as plt
def generate_wordcloud(column):
    text = ' '.join(column)
    stopwords = set(STOPWORDS)
    stopwords.update(['https','t','co']) # add additional stopwords here
    wordcloud = WordCloud(max_words=100, background_color='white', colormap='Blues', stopwords=stopwords, width=800, height=400).generate(text)
    plt.figure(figsize=(800/100, 400/100))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    return plt

def save_all_plots(folder_name,df):
    import os
    import zipfile
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
    fig=generate_wordcloud(df["title"])
    fig.savefig(f'{folder_name}/wordcloud.png')
    listx=["topics","sentiment","emotion"]
    listy=["D","W","M"]
    #hierarchial
    from bertopic import BERTopic
    from flair.embeddings import TransformerDocumentEmbeddings
    from scipy.cluster import hierarchy as sch
    try:
        print("Generating hierarchical topics...")
        roberta = TransformerDocumentEmbeddings('roberta-base')
        data = (df['title'].fillna('').astype(str) + " " + df['body'].fillna('').astype(str)).tolist()
        topic_model = BERTopic(verbose=True)
        topics, probs = topic_model.fit_transform(data)
        linkage_function = lambda x: sch.linkage(x, 'single', optimal_ordering=True)
        hierarchical_topics = topic_model.hierarchical_topics(data, linkage_function=linkage_function)

        # Visualize hierarchical topics
        fig = topic_model.visualize_hierarchy(hierarchical_topics=hierarchical_topics, linkage_function=linkage_function, top_n_topics=20)
        fig.write_html(f'{folder_name}/hierarchical_topics.html')

        # Visualize topics
        fig = topic_model.visualize_topics()
        fig.write_html(f'{folder_name}/topics_visualization.html')

        # topic txts and zip
        topic_txts=pd.DataFrame({'topic': topics, 'document': data})
        topic_folder = os.path.join(folder_name, 'topics_txts')
        os.makedirs(topic_folder, exist_ok=True)
        for topic_id in range(topic_txts['topic'].max() + 1):
            if topic_id < 20:  # Only save topics less than 20
                topic_docs = topic_txts[topic_txts['topic'] == topic_id]['document']
                with open(f'{topic_folder}/topic_{topic_id}.txt', 'w', encoding='utf-8') as f:
                    f.write('\n'.join(topic_docs))
        shutil.make_archive(os.path.join(folder_name, 'topic_txts'), 'zip', topic_folder)


    except Exception as e:
        print(f"Error generating hierarchical topics: {e}")
    for i in listx:
        cat_percent_filename = f'{folder_name}/{i}_percentage.html'
        plot_category_percentage(df, i).write_html(cat_percent_filename)
        for j in listy:
            temporal_filename = f'{folder_name}/{i}_time_series_{j}.html'
            plot_time_series(df, 'created_utc', i, freq=j).write_html(temporal_filename)




# -------- Old version --------
# def save_all_plots(folder_name,df):
#     import os
#     if not os.path.exists(folder_name):
#         os.makedirs(folder_name)
#     fig=generate_wordcloud(df["title"])
#     fig.savefig(f'{folder_name}/wordcloud.png')
#     listx=["topics","sentiment","emotion"]
#     listy=["D","W","M"]
#     #hierarchial
#     from bertopic import BERTopic
#     from flair.embeddings import TransformerDocumentEmbeddings
#     roberta = TransformerDocumentEmbeddings('roberta-base')
#     from scipy.cluster import hierarchy as sch
#     data = (df['title'].fillna('').astype(str) + " " + df['body'].fillna('').astype(str)).tolist()
#     topic_model = BERTopic(verbose=True)
#     topics, probs = topic_model.fit_transform(data)
#     linkage_function = lambda x: sch.linkage(x, 'single', optimal_ordering=True)
#     hierarchical_topics = topic_model.hierarchical_topics(data, linkage_function=linkage_function)
#     fig=topic_model.visualize_hierarchy(hierarchical_topics=hierarchical_topics)
#     fig.write_html(f'{folder_name}/hierarchical_topics.html')
#     fig=topic_model.visualize_topics()
#     fig.write_html(f'{folder_name}/topics_visualization.html')
#     for i in listx:
#         cat_percent_filename = f'{folder_name}/{i}_percentage.html'
#         plot_category_percentage(df, i).write_html(cat_percent_filename)
#         for j in listy:
#             temporal_filename = f'{folder_name}/{i}_time_series_{j}.html'
#             plot_time_series(df, 'created_utc', i, freq=j).write_html(temporal_filename)
            
def list_directory_two_levels(path):
    import os
    # Check if the path exists
    if not os.path.exists(path):
        print(f"Path {path} does not exist")
        return
    
    # List contents of the main directory
    print(f"\n{path}/")
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        
        # Print first level item
        prefix = "├── " if item != os.listdir(path)[-1] else "└── "
        print(f"{prefix}{item}")
        
        # If it's a directory, list its contents (second level)
        if os.path.isdir(item_path):
            for subitem in os.listdir(item_path):
                subitem_prefix = "│   ├── " if subitem != os.listdir(item_path)[-1] else "│   └── "
                if item == os.listdir(path)[-1]:
                    subitem_prefix = "    ├── " if subitem != os.listdir(item_path)[-1] else "    └── "
                print(f"{subitem_prefix}{subitem}")