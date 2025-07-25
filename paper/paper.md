---
title: "Muse-it: A Tool for Analyzing Music Discourse on Reddit"
tags:
  - Python
  - Reddit
  - Music Information Retrieval
  - Musicology
  - Social Media
  - Data Analysis
  - NLP
authors:
  - name: Jatin Agarwala
    corresponding: true
    affiliation: 1
    orcid: 0009-0006-3479-3522
  - name: George Paul
    affiliation: 1
  - name: Nemani Harsha Vardhan
    affiliation: 1
  - name: Vinoo Alluri
    affiliation: 1
affiliations:
  - name: International Institute of Information Technology, Hyderabad
    index: 1
    ror: 05f11g639
date: 17 June 2025
bibliography: paper.bib
---

# Summary

Muse-it is a user-friendly software tool that helps researchers collect and analyze online discussions about music from Reddit. The software allows users to search for specific  topics and gather posts and comments from across the platform into a csv file. Muse-it can then highlight patterns in the discussions—such as emotions, themes, and musical preferences—and link them to related tracks on Spotify. It also creates interactive visualizations to help users explore trends and group similar topics together. By focusing on naturally occurring online conversations, Muse-it makes it easier to study how people talk about music in real-life settings, without the influence of laboratory environments or questionnaires. While many of Muse-it’s features are tailored to music research, the tool is flexible and can be used by researchers in other fields interested in analyzing Reddit discourse on any topic.

# Introduction

![Muse-it](figures/Muse-it%20Visual.svg)  
*Figure 1: We introduce Muse-it, a tool to retrieve,  process, visualize, and analyze music-related Reddit discourse using search queries. Furthermore, it provides metadata of the tracks, albums, and playlists linked in the extracted data for further analysis.*

Reddit is a social media platform built around user-created communities called subreddits, where users can interact anonymously. While other platforms impose character limits or induce social desirability bias, Reddit’s anonymity encourages users to share experiences freely and openly. Users often post links to personal music choices, including playlists, providing an organic source of data on musical experiences and relationships with music.

A range of studies has demonstrated the versatility of Reddit data within MIR and music perception and cognition. For example, @if_i_like_2024 scraped ~5000 threads from r/ifyoulikeblank to compare human and algorithmic music recommendations, highlighting extra-musical factors in human suggestions. ASMR and music-induced frisson were analyzed via Reddit comments in @asmr_article, supporting Huron’s frisson theory @huron_2006.

Reddit’s anonymity enables vulnerable populations to discuss sensitive topics openly. @bhavyajeet analyzed r/depression and r/depressionMusic to identify music-listening strategies and their acoustic and lyrical properties. @sharon2024 examined r/autism discussions, revealing pop and electronica preferences among individuals with ASD, contrasting earlier findings. These studies showcase the value of first-person accounts in music psychology research.

The presence of subreddits also allows exploration of niche communities. Studies of genre-specific forums (e.g., metal, jazz) have examined identity construction and emotional associations @mishra-etal-2021-metal. @Veselovsky_Waller_Anderson_2021 created a 1.3M-instance dataset of music sharing on Reddit, exploring macro-scale cultural dimensions of online music sharing.

Despite these insights, MIR research has yet to fully exploit Reddit data due to technical barriers in data retrieval, processing, and organization. Muse-it addresses this gap by streamlining the retrieval, analysis, and visualization of Reddit data for music research, lowering the technical barrier for interdisciplinary studies.

# Statement of Need

Traditional laboratory-based research into music behavior and cognition often suffers from biases such as social desirability, demand characteristics, and limited ecological validity. Naturalistic settings like Reddit offer an opportunity to study music engagement as it organically occurs, reducing these biases. In recent years, Reddit has grown as a valuable resource for social science research due to its large user base, topic-specific communities, and candid discourse. However, its use in musicology remains limited. This is not due to a lack of potential, but rather the technical barrier to accessing and analyzing Reddit data. Easier access to Reddit data could therefore unlock new possibilities for music researchers, enabling wider participation in large-scale, ecologically valid research.

Assembling and processing Reddit data, integrating it with music metadata, and generating meaningful visualizations pose significant technical challenges. Existing tools such as PRAW [@botzer2022analysis] facilitate basic Reddit data extraction, and SpotDL [@bhavyajeet] retrieves track metadata, but no unified framework bridges these tasks for music-focused research.

Moreover, a need for dialogue between Music Information Retrieval (MIR) and music psychology was raised over a decade ago [@seven_problems_2013; @mell_ann_2012], but remains relevant even today. MIR often emphasizes computational accuracy and engineering performance, while overlooking psychological and contextual dimensions of music experience. Conversely, music cognition research tends to underutilize the large-scale analytical capabilities that MIR offers. Muse-it is designed to bridge this gap by providing a scalable, naturalistic framework for studying musical discourse that can be used by both MIR practitioners and psychological researchers.

Existing tools such as PRAW [@praw] facilitate basic Reddit data extraction, and SpotDL [@spotDL] retrieves track metadata, but no unified framework bridges these tasks for music-focused research. Muse-it addresses these gaps by offering:

