---
title: Building a technical analysis platform
layout: post
category: English
tags:
- JavaScript
- Q
- Django
---

From March 2015 the Chinese stock markets is becoming so hot that it felt like everybody can make money by staring at stock screens. The SS index raised from around 3000 to almost 5000. At that time, I happened to have a constructive dinner with Richard, who is one of my good friends at NYU. He shared with me a lot about how he can make $300 per day by investing ETFs and stocks. I have a Bachelor’s degree in Accounting, so I know it requires professional information in the investment, although these days even old mama can play with them. I asked Richard based on what did he make the buy/sell decision, and he couldn’t tell me. The second minute I read an article about how the author made a very good backtesting based on a double moving-average strategy. I decided to start my own stock price analysis platform.

I want to learn this author’s idea about his strategy, but I don’t want to limit myself to only one strategy. I know this is just a game of chance. Therefore I planed to collect as many strategies as I can, and then use computers to calculate their returns and find the best one.

I created four systems and gave them proper names to make it meaningful:

- [China-stock](https://pypi.python.org/pypi/china-stock): a python module that is responsible for extracting stock data from the Internet. I originally used Tushare, which is python module does the same thing. The question is that it has too many functions that I don’t need and it also crawls data by analyzing the web pages, which is slow and inefficient. My China-stock, however, extracts data from non-public APIs from some major financial information providers. I used some hacking techniques to get the APIs.
- Q-django: it is the back-end server based on Django that is responsible for stock data persistence. The server has a direct connection with China-stock module and keeps running everyday to get stock data and to store them into the database. It also provides a powerful REST API set for front-end use.
- Q-chart: it is a JavaScript library for GUI of the platform. It provides modules for multiple stocks’ backtesting, simulation, charts generation, etc.