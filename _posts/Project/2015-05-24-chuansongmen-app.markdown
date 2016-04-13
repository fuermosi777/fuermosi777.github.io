---
title: Chuansongmen
layout: project
category: project
slug: chuansongmen-app
color: darkblue
icon: csm.png
iconsize: small
tags:
- Objective-C
---

## Updates

v1.2 5/12/2015

- Add "Read Later" for posts
- Long press post in the list view and select "Read Later", you can read the post without the Internet

v1.1 4/30/2015

- Added category cache to avoid crash
- Click account author's avatar to see author's information
- Fixed account paging bugs

## Introduction

This app is the iOS version of [Chuansongmen][1], which has over 40,000 UVs per day. I was invited to join the development team of Chuansongmen and was responsible for developing the app. The app is heavily influenced by my previous work [StudentDaily][2] and another famous app [MONO][3].

![](/images/csm.jpg)

## Design

I was responsible for designing the app.

## Development

I was responsible for developing the app. The first iteration app has the following functions:

- View latest Posts from various Public Accounts in Wechat platform. The data is coming from the [Chuansongmen][1] backend, based on Tornado
- Select different categories by scrolling the category list in the top navbar
- Read a Post. The post page has a large banner in the top and content in the bottom. The post is HTML content requesting from the server and loaded in a `UIWebView`
- Share a Post in the Wechat Moments, share a Post to a Wechat friend, or mark a Post as Favorite. This function is very important to attract new users.
- Search for Public Accounts and view the result in a list
- View all Posts from a certain Public Account
- View a certain Public Account's profile, including Wechat ID and description

The next version is expected to add the user login, register, and subscription functions.

The app can be downloaded from the [Apple Store][4].

[1]:http://chuansong.me
[2]:/2015/01/02/studentdaily-a-news-app.html
[3]:https://itunes.apple.com/cn/app/id902977856
[4]:https://itunes.apple.com/cn/app/chuan-song-men-wei-xin-gong/id969898148?ls=1&mt=8