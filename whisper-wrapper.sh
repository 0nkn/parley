#!/bin/bash
# Path to your newly named environment
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
source "$SCRIPT_DIR/whisper-env/bin/activate"
whisper "$@"
