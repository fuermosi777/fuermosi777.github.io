---
title: Quirks of height of viewable area in mobile Safari
layout: post
category: blog
tags:
- Safari
- JavaScript
- CSS
---

One of my web projects requires the top section of the page to have a window's height. Normally I use a CSS rule `height: 100vh` to do this if I don't consider IE 8 or before because it is fast and easy. It works fine in most desktop browsers, but in mobile Safari the section is cut off the bottom (around 20px).

When playing with Safari, I found that mobile Safari has a very weird feature (looks cool though): it hides the tab bar in the bottom, and shrinks the address menu bar in the top when the user scrolls the page, causing the CSS rule fails.

As we can see from the following figures, the height of the viewable area before the bars are hidden is `window.innerHeight`. The return value is also `100vh` in desktop browsers because most desktop browser won't hide address bar when scrolling. The `100vh` in mobile Safari, however, equals to the screen height minus the menu bar and the minified address bar (with 20px height).

![](/media/blog/6.jpg)

![](/media/blog/7.jpg)

In order to get that number in JavaScript, there is a `window.screen.availHeight`, which is not actually the available height because it still counts the minified address bar (20px). Therefore, the `100vh` in mobile Safari should be `window.screen.availHeight - 20` or `window.screen.height - 40`. This is a ugly hack because we don't know when Apple will change the height of the address bar to 24px or other.

Since there are a lot of users using mobile Safari today, this quirk practically makes `100vh` useless, especially in the top section.

One solution is to set the height of the section using `window.innerHeight` in JavaScript, causing repaints, or set the height only in mobile Safari by adding a device detector ([e.g.](http://stackoverflow.com/questions/3007480/determine-if-user-navigated-from-mobile-safari)).