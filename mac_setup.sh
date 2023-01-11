#!/usr/bin/env bash

if [[ $(command -v brew) == "" ]]; then
    echo "Installing Homebrew"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

if [[ $(command -v nvm) == "" ]]; then
    echo "Installing NVM"
    brew install nvm
fi

if [[ $(command -v npm) == "" ]]; then
    echo "Installing node via NVM"
    nvm install lts
fi

if [[ $(command -v yarn) == "" ]]; then
    echo "Installing yarn"
    brew install yarn
fi

# Setup VS Code
FILE=/Applications/Visual\ Studio\ Code.app
if [ ! -e "$FILE" ]
then
    brew install --cask visual-studio-code
    code --install-extension ms-playwright.playwright
fi

echo "Setup complete"
