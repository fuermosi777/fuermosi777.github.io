---
title: Some brain-burning Javascript questions
layout: post
category: English
tags:
- Javascript
---

Some of the questions are tricky, the others are traps.

> Print numbers 1 - 10 with 1 second lag

```javascript
// use setTimeout
function print(n) {
    console.log(n);
    if (n < 10) {
        setTimeout(() => {
            print(++n);
        }, 1000);
    }
}

print(1);
```

```javascript
// use setInterval
function print() {
    var n = 1;
    console.log(n);
    var interval = setInterval(() => {
        n++;
        console.log(n);
        if (n === 10) {
            clearInterval(interval);
        }
    }, 1000);
}

print();
```

```javascript
// for loop & IIFE
for (var i = 1; i <= 10; i++) {
    (function(n){
        setTimeout(() => {
            console.log(n);
        }, i * 1000);
    })(i);
}
```

> If `sum(1, 2, 3) === 6`, make the following also work: `sum(1)(2, 3)`, `sum(1, 2)(3)`, `sum(1)(2)(3)`

```javascript
function sum() {
    // convert arguments to array
    var args = Array.prototype.slice.call(arguments);

    function getTotal() {
        return args.reduce((a, b) => a + b);
    }

    if (args.length !== 3) {
        return function(a) {
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return sum.apply(null, args);
        }
    } else {
        return getTotal();
    }
}

console.log(sum(1)(2)(4)); // -> 7
console.log(sum(1, 2)(4)); // -> 7
console.log(sum(1)(2, 4)); // -> 7
```