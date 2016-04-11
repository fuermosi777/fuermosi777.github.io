---
title: 前端响应式设计与实现 - 一周工作总结
layout: post
category: blog
lang: cn
tags:
- Responsive
- Bootstrap
- LESS
---

本周主要内容是完成公司页面的最终效果，基本上就是在不同的设备尺寸间切换。尽管这个页面基于Bootstrap，但是后来的开发过程中实际用到的Bootstrap模块并不多，只有它的grid系统略有涉及，但很多地方都进行了高度自定义化。在这种情况下需要下载Bootstrap的LESS文件自己进行编译。

自行编译Bootstrap我个人的原则是绝对不碰Bootstrap原来的LESS文件，以免将来Bootstrap升级的时候无法知道自己究竟自定义了哪些模块。但是不像Susy的设计，一开始就是为了给开发人员提供grid系统解决方案，Bootstrap并没有提供LESS的mixin或者variable供开发者调用，而由于这个项目自定义程度较高，需要改动很多variables。

我的解决办法是，在Bootstrap的LESS文件之外使用自己的`bootstrap.less`，然后按需引入Bootstrap内的模块。而一些基础模块，比如`variable.less`，则自定义后引入主文件。整体文件结构如下：

```
|-- less
	|-- main.less
	|-- bootstrap.less
	|-- variable.less
	|-- bootstrap (original)
		|-- bootstrap.less
		|-- variable.less
		|-- ...
```

这样即使Bootstrap更新版本也可以直接把新版本放到原来的Bootstrap目录即可。

Bootstrap的响应式栅格系统采取的是“container固定 + 整体浮动”的设计。具体来说，就是在大尺寸设备下，在每个breakpoint之间container的尺寸是固定的，而窗口的宽度浮动变化，因此每个container的宽度必须要小于这个设备下窗口的宽度。在这个维度内设计和开发页面需要准备四种不同的design方案，分别是mobile, portrait, landscape和desktop。它们的尺寸如下：

```
Type		min			max			code		
mobile		0px			767px		xs		
portrait	768px		1023px		sm
landscape	1024px		1449px		md
desktop		1450px		--px		lg
```	

三个breakpoint则分别是768px, 1024px和1450px。跟原本Bootstrap的设计并不同，因此需要在`varialble.less`的这份copy中修改。

确定好了大体框架，剩下的过程就比较简单了。但是由于这个项目半路接手，并没有和设计师在一开始就确认好颜色、margin等重用的内容，因此后续的维护过程很麻烦。

下图是设计师开始的设计，中间两个为协商之后添加的新版面。

![](/media/blog/3.jpg)

我使用[GluePrint](http://glueprintapp.com/)来确保设计的实现，最终误差不会超过1px。网站的最终效果放到了[Heroku](http://bg-company-page.herokuapp.com/)上。接下来需要对性能缓慢不堪的JavaScript进行优化。下周估计可以完成这个项目了。