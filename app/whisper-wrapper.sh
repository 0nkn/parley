#!/bin/bash
# Wrapper script for Whisper transcription that handles file paths and prevents debug output

# Check if an audio file path was provided
if [ "$#" -ne 1 ]; then
    echo "Error: No audio file provided" >&2
    exit 1
fi

AUDIO_FILE_PATH="$1"

# Check if the file exists
if [ ! -f "$AUDIO_FILE_PATH" ]; then
    echo "Error: Audio file not found: $AUDIO_FILE_PATH" >&2
    exit 1
fi

# Activate the whisper environment
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
source "$SCRIPT_DIR/whisper-env/bin/activate"

# Run the Python script with the audio file path
# Suppress all warnings, only output the transcribed text
python3 -c "
import sys
import os
import warnings

# Suppress all warnings
warnings.filterwarnings('ignore')

try:
    import whisper
except ImportError:
    sys.stderr.write('Error: whisper package not installed\n')
    sys.exit(1)

try:
    # Get the audio file path from command line arguments
    audio_file = '$AUDIO_FILE_PATH'
    
    # Load the model silently (no progress output)
    model = whisper.load_model('base', download_root='/tmp/whisper')
    
    # Transcribe the audio without printing debug info
    result = model.transcribe(audio_file, fp16=False, verbose=False)
    
    # Only output the transcribed text
    transcribed_text = result.get('text', '').strip()
    if transcribed_text:
        print(transcribed_text)
    else:
        print('')
except Exception as e:
    # Send errors to stderr, not stdout
    sys.stderr.write(f'Error during transcription: {str(e)}\n')
    sys.exit(1)
" 2>/dev/null 