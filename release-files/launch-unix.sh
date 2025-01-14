#!/bin/bash

# Change to the script's directory (double clicking scripts on mac makes the script run in the home dir)
cd -- "$(dirname "$0")" || exit

# make the script executable if it isn't already
if [[ ! -x "$0" ]]; then
    chmod +x "$0"
    exec "$0" "$@"
    exit 0
fi


xdg-open http://localhost:5000/
./routes
exit
