---
title: 2015 MacOS Sierra Setup References for Front-end Developers
layout: post
category: English
tags:
- OS X
---

This is an updated version for El Capitan guide last year. It is basically a cheatsheet for me to finish the setup after a clean re-installation. This guide is completely third-party and is only for reference because I know developers always have their own eccentricity based on the degree of their lazy.

## System Preferences

*   Backup all important files and folders in `~`
*   Backup all setups and packages in Sublime text
*   Backup `~/.ssh/id_rsa*` first. The reason is that you might want to have many SSH connections depending on this. Backup the `id_rsa` and `id_rsa.pub` by using the following command: `cp ~/.ssh/id_rsa* <your/backup/path>;`
*   Setup Dock: this is completely personal.

    1.  Automatically hide and show the Dock
    2.  Enable magnification;
    3.  Minimize windows into application icon (not a fan of really long dock);

![](/images/Screen-Shot-2015-10-02-at-2.18.46-PM.png)

*   Download [Scroll Reverser](https://pilotmoon.com/scrollreverser/). I like the nature scroll action of touchpad, but I just can't accept it when using mouse. This tool helps me to reverse the scroll direction of the mouse.
*   Download [Sogou input method](http://pinyin.sogou.com/mac/?r=pinyin) (System Preferences > Keyboard > check Automatically switch to a document’s input source): if you are a Chinese speaker, then you will know how irreplaceable this app is.
*   System Preferences > Security &amp; Privacy > Allow apps downloaded from Anywhere

![](/images/Screen-Shot-2015-10-02-at-2.17.06-PM.png)

*   System Preferences > Trackpad > Tap to click.
*   Enable three-finger drag: System Preferences > Accessibility > Mouse Trackpad > Trackpad Options > Enable dragging (three fingers). This is a killer function when using Mac's touchpad. Don't know why Apple move this switch to this weird place.

![](/images/Screen-Shot-2015-10-02-at-2.21.52-PM.png)

*   Finder > show all file extensions
*   Make good uses of the screen corners: System Preferences > mission control > Hot corners

![](/images/Screen-Shot-2015-10-02-at-2.24.44-PM.png)

## Development Environment

*   Download iTerm2 (Profiles > General: working dir - reuse previous session’s dir; window: transparency/blur/top of screen)

![](/images/Screen-Shot-2015-10-02-at-2.24.44-PM1.png)

*   Install Dropbox
*   Install [Sublime Text 3](http://www.sublimetext.com/3)

    1.  View > Sidebar > Show open files
    2.  install [Package control](https://packagecontrol.io/installation)
    3.  Must-have Plugin list:

        1.  Babel
        2.  HTML-CSS-JS Prettify
        3.  LESS
        4.  Jade

    4.  Preferences:

        *   `"translate_tabs_to_spaces": true`
        *   `"word_wrap": true`

    5. Theme: [El-Capitan-Theme](https://github.com/iccir/El-Capitan-Theme)

*   Install [Chrome](http://www.google.com/chrome/)
*   Install [Alfred 2](https://www.alfredapp.com), setup shortcuts for apps (should install Powerpack)

![](/images/Screen-Shot-2015-10-02-at-2.39.49-PM.png)

*   Setup Mail
*   Download Xcode (Start it and agree with terms)
*   Install Command Line Tools `$ xcode-select --install`
*   Homebrew: `$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
*   Install Node.js `$ brew install node`
*   zsh &amp; oh-my-zsh:

    1.  `$ brew install zsh`
    2.  `$ wget --no-check-certificate https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh`
    3.  `$ sudo vi /etc/shells`
    4.  `/usr/local/bin/zsh`

*   Postgres: `$ brew install postgresql`
*   MySQL: `$ brew install mysql`
*   Python: `$ brew install python`
*   virtualenv: `$ pip install virtualenv`
*   virtualenvwrapper:

    1.  `$ pip install virtualenvwrapper`
    2.  `$ export WORKON_HOME=~/venvs`
    3.  `$ source /usr/local/bin/virtualenvwrapper.sh`

## Other apps

* Wechat
* Sip
* Sketch
* IntelliJ IDEA
* Skitch
* NetEase music
* PDF Expert
* ExpressVPN