---
title: 2018 MacOS High Sierra Setup References for Front-end Developers
layout: post
category: English
tags:
- macOS
- High Sierra
---

* TOC
{:toc}

This is an updated version for Sierra and El Capitan guide for three years. It is basically a cheatsheet for me to finish the setup after a clean re-installation. This guide is completely third-party and is only for reference because I know developers always have their own eccentricity based on the degree of their lazy.

## System Preferences

### Backup

Backup all important files and folders in `~` (music and photos if necessary)

Backup all setups and packages in Sublime text (need to do only once):

    $ cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
    $ mkdir ~/Dropbox/apps/Sublime
    $ mv User ~/Dropbox/apps/Sublime/
    $ ln -s ~/Dropbox/apps/Sublime/User

Backup `~/.ssh/id_rsa*`: the reason is that you might want to have many SSH connections depending on this. Backup the `id_rsa` and `id_rsa.pub` by using the following command:

    $ cp -r ~/.ssh <your/backup/path>;

### Basics

* Setup Dock: this is completely personal.

    1. Automatically hide and show the Dock
    2. Enable magnification;
    3. Minimize windows into application icon (not a fan of really long dock);

![](/images/Screen-Shot-2015-10-02-at-2.18.46-PM.png)


* Add Chinese simplified Input method and check "Use Caps Lock to switch input method" option (No need for Karabiner-Elements any more).
* System Preferences > Trackpad > Tap to click.
* Enable three-finger drag: System Preferences > Accessibility > Mouse Trackpad > Trackpad Options > Enable dragging (three fingers). This is a killer function when using Mac's touchpad. Don't know why Apple move this switch to this weird place.

![](/images/Screen-Shot-2015-10-02-at-2.21.52-PM.png)

* Finder > show all file extensions
* Make good uses of the screen corners: System Preferences > mission control > Hot corners

![](/images/Screen-Shot-2015-10-02-at-2.24.44-PM.png)

## Development Environment

* Download iTerm2 (Profiles > General: working dir - reuse previous session’s dir; window: transparency/blur/full-width top of screen; In Profiles > Keys, add a new shortcut <kbd>Option</kbd> + <kbd>left</kbd> and set to `Escape` + `b`, <kbd>Option</kbd> + <kbd>right</kbd> to `Escape` + `f`, <kbd>Option</kbd> + <kbd>Delete</kbd> to Send Hex Code `0x1B 0x08`, and <kbd>Fn</kbd> + <kbd>Option</kbd> + <kbd>Delete</kbd> to `Escape` + `d`) 
* Download Xcode (Start it and agree with terms)
* Install [Sublime Text 3](http://www.sublimetext.com/3)

    1. Restore settings from Dropbox:

        - `$ cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/`
        - `$ rm -r User`
        - `$ rm -r Colorsublime-Themes`
        - `$ ln -s ~/Dropbox/apps/Sublime/User`
        - `$ ln -s ~/Dropbox/apps/Sublime/Colorsublime-Themes`

    2. Install package control: `cmd+shift+p` -> install package control
    3. Theme: [El-Capitan-Theme](https://github.com/iccir/El-Capitan-Theme)

* Install [Atom](https://atom.io/)

    1. Restore atom settings from Dropbox:

        `$ ln -s ~/Dropbox/apps/Atom/.atom ~/.atom`

* Install [Chrome](http://www.google.com/chrome/)

Install Command Line Tools:

    $ xcode-select --install

Install Homebrew:

    $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/masterinstall)"`
    $ brew update

Install Node.js

    $ brew install node

Install zsh and oh-my-zsh:

    $ brew install zsh
    $ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/mastertools/install.sh)"`
`/usr/local/bin/zsh`

Install Postgres:

    $ brew install postgresql

Install MySQL:

    $ brew install mysql

Install Python:

    $ brew install python
    $ brew linkapps python

Install virtualenv:

    $ pip install virtualenv

Install virtualenvwrapper:

    $ pip install virtualenvwrapper
    $ export WORKON_HOME=~/venvs
    $ source /usr/local/bin/virtualenvwrapper.sh

Install RVM:

    $ \curl -sSL https://get.rvm.io | bash -s stable

Before run:

    $ source /Users/hao/.rvm/scripts/rvm

Reload:

    $ rvm reload

Put the cmds into `~/.zshrc`:

    source $HOME/.rvm/scripts/rvm
    export PATH="$PATH:$HOME/.rvm/bin"

Install Ruby:

    $ rvm install ruby

Set default:

    $ rvm --default use 2.3.1

Install Jekyll:

    $ gem install github-pages

## Setup Hammerspoon (for shortcuts)

[Download](http://www.hammerspoon.org/). Configuration files hosted on [Github](https://github.com/fuermosi777/hammerspoon-config).

Clone it to `~/.hammerspoon`.

## Other apps

* Dropbox
* Things3
* 1Password
* Wechat
* Sip
* Sketch
* Skitch
* [PDF Expert](https://pdfexpert.com/downloads)
* Caffeine
* PureVPN
* Slack
* [AppCleaner](https://freemacsoft.net/appcleaner/)
* Beamer
* IINA (Video player)
