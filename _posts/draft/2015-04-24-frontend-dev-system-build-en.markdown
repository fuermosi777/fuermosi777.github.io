---
title: The building of the frontend development system
layout: post
category: blog
lang: en
tags:
- Frontend
- Module
---

On my first day in the company, my boss wanted to refurbish one of the pages in the website to attract more investors because the current page looked like one 5 years ago (in fact it was). The development of a web page was supposed to be very simple and elegant: writing a HTML, js and a css file can do the job. Throwing them into a folder like this:

```
Project
|-- company.html
|-- style.css
|-- script.js
|-- a.png
|-- b.jpg
```

After this page, I was told that I need a new page (e.g. About), which was easy as well. Just adding another HTML file, and using previous css and js:

```
Project
|-- company.html
|-- about.html
|-- style.css
|-- script.js
|-- xxx.png
|-- yyy.jpg
```

It didn't last long. Now we need the third page. I believe any sane developer would consider using a more organized way to manage the project. Like this:

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

Everybody can understand this: a simple way to organize the project by categorizing files based on their file types. All css files are in the css directory, and if you want to change css, just go to that folder. The pro is that it is very straight forward, but is it a good way?

I found that either the company or the about page, they all share a navigation bar and a footer block. I definitely won't write them separately but extract them as modules. I used Jade in the template, and used LESS and Browserify to manage css and js modules. After that I used Gulp to pack and compress everything to publish:

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

There are some issues: first of all, nav and footer are not pages while they were put in the page directory, which makes no sense. [Zhang][1] mentioned in his article that:

> Unless there are only 1 or 2 persons in your team, or there are few codes in the project and you don't worry about the performance and the future, you should not separate files based on the file type

My team only has few persons, but the number of code lines is big. Considering that the designer is a picky patient in OCD, I should not do this.

Therefore, some new definitions are as follows:

- A project is made of multiple pages
- A page consists multiple modules
- A module has its own template, css, and js

Since the web development is not pure object-oriented, a page might has something very unique. Also, besides modules, all pages should share a set of public resources such as colors or grid systems. What should we do? There are two solutions:

- Packing to one css and one js
- Each page not only use the public css and js, but also use page-only module set

As a patient in OCD, I hope everything to be very simple, because I believe that after two months, I don't want to see any of the complex codes I am writing now. Therefore I hope to break the project into different modules, which carry few content, and use a robust frontend engineering system to assemble them. Finally, here is my system (using Node.js):

```
Project
|-- modules 				
	|-- base 
		|-- base.jade		#base module
		|-- main.less
		|-- main.js
		|-- variables.less
		|-- grid.less
		|-- ...
	|-- nav					
		|-- main.jade
		|-- main.less
		|-- main.js
	|-- footer
		|-- main.jade
		|-- main.less
		|-- main.js
|-- views 					#page structure
	|-- home.jade
	|-- company.jade
	|-- about.jade
|-- img
|-- public
	|-- css
	|-- js
```

[1]: http://www.infoq.com/cn/articles/talk-front-end-integrated-solution-part2

