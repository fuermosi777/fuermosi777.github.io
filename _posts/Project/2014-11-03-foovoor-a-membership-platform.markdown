---
title: Foovoor
subtitle: A loyalty program service for restaurant
layout: project
category: project
image: foovoor.png
imagesize: small
color: DD523C
bgcolor: e78576
tags:
- Python
- Django
- JavaScript
- HTML/CSS
- Objective-C
---

## Introduction

[Foovoor][2] is a members-only service for customers that provides unique benefits across the best restaurants at New York. The project successfully raised $200,000 venture capital after the release of the first version. I was responsible for designing the database schema, building the database, writing backend system, building RESTful API for iOS app and web app, designing front-end UI and layout using Photoshop, coding front-end pages using HTML, CSS and JavaScript, and testing.

![](/images/f1.jpg)

The business procedure is that our partner restaurants are able to set their benefit schedule in the website of Foovoor. The member of Foovoor can see all discount information such as coupon, discount or gift from the website or the app. The member need to visit the restaurant in the benefit time and request a code from their Foovoor app. The partner restaurant will input the code into our system to verify the code. Once the code is verified, the member can enjoy the benefit and our partner restaurant can identify the member --- whether the customer is visiting for the first time or is a regular customer might provide extra reward.

## Website

__Front-end__

The front-end UI library I used is Twitter Bootstrap 3.0. The layout was inspired by the design of the website of [Zhihu][4], especially for the gradient style of bars and buttons. The [Animate][5] is used to add animation.

I developed a jQuery plug-in called [Slideshow.js][6] to display the photos of the restaurants as the following figure shows.

![](/images/f2.jpg)

__Backend__

The database used is PostgreSQL and the app is deployed in Webfaction. The framework used is Django 1.6.

__Safety__

I have applied a SSL certificate for the website to support HTTPS. The payment system used is [Stripe][7].

## App

The design of the app is heavily influenced by [Munchery][3]. I tried to make the design as simple as possible to highlight the information. The font used in both website and the app is Maven Pro.

![](/images/f3.jpg)

The website can be visited from this [link][2].

The Foovoor app can be downloaded from [App Store][1].

[1]:https://itunes.apple.com/us/app/foovoor/id938833745?ls=1&mt=8
[2]:https://foovoor.com/
[3]:https://munchery.com/
[4]:http://www.zhihu.com/
[5]:http://daneden.github.io/animate.css/
[6]:https://github.com/fuermosi777/slideshow-js
[7]:https://stripe.com/