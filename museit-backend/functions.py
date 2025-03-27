import datetime
import shutil
import json
import csv

import os
import re
import subprocess
import platform

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
    for sub_idx, subreddit in enumerate(list_of_subreddits):
        print(f"querying subreddit {sub_idx+1}/{len(list_of_subreddits)}")
        for submission in tqdm(reddit.subreddit(subreddit).search(query, limit=None)):
            created_utc = datetime.datetime.fromtimestamp(submission.created_utc)
            if start_date <= created_utc.date() <= end_date:
                #comments = get_comments_for_submission(submission)
                #comments=[]
                if comments_flag:
                    comments = get_comments_for_submission(submission)
                else:
                    comments=[]
                posts = posts.append({
                    'subreddit': subreddit,
                    'title': submission.title,
                    'body': submission.selftext,
                    'url': submission.url,
                    'created_utc': created_utc,
                    'num_comments': submission.num_comments,
                    'comments': comments,
                    'reddit_permalink': f"https://reddit.com{submission.permalink}"
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
    
    pattern = re.compile(r"https://open\.spotify\.com/(album|track|playlist)/([a-zA-Z0-9]+)")
    if 'comments' in df.columns:
        df['comment_urls'] = df['comments'].apply(
            lambda comments: [match.group(0) for comment in comments for match in pattern.finditer(comment)]
        )

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



# ------------- spotdl stuff

def convert_spotdl_to_csv(input_file):
    output_file = input_file.replace('.spotdl', '.csv')
    # Load the JSON data from the .spotdl file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Determine the field names by using the union of keys from all JSON objects
    fieldnames = set()
    for entry in data:
        fieldnames.update(entry.keys())
    fieldnames = list(fieldnames)

    # Helper function to convert list values to a comma-separated string
    def convert_value(value):
        if isinstance(value, list):
            return ', '.join(str(item) for item in value)
        return value

    # Write the CSV file
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for entry in data:
            # Convert any list fields into a comma-separated string
            entry_converted = {key: convert_value(entry.get(key, "")) for key in fieldnames}
            writer.writerow(entry_converted)

    # Delete the original .spotdl file after conversion
    os.remove(input_file)


# # input_file = 'spotify_metadata/playlists/2ZbkFdn7eSnTkd9E0ZeX2j.spotdl'  # Input file with .spotdl extension
# # convert_spotdl_to_csv(input_file)

def get_spotify_uri_and_type(url):
    """
    Parses a Spotify URL and returns a tuple (url_type, spotify_uri).
    If the URL does not match one of the expected types, returns ("none", None).
    """
    pattern = re.compile(r"https://open\.spotify\.com/(album|track|playlist)/([a-zA-Z0-9]+)")
    match = pattern.match(url)
    
    if match:
        url_type, spotify_id = match.groups()
        spotify_uri = f"{spotify_id}"
        return url_type, spotify_uri
    
    return "none", None
    

def fetch_metadata(url, output_folder, overwrite=False, timeout_minutes = 5):
    """
    Fetches metadata for a Spotify URL using spotdl and saves it in the given folder.
    """
    url_type, spotify_uri = get_spotify_uri_and_type(url)
    
    if url_type not in ["track", "album", "playlist"]:
        print("Invalid Spotify URL type.")
        return
    
    metadata_dir = os.path.join(output_folder, url_type + "s")
    os.makedirs(metadata_dir, exist_ok=True)
    if not overwrite and os.path.exists(os.path.join(metadata_dir, f"{spotify_uri}.csv")):
        print(f"Metadata for {url} already exists. Skipping.")
        return None
    metadata_file = os.path.join(metadata_dir, f"{spotify_uri}.spotdl")

    # Determine the spotdl executable path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    spotdl_executable = os.path.join(script_dir, "spotdl")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    system_name = platform.system()
    
    if system_name == "Windows":
        spotdl_executable = os.path.join(script_dir, "spotdl_windows.exe")
    elif system_name == "Linux":
        spotdl_executable = os.path.join(script_dir, "spotdl_linux")
    elif system_name == "Darwin":  # macOS
        spotdl_executable = os.path.join(script_dir, "spotdl_mac")
    else:
        print("Unsupported operating system.")
        return None

    # if platform.system() == "Windows":
    #     spotdl_executable += ".exe"

    # if not os.path.exists(spotdl_executable):
    #     print("Error: spotdl executable not found in the script directory.")
    #     return

    command = [spotdl_executable, "save", url, "--save-file", metadata_file]
    try:
        subprocess.run(command, capture_output=True, text=True, check=True, timeout=timeout_minutes*60)
        convert_spotdl_to_csv(metadata_file)
    except subprocess.TimeoutExpired:
        print(f"Timeout expired for {url}. Process took more than {timeout_minutes} minutes.")
        if os.path.exists(metadata_file):
            os.remove(metadata_file)
    except subprocess.CalledProcessError as e:
        print("Error fetching metadata:", e.stderr)
    
def process_spotify_links_with_spotdl(spotify_links, output_folder="spotdl_data"):
    """
    Processes a list of Spotify links, generating .spotdl files in a specified folder.
    """
    os.makedirs(output_folder, exist_ok=True)
    print("Generating .spotdl metadata for Spotify links...")
    
    for urllist in tqdm(spotify_links, desc="Processing Spotify links"):
        for url in urllist:
            fetch_metadata(url, output_folder)

# # Example usage:
# # artist_url = "https://open.spotify.com/artist/1wRPtKGflJrBx9BmLsSwlU"
# # url = "https://open.spotify.com/track/1f5aofDt2CHxCELwP8STu9"
# test_url = "https://open.spotify.com/playlist/2ZbkFdn7eSnTkd9E0ZeX2j?si=EabDFz8sRNC6eNVZSLiylQ"
# fetch_metadata(test_url)
