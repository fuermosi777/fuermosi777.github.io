---
title: The improvement of the loading and SEO of large React website
layout: post
category: English
tags:
- React
- SEO
---

There are two problems detected in the company's current React-based website.

The first one is the loading performance issue. The website is broken into components. The size of the bundle size is as large as almost 600KB. Even with gzip compression, the file is still over 200+KB. With slow internet, the user will see a blank in the beginning.

The second one is SEO issue. The Google search engine will see nothing but a title and a description in the `<head>`.

Actually, it was not hard to solve them. Server rendering (or Isomorphic) is a way to take the advantage of `React.renderToString()` and solve them. However, I didn't use it because 1) there are a lot of DOM manipulation based on jQuery and Velocity in the codebase, requiring a window object, which does not exist in the server, and 2) even with `target: "node"` in configuration, "webpack" still cannot pack a module for Node.js, so that I cannot use tools like less-loader or style-loader. Based on them, I switch to other solutions.

For the loading speed, since pages are using components on demand, there is no need to pack everything into one single file; instead, the code splitting feature in webpack can cut the bundle into multiple files:

```
init.js
HomePage.js
AboutPage.js
...
```

After this, the website will load an init.js and then load file on demand.

For SEO, there are two options. The first one is to use `<noscript/>`, and the second one is to use phantomjs. I used phantomjs because I would have to write duplicate codes if I went with noscript – I have to put the content in the server side.

One tricky thing is that phantomjs won't support `bind()` so that PhantomJS 2 should be used to render React project, which used a lot of `.bind()` functions.