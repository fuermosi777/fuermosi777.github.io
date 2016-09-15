---
title: 使用Javascript的KMP算法
layout: post
category: Chinese
tags:
- Algorithm
- KMP
---

KMP算法中比较麻烦的是生成匹配数组的部分。《算法4》里Sedgewick使用一个非常难懂的DFA概念，再加上`charAt()`方法字符和整数的混乱转换，让这个部分变得非常难懂。[网络上](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)也有对KMP算法的解释，但是对如何生成匹配数组的部分却含糊不清。经过一个小时的认真研究画图，终于算是弄懂了生成匹配函数的原理。对于KMP的原理和匹配数组的使用，多有文章介绍，此不赘述，这篇文章主要介绍匹配数组生成的原理。

```javascript
// pattern ABCDABD

// @param String pattern
// @return Array
var fail = function(pattern) {
    var mode = []; 
    for (let i = 0; i < pattern.length; i++) {
        mode[i] = 0;
    }
    var i = 0, j;
    for (j = 1; j < pattern.length; j++) {
        // part 1
        while (i > 0 && pattern[i] !== pattern[j]) {
            i = mode[i - 1];
        }

        // part 2
        if (pattern[i] === pattern[j]) {
            i++;
        } else {
            i = 0;
        }

        // part 3
        mode[j] = i;
    }
    return mode;
};
```

代码中`fail()`函数的目的是生成一个“失配”后的数组。具体的使用方法为如果发生失配，则需要把pattern文字中的指针重置为匹配数组中已匹配的字符的匹配值。在函数的前四行，首先生成一个空的数组，长度为pattern的长度，并把值都初始化为0。

在第二部分中，通过一个循环来生成匹配数组。需要注意的是，由于`mode[0]`始终为0（没有前后缀），因此指针`j`从1开始。循环内部分为三个主要部分，已经在代码中用注释标注。

第一部分`pattern[i] !== pattern[j]`来判断新的值是否和上次匹配的最长相同前后缀（Longest common prefix and postfix）后面的值是否相同。这句话听起来非常绕口。需要了解到，现有一个字符串“ABCAB”，已知最长相同前后缀为2，那么这个前后缀必然为“AB”，即`pattern[0..1]`。如果在此字符串后新增一个字符“D”，则字符串变成“ABCABD”，只需要比较新增的“D”是否跟“AB”后面的“C”是否相同，如果相同，则新字符串的最长相同前后缀在原来基础上加1，否则，比较左侧的值“B"，直到该值不存在（即`i > 0`）。

第二部分，经过第一部分的过滤之后，比较新值跟`pattern[i]`。第三部分，把得到的匹配值赋予匹配数组中。最难的部分即为第一部分。有了匹配数组之后，接下来的KMP算法就非常简单：

```javascript
String.prototype.kmpIndexOf = function(p) {
    var mode = fail(p);
    var i = 0, j = 0;
    for (i; i < this.length; i++) {
        if (j === p.length - 1) return i - p.length + 1;
        if (this[i] === p[j]) {
            j++;
        } else if (j === 0) {
        } else {
            j = mode[j - 1];
            i--;
        }
    }
    return -1;
};

console.log("ABC ABCDAB ABCDABCDABDE".kmpIndexOf("ABCDABD"));
```