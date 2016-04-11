---
title: 高效率DOM和CSS动画操作 - 一周工作总结
layout: post
category: Chinese
tags:
- JavaScript
- Animation
- Velocity
- CSS
---

由于开发的页面有几个涉及复杂动画的重DOM部分，测试页面在一些移动设备（iPad Mini 2，iPad 2和iPhone 6）上表现非常差，促使我不得不开始研究DOM动画的性能优化部分。本文旨在通过一个实际案例的开发过程来讨论利用JavaScript和CSS完成DOM动画和操作的一些优化。

这是一个介绍团队的页面。开始全部都是个人头像，当鼠标点击头像后会在相应行的下方展开一个较大的介绍页面，里面有一些个人信息。点击其他头像会动态切换资料。

##绝对定位

可见设计师考虑到了responsive并且在四种不同尺寸下的设备都做了设计稿。由于自己上个项目的影响，对这个项目的开发设计思路是利用`div`的`position:absolute`属性，通过JavaScript修改`top`和`left`的值来确定每个小图（简称avatar）的位置，然后通过设定`width`和`height`的值控制图片大小。

详细思路是构造两个`class`，分别是avatar和spotlight，代表小图中每个人的头像和点开后展开的详细页面，每个class中添加`setPosition`和`setSize`的方法，然后在`main.js`中引用，添加各种方法控制。使用RequireJS进行模块管理，代码如下：

```
// gallery
require(['./avatar', './spotlight'], function(Avatar, Spotlight) {
	var Gallery = function(elem, data) {
		this.elem = document.querySelector(elem);
		this.data = data;
		this.persons = [];
		this.init();
	};
	Gallery.prototype = {
		init: function() {
			this.addPersons();
			this.bind();
		},
		addPersons: function() {
			for (var i = 0, m = this.data.length; i < m; i++) {
				var p = new Avatar();
				this.persons.push(p);
				...
			}
			...
		},
		addSpotlight: function() {
			this.spotlight = new Spotlight();
			...
		},
		setHeight: function() {
			...
		},
		bind: function() {
			this.elem.addEventListener('click', function(e) {
				if (e.target.classList.contains('avatar')) {
					...
				}
			});
		}
	};
	return Gallery;
});
```

由于全部是绝对定位，不仅avatar需要手动设置宽和高还有位置，就是点开小图之后的详细介绍部分（简称spotlight）也要绝对定位并手动定义宽和高。avatar和spotlight的代码如下：

```
// person
require(function() {
	var Person = function(elem) {
		this.elem = document.querySelector(elem);
		...
	};
	Person.prototype = {
		init: ...
		setPosition: ...
		setSize: ...
		bind: ...
	};
	return Person;
});
```

这种设计思路的好处是每个头像的位置全部掌控，随心所欲地设置动画。缺点也很明显，首先用JavaScript控制DOM的位置和大小，DOM操作次数巨大，整体性能堪忧。经过实际测试，在桌面浏览器表现尚可，但是在移动端表现惨不忍睹，而且牵连到其他模块的运行效率。其次，由于要手动控制所有元素的位置和尺寸，代码量增长得也相当可观，不便于维护和管理，而且也完全没有利用到CSS的性能优势。当点击某一个头像之后，所有的头像的位置都要重新进行计算，并且通过动画安排到新的位置。因为每个头像都是绝对定位，因此没有办法把它们装在一起移动，而非得分别移动不可。我个人觉得这个机制成了性能低下的主要元凶。

最后，由于是响应式设计，有好几种排列方式。如果是iOS开发，只需要考虑iPhone和iPad两种尺寸就好了，但是网页上就要考虑无数种可能。一般来说分为四种，即mobile，portrait，landscape和desktop。在设计稿中，这个团队介绍页面在大尺寸浏览器下为一行六列，到了手机上会缩成一行三列，所以Gallery每次排列avatars的时候还得计算一下窗口宽度，造成更多的性能损耗。

##使用translate()

最开始想的是利用`top`和`left`进行绝对定位的控制也许不是一个好方法。Paul Irish在他的[文章][1]中解释了使用CSS`translate()`的转换要比使用绝对定位的`top`和`left`控制速度要快，因为translate可以利用GPU加速。另外Paul Lewis和Irish在另一篇[文章][3]中提到了四种非常“廉价”的DOM操作：

- transform: translate();
- transform: scale();
- transform: rotate();
- opacity: 0..1;

是否真是这样？经过实际测试（多亏的[Velocity][2]API内置了`translateX`和`translateY`，直接就可以转换），性能提升并不大。GPU加速占用的内存，反而在移动端上可能拖慢浏览器造成卡顿。

##相对定位

经过思考之后想利用CSS来进行相对定位，既然60FPS的丝滑柔顺达不到，起码能看出一点点动画效果吧。思路是直接用`div`堆砌页面，利用CSS控制宽高。每次点击Gallery类，会自动计算出开启spotlight的行数。代码如下：

```
// gallery
require(function() {
	var Gallery = function(elem) {
		this.elem = document.querySelector(elem);
	};
	Gallery.prototype = {
		init: ...
		addPersons: ...
		addSpotlight: ...
		slideDownSpotlight: ...
		SlideUpSpotlight: ...
		bind: ...
	};
});
```

代码非常简单，因为不需要设置位置和尺寸。但是，最开始没有使用相对定位是因为无法搞定动画。因为每次点击头像，spotlight总是直接弹出来，把下方的头像挤到下面去。后来想到如果非要动画不可，可以通过改变spotlight的高度来进行动画。设置`max-height`为0，全部显示的时候设置一个最大值，然后就可以用CSS的`transition`或者JavaScript的`velocity.js`库来完成动画。

这样做的唯一安全隐患是每次修改高度(比如增加1px)都会引起下面所有元素的[重排][4]。但是考虑到下面都是看不见的部分，因此勉强可以接受。写好后经过测试，速度比绝对定位提升不少，起码在移动端也可以畅快地浏览了。在下一迭代，可能会使用canvas来替代整个架构，这样又要回到绝对定位。但不论哪一种技术，都有它的优缺点。像Flipboard那种追求用户体验的阅读器，使用react-canvas非常合理，而这个项目作为一个公司页面，其实相对定位带来的表现已经完全足够。

##资料

1. [Why moving elements with translate() is better than pos:abs top/left - Paul Irish][1]
2. [Velocity][2]
3. [High Performance Animations][3]
4. [REFLOWS & REPAINTS: CSS PERFORMANCE MAKING YOUR JAVASCRIPT SLOW?][4]

[1]:http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
[2]:http://julian.com/research/velocity/
[3]:http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
[4]:http://www.stubbornella.org/content/2009/03/27/reflows-repaints-css-performance-making-your-javascript-slow/