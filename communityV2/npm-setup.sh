#!/bin/bash

function directory_exists {
	if [ -d $1 ]; then
		return 1
	else
		return 0
	fi
}

function program_is_installed {
  local return_=1
  type $1 >/dev/null 2>&1 || { local return_=0; }
  return $return_
}

function setup_npm_globals {
    echo "check rimraf is installed"
    cmd="npm install -g rimraf"
    if program_is_installed rimraf; then
        eval "$cmd"
        echo "rimraf installation completed"
    else
        echo "rimraf already installed"
    fi
}

function install_latest_nvm {

    echo "check nvm is installed"
    cmd="curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash"
    if program_is_installed nvm; then
        eval "$cmd"
        cmd="source ~/.nvm/nvm.sh"
        eval "$cmd"
        echo "nvm installation completed"
    else
        echo "nvm already installed"
    fi
}

function install_latest_npm {
    echo "check local npm version"
    currentNpm=`npm --version`
    echo "$currentNpm"
    if [ "$currentNpm" == "6.10.2" ]; then
        echo "latest npm version installed"
    else
        echo "install latest npm"
        local cmd="npm install -g npm@6.10.2"
        eval "$cmd"
    fi
}

function install_latest_node {
    echo "check local node version"
    current=`node --version`
    echo "$current"
    if [ "$current" == "v12.7.0" ]; then
        echo "latest node version installed"
    else
        echo "install latest node"
        local cmd="nvm install v12.7.0"
        eval "$cmd"
        cmd="nvm use v12.7.0"
        eval "$cmd"
    fi
}

source ~/.nvm/nvm.sh
install_latest_node
setup_npm_globals
node --version
npm --version

task="$1"
echo "$1"
eval "$task"
