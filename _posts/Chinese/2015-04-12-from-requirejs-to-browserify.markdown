---
title: 使用browserify进行JavaScript模块管理
layout: post
category: Chinese
tags:
- JavaScript
- Browserify
- CommonJS
- Gulp
---

## 前言

前一段日子在使用了RequireJS之后觉得模块化开始实在太爽，它使用AMD语句，将整个模块包再一个`define`中然后以`return value`的形式提供接口。像这样：

```
define(['jquery'], function($) {
	var Sth = function(elem) {
		this.elem = $(elem);
		...
	};
	Sth.prototype = {
		init: function() {
		},
		setHeight: function() {
		},
		...
	};
	return Sth;
});
```

但是使用过程中也遇到了几点不爽：

- 由于浏览器能力限制，RequireJS是在运行时解析，因此在逻辑代码外包裹一层`define`，造就了AMD规范，让强迫症患者的我非常不爽
- 如果依赖的模块太多，在`define`开始处要把长长的列表写两次，而且顺序不能差，太麻烦了，比如下面代码：

```
define([
	'jquery',
	'underscore',
	'backbone',
	'main/nav',
	'main/gallery',
	'main/spotlight',
	'main/somethingelse'
], function(
	$,
	_,
	Backbone,
	Gallery,
	Spotlight,
	Somethingelse
) {
	var App = function(){};
	return App;
});
```

- 使用RequireJS提供的`r.js`构建工具打包的时候，结果仅仅是按照依赖顺序把所有的模块丢到一个文件里，再在开始处加上`require.js`。有一个叫[almond][1]的插件可以替代巨大的`require.js`，但遗憾的是我从来没有用它成功构建过

## Browserify

几天前我花了一段时间把company page的模块全部更换成了Browserify的模式，可以让我以node.js的风格在浏览器写代码了。一个直接的好处就是，代码更短了，而且更容易维护。[这篇文章][2]介绍了很多其他好处。[Browserify的官方网站][3]也提供一系列文章教程。上面的代码使用Browserify会变成如下：

```
var Sth = function(elem) {
	this.elem = $(elem);
	...
};
Sth.prototype = {
	init: function() {
	},
	setHeight: function() {
	},
	...
};
module.exports = Sth;
```

## 使用Gulp构建

我一直使用Gulp来构建项目中的LESS和JavaScript文件。名叫`gulp-browserify`的插件由于“直接使用来自browserify模块”被加入了[Gulp的黑名单][5]。[这篇文章][6]提供了直接用browserify在Gulp中构建的解决办法，需要安装`browserify`和`vinyl-source-stream`。代码如下:

```
var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream');
 
gulp.task('browserify', function() {
    return browserify('./src/js/main.js',{ debug: true })
        .bundle()
        .pipe(source('main-built.js'))
        .pipe(gulp.dest('./temp/js'));
});

...
```

我会先用browserify构建一个暂未压缩的js文件放到`/temp`中，以便排错，然后再用[uglify][7]压缩生成到`/public`文件中。

## 全局依赖

对于全局依赖的模块，比如jQuery，Browserify没有提供RequireJS中类似"shim"的东西。一个最直接的做法是在`main.js`中定义

`window.$ = require('./path-to-jquery/jquery.js');`

这个项目有一个模块使用jQuery-ui插件，这个插件依赖于jQuery，这时再定义

`window.$.mobile = require('./path-to-jquery-ui/jquery-ui.js');`

是完全没用的，只能使用[browserify-shim][4]这个插件做一些配置，这让我非常不爽。我对于这些第三方插件的质量表示怀疑，因此对于使用比较抗拒。好在我用jquery-ui的唯一目的是使用swipe事件，后来直接使用[Hammer.js][8]，它提供CommonJS的接口可以直接使用。对于全局依赖的问题，[这篇文章][9]也给出了一种解决方案。
```

总体来说，从RequireJS转换到Browserify的过程很成功，效果也很好，暂时会作为前端开发的主力方案使用。

## 资料

1. [Almond.js][1]
2. [A Journey from requirejs to browerify][2]
3. [Browserify articles][3]
4. [browserify-shim][4]
5. [gulp-blacklist][5]
6. [gulp browserify starter faq][6]
7. [gulp-uglify][7]
8. [Hammer.js][8]
9. [Journey From RequireJS to Browserify][9]

[1]:https://github.com/jrburke/almond
[2]:http://orizens.com/wp/topics/a-journey-from-require-js-to-browserify/
[3]:http://browserify.org/articles.html
[4]:https://github.com/thlorenz/browserify-shim
[5]:https://github.com/gulpjs/plugins/blob/master/src/blackList.json
[6]:http://viget.com/extend/gulp-browserify-starter-faq
[7]:https://www.npmjs.com/package/gulp-uglify
[8]:http://hammerjs.github.io/
[9]:http://esa-matti.suuronen.org/blog/2013/03/22/journey-from-requirejs-to-browserify/#update3