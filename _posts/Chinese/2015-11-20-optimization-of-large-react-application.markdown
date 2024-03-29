---
title: React搭建大型应用的载入优化和SEO优化
layout: post
category: Chinese
tags:
- React
- Performance
---

最近发现公司的基于React全面架构的网站面临两个严重问题。

一是载入速度：网站所有的部分都被分成模块，以页面为单位交织在一起，形成了一个巨大的Javascript文件，体积大概有600+KB，尽管使用gzip压缩到200+KB，但是在网络缓慢的情况下用户还是在开始的阶段看到一片空白。

二是SEO问题。这个问题期初并不严重，但是由于网站内容增多而无法被搜索引擎收录而变得严重起来。

其实对于两个问题有一个通用的解决方案：使用`React.renderToString()`在后台快速渲染页面。这个方法有一个非常严重的问题，首先是代码中有很多基于jQuery和velocity的DOM操作，这都需要window对象，然而在服务器渲染中，是没有这个对象的。第二，webpack打包后，尽管设置了`target: "node"`，却始终无法在服务器中require。这就导致一些网站的UI部分（Less，图片）等无法被载入到打包模块里。因为网站项目很大，所以想把所有模块重新编写耗时耗力。基于这些实际情况，我采用了下面两个办法来缓解问题。

载入速度：不同页面按需使用模块，因此完全没有必要把所有模块打包成一个文件，毕竟这是一个网站而不是一个单页应用。使用Node后端来控制页面路由，使得页面的js文件可以按需加载。这需要用到webpack的一个叫做code splitting的功能，可以把所有文件基于页面分成：

```
init.js
HomePage.js
AboutPage.js
...
```

然后再根据需要加载。最后页面开始只需要加载一个大概60KB的初始文件，然后再加载不同页面的js文件即可。

对于SEO问题的解决有两个方案。第一是使用noscript标签，第二是使用phantomjs为机器人单独渲染，我使用的是方案二。因为方案一将不可避免地导致重复写代码。而使用phantomjs相当于事先替搜索引擎用浏览器打开页面然后再把结果返回。phantomjs基于webkit引擎，所以不会有React服务器端渲染遇到的一些问题。

需要注意的是phantomjs使用比较旧的javascript引擎，没`有bind()`这个函数，导致基本无法渲染React项目（因为使用了大量的bind。解决办法是使用phantomjs 2。