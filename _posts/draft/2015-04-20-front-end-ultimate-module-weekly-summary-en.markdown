---
title: Front-end and backend separation - weekly summary
layout: post
category: blog
lang: en
tags:
- Node.js
- Apache
---

The company page is finally online. The next project is to refurbish the home page. The designer is very unsatisfied with the current design and basically she wants to re-do all things. I examined the current structure of the site, and found it very messy, which forces me to separate the front-end and the backend.

The current site is using Django framework and hosted on Heroku. There are some issues:

- In order to be consistent in development and production, a prefix `STATIC_URL` is needed in the templates before any URLs of static files such as images or stylesheets. Nonetheless I used Node.js as local server because I want to focus on the frontend. I really hate that prefix, especially when I use JSON data which involves URLs in JavaScript. I tried to use Gulp to add this prefix into URLs but I felt ugly because it looks like a hacking method.
- The previous engineer who built the Django site threw everything into the static directory. There are millions `.css` and `.js`. Some of the files are named by page such as "home.css" while some of them are named by modules such as "navbar.css". There are three versions of jQuery in the js directory, and not to mention the images. Which image can be deleted and which one cannot, I really don't know.
- Django has a nice template system. I don't hate Django. Actually the first framework I learned is Django 1.6. However, Django is a relatively heavy framework comparing to many other lightweight frameworks today. Django focuses on the complicated business processes instead of frontend. Also, it takes me 3-5 minutes to deploy a new version every time.
- I want to focus on the frontend but not running a Gulp, a MySQL and a foreman at the same time when I am coding

I had a chance to take a look at our system. It is a little out of order. There are two EC servers which run a web app product and a Heroku runing the website. In addition, a Wordpress is responsible for the press and the blog. My objective is to implement a simple transition, and to develop based on modularization. Here are some plans I tried:

- Expand in the current Django project and re-organize everything gradually. I got a headache seeing all those disordered directories and files.
- Add a Nginx server as thte frontend server in front of the Apache, so that I can do the traditional HTML. The pitfall is that there is still some dynamic content that needs the database. I was thinking using Ajax but it was not good with the SEO yet.
- Build a Node.js in the EC server and use Apache's reverse proxy to run the website. It looked nice, until I found that we were using SSL encryption. I am not a master in Apache configuration. It was scary because I might ruin everything.
- My final choice is to deploy a Node.js app on Heroku and use "rewrite" rules of Apache to redirect the URL. The best thing I like Node.js is that the deployment is so fast and the development and production environment are similar. I can use one language to do both front and backend. Nice.