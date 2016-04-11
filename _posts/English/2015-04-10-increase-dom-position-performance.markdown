---
title: Path to efficient DOM and CSS animation - weekly summary
layout: post
category: English
tags:
- JavaScript
- Animation
- Velocity
- CSS
---

Some of the sections I developed this week involved complicated animations among DOM. The page had a very poor performance in some mobile devices (tested on iPad Mini 2, iPad 2 and iPhone 6), which made me start to study how to optimize animations in DOM manipulation. This article aims to discuss some methods to optimize JavaScript and CSS animations based on a real world project.

This is a page for team introduction. It starts with a gallery with team members. When clicking one of the avatar, a bigger `div` will slide down to represent details about this person.

## Absolute position

It is seen that the designer (very good one) has considered the responsive design and created four kinds of mockups. Affected by my previous project, my idea for this project is to use `position:absolute` and change `top` and `left` attributes through JavaScript to set each avatar's position, and change `width` and `height` to control the sizes.

The idea is to construct two classes: avatar and spotlight. Avatar class is for each person in the gallery and the spotlight class is for the detailed one. Using RequireJS to manage modules, the codes are as follows:

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

Because all elements are in absolute positions, I would have to set both width and height for each avatar manually, but also set width, height, and position for spotlight as well. The codes are as follows:

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

The perk of the idea is that I can control the position and size of every avatar and set animations as my wish. The pitfalls, however, are obvious: first of all, using JavaScript to control the position and size of `div` causes lots of times of DOM manipulation, damaging the performance. After testing, the product runs good in desktop browsers (Macbook Pro Retina 15' Chrome 41), but it really sucks in mobile, and it damages other sections. Secondly, due to the manually control, the number of the lines of codes is large. It is hard to maintain and manage the codes even with AMD. After clicking an avatar, all avatars will be re-calculated to be positioned in new place. Finally, since the number of columns in each row in different sizes of device is various, I cannot move the elements together. I think this is the main reason that causes the poor performance. 

## Using translate()

The first thing I came out was that perhaps it was not a good idea to use `top` and `left` to control the positions. Paul Irish discussed why CSS `translate()` is much better than `top` and `left` absolute positioning in his [article][1], because `translate` can take the good advantage of GPU acceleration. Paul Levis and Irish mentioned four "cheap" DOM manipulations in another [article][3]:

- transform: translate();
- transform: scale();
- transform: rotate();
- opacity: 0..1;

Is that true? After tests (thanks to [Velocity][2]'s APIs, which embeds `translateX` and `translateY` already), the increase of the performance was not obvious. 

## Relative position

After some brain storms, I thought that relative position might be a good idea. I admit that since it is hardly possible to create silky animations with 60FPS in this project, at least I can create some animations. The idea was to build the page using `div` and control width and height using pure CSS. When clicking the Gallery, it will calculate where to put the new spotlight:


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

The code is simple because I don't need to set positions or sizes. Nonetheless at first I don't know how to implement animations because when clicking an avatar, the spotlight will just pop up. On a second thought, I thought that I can change the height of the spotlight to create a "SlideUp" and "SlideDown" animation effect. Setting `max-height:0` and `max-height:1200px`, I can use `transition` or Velocity.js to run the animation.

One pitfall is that for each change of the height, all elements below spotlight will [reflow][4]. Considering that those elements are invisible to users, I can accept that. The testing showed that the performance was much better. At lease I can see everybody in the team even in my iPhone. In next generation I am considering using Canvas to replace, which will go absolute positioning again. However, whichever the technique is, it has both pros and cons. As a relative simple team gallery for company introduction, DOM is sufficient.

## References

1. [Why moving elements with translate() is better than pos:abs top/left - Paul Irish][1]
2. [Velocity][2]
3. [High Performance Animations][3]
4. [REFLOWS & REPAINTS: CSS PERFORMANCE MAKING YOUR JAVASCRIPT SLOW?][4]

[1]:http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
[2]:http://julian.com/research/velocity/
[3]:http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
[4]:http://www.stubbornella.org/content/2009/03/27/reflows-repaints-css-performance-making-your-javascript-slow/