---
title: Front-end responsive development - weekly summary
layout: post
category: English
tags:
- Responsive
- Bootstrap
- LESS
---

I was finalizing the design Q&A for the company page this week. Basically I switched among different sizes of the design all the time. Although this page was based on the Bootstrap, it turned out I didn't use many modules of the Bootstrap at all. I only used its Grid system, and customize most of the system as well. Under the circumstance, I needed to compile my own LESS files (In my following projects I am not going to use Bootstrap and might try Susy which only provides necessary math for grid system).

My principle of compiling Bootstrap was that I never touched the original `.less` files, in case that I forget which modules were customized after the update. Unlike Susy, which provides interface of mixins (based on SASS), Bootstrap doesn't provide these interfaces, while many variables needed to be changed in this project.

My solution upon this was that creating a `bootstrap.less` copy file and editing it, importing necessary modules based on needs. For some fundamental modules such as `variable.less`, I used my own customized version. The directory tree was like this:

```
|-- less
	|-- main.less
	|-- bootstrap.less
	|-- variable.less
	|-- bootstrap (original)
		|-- bootstrap.less
		|-- variable.less
		|-- ...
```

Bootstrap's grid system design is based on "fixed container" and "float window". In large devices, the widths of the containers between breakpoints are fixed while the widths of the windows are float. There are four mock-ups needed, which are "mobile", "portrait", "landscape", and "desktop". The sizes are as follows:

|Type|min|max|code|
|:---|:---|:---|:---|
|mobile|0px|767px|xs|
|portrait|768px|1023px|sm
|landscape|1024px|1449px|md
|desktop|1450px|--px|lg

The three breakpoints are 768px, 1024px and 1450px. Being different from the Bootstrap's design, it is necessary to edit in the customized `variable.less` file.

The rest is easy after the confirmation of the layout. 

I used [GluePrint](http://glueprintapp.com/) to make sure the implementation of the design. The errors were less than 1px. The demo of the page was hosted in [Heroku](http://bg-company-page.herokuapp.com/). Next week I am going to optimize the slow JavaScript.