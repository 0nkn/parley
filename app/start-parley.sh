#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Parley with Whisper support...${NC}"

# Check if whisper-env exists in the parent directory or current directory
if [ -d "../whisper-env" ]; then
  WHISPER_ENV="../whisper-env"
elif [ -d "./whisper-env" ]; then
  WHISPER_ENV="./whisper-env"
elif [ -d "../venv" ]; then
  WHISPER_ENV="../venv"
elif [ -d "./venv" ]; then
  WHISPER_ENV="./venv"
else
  echo -e "${RED}Error: whisper-env virtual environment not found.${NC}"
  echo -e "Please create it using: python -m venv whisper-env"
  echo -e "Then install whisper using: whisper-env/bin/pip install git+https://github.com/openai/whisper.git"
  exit 1
fi

echo -e "${GREEN}Found Whisper environment at: ${WHISPER_ENV}${NC}"

# Activate the virtual environment
echo -e "${YELLOW}Activating Whisper environment...${NC}"
source "${WHISPER_ENV}/bin/activate"

# Check if whisper is installed
if ! python -c "import whisper" &> /dev/null; then
  echo -e "${RED}Error: whisper is not installed in the virtual environment.${NC}"
  echo -e "Please install it using: pip install git+https://github.com/openai/whisper.git"
  deactivate
  exit 1
fi

echo -e "${GREEN}Whisper is properly installed.${NC}"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
  echo -e "${RED}Error: ffmpeg is not installed.${NC}"
  echo -e "Please install ffmpeg using your package manager:"
  echo -e "  macOS: brew install ffmpeg"
  echo -e "  Ubuntu/Debian: sudo apt install ffmpeg"
  deactivate
  exit 1
fi

echo -e "${GREEN}ffmpeg is properly installed.${NC}"

# Start the Next.js application
echo -e "${YELLOW}Starting Next.js application...${NC}"
echo -e "${GREEN}Whisper environment is active and ready to use!${NC}"
echo -e "${YELLOW}Running: npm run dev${NC}"

# Run the dev server
npm run dev

# Deactivate the virtual environment when the app exits
deactivate 