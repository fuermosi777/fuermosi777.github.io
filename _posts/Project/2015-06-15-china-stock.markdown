---
title: china-stock - a Python module retrieves SZ & SH stock data from Sina Finance
layout: project
category: project
color: purple
icon: china-stock.png
iconsize: big
tags:
- Python
---

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