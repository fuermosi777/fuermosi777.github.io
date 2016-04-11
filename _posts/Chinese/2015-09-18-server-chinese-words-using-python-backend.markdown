---
title: Python后台伺服中文字体
layout: post
category: Chinese
tags:
- Python
- Font
---

中文字体在网页的使用严重受挫，原因主要在于中文并不是字母形文字，而像英文，仅需要26个字母就可以组成所需文字。这一原因导致中文字体文件动辄几MB大小，对于一般网页的载入尺寸严重过大。

有字库提供了一个解决方案：通过给需要加载字体的文字添加类名的方式，用Javascript向服务器发起请求，服务器再根据所需文字导出所需字体文件返回。对于免费版来说，有一个请求次数限制，因此对于高访问量的网站并不合适。

方正字库提供了一个云服务，提供多种不同字体的载入。对于方正字库来说，这倒是一个很好的利用互联网思维的例子。

本文提供了另一种解决思路，利用[sfntly][1]这个库自行搭建字体处理中心。

Google提供了一个类库[sfntly][1]，能够很容易地把所需要字体从字体文件中提取出来。具体方法如下：

把sfntly克隆到本地后，进入java文件夹。运行build命令：

```
$ ant
```

build好之后，运行`java -jar dist/tools/sfnttool/sfnttool.jar -h`确认build完成，给出帮助信息如下：

```
Subset [-?|-h|-help] [-b] [-s string] fontfile outfile
Prototype font subsetter
    -?,-help    print this help information
    -s,-string     String to subset
    -b,-bench     Benchmark (run 10000 iterations)
    -h,-hints     Strip hints
    -w,-woff     Output WOFF format
    -e,-eot     Output EOT format
    -x,-mtx     Enable Microtype Express compression for EOT format
```
取得最新的苹方字体，然后运行下列命令可以生成一个新的woff字体文件：

```
java -jar dist/tools/sfnttool/sfnttool.jar -w -s "内容" PingFangRegular.ttf new.woff
```

需注意的是Java版本应为1.8，否则会报错。

本地运行成功后，需要在服务器上搭建。思路是前端使用一个ajax把需要字体的内容post到后端，后端生成一个字体文件，并返回字体文件的地址。本文中使用的是python Django 1.8.4框架。

python视图代码如下：

```python
from django.http import HttpResponse
from django.shortcuts import render
import subprocess
import uuid
from django.views.decorators.csrf import csrf_exempt

def main(request):
    if request.method != "POST":
        return HttpResponse(status=400)
    body = request.POST.get("body", None)
    if not body:
        return HttpResponse(status=503)
    body = "".join(set(body))  # rm duplicate
    body = body.encode("utf8") # encode
    font_id = uuid.uuid4()
    subprocess.call(["java", "-jar", "font/dist/tools/sfnttool/sfnttool.jar", "-w", "-s", "%s"%body, "font/fonts/PingFangRegular.ttf", "font/serve/%s.woff"%font_id])
    content = "@font-face {font-family: "Ping-Fang"; font-style: normal; font-weight: 400; src: local("PingFang"), url(/fonts/%s.woff) format("woff"); }"%font_id
    return HttpResponse(content, content_type="text/css")
```

原理基本上是从request中取得body内容，然后通过subprocess运行jar包，生成一个随机名字的字体文件（通常只有几K大小），然后返回一个css文件，引用刚才生成的字体文件。

这样有一个问题是每次用户访问就会产生一个字体文件，如果每天访问量较多的情况下，文件量还是很惊人的。一种解决办法是生成文件后推送到S3或者其他文件存储器中，然后删掉该文件。另外应该是设置一个cronjob定时清理字体文件。另外还有一种办法是针对每篇文章在一开始就生成好字体文件，把文件地址存在数据库里，然后阅读文章的时候进行调用。对于一些其他诸如评论之类的内容，则专门临时生成字体。

前端收到新的css之后，可以通过以下代码载入：

```javascript
var newFontStyle = document.createElement("style");
newFontStyle.type = "text/css";
newFontStyle.textContent = res;
document.head.appendChild(newFontStyle);
```

[1]: https://github.com/googlei18n/sfntly