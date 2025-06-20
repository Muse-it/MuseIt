# MuseIt-Backend
Flask server backend that contains AI things used by MuseIt. Also serves the frontend.

## How to run

1. Initialise a conda environment from the provided `<os>_environment.yml`, use the appropriate yml file for you OS [ref](https://stackoverflow.com/a/48016620). (the author prefers [mamba](https://mamba.readthedocs.io/en/latest/installation/mamba-installation.html)/[micromamba](https://mamba.readthedocs.io/en/latest/installation/micromamba-installation.html) over conda, but conda also works)
   ```
   conda env create --name museit --file=<os>_env.yml
   ```

   The install/download can take a while.

2. Activate the newly created env
   ```
   conda activate museit
   ```

3. Run the app
   ```
    python routes.py
   ```

   (If any import errors come up, install the required dependencies with `conda install <dep>`)

## Things to note

##### IMPORTANT: Ensure no routes are the same between the frontend and the backend.
Reason: All routes that don't match the specified backend routes will be served directly. If the browser requests a route that is specified in the backend, the response will be served.

### Downloading models
Running the app without a model cached, which is usually the case when hitting `/generate` for the first time on a machine, will trigger a download of the required models. Allow the download to finish. On subsequent requests, the app should use the cached models. Make sure to warn users of the same.

### routes.spec
```py
from PyInstaller.utils.hooks import collect_data_files
from PyInstaller.utils.hooks import copy_metadata

# Collect URLExtract and tweetnlp data files
urlextract_datas = collect_data_files('urlextract')
tweetnlp_datas = collect_data_files('tweetnlp')

# Other bits of code....

   datas=[
      ('./static', 'static'),
      *urlextract_datas,
      *tweetnlp_datas,
      *copy_metadata('tweetnlp'),
      *copy_metadata('urlextract')
   ],
```

The above code was added to ensure files need by `urlextract` and `tweetnlp` are present (namely one tld cache file). The snippet also specifies instructions that will include the files from `./static` and other required files.