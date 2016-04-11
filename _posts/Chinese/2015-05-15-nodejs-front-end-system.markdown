---
title: 基于Nodejs前端开发的一些想法 - 一周工作总结
layout: post
category: Chinese
tags:
- Node.js
---

前端的一个魅力之处在于它并不像很多其他语言那样有着完善的开发方式或者流程。它的混乱和自由同样也是它的可爱及可恨之处。[@xufei][1]的说法是

> 没有哪个别的领域像前端圈能出现这么混乱而欣欣向荣的景象，一方面说明前端的创造力很旺盛，一方面却说明了基础设施是不完善的。

在iOS开发的时候，安装第三方库除了手动编译以外，有且只有一个cocoapods，开发有完整的MVC模式，只要xcode在手打遍天下都不怕。在开发过程中，如果我想重复使用某个组件（比如说定制好的UIWebView），只需要单独写一个类，之后可以轻松重复使用，而在前端开发却有很多种方式。

最原始的方式，比如在Django框架的模板中，写一个base.html的基础模板，然后在不同的block里引入模块。然而这里引入的只是html内容。由于web页面相对app页面来说内容较多，交互复杂，因此产生的不同种类组件较为繁杂。有些组件只是单纯的内容，比如nav或者footer，而有些组件可能重动画重交互，需要大量的JavaScript代码。不管哪一种，似乎把每个组件由三个html，css和js文件组成是一个很好的选择，这样需要这个组件的时候，则需要引入这三种文件。

然而这样似乎跟html发明的初衷本末倒置了。界面开发中，html，css和js是难得的把内容、表现和逻辑分离比较好的架构。这个架构中，我们假设html是内容提供者，css是表现方式，js是逻辑规则。这在早期的web开发比较适合，但是在现代越来越复杂的web页面中，似乎略有不适。

现在的一些重前端的终极目的是以能以复用为基础而进行的组件化开发。比如说，一个标注着真实数据的google地图，我希望在不同页面显示，但数据可能是略有不同的。若想不重复写代码，唯有组件化开发。但是在组件化的同时，html的角色更倾向于内容的结构，而不是内容本身，而js此时则扮演了内容。

打个比方，现在做好了一个google地图组件，放在页面中，js中使用方式如下：

```
var Map = require('./modules/map.js');
var map = new Map({
	elem: 'map',
	fullscreen: 'true',
	markers: [{
		lat: 43.342,
		lng: 79.343
	}, {
		lat: 45.332,
		lng: 80.439
	},...]
});
```

在这个例子中，js找到ID为“map”的DOM初始化一个新的Map组件，传入一些基本的设置（比如是否全屏，显示marker的坐标数据等）。这里的数据全部都是由js提供，而html作为组件的模板部分，只是提供一个简单的壳而已。

JavaScript的组件化一般有AMD和CommonJS等方式。我用过RequireJS和Browserify来管理不同组件下的js文件。两者区别不大，可能Browserify写的代码更少一些（但是Browserify对于不支持CommonJS的模块的的异步加载非常困难）。不管哪种方式，最后肯定是要把所有的js文件根据其依赖打包成一个文件，减少页面的引用次数，增加载入性能。

除了单页应用（SPA）外，一般的项目开发都会涉及多个页面。那么在多个页面下究竟如何进行组件化的实践呢？这之所以成为问题，还是由于html，css和js松耦合导致的。好比刚才的google地图组件，我打算在多个页面中使用，然而组件使用的唯一方法是在js中创建一个新的object。不管有多少页面，我都会用打包工具打包成一个main.js文件，那我怎么知道到底哪个页面会启动地图组件，哪些页面不会呢？再比如，我想在某个页面插入两个组件，难道我要在main.js中创建两个新的组件？

一种思路是利用像Gulp或者Grunt这样的构建工具，为每个页面单独构建js和css文件。页面单独引用自己的文件，不会造成冲突。但实际开发中，发现这是一个很糟糕的办法：

- 大量重复加载静态资源。比如我在首页明明已经加载过地图的文件，打开新的页面，尽管有一模一样的地图，浏览器还是得加载属于这个页面的js文件
- 开发过程需要不停切换页面，有时候更新了某个组件，但是其他页面还没来得及构建，等到以后页面有几十个的时候为时晚矣

综上所述，整个项目务必只能引用一套js和css，为每个页面单独炮制js和css是不可取的。当使用统一的js时，组件的激活则不是点对点的精确制导，而是广撒网一样的无差别攻击。那么这个组件的壳部分，即html，需要有自己独特的标示符。

ReactJS和Polymer是目前比较先进的技术。我们来看他们是怎么做的。

ReactJS使用虚拟DOM，实际是用js来渲染生成html内容。我对这种做法抱有保留态度，因为JavaScript再快，好像也快不过原生的C。但我们关注的是它的组件化实现方式：React把DOM的id或者className当做标示符，通过`React.createClass()`方法来激活并描述组件，而其本应该在html中的内容，则利用它独特的“JSX”语法内嵌在了js中。也有人开发了工具单独分离JSX语句，放在单独的`.rt`文件中作为模板。这套系统比较清晰，但总觉得是花了好大得劲把浏览器本来能做的时候又做了一遍。

Polymer是面向未来的组件化开发方案。它把试验中的web component概念变成了现实，还利用了先进的shadow DOM概念。在这套系统下，html重新夺回了内容提供者的角色。每个html页面中，link标签引入组件，然后通过语义化标签来使用。如下：

```
<link rel="import" href="google-map.html">
<google-map lat="37.790" long="-122.390"></google-map>
```

看起来清晰明白，似乎就是web的未来。但我唯一的担心就是如果组件过多的时候，是不是每个页面就要加载大量的组件，会不会造成阻塞或者性能下降呢？这样像AMD或者CommonJS的努力不又是付诸东流了么？另外语义化标签暂时还没有成为html标准，这样使用会不会有潜在的风险还不得而知。

说了半天终于要说到题上。我现在在实际项目中依托Node.js作为前端服务器，以Jade、Gulp、Browserify等工具的帮助下形成一套较为方便的组件化开发方案。具体来说，每个组件仍然是由html(jade)，css(less)和js组成。但是jade模板系统具有一个mixin的功能，它把html转化成具有简单编程能力的语言。比如在刚才的地图组件中，jade文件应该是这样：

```
mixin map(fullscreen, datasource)
	map(data-fullscreen=fullscreen, data-source=datasource)
		...
```

组件的模板文件只是一个jade的mixin。这个mixin有两个parameters，一个是是否全屏，另外一个是数据源的地址。这个组件也是用的语义化标签，因此，如果想使用组件，就像这样：

```
include modules/map
+map("fullscreen", "/path/to/data.json")
```

在js文件中，定义组件的constructor里提取DOM的data attributes来获取内容，兼容性较高。在多页面多组件无差别激活的问题上，在main.js中定义一个函数：

```
function run(tagName, Class) {
	var doms = document.getElementsByTagName(tagName);
	if (!doms) return;
	for (var i = 0; i < doms.length; i++) {
		new Class(tagName);
	}
}
```

这样在main中引入组件后，只需要使用一个`run`函数就可以在页面内循环搜索组件的标签并触发它。

[1]: https://github.com/xufei/blog/issues/19