---
title: Create a deep freeze function for object as constant
layout: post
category: English
tags:
- Javascript
---

In Javascipt, constants are not really "constants". When you import some kinds of array from a file, and then alter it, you can actually change the "constant". To avoid this, simply calling the following `deepFreeze()` to the array or the object, and it will throw an error for mis-use.

```javascript
export default function deepFreeze(stuff) {
  Object.freeze(stuff);

  Reflect.ownKeys(stuff).forEach(key => {
    let prop = stuff[key];

    if (
      prop !== null &&
      (typeof prop === 'object' || typeof prop === 'function' || Array.isArray(prop)) &&
      !Object.isFrozen(prop)
    ) {
      deepFreeze(prop);
    }
  });
}
```
