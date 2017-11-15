---
title: china-stock
subtitle: A Python module retrieves stock data
layout: project
category: opensource
bgcolor: FACDAC
image: china-stock.png
tags:
- Python
---

## Introduction

[china-stock][1] is a Python module which can retrieves stock data from Chinese Shenzhen and Shanghai Stock exchanges.

__Install__

```
$ pip install china-stock
```

__Test__

```
$ python -m unittest tests/test.py
```

__Use__

```
>>> from china_stock import Stock
>>> symbol_list = ['sh000001', 'sh000002', 'sh601006']
>>> stocks = Stock(symbol_list)
>>> stock = stocks.get_data[0]
```

[1]:https://github.com/fuermosi777/china-stock