- Automated retrieval of Reddit posts and comments matching custom queries across multiple subreddits.
- Optional NLP-based annotation of themes, emotions, and sentiment using TweetNLP [@camacho-collados-etal-2022-tweetnlp; @antypas2023robust].
- Topic modeling and hierarchical clustering via BERTopic [@camacho-collados-etal-2022-tweetnlp] and Sentence-BERT [@reimers-2020-multilingual-sentence-bert].
- Extraction of Spotify metadata (artist, genre, release date, popularity, lyrics) through SpotDL integration.
- A cross-platform GUI (SolidJS frontend, Flask backend) for configuring queries, filtering results, and generating interactive visualizations.

Muse-it's ability to organically combine Reddit discourse with rich track metadata from Spotify allows researchers to bridge the gap between qualitative insights and quantitative attributes. Muse-it can therefore serve as an invaluable tool for mixed-methods research in the field of musicology that empowers researchers to validate existing inferences in more ecologically valid settings and generate novel hypotheses. By lowering the technical barriers to big data analytics, Muse-it enables a broader community of researchers to explore the nuanced relationships between online discourse and music. It is also worth noting that the tool can be used by researchers outside the field of musicology for data retrieval and analysis.

# Muse-it architecture and functionality

Muse-it comprises four modules (Figure 1):

1.  **Data retrieval from Reddit** 
2.  **NLP-based metadata extraction (emotion, sentiment, topics)** 
3.  **Visualization and hierarchical topic clustering** 
4.  **Spotify track metadata extraction via SpotDL**

![Muse-it pipeline](figures/Muse-it%20pipeline.svg)  
*Figure 2: Muse-it pipeline.*

## Reddit Data Retrieval

Data retrieval uses the Reddit API [@reddit_api] and PRAW [@praw]. Muse-it searches for subreddits matching a query, allows user selection, and retrieves up to 1000 posts per subreddit. Filters for date range, comments, and Spotify URLs are provided. Metadata retrieved includes subreddit name, title, body, URL, comment count, and creation time. Spotify URLs in posts and (optionally) comments are identified for later metadata extraction. Retrieval of 10,000 posts typically takes 5–10 minutes.

## Metadata Generation using NLP

Post titles are processed to generate themes, emotions, and sentiment using TweetNLP [@camacho-collados-etal-2022-tweetnlp]. Titles are favored for efficiency. NLP processing of 10,000 posts takes ~4 minutes.

![Emotion time series](figures/emotion%20ts%20final.png)  
*Figure 3: Monthly time-series of emotions for "sad music" posts.*

## Topic Clustering and Visualization

Muse-it visualizes metadata distributions and temporal trends. It uses BERTopic [@grootendorst2022bertopic] with Sentence-BERT embeddings [@reimers-2020-multilingual-sentence-bert] for hierarchical clustering and 2D topic maps. 

![Hierarchical clustering of topics](figures/Muse-it%20HC2.svg)  
*Figure 5: Hierarchical clustering of topics.*

It also created wordcloud visualizations of the retrieved text.

![Wordcloud](figures/wordcloud.png)  
*Figure 4: Word cloud for "sad music" posts.*

## Track Metadata Extraction

Spotify URLs are processed with SpotDL [@spotDL] to extract track, album, and playlist metadata (e.g., name, artist, album, genres, release date, lyrics). Metadata extraction of 100 tracks takes ~2 minutes; timeouts prevent excessively long processing.

## Data Download

Muse-it outputs a primary CSV (`data.csv`) with Reddit content and metadata, and separate CSVs for Spotify metadata organized by URI (Figure 6). CSV sizes vary but are typically tens of megabytes.

![Key CSV headers for Reddit and Spotify metadata](figures/Muse-it%20csv%20headers.svg)  
*Figure 6: Key CSV headers for Reddit and Spotify metadata.*

# Comparison to Existing Software

While PRAW provides basic Reddit API access and SpotDL handles Spotify metadata, neither offers a unified pipeline for music-focused discourse analysis for researchers. By automating the retrieval and organization of online discourse, Muse-it reduces the complexity that is traditionally associated with big data. It enables researchers to focus on extracting meaningful insights rather than grappling with data curation challenges.

# Installation

1. Download the file appropriate for your platform from https://github.com/george-paul/MuseIt/releases.
2. Extract the zip file.
3. Obtain a [Reddit](https://www.reddit.com/r/reddit.com/wiki/api/) API Secret and ID
4. . Populate this in the `config.yaml` file.
5. Open the launch script. This file will be named `launch-<platform>`.

This will open a console window in which the  backend is running, as well as a browser windows through which one can interact with the frontend. The console window will show the progress of each request.

# Usage

1. Enter search query (e.g., “sad music”), select subreddits, date range, and filters.
2. Click “Run” to retrieve and process data.
3. Explore visualizations for themes, sentiments, emotions, topics, and trends.
4. Download CSV files for further analysis.

We have created a demo of the tool along with the data used to create the visualizations, which can be found at <https://drive.google.com/drive/folders/1DtQZ7oRwrp4LPSu8-EajPTWX_l93WOs4?usp=sharing>

Instructions on how to use, develop, build, and test Muse-it can be found in the [README](https://github.com/george-paul/MuseIt/blob/master/README.md) of the repository.

# Acknowledgements

We thank the developers of PRAW, SpotDL, TweetNLP, BERTopic, and Sentence-BERT for their open-source contributions.

# References
