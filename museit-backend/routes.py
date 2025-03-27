import sys
from functions import *
from flask import Flask, request, jsonify, send_from_directory,render_template
from flask_cors import CORS
# import requests
app = Flask(__name__, static_folder='./static', static_url_path="", template_folder='./static')
cors = CORS(app, resources={r"/*": {"origins": "*"}}) # Might pose a security risk but unsure whether it is so when only running on localhost
import warnings
import os
warnings.filterwarnings("ignore")


# -------------------
# serves frontend
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("/static/" + path):
        return send_from_directory('static', path)
        

#localhost:5000/query/"depression music"
@app.route('/query/<query>', methods=['GET'])
def query(query):
    posts = initial_freq_given_query(query)
    print(query,posts)
    return posts

#http://127.0.0.1:5000/scrape
#example json
#{
#     "query": "Depression Music",
#     "list_of_subreddits": [
#         "teenagers",
#         "PlaylistsSpotify"
#     ],
#     "start_date": "2022-01-01",
#     "end_date": "2024-12-31",
#     "comments_flag": true
# }
@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.json
    query = data.get('query')
    list_of_subreddits = data.get('list_of_subreddits')
    if type(list_of_subreddits) == str:
        import ast
        list_of_subreddits = ast.literal_eval(list_of_subreddits)
    start_date = data.get('start_date')
    if type(start_date) == str:
        start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
    end_date = data.get('end_date')
    if type(end_date) == str:
        end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
    comments_flag = data.get('comments_flag')

    if not all([query, list_of_subreddits, start_date, end_date]):
        return jsonify({'error': 'Missing parameters'}), 400
    print(query,list_of_subreddits,start_date,end_date,comments_flag)
    posts = subreddits_posts_and_comments_given_query(query, list_of_subreddits, start_date, end_date, comments_flag)
    return posts.to_dict()
#http://127.0.0.1:5000/metadata
# {
#     "query": "Depression Music",
#     "list_of_subreddits": [
#         "teenagers",
#         "PlaylistsSpotify"
#     ],
#     "start_date": "2022-01-01",
#     "end_date": "2024-12-31",
#     "comments_flag": true,
#     "metadata_flag": true
# }
@app.route('/generate', methods=['POST'])
@app.route('/generate', methods=['POST'])
def scrape_with_metadata():
    data = request.json
    query = data.get('query')
    list_of_subreddits = data.get('list_of_subreddits')
    if type(list_of_subreddits) == str:
        import ast
        list_of_subreddits = ast.literal_eval(list_of_subreddits)
    start_date = data.get('start_date')
    if type(start_date) == str:
        start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
    end_date = data.get('end_date')
    if type(end_date) == str:
        end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
    comments_flag = data.get('comments_flag')
    metadata_flag = data.get('metadata_flag')
    spotdl_flag = data.get('spotdl_flag')
    
    if not all([query, list_of_subreddits, start_date, end_date]):
        return jsonify({'error': 'Missing parameters'}), 400
    
    print(query, list_of_subreddits, start_date, end_date, comments_flag, metadata_flag, spotdl_flag)
    posts = subreddits_posts_and_comments_given_query(query, list_of_subreddits, start_date, end_date, comments_flag)
    path_to_save = f'plots/{query}'
    os.makedirs(path_to_save, exist_ok=True)
    if metadata_flag:
        metadata = generate_metadata(posts)
        metadata.to_csv(os.path.join(path_to_save, "metadata.csv"), index=False)
        save_all_plots(path_to_save, metadata)
    else:
        metadata = process_text_to_spotify_links(posts)
    
    if spotdl_flag:
        spotify_links = metadata['spotify_links'].tolist()
        print(spotify_links)
        if spotify_links != []:
            process_spotify_links_with_spotdl(spotify_links, os.path.join(path_to_save, "spotdl_data"))
        else:
            print("No spotify links found!")
    
    if metadata.empty:
        return metadata.to_dict()
    return metadata.to_dict()


# @app.route('/plots/<query>', methods=['GET'])
# def generate_plots(query):
#     metadata = pd.read_csv(f'{query}/metadata.csv')
#     save_all_plots(query,metadata)
#     return jsonify({'message': 'Plots generated successfully'}), 200

def get_plots_path():
    if getattr(sys, 'frozen', False):
        # We're running in a bundle
        return os.path.join(os.path.dirname(sys.executable), 'plots')
    # We're running in a normal Python environment
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'plots')

@app.route('/plots/<path:path>')
def send_report(path):
    plots_path = get_plots_path()
    if not os.path.exists(plots_path):
        os.makedirs(plots_path)
    return send_from_directory(plots_path, path)

if __name__ == '__main__':
    app.run(debug=False)