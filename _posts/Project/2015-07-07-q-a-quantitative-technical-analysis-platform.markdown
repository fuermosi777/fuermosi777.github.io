---
title: Q
subtitle: A quantitative technical analysis platform
layout: project
category: project
color: E47878
bgcolor: E47878
image: q.png
tags:
- Python
- Javascript
---

[Q][1] is a quantitative technical analysis platform I created. It has three main components:

- Q command: powered by Django 1.8 and Python 3, it has different modules which are responsible for tasks such as stocks information updating, prices information fetching, database inserting and so on.
- Strategy center: it is the core component that use strategy to do backtesting and simulation.
- Q.js: the front-end library that convert data from API to visualized charts and other stuff.

The database contains all stock information of China’s Shanghai and Shenzhen stock exchanges of all time.

[1]: http://q.liuhao.im