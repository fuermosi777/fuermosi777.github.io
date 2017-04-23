---
title: Ziyue.io
subtitle: A tech news reader
layout: project
category: project
color: 21C1B1
bgcolor: 21C1B1
image: ziyue.png
tags:
- Javascript
- React
---

## Introduction

[Ziyue.io][1] is a website that collects technology related news from thousands of sources, and it is committed to be one of the readers with the best user experience. I built the full stack implementation of the project including front-end, backend, database, and system.

Ziyue.io by far is a side project that I put my most effort in. The name of “Ziyue” means “atom reading”, which I believe is a good explain of fragmented reading. The reason I built it was because of a personal requirement: I am having a hobby of reading tech news every day. However, sites like HackerNews has a poor design to me. To open a link in a new page and having to wait for 5 seconds to read is a really frustrating experience. Hence I built this simple online reader that collects thousands of news every day and have a much better reading experiences.

## Front-end

The techniques involved in the front-end are React, Webpack, and Babel. I used a slimed “FLUX” structure in the app because of the lack of local storage. I don’t want the user to feel complicated.

## Backend

The backend is based on Django 1.8.4. I built a group of bots to crawl news from different sources, which is also the most challenging part of this project. Some of the sites provide RSS feed, while some sites’ feeds contain only a small part of the article, and some sites don’t provide feed at all. Some sites use Ajax to load the content, making simple crawler useless. Some sites have iOS or Android apps that I can analyze the requests to get the APIs (some use SSL encryption).

## Database and System

The database used is PostgresSQL, which has an easy JSON API for the data, cutting the middleman to save time. The web server used is Nginx. Uwsgi is used to connect Django to Nginx. The entire system is deployed on Amazon EC2, S3 and RDS.

Ziyue.io website: [http://ziyue.io][1]

Official blog: [http://about.ziyue.io](http://about.ziyue.io)

[1]: http://ziyue.io