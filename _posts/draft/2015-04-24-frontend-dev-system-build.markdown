---
title: 前端开发体系建设
layout: post
category: blog
lang: cn
tags:
- Frontend
- Module
---

刚到BillGuard的时候，老板说打算把现有的company page重新弄一下，以便吸引更多投资者（更好地捞钱）。前端开发本来应该是一件很简单的事，写一写html，js和css就可以完成一个页面。把他们放到文件夹里就像这样：

```
Project
|-- company.html
|-- style.css
|-- script.js
|-- xxx.png
|-- yyy.jpg
```

开发完毕后，我们需要添加一个新页面，就叫about好了。这个好办，直接添加一个新的html页面，css和js就用原来的：

```
Project
|-- company.html
|-- about.html
|-- style.css
|-- script.js
|-- xxx.png
|-- yyy.jpg
```

好景不长，我们需要第三个页面了。这时候任何一个头脑正常的开发者就会考虑换一种更有组织的方式来管理项目，比如这样：

```
Project
|-- Page
	|-- company.html
	|-- about.html
	|-- third.html
|-- css
	|-- style.css
|-- js
	|-- script.js
|-- img
	|-- a.png
	|-- b.svg
	|-- c.jpg
```

这是大家都知道的按照文件类型来划分资源的形式。所有的css样式放在专门的css目录里，需要修改的时候找到css目录就可以了。这样的优点是直接简单，然而真的很好吗？

现在发现不管是company还是about页面，他们都拥有一个相同的导航栏和尾部。机智如我肯定不会分别写在三个不同的页面里（如果修改岂不是要改三处），而是提取一个单独的模块出来（这里使用Jade），并且为这个单独的模块单独定制一款css和js（这里不如使用LESS和Browserify来管理css和js模块），然后用Gulp合并打包压缩构建到build目录中。如此一来，项目变得更为可观：

```
Project
|-- Page
	|-- company.jade
	|-- about.jade
	|-- third.jade
	|-- nav.jade
	|-- footer.jade
|-- css
	|-- main.less
	|-- nav.less
	|-- footer.less
|-- js
	|-- nav.js
	|-- footer.js
	|-- main.js
|-- img
|-- build
	|-- main.css
	|-- main.js
```

首先来看page目录内，nav和footer明显不属于页面，却被放在page目录中，显然不符合常理，css中亦是如此，入口文件main与其他文件并非相同。[张云龙][1]在他的文章中这样提到：

> 除非你的团队只有1-2个人，你的项目只有很少的代码量，而且不用关心性能和未来的维护问题，否则，以文件为依据设计的开发概念是应该被抛弃的

我的团队只有1-2个人，但是代码量未必会少，而且考虑到设计师是个很挑剔的强迫症患者，无休止地更新和修复必不可少，因此选择语义化的开发概念才是正道。

因此，从整个项目范围内重新定义如下：

- 一个项目是由若干页面（page）组成
- 每个页面是由若干模块（module）组成
- 每个模块有自己的模板、css和js

然而web开发并不是开发模式中纯粹的面向对象，很多模块是页面独有的，为此特地写一个模块岂不是多此一举？另外，除了模块之外，css和js应该有一套所有页面公用的部分，比如css中的颜色定义、框架系统等等，该怎么办？对此有两个解决方案：

- 开发的时候分成不同模块，部署的时候打包到一起，整个网站只引用一个css和一个js文件
- 开发的时候分成不同模块，部署的时候每个页面除了引用一套公用的属性之外还要引用页面自己的模块套装

显然第一种方式来的更简单一些。作为一个强迫症前端，我希望一切东西都要简洁。因为我相信我现在写下的代码，再过两个月，我是一眼都不想看。所以我希望在开发过程把项目细分成不同模块，每个模块承载少量的内容，然后再用一个健壮的前端工程系统把一切耦合起来。最后，我规划的体系是这样的：

```
Project
|-- modules 				#模块
	|-- base 
		|-- base.jade		#基础模块，用于less和js的入口
		|-- main.less
		|-- main.js
		|-- variables.less
		|-- grid.less
		|-- ...
	|-- nav					#导航栏模块
		|-- main.jade
		|-- main.less
		|-- main.js
	|-- footer
		|-- main.jade
		|-- main.less
		|-- main.js
|-- views 					#页面结构
	|-- home.jade
	|-- company.jade
	|-- about.jade
|-- img
|-- public
	|-- css
	|-- js
```

[1]: http://www.infoq.com/cn/articles/talk-front-end-integrated-solution-part2

