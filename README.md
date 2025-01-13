# MuseIt

MuseIt, a music sentiment analysis/viz tool. SolidJS frontend and Flask backend.

## How to use

1. Download the file appropriate for your platform from https://github.com/george-paul/MuseIt/releases.
2. Extract the zip file.
3. Obtain a Reddit and Spotify API Secret and ID. Populate this in the `secrets.yaml` file.
4. Open the launch script. This file will be named `launch-<platform>`.

This will open a console window in which the backend is running, as well as a browser windows through which one can interact with the frontend. The console window will show the progress of each request.

## Usage Notes

- The models are not bundled with the release. When the first request is made, the backend will download the required models. Allow this to finish. After which, the models will remain cached on the machine at the `huggingface` [cache dir](https://stackoverflow.com/questions/63312859/how-to-change-huggingface-transformers-default-cache-directory) and no downloads will be needed hence.
- Reddit queries make requests to the Reddit API. This can fail due to a rate limit set by Reddit. Ensure not to select too many Subclasses when submitting a filter to avoid this issue. If you encounter this issue, an error will display on the backend console specifying the same.

## How to develop

Details on developing for MuseIt are found in the READMEs within the `museit-frontend` and `museit-backend` directories. Instructions on how to create a release are in the backend README. 