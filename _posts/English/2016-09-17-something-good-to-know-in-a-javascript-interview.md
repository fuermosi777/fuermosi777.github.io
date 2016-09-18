---
title: Some good to know in a Javascript interview
layout: post
category: English
tags:
- Javascript
- note
---

This post records some of the questions I met in technical interviews. Some of them are tricky.

* TOC
{:toc}

### What is functional programming in Javascript? What's its advantages?

Functional programming is one of the programming paradigms. Here are some features:

1. Functions can be passed as parameters or be returned.
2. No side effects. A function will return a value but no change other variables such as global variable.

Advantages:

1. Code elegant and simple. Quick development.
2. Easy for testing.

### What is closure? 

Closure is those functions what can visit independent (free) variables. In other words: closures can memorizes the environment when they were created.

```javascript
function init() {
    var name = "test";
    function display() {
        console.log(name);
    }
}
```

The inside function can visit variables declared in its outside scope.

```javascript
function func() {
    var name = "test";
    return function() {
        console.log(name);
    }
}

var f = func();
f();
```

A closure is a special object that made of a "function" and the scope where the function was created. 

Some usage:

- Simulate private method

```javascript
var createClass = function() {
    var ct = 0;
    function changeBy(n) {
        ct += n;
    }
    return {
        add1: function() {
            changeBy(1);
        },
        value: function() {
            return ct;
        }
    }
}
```

Disadvantages:

Negative effects on performance and memory.

Reference: [MDN](https://developer.mozilla.org/cn/docs/Web/JavaScript/Closures)

### How Javascript's scope chain works?

Read: [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)

### What is the difference between declaring properties in construction vs. in Prototype?

```javascript
function A() {
    this.p1 = 0;
}

A.prototype.p2 = 0;

var a = new A();
var b = new A();

console.log(a.p1); // 0
console.log(b.p1); // 0

a.p1 = 2;

console.log(a.p1); // 2
console.log(b.p1); // 0

A.prototype.p2 = 2;

console.log(a.p2); // 2
console.log(b.p2); // 2
```

### Declaring method in construction vs. in Prototype?

Declare methods in construction takes no advantages of closure, so it should be replace by prototype.

    http://stackoverflow.com/questions/9772307/declaring-javascript-object-method-in-constructor-function-vs-in-prototype

### React's contextProps?

Reference: [React docs](https://facebook.github.io/react/docs/context.html)