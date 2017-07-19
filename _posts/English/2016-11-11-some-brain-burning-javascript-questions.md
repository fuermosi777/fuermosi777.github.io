---
title: Some brain-burning Javascript questions
layout: post
category: English
tags:
- Javascript
- note
---

* TOC
{:toc}

Some of the questions are tricky, the others are traps. All of them are fun.

## Print numbers 1 - 10 with 1 second lag - Beepi

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
    setTimeout(() => {
        console.log(i);
    }, i * 1000);
}
```

## If `sum(1, 2, 3) === 6`, make the following also work: `sum(1)(2, 3)`, `sum(1, 2)(3)`, `sum(1)(2)(3)` - Beepi

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

## Create a cache function to cache functions that took 2s to run

For example, `complexFunction` has a runtime of 2s. The `cachedFunction` has a runtime of 2s when it first runs, and later it will return the result instantly. All functions that need to be cached will return a value and has no other side effects

```javascript
var complexFunction = function(arg1, arg2) {
    return arg1 + arg2;
};

// complexFunction(1, 2); -> 2s
// complexFunction(1, 2); -> 2s

var cache = function(func) {
    var map = {};
    return function() {
        var key = '';
        for (var i = 0; i < arguments.length; i++) {
            key += typeof arguments[i] + arguments[i];
        }
        if (!map.hasOwnProperty(key)) {
            map[key] = func.apply(null, arguments);
        }
        return map[key];
    }
};

var cachedFunction = cache(complexFunction);

// cachedFunction(1, 2); -> 2s
// cachedFunction(1, 2); -> 0s

```

## Create the `all()` function that achieve this `[1, 2, 3].all(isGreaterThanZero); -> true`

```javascript
var isGreaterThanZero = function(num) {
    return num > 0;
};

Array.prototype.all = function(func) {
    for (var i = 0; i < this.length; i++) {
        if (!func(this[i])) {
            return false;
        }
    }
    return true;
};


[1, 2, 3].all(isGreaterThanZero); // true
[-1, 2, 3].all(isGreaterThanZero); // false
```

## Reverse an array without using loop - SigFig

```javascript
// use recursion
var a = [1,2,3,4,5];

function swap(array, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function reverse(array, i) {
    if (i < Math.floor((array.length - 1) / 2)) {
        swap(array, i, array.length - 1 - i);
        reverse(array, i + 1);
    } else {
        return;
    }
}

reverse(a, 0);
console.log(a);
```

## Write a debounce function

```javascript
(function() {
    function debounce(func, wait) {
        var timeout = null;
        return function() {
            var that = this;
            var arg = arguments;
            if (timeout == null) {
                func.apply(this, arg);
                timeout = setTimeout(function() {
                    clearTimeout(timeout);
                    timeout = null;
                }, wait);
            }
        }
    }

    var efficent = debounce(function(e) {
        console.log(e.type);
    }, 1000);

    window.addEventListener('resize', efficent);
})();
```

## Decompress `3[abc]2[d]ef -> abcabcabcddef` - Google

## Calculate `(add (mul 2 3) 3 1)` - Affirm
