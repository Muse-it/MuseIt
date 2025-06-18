# MuseIt

MuseIt, a music sentiment analysis/visualisation tool. SolidJS frontend and Flask backend.

### How to use

1. Download the file appropriate for your platform from https://github.com/george-paul/MuseIt/releases.
2. Extract the zip file.
3. Obtain a [Reddit](https://www.reddit.com/r/reddit.com/wiki/api/) API Secret and ID
4. . Populate this in the `config.yaml` file.
5. Open the launch script. This file will be named `launch-<platform>`.

This will open a console window in which the  backend is running, as well as a browser windows through which one can interact with the frontend. The console window will show the progress of each request.

### Usage Notes

- The models are not bundled with the release. When the first request is made, the backend will download the required models. Allow this to finish. After which, the models will remain cached on the machine at the `huggingface` [cache dir](https://stackoverflow.com/questions/63312859/how-to-change-huggingface-transformers-default-cache-directory) and no downloads will be needed hence.
- Reddit queries make requests to the Reddit API. This can fail due to a rate limit set by Reddit. Ensure not to select too many Subclasses when submitting a filter to avoid this issue. If you encounter this issue, an error will display on the backend console specifying the same.

#### config.yaml

```yaml
# client IDs and Secrets for spotify and reddit API keys
reddit_client_id: "<client_id_here>"
reddit_client_secret: "<client_secret_here>"

# changes how long the backend will try to scrape for comment metadata
metadata_extraction_timeout_minutes: 5
```



### Possible Errors

- `Error fetching metadata: [PYI-xxxx:ERROR] Failed to execute script '__main__' due to unhandled exception!`: SpotDL scraping requires ffmpeg to be installed. You will receive this error if it isn't installed. In the release files directory run:

  ```
  ./spotdl_<platform> --download-ffmpeg
  ```
  For linux systems, you may have to explicitly give execute permissions to this file by running the command `chmod +x spotdl_linux` in the backend directory.

## Developing for MuseIt

Specifics for working on the backend and frontend are in the respective READMEs.

### How to build for distribution

0. Create a `for-dist/` (can be named anything) directory somewhere . This is the folder that'll be zipped for distribution.
1. Execute `pnpm run build` in `./museit-frontend`. And subsequently copy the contents from `./museit-frontend/dist` to `for-dist/static`. 
2. Navigate to `./museit-backend`. Before building, ensure `debug=False` in the `app.run` call in `routes.py`. You may enable this flag during development but is recommended `False` for production build.

3. Activate the conda environment that was used for development with `conda activate <env-name>`. (More instructions about this in the museit-backend README.)

4. Run the following command to build the executable. This command will build the executable for the platform on which it is run (Win/Mac/Linux):

    ```
    pyinstaller -y routes.spec
    ```
    > The `-y` switch will automatically delete and replace the previous build. Optionally, you may add `-F` for a one file build but will cause the user's launch of the executable to be slower.

5. This command will generate an executable. Copy the contents of `.museit-backend/dist/routes` to `for-dist/`. 

6. Copy an empty `config.yaml` and `praw.ini` from `./release-files` to `for-dist/`

Final tree should look something like:

```
for-dist/
├─ routes  (routes.exe on Windows)
├─ _internal/
├─ praw.ini
├─ config.yaml  (Make sure this doesn't have your API secrets!)
```

