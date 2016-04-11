---
title: 随窗口变化高度自动变化的div
layout: post
category: blog
lang: cn
tags:
- JavaScript
- jQuery
---

很多现代网页出于“简洁”或“大气”的目的会在Landing Page第一眼放上一个全屏的视频背景或者图片。

对于这种效果似乎一个`height: 100%`的css属性就可以搞定了，但是实际开发发现事情并不是这么简单。也许对于整个页面只有一个背景的网页设定css属性可以用，但是如果想要只有上部分是全屏的背景图片或视频的网页，css好像无能为力。

下面是使用JavaScript来解决这个问题，最简单的实现方式是使用jQuery：

```
$(window).load(function() {
	$('.test').css('height', $(window).height() + 'px');
});
```

如果想要改变窗口大小的时候也可以重新调整，势必要使用`resize`，为了让代码简化，这里使用一个`setDivWindowHeight()`函数:

```
$(function(){
	// Set div height 
	setDivWindowHeight('.test');
	$(window).resize(function(){
		setDivWindowHeight('.test');
	});
	
	// Functions
	function setDivWindowHeight(elem) {
		$(elem).css('height', $(window).height() + 'px');
	}
});
```

很快发现`resize`的调用会使改变窗口大小的时候系统负担飙升，因为每次改变大小浏览器都需要重新取得当前窗口的高度然后给`div`设定。尤其是当页面有多个部分需要等于窗口高度，或者有其他大量交互或动画内容的时候，这简直就是灾难。

其中一个解决办法是忽略窗口改变这个动作，而是只在首次加载页面的时候设定的好高度，例如[Govermade][http://grovemade.com/]。理由是一般用户可能不会经常改变窗口的大小。如果用户使用手机或者平板电脑浏览网页则根本没有机会修改窗口的大小。但我觉得这个解决办法有点诡辩的意思——如果用户不需要修改窗口大小，则根本没机会触发`resize`，所以即使加上那个事件侦听，似乎也完全无碍。

有没有其他办法呢？考虑到每次修改窗口的时候都会调用`resize`之后的函数，如果能够在那个函数里少做一点事情，而是把改变窗口的动作放到其他函数里，并单独使用`setInterval`来查看呢？

```
// 设定一个flag来判断窗口大小是否发生改变
var didResize = false;
// 如果窗口尺寸改变，设定这个flag为true
$(window).resize(function() {
	didResize = true;
});
// 侦听
setInterval(function() {
	if (didResize == true) {
		didResize = false;
		setDivWindowHeight('.test');
	}
}, 500);
...
```

这样一来，侦听函数每500毫秒处理检测一次窗口是否发生改变，如果改变则重新设定目标`div`的高度。可以明显解决复杂页面窗口改变后的卡顿问题。

把代码按照request.js的AMD标准包起来做成一个类，方便其他模块调用：

```
define(['jquery'], function($) {
	// 开始
    var WindowHeight = function(container) {
        this.elem = $(container);
        this.init();
    }

	// 添加方法
    WindowHeight.prototype.init = function() {
        this.bind();
    }

    WindowHeight.prototype.bind = function() {
        var that = this;
        // window
        var didResize = false;
        $(window).resize(function() {
            didResize = true;
        });
        setInterval(function() {
            if (didResize == true) {
                didResize = false;
                that.setToWindowHeight();
            }
        }, 500);


        $(window).load(function() {
            that.setToWindowHeight();
        });
    }

    WindowHeight.prototype.setToWindowHeight = function() {
        this.elem.css({
            'height': $(window).height() + 'px'
        });
    }

    return WindowHeight;
});

```

以后再使用的时候可以直接这样：

```
define(['windowHeight'], function(WindowHeight) {
	var wh = new WindowHeight('#test');
});
```