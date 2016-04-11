---
title: StudentDaily - A news app
layout: post
category: project
slug: studentdaily-a-news-app
tags:
- Python
- Linux
- Objective-C

---


#Introduction

“StudentDaily” is an iOS news app. I built this to solve public account problems in Wechat users.

[Wechat (微信)][1] is a social network app that connects people. It has almost 0.6 billion users all around the world. Besides traditional text, voice or video chat, Wechat provides an Official Public Account Platform that allows personal users or media to post news there for subscription. The problem is that there is no way for readers to read all posts at one time from different public accounts. The readers will have to visit an account and read all news, and switch to another account. Also, among millions of the public accounts, it is difficult to find those with values. Moreover, Wechat has not open APIs for search engines, and there are no stable URLs for posts of these accounts, causing tremendous troubles in scrapping.

#Backend

![json](/media/project/2.png)

I built a crawling script that is able to crawl data from [Sogou][2] Wechat search engine, which is the only partner with Wechat now, and analysis the XML and JSON data, and use semantic analysis to retrieve clear text from the data, and then export using self-built [APIs][3]. In addition, because Sogou will ban IP who made too many requests, I also use proxy to handle the crawling. The crawling and processing tools I used include PhantomJS, Scrapy, and BeautifulSoup 4.

#Front-end

The original Wechat articles contain numerous custom inline-styles, making the page hard to read. For example, in the following figure, the left side screenshot shows how original article is displayed. The title is in large, black and bold text, while some parts of the text are blue color. There are empty lines all over the places. To improve the user experience and make it easy to read, I used JavaScript and CSS to built a plain-text converting tool that can easily convert HTMLs with multiple in-line styles to plain texts, as the screenshot on the right side.

![](/media/project/1.jpg)

I also registered [“studentdaily.org”][4] domain and built the APIs for app. The visitor can register an account and subscribe their favorite accounts in the app and read them seamlessly everyday.

![](/media/project/4.jpg)

I designed the app icon and website logo as well.

![](/media/project/3.png)

This app can be downloaded from [App Store][5].

The source code can be found [here][6].

[1]:http://www.wechat.com/en/
[2]:http://weixin.sogou.com/
[3]:http://studentdaily.org/api/post/list/?keyword=%E7%B2%BE%E9%80%89
[4]:http://studentdaily.org/
[5]:https://itunes.apple.com/us/app/xue-sheng-ri-bao-hui-ju-zui/id954164794?ls=1&mt=8
[6]:https://github.com/fuermosi777/studentdaily
