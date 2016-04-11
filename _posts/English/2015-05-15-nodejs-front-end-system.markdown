---
title: Some ideas in front-end development based on Node.js
layout: post
category: English
tags:
- Node.js
- Polymer
- React
---

One thing I like JavaScript is that unlike most other programming language, JavaScript does not have complete developing method and process. Its chaos and freedom are both the con and pro. [@xufei][1] mentioned in his blog:

> There are no any other fields that are similar to Front-end world, which is chaotic and thriving. On one hand, it means that front-end developers are creative. On the other hand, it means that the infrastructure of front-end is poor.

In iOS development, except for manually compiling, there is one and only a Cocoapods. The MVC pattern is perfect. If you have the Xcode, you don't have to be afraid of anything. In developing, if I want to reuse a certain object - such as a UIWebView - I just need to create a new UIWebView object and reuse it anytime I want to. There are many ways to do this in the front-end, though.

The most traditional way is to use template. For example, in Django framework, a `base.html` template is the foundation for most pages. The developer buried blocks in the template, and filled the block with content in different pages. Compared with an app, a website has much more content, and involves complex interactions, resulting in complicated modules. Some of the modules are just content, such as the navigation bar and the footer. Some of the modules are animation-oriented such as moving map, which requires tons of lines of JavaScript. Whichever it is, it seems to be a very good choice to combine `html`, `css` and `js` together as a single module. In this situation, when you need a module, just import these files.

Nonetheless, it might be conflict with the origin of HTML. In the UI development, `html`, `css` and `js` are a very rare combination that perfectly separate the content, the logic, and the appearance. In this system, we assume that `html` is the content provider, `css` is the skin, and the `js` is logic rules. It suited well in the early stage of HTML, when pages were simple. Today it becomes outdated.

In some front-end heavy projects, the ultimate key is to reuse any modules as much as possible to save time and sweat. For example, I created a Google map with real data and I hope it can be loaded in multiple pages with different data. If I don't want to rewrite the code, I must make it modularized. In the new component, `html` is more like a skeleton instead of the content itself, while `js` plays as the content provider.

For example, now we have a Google map module. We put it in the page:

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

In this example, the browser finds a DOM with the ID of "map", and initiate it with some settings (whether it is full-screen and the data of the markers). All of these data are provided by JavaScript. `html` as the template part of the module is only a simple shell.

The typical ways of modularization of JavaScript are AMD and CommonJS. I have used both RequireJS and Browserify to manage JavaScript codes. The difference is rare (perhaps I wrote less in Browserify), but it was very difficult to do asynchronous module loading. At last I will pack all JavaScript files according to their dependency relations in order to reduce the number of loadings and increase the performance.

Unlike Single-page applications, a normal project will have multiple pages. The question is how to modularize in multiple pages? It is a key question because of the loose coupling of `html`, `css` and `js`. Considering the Google map module we just created, I am going to reuse it in multiple pages, while the only way is to create a new Google map object in JavaScript. No matter how many pages a project has, I will pack them to a single `main.js` file. How could I know in which pages the map will be initiated and in which pages the map will be ignored? Besides, if I want to reuse the map twice, should I created two objects in the `main.js`?

One solution is to use build tools like Gulp and Grunt, to build `js` and `css` for each page. Each page will use its own script and style files without causing conflicts. However, in the developing, I found it is a very horrible idea:

- Duplicate loading static files. The map module has been loaded in the home page, the browser will have to load the same codes in other pages with this map module.
- I had to switch pages in the development because I don't want Gulp to build files in all pages each time I made a small changes. If I use Gulp to build by pages, sometimes it will be too late to rebuild modules.

In summary, the entire project must use one and only one set of `js` and `css`. It is not reasonable to build files for each page. The use of modules should be undifferentiated attack but not point precision attacking. In this system, the shell part of the module, needs its identifier.

[React](https://facebook.github.io/react/) and [Polymer](https://www.polymer-project.org/0.5/) are advanced technologies created by Facebook and Google. Let's see how they do.

React uses virtual DOMs, use JavaScript to render and generate `html` content. I have reservations on this. JavaScript can hardly beat C in performance. If we focus on how React implement modularization, we can find that React treat DOM's ID or class name as the identifier and initiate module by using `React.createClass()` method. Those content which is suppose to be as in `html` files is embedded in JavaScript using its unique `JSX` syntax. Someone invented tools to separate that and place the content in a `.rt` file as the template. 

Polymer is the future plan. It makes the experimental component concept into reality and use Shadow DOM. In this system, `html` takes the content provide role back. In each `html` pages, Polymer imports modules using `<link>` tag and uses them by semantic attributes:

```
<link rel="import" href="google-map.html">
<google-map lat="37.790" long="-122.390"></google-map>
```

Very clear, it looks like the future. The only thing I am worrying about is that if the page imports too many modules, whether it will cause blocking and decrease the performance. In that case, all the effort AMD and CommonJS made are in vain. Also, semantic tags are not yet html standard. There are risks.

What I am using now in the projects is a system based on Node.js as the front-end server, supplemented by Jade, Gulp, Browserify. Each module is made up of `html`(Jade), `css`(LESS) and `js`. Thanks to `mixin` in Jade, `html` becomes a simple language with basic programming features such as function, variable and iteration. In the Google map module, a Jade file should be like this:

```
mixin map(fullscreen, datasource)
	map(data-fullscreen=fullscreen, data-source=datasource)
		...
```

The template of each module is just a `mixin`. The `mixin` accepts two parameters: isFullscreen and the data source. To use it:

```
include modules/map
+map("fullscreen", "/path/to/data.json")
```

In `js`, we can get settings in `dataset` of DOMs. In `main.js`, we write a function like the following and run the modules.

```
function run(tagName, Class) {
	var doms = document.getElementsByTagName(tagName);
	if (!doms) return;
	for (var i = 0; i < doms.length; i++) {
		new Class(tagName);
	}
}
```

[1]: https://github.com/xufei/blog/issues/19