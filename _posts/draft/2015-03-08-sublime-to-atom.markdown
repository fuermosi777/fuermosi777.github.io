---
title: 从Sublime Text 3到Atom
layout: post
category: blog
lang: cn
tags:
- Atom
---

最近从Sublime Text 3转到Github的Atom，开了一个web项目，觉得很不错，也因为一直以来没有购买Sublime而时不时需要点击弹出的对话框而不堪其扰，决定把主力开发工具转移到Atom上来。以下为使用过程中的一点感受和想法。

#安装Atom

Atom是Github出品，其实质运行在浏览器引擎之特性也非常有趣。其最新版本可从[atom 网站][1]下载到。为了证明其本质是一个运行在Chromium的网页，在Atom新打开的页面使用快捷键`command`+`option`+`i`可以打开熟悉的开发界面。 

![](/media/blog/2.png)

#安装Monokai主题

虽然转到Atom，但是对Sublime的默认主题念念不忘（配色特别好看），因此找到了[Monokai][2]主题安装。安装方法为使用快捷键`command`+`,`打开settings，然后选择Theme，搜索Monokai即可快速下载安装。

#安装命令行工具

打开Atom菜单，找到Install Shell Commands安装`apm`，这是一个类似node.js里的`npm`包管理器的东西。

#设置Line Wrap

Atom默认的设置是不换行，对于某些HTML界面在小屏幕的显示实在太难受。使用快捷键`command`+`，`打开设置，然后点击Open Config Folder。找到`config.cson`打开，然后在`editor`下面添加代码`softWrap: true`。例如：

```
editor:
	fontSize: 11
	invisibles: {}
	fontFamily: "menlo"
	softWrap: true
```

#一些Packages

ST的优秀之处在于数不尽的让开发过程变得简单快速的套件包。Atom继承了这一优秀传统，而且由于其Web的特性使得套件包可以用JavaScript，导致套件的数量呈现爆炸式增长。一般常用功能的Packages在Atom的[网站][3]上都可以找到。

- atom-beautify，重新indent代码
- jslint，验证Javascript
- csslint，验证CSS语法

#后续

使用了Atom一段时间最后还是切换回了ST3.主要是因为启动速度较慢使得使用Atom的时候有点像打开Xcode或者Eclipse的感觉。但是Atom的开发速度和迭代更新都很迅速，在可见的未来可以预见它的潜力之巨大。

#参考

1. http://www.infoq.com/cn/news/2014/05/atom
2. https://atom.io/
3. https://github.com/kevinsawicki/monokai
4. http://air.googol.im/2014/03/07/first-glance-at-atom.html
5. https://discuss.atom.io/t/turn-on-line-wrap/1627/2

[1]: https://atom.io/
[2]: https://github.com/kevinsawicki/monokai
[3]: https://atom.io/packages
