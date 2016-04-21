---
title: How to deal with cross-domain issues in Single-page App?
layout: post
category: English
tags:
- JavaScript
---

The biggest challenge I have ever met in the development of a single-page app is the cross-domain request with CORS problem. After one week of intense development of a React app, everything seems fine until I made my first `$.ajax` call to the server, which ran in another port.

In my previous personal projects, I simply added a Access-control-allow-origin: * in the response to temporarily solve it. However, this time the back end is a Java server which I have little experiences in. There is a simple Chrome extension called [`Allow-Control-Allow-Origin: *`](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) can do exactly the same thing. It went well until something else happened.

The authentication of this app is based on session, which means that the header should include cookies so that the server can login/register, determine status of the users. I spent a lot of time wondering why my ajax call could not send any cookies and later I found that even though the front-end and the backend have the same domain (http://localhost), but the ports are different. Fortunately jQuery’s `$.ajax()` has an option xhrFields: {withCredentials:true} that allow to send cookies. However, in order to set this option, the Access-control-allow-origin: must not be *.

I uninstalled the Chrome extension, and asked one of the back end developed to add a `Access-control-allow-origin: 127.0.0.1:8080` in the testing server. Looks like it should be solved. However, due to a mysterious reason, the ajax call just could not send cookies.

My final solution was to run a Nginx locally, and reverse proxy the two servers to a single port. I have to say it was the best solution so far.