---
title: Publish Electron app to the Mac App Store (MAS)
layout: post
category: English
tags:
- Electron
- MAS
---

**Update 9/18/2016:**

This post is outdated. Please follow the latest [guide](https://github.com/electron/electron/blob/master/docs/tutorial/mac-app-store-submission-guide.md). The only notable thing is that Electron does not support "bookmark" entitlement, which causes applications fail to open local file or folder after reboot. [Issue](https://github.com/electron/electron/issues/4637)

**Update 4/21/2016:**

The Chrome 0.37 signing problem seems to be fixed by adding an entry to entitlements.

[Issue](https://github.com/electron/electron/issues/3871#issuecomment-206724151)

**Update 4/10/2016:**

Due to a Chrome update of version 0.37, signed Electron app won't work properly according to this [issue](https://github.com/electron/electron/issues/3871#issuecomment-206724151). Using 0.36.12 is a better choice.

**Update 4/8/2016:**

Something more should be signed as well (see demo signing file). You might receive Apple's Email informing that some files' signature are not correct. Make sure signing them.

## Main

It's not simple to publish an Electron-based app to the Mac App Store (MAS). A lot of people are using [electron-packager](https://github.com/maxogden/electron-packager) to make their lives easier. However, before they add Mac App Store support to the build system, I don't recommend to use it because until now (01/25/2016), electron-packager only supports linux, win32 and darwin platforms ([source](https://github.com/maxogden/electron-packager/blob/master/usage.txt)).

Simply using darwin platform to build will receive an email from Apple that Apple Store no longer accepts QTKit APIs. Fortunately, according to this [issue](https://github.com/maxogden/electron-packager/issues/163), the MAS support is on the way. Before that, it is wise to stick on the electron's official [guideline](http://electron.atom.io/docs/v0.34.0/tutorial/mac-app-store-submission-guide/).

It is a great guide, and yet lack some very key points.

1. Two certificates are needed: distribution and installer. The basic flow to publish on MAS is that to pack an .app package, to use $ productbuild to create a .pkg file, to upload the file using Application loader.
1. child.plist and parent.plist need to be placed in the same directory as the .sh script file (not in the app directory).
1. The last line of the signing script in the guide was incorrect: $APP_PATH should be $RESULT_PATH. I think the typo will be soon fixed (fixed on 11/20/2015).
1. Even thought your app works fine in development, to publish it to the MAS you will need Sandbox entitlements; otherwise it will be rejected in 3 seconds. In the guideline, however, no any entitlement examples. A lot of electron-based apps will need to connect to the Internet to work, and a bunch of apps need to have the read and write access to save settings. Taking these two as example, the correct writing should be like the following:

```xml
<!-- child.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>com.apple.security.app-sandbox</key>
        <true/>
        <key>com.apple.security.inherit</key>
        <true/>
    </dict>
</plist>

<!-- parent.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
      <dict>
        <key>com.apple.security.app-sandbox</key>
        <true/>
        <key>com.apple.security.network.client</key>
        <true/>
        <key>com.apple.security.files.user-selected.read-write</key>
        <true/>
      </dict>
</plist>
```

1. Also make sure that you put these two entitlements in the MAS publishing page.

1. Sometimes after all these steps, when you open the your app, you will find a blank page and the app crashes. This [issue](https://github.com/alexeyst/node-webkit-macappstore/issues/1) offers a solution: adding `-i "<com.xxx.name>"` in all codesign commands.

For my app WordMark, the signing script is like this:

```sh
#!/bin/bash
APP="WordMark"
APP_PATH="./osx/electron-v0.36.2-mas-x64/WordMark.app"
RESULT_PATH="./osx/$APP.pkg"
APP_KEY="3rd Party Mac Developer Application: <MOSAIC>"
INSTALLER_KEY="3rd Party Mac Developer Installer: <MOSAIC>"
FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Libraries/libnode.dylib"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Electron Framework"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/"
codesign --deep -fs "$APP_KEY" -i im.liuhao.wordmark.helper --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign --deep -fs "$APP_KEY" -i im.liuhao.wordmark.helper.EH --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign --deep -fs "$APP_KEY" -i im.liuhao.wordmark.helper.NP --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper NP.app/"
codesign  -fs "$APP_KEY" -i im.liuhao.wordmark --entitlements parent.plist "$APP_PATH"
productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY"
```