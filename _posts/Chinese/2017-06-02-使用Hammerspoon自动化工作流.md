---
title: 使用Hammerspoon自动化工作流
layout: post
category: Chinese
tags:
- util
---

![](/images/hammerspoon-bg.png)

* TOC
{:toc}

## 引言

作为程序员，我一直致力于避免来回从鼠标/触摸板和键盘之间切换。因为程序员花大量的时间在黑漆漆的屏幕上，而鼠标相比键盘来说效率要逊色太多，这一点随着屏幕尺寸的增大越发明显。最近我发现了一个叫做[Hammerspoon](http://www.hammerspoon.org/)的强大工具。下面我会分享一些我自己的使用技巧和心得。有些技巧非常有用，能够极大提升电脑的日常使用效率，进而缓解因非编程行为引起的焦虑感，最后提升程序员的幸福指数。

Hammerspoon的配置文件用Lua语言编写。尽管Lua提供了不错的模块系统。但我倾向于避免使用它。因为我一般习惯于把这些配置文件放在Github上，每次需要更新的时候，一个简单的复制粘贴就可以轻松搞定，而不需要用命令行再去`git pull`。另外我认为Hammerspoon这种工具的初衷是以最简洁的方式来帮助程序员解决一些日常操作的问题，因此创造太多的文件无异于自找麻烦。

## 我的一些配置：`~/.hammerspoon/init.lua`

### 1. 使用<kbd>alt</kbd> + <kbd>字母</kbd>组合键快速启动应用

这是我最常用的功能。从Windows时代开始我就一直尽量把常用的应用放在快捷键中，而不是用鼠标去点击那些图标。一旦熟悉了这种操作方式，生命会延长很多时间。使用Mac系统后，我先后使用了Bettertools和Alfred的PowerPack来完成这项功能，而Betterment格外引入了一些我完全不需要的功能，而PowerPack价格昂贵。自从有了Hammerspoon，这些软件通通都不需要了。

这是我用Hammerspoon的解决方案:

```lua
--- 一个闭包函数
function open(name)
    return function()
        hs.application.launchOrFocus(name)
        if name == 'Finder' then
            hs.appfinder.appFromName(name):activate()
        end
    end
end

--- 快速打开Finder，微信，Chrome等等
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

你可以按自己的需求添加或修改快捷键。但目前我发现使用<kbd>alt</kbd>键加上字母键是一个非常好的选择。因为默认的<kbd>alt</kbd>和字母是打出一些拉丁文，这个需求很少有人用到。

### 2. 使用<kbd>alt</kbd> + <kbd>字母</kbd>快速打开某个Chrome标签页

有一些应用是运行在网页中的单页应用，比如Slack，HipChat，甚至Gmail。传统方式打开这些页面，非得先打开Chrome窗口，然后在上面的标签栏找到想找的页面。非常费事费力。因此我使用Hammerspoon来完成跟上一个功能类似的快捷键。

这里我们需要用到[JXA](https://github.com/dtinth/JXA-Cookbook)，即使用javascript代码提供的API来完成一些自动化工作流，这是Mac系统自Yosemite以来新添加的功能，另外一个选择是AppleScript，但是这个语法复杂，实在太麻烦了。Hammerspoon可以直接运行javascript的代码：

```lua
function chrome_active_tab_with_name(name)
    return function()
        hs.osascript.javascript([[
            // 以下为javascript代码
            var chrome = Application('Google Chrome');
            chrome.activate();
            var wins = chrome.windows;

            // 循环查找符合页面标题的标签页，并使之激活
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
            // javascript结束
        ]])
    end
end

--- Use
hs.hotkey.bind({"alt"}, "H", chrome_active_tab_with_name("HipChat"))
```

这样，直接按住<kbd>alt</kbd>和<kbd>h</kbd>快捷键，我就可以直接打开HipChat的web应用了。开发JXA有个技巧，可以直接在Mac提供的Script Editor中开发，API文档可以通过菜单栏中的Library中找到。如果没有某些应用的话，需要点击Library上方的加号添加。

### 3. 快速修改窗口为屏幕尺寸的30%, 50%或者70%

Spectacle提供这一功能，但是既然使用了Hammerspoon，也就没必要再额外添加另外一个应用了。以下为解决方案：

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

### 4. 快速切换Chrome用户，打开隐身模式窗口

工作人士在办公室使用电脑时常会在Chrome的工作用户和个人用户之间切换（后者用来浏览一些私人内容）。用鼠标来切换无疑是浪费生命的行为。前端程序员经常会使用隐私模式来确保网页没有缓存。尽管Chrome提供了快捷键，但是如果当前应用不是Chrome的话，是没办法使用的。以下是使用Hammerspoon来搞定的方案，基本上就是切换到Chrome应用后模拟用户点击菜单栏。

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

### 5. 休眠Mac

没什么可说的。

```lua
--- sleep
hs.hotkey.bind({"control", "alt", "command"}, "DELETE", sleep)
```

### 6. 连接到工作网络WIFI后，自动静音电脑

在办公室时有时会误点一些视频或者带有音乐的网页。如果音乐优美倒也无妨，但是如果是令人尴尬的声音则会造成负面影响。因此使用Hammerspoon来让电脑一旦连接到工作Wifi就自动静音。

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

### 7. 快速添加提醒事项

我是Mac自带软件“提醒”的重度使用者。每次添加提醒的时候，选择时间是一个大问题。“提醒”这个软件非常简洁强大，但是并没有提供一些常用的快捷键。因此使用Hammerspoon和JXA大法了来完成自动化。

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

按住<kbd>control</kbd>，<kbd>alt</kbd>，<kbd>command</kbd>和<kbd>R</kbd>以后，会出现下列对话框：

![](/images/hammerspoon-reminder-demo-1.png)

![](/images/hammerspoon-reminder-demo-2.png)

![](/images/hammerspoon-reminder-demo-3.png)

所有配置文件可以在[这里](https://github.com/fuermosi777/utils/blob/master/hammerspoon/init.lua)找到。