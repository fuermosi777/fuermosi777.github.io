---
title: MacOS automation and shortcuts with Hammerspoon
layout: post
category: English
tags:
- util
---

* TOC
{:toc}

## Introduction

I have been committing to free my hand from mouse for a very long time. As a programmer, it's easy to get frustrated when I have to switch from mouse and keyboard. That's why I use [Hammerspoon](http://www.hammerspoon.org/) --- a perfect solution for OS X automation and a lot of other features. I will explain some of my most useful features when I use Hammerspoon in this post.

First of all, even though Lua has a very simple module manage system. I intend not to use it since I want to just copy and paste my configuration file text from Github. I don't want to setup some sort of git repo for `./hammerspoon`, even though it seems more intuitive. I don't have too many requirements from Hammerspoon. I think it should be a very simple helper tool for developers.

## My recipes of `~/.hammerspoon/init.lua`

### Open application with <kbd>alt</kbd> + <kbd>?</kbd>

This is one of my favorite feature. Opening an application by holding two keys in the keyboard, is something I've used for year since I used Windows. Before I discovered Hammerspoon, I have tried Bettertools and Alfred (with PowerPack) to do that. But Bettertools involves a lot of unused feaetures, and PowerPack is expensive.

Here is my solution with Hammerspoon:

```lua
--- A closure function
function open(name)
    return function()
        hs.application.launchOrFocus(name)
        if name == 'Finder' then
            hs.appfinder.appFromName(name):activate()
        end
    end
end

--- quick open applications
hs.hotkey.bind({"alt"}, "E", open("Finder"))
hs.hotkey.bind({"alt"}, "W", open("WeChat"))
hs.hotkey.bind({"alt"}, "C", open("Google Chrome"))
hs.hotkey.bind({"alt"}, "T", open("iTerm"))
hs.hotkey.bind({"alt"}, "X", open("Xcode"))
hs.hotkey.bind({"alt"}, "S", open("Sublime Text"))
hs.hotkey.bind({"alt"}, "V", open("Visual Studio Code"))
hs.hotkey.bind({"alt"}, "I", open("IntelliJ IDEA"))
hs.hotkey.bind({"alt"}, "M", open("NeteaseMusic"))
```

So that I can just tap <kbd>alt</kbd> and <kbd>c</kbd> to open Chrome.

### Open a certain Chrome tab with <kbd>alt</kbd> + <kbd>?</kbd>

For some apps such as Slack and HipChat, I want to run it as a web app in the browser, and I also want to quick switch to it. It's a little tricky because Hammerspoon doesn't have API for third party applications such as Chrome. So we need [JXA](https://github.com/dtinth/JXA-Cookbook) to help with this. JXA is that using Javascript to complete some automation in OS X. Here is my solution:

```lua
function chrome_active_tab_with_name(name)
    return function()
        hs.osascript.javascript([[
            // below is javascript code
            var chrome = Application('Google Chrome');
            chrome.activate();
            var wins = chrome.windows;

            // loop tabs to find a web page with a title of <name>
            function main() {
                for (var i = 0; i < wins.length; i++) {
                    var win = wins.at(i);
                    var tabs = win.tabs;
                    for (var j = 0; j < tabs.length; j++) {
                    var tab = tabs.at(j);
                    tab.title(); j;
                    if (tab.title().indexOf(']] .. name .. [[') > -1) {
                            win.activeTabIndex = j + 1;
                            return;
                        }
                    }
                }
            }
            main();
            // end of javascript
        ]])
    end
end

--- Use
hs.hotkey.bind({"alt"}, "H", chrome_active_tab_with_name("HipChat"))
```

### Move windows to 30%, 50% and 70% of the left/right of the screen

I used Spectacle to achieve this until I discovered Hammerspoon. Why do I need one more application when I can use Hammerspoon to achieve it?

Here is my solution:

```lua
function move(dir)
    local counter = {
        right = 0,
        left = 0
    }
    return function()
        counter[dir] = _move(dir, counter[dir])
    end
end

function _move(dir, ct)
    local screenWidth = hs.screen.mainScreen():frame().w
    local focusedWindowFrame = hs.window.focusedWindow():frame()
    local x = focusedWindowFrame.x
    local w = focusedWindowFrame.w
    local value = dir == 'right' and x + w or x
    local valueTarget = dir == 'right' and screenWidth or 0
    if value ~= valueTarget then
        hs.window.focusedWindow():moveToUnit(hs.layout[dir .. 50])
        return 50
    elseif ct == 50 then
        hs.window.focusedWindow():moveToUnit(hs.layout[dir .. 70])
        return 70
    elseif ct == 70 then
        hs.window.focusedWindow():moveToUnit(hs.layout[dir .. 30])
        return 30
    else
        hs.window.focusedWindow():moveToUnit(hs.layout[dir .. 50])
        return 50
    end
end

--- window
hs.window.animationDuration = 0
hs.hotkey.bind({"ctrl", "cmd"}, "Right", move('right'))
hs.hotkey.bind({"ctrl", "cmd"}, "Left", move('left'))
```

### Quick switch Chrome users, or open incognito mode

Another killer feature. If you have multiple users of Chrome, it could be hard for you to find the correct window. Here is a solution:

```lua
function chrome_switch_to(ppl)
    return function()
        hs.application.launchOrFocus("Google Chrome")
        local chrome = hs.appfinder.appFromName("Google Chrome")
        local str_menu_item
        if ppl == "Incognito" then
            str_menu_item = {"File", "New Incognito Window"}
        else
            str_menu_item = {"People", ppl}
        end
        local menu_item = chrome:findMenuItem(str_menu_item)
        if (menu_item) then
            chrome:selectMenuItem(str_menu_item)
        end
    end
end

--- open different Chrome users
hs.hotkey.bind({"alt"}, "1", chrome_switch_to("Hao"))
hs.hotkey.bind({"alt"}, "2", chrome_switch_to("Yahoo!"))
hs.hotkey.bind({"alt"}, "`", chrome_switch_to("Incognito"))
```

### Quick put computer to sleep mode

```lua
--- sleep
hs.hotkey.bind({"control", "alt", "command"}, "DELETE", sleep)
```

### When connected to work Wifi, mute the computer to avoid awkward moment

Sometimes when I accidentally click a Youtube video at office, the loud music will make everyone staring at me. To avoid such moment, I can setup a water for Wifi, so that whenever the computer connects to the work Wifi, it will mute itself if it's using default output speaker.

```lua
local workWifi = 'YFi'
local outputDeviceName = 'Built-in Output'
hs.wifi.watcher.new(function()
    local currentWifi = hs.wifi.currentNetwork()
    local currentOutput = hs.audiodevice.current(false)
    if not currentWifi then return end
    if (currentWifi == workWifi and currentOutput.name == outputDeviceName) then
        hs.audiodevice.findDeviceByName(outputDeviceName):setOutputMuted(true)
    end
end):start()
```

### Quick add a new reminder

I spent a lot of time on this recipe. It is very useful to me as I am a heavy user of Apple's Reminder app. It is a built-in app and yet powerful. However, it doesn't provide very many options on shortcuts. With JXA, I can create a workflow so that I can add a quick reminder with remind time to any list I have.

```lua
function addReminder()
    hs.osascript.javascript([[
        var current = Application.currentApplication();
        current.includeStandardAdditions = true;
        var app = Application('Reminders');
        app.includeStandardAdditions = true;

        var td = new Date(); 

        var dateMap = {
            'Tonight': (function() { var d = new Date(); d.setHours(19, 0, 0, 0); return d; })(),
            'Tomorrow morning': (function() { var d = new Date(); d.setHours(10, 0, 0, 0); d.setHours(d.getHours() + 24); return d; })(),
            'Tomorrow night': (function() { var d = new Date(); d.setHours(19, 0, 0, 0); d.setHours(d.getHours() + 24); return d; })(),
            'This saturday': new Date(td.getFullYear(), td.getMonth(), td.getDate() + (6 - td.getDay()), 10, 0, 0, 0),
            'This sunday': new Date(td.getFullYear(), td.getMonth(), td.getDate() + (7 - td.getDay()), 10, 0, 0, 0) 
        };

        try {
            var content = current.displayDialog('Create a new Reminder', {
                defaultAnswer: '',
                buttons: ['Next', 'Cancel'],
                defaultButton: 'Next',
                cancelButton: 'Cancel',
                withTitle: 'New Reminder',
                withIcon: Path('/Applications/Reminders.app/Contents/Resources/icon.icns')
            });
            
            var list = current.chooseFromList(['TO DO', 'TO BUY', 'TO WATCH'], {
                withTitle: 'List Selection',
                withPrompt: 'Which list?',
                defaultItems: ['TO DO'],
                okButtonName: 'Next',
                cancelButtonName: 'Cancel',
                multipleSelectionsAllowed: false,
                emptySelectionAllowed: false
            })[0];
            
            var remindDate = current.chooseFromList(Object.keys(dateMap), {
                withTitle: 'Due Date Selection',
                withPrompt: 'When?',
                okButtonName: 'OK',
                cancelButtonName: 'Cancel',
                multipleSelectionsAllowed: false,
                emptySelectionAllowed: true
            });
            var remindMeDate = remindDate.length === 1 ? dateMap[ remindDate[0] ] : null;
            
            var entry = app.Reminder({
                name: content.textReturned,
                remindMeDate: remindMeDate
            });
            
            app.lists[list].reminders.push(entry);
            
        } catch (err) {}
    ]])
end

--- Use
hs.hotkey.bind({"ctrl", "alt", "cmd"}, "R", addReminder)
```

![](/images/hammerspoon-reminder-demo-1.png)

![](/images/hammerspoon-reminder-demo-2.png)

![](/images/hammerspoon-reminder-demo-3.png)

### Create a keyboard macro

As a Javascript developer who is not good at debugging, I spent 10% of my coding time typing `console.log`. The following snippet allows me to type that text with a combo of shortcuts, without using any additional applications.

```
function keyStrokes(str)
    return function()
        hs.eventtap.keyStrokes(str)
    end
end
hs.hotkey.bind({"ctrl", "alt", "cmd"}, "L", keyStrokes("console.log("))
```

You can find all of my configurations [HERE](https://github.com/fuermosi777/utils/blob/master/hammerspoon/init.lua)