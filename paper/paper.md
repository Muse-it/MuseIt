---

title: 'Muse-it: A Tool for Analyzing Music Discourse on Reddit'
tags:

* Python
* TypeScript
* music information retrieval
* social media
* data analysis
  authors:
* name: Jatin Agarwala
  affiliation: 1
  corresponding: true
* name: George Paul
  affiliation: 1
* name: Nemani Harsha Vardhan
  affiliation: 1
* name: Vinoo Alluri
  affiliation: 1
  affiliations:
* name: International Institute of Information Technology, Hyderabad
  index: 1
  date: 17 June 2025
  bibliography: paper.bib

---

# Summary

Muse-it is an open-source platform for retrieving, processing, and visualizing large-scale Reddit discussions focused on music-related queries. It enables researchers to collect posts and comments across subreddits, apply NLP pipelines for sentiment, emotion, and theme extraction, perform topic modeling and clustering, and link discourse to Spotify content metadata via SpotDL. Muse-it lowers the barrier to mixed-methods music research by integrating social media discourse analysis with quantitative track-level features, fostering interdisciplinary investigations into music behavior in ecological settings.

# Statement of Need

Researchers in musicology, cognitive science, and music information retrieval (MIR) increasingly seek to leverage social media discussions to study real-world listening behaviors and emotional responses at scale. However, assembling and processing Reddit data, integrating it with music metadata, and generating meaningful visualizations pose significant technical challenges, particularly for those without extensive computational expertise. Existing tools such as PRAW \[@botzer2022analysis] facilitate basic Reddit data extraction, and SpotDL \[@bhavyajeet] retrieves track metadata, but no unified framework bridges these tasks for music-focused research.

Muse-it addresses this gap by offering:

* Automated retrieval of Reddit posts and comments matching custom queries across multiple subreddits.
* Optional NLP-based annotation of post titles for themes, emotions, and sentiment using TweetNLP \[@camacho-collados-etal-2022-tweetnlp; @antypas2023robust].
* Topic modeling and hierarchical clustering of discourse via BERTopic \[@grootendorst2022bertopic] and Sentence-BERT embeddings \[@reimers-2020-multilingual-sentence-bert].
* Extraction of Spotify track, album, and playlist metadata (e.g., artist, genre, release date, popularity, lyrics) through SpotDL integration.
* A cross-platform GUI (SolidJS frontend, Flask backend) for configuring queries, filtering results, and generating interactive visualizations.

By combining qualitative and quantitative analyses, Muse-it empowers researchers to formulate and test hypotheses about music engagement, mood regulation, and cultural dynamics using ecologically valid data from Reddit.

# Comparison to Existing Software

While PRAW provides access to Reddit’s API for generic data retrieval, it lacks built-in support for large-scale filtering, NLP annotation, or linkage to music streaming metadata. SpotDL can download audio and metadata from Spotify URLs but does not natively process social media discourse. Other MIR-focused tools (e.g., \[@Veselovsky\_Waller\_Anderson\_2021]; \[@if\_i\_like\_2024]) demonstrate the value of Reddit data but require bespoke pipelines. Muse-it integrates end-to-end functionality—from query to visualization—specifically tailored for music discourse analysis.

# Installation

To run Muse-it, download the platform release for your operating system from the [GitHub repository](https://github.com/george-paul/MuseIt/releases). Ensure the following requirements are met:

**Requirements**

* **Python** ≥ 3.12
* **Node.js** ≥ 16.0
* **FFmpeg** (required by SpotDL for metadata extraction)
* **Reddit API credentials**: set `reddit_client_id` and `reddit_client_secret` in `config.yaml` (see below)
* **Environment**: SolidJS frontend and Flask backend

**Installation Steps**

1. Extract the downloaded archive.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt   # backend dependencies
   npm install                       # frontend dependencies
   ```
3. Populate `config.yaml`:

   ```yaml
   reddit_client_id: "<your_id>"
   reddit_client_secret: "<your_secret>"
   metadata_extraction_timeout_minutes: 5
   ```
4. Launch the application:

   ```bash
   ./launch-<platform>   # e.g., launch-linux or launch-windows
   ```

# Usage

1. In the GUI, enter a search query (e.g., “sad music”), select subreddits, date range, and optional filters (comments, NLP metadata).
2. Click “Run” to retrieve and process data. Progress displays in the console and browser.
3. Explore visualizations for themes, sentiments, emotions, topic clusters, and temporal trends.
4. Download the resulting CSV files (Reddit data and Spotify metadata) for further analysis.

# Acknowledgements

We thank the developers of PRAW, SpotDL, TweetNLP, BERTopic, and Sentence-BERT for their open-source contributions.

# References
