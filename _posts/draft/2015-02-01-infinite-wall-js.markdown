---
title: Infinite Wall
layout: post
category: project
slug: infinite-wall-js
tags:
- JavaScript
- HTML/CSS
---

Infinite Wall is a jQuery plug-in that helps you create an infinite photo gallery wall. For more information and download, please visit [Github page](https://github.com/fuermosi777/infinite-wall-js)

#Preview

![](/media/project/10.gif)

#How to use

1. Include necessary JavasSript and CSS files

```
	<script src="dist/jquery-1.11.2.min.js"></script>
	<link rel="stylesheet" href="css/infinite-wall.css">
	<script src="js/infinite-wall.js"></script>
```
2. Create a `<div>` with an `id`

```
	<div id="viewport">
    </div>

    <script>
    $('#viewport').wall({
        data: data, // replace with your data
        width: 100,
        height: 100
    });
    </script>
```

#Reference
	
Data is a must for display. I have prepared a dummy dataset `data.js`. You can include it in HTML and see. You can also use Ajax to fetch data and use it.

#License

Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).