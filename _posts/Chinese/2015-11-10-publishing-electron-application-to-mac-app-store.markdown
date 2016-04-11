---
title: 把Electron应用发布到Mac App Store
layout: post
category: Chinese
tags:
- MAS
- Electron
---

**2016年4月10日更新**

由于Electron最近一次0.37升级中Chrome版本升级导致签名后的应用异常([issue](https://github.com/electron/electron/issues/3871#issuecomment-206724151))，在此情况下使用0.36.12版本。

## 原文

把做好的Electron应用发布到Mac App Store上需要一定的难度。首先，很多人使用[electron-packager](https://github.com/maxogden/electron-packager)来简化发布流程，但是实际上，在他们正式推出mas（Mac App Store）平台的发布包之前，我并不建议使用它。因为目前(2015年11月10日前）electron-packager只支持darwin，win32和linux三个平台。

如果使用darwin平台后，上传文件后会收到Apple的错误邮件说App Store已经不接受QTKit API。

据[可靠消息](https://github.com/maxogden/electron-packager/issues/163)，对mas的支持已经提上日程。当他们发布mas的平台后，使用electron-packager显然是更方便快速的选择。但在此之前，还是得使用electron官方的[指导指南](http://electron.atom.io/docs/v0.34.0/tutorial/mac-app-store-submission-guide/)。

这份指南写的很好，但有些地方说得不够明白。

获取Apple的证书要获取两份，一份是分发证书（distribution），另外一份是安装证书（installer）。基本的流程是，要先打包好一个app程序，然后用productbuild做成.pkg安装包，最后通过Application loader上传。安装正式则是用于做pkg。
child.plist和parent.plist需要放在执行sh代码同一路径，而不是放在app里。
在官方提供的签名脚本中最后一行有一处错误。`$APP_PATH`应该为`$RESULT_PATH`，不过应该很快就会被改正。
另外需要注意的是，把应用发布到mas需要sandbox entitlements，不然会被果断拒绝。在指南中的child.plist和parent.plist里并没有指明任何entitlements。如果应用需要网络，则需要com.apple.security.network.client，如果应用需要写入数据，则你可能需要这个`entitlement：com.apple.security.files.user-selected.read-write`。另外，这些entitlement需要添加在parent.plist中。

更完整的示例代码如下:

```
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

另外需要确保在发布的时候也要在Mas的页面中添加这两条沙盒规则。

添加好entitlements，重新签名，又一个大坑出现了：应用打开后一片空白。这个issue中给出了解决办法：即在每个codesign中加入命令`-i <com.xxx.name>`。我目前上线了一个应用WordMark使用的签名示例代码如下：

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