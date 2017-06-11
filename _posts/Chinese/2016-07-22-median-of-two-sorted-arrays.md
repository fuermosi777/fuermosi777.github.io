---
title: 两个有序数组找中位数的Javascript解法
layout: post
category: Chinese
tags:
- Algo
---

> There are two sorted arrays nums1 and nums2 of size m and n respectively.
> Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

此为LeetCode的第四题，却花了我五个小时时间才做出来，题干格外精简，不愧为“Hard”模式的难题一道，因此要好好记录一下解题过程：

计算中位数需要考虑数字总数为奇数或偶数，计算中位数的方法也不一样。为了方便思考，首先只考虑总数为奇数的情况，即 `(m + n) % 2 !== 0`; 

中位数不只是一串数字的中间数，它还有一个明显但却很重要的性质：大于和小于中位数的数字数目为总数 N / 2. 比如在如下一列数字中，排列在中位数后面的数字一共有 7 / 2 = 3 个。

```
1,2,3,4,5,6,7
``` 
题目要求运行时间为O(log(m + n))，自然想到二分法。在下列两组数字中，首先搜索第一组数字，一个数字为 4，那么如果 4 为两数组之和的中位数，根据刚才的性质，那必然 4 之后有 3 个 数字。

```
[2, 4, 5]
[1, 3, 6, 7]

[x, x, x, 4, x, x, x]
```

由于两个数组皆为排序，在第一组数中，4 之后只有一个 5，所以剩下两个数字则应该是第二个数组中较大的两个 —— 6 和 7. 我们把数字 6 所在的位置称作 `b2`，6 之前的数字位置作为 `b1`，那么只要满足`nums2[b1] <= 4 <= nums2[b2]`,4 就是两个数组的中位数。如果不满足该条件，则要么`nums2[b1] > 4`，或者`nums2[b2] < 4`，如果是前者，则说明中位数应该比 4 要大，要继续在数组1中 4 之前进行搜索，后者则相反。另外也需要考虑一些特殊情况：

- 如果 `b1` 和 `b2` 超出数组位置的边缘情况，非常棘手。
- 如果某个数组为空，则直接计算另一数组的中位数。

这样，如果二分法搜索完毕后依然找不到符合要求的数，那么调换两个数组的位置，依法同样搜索另外一个数组。

对于偶数长度的双数组，对于边缘情况的处理更为复杂，因此在这里采用一个非常巧妙的办法。因为偶数长度的数组的中位数由中间两个数字平均数而得，因此考虑把偶数数组变为两个奇数数组，分别求得中位数，再算出其平均数。具体来说，因为两数组均已经排序，可以在任意一个数组添加一个`Infinity`，从而变为奇数长度数组，求得中位数1。再分别测量两个数组的最大值，找到存在最大值的数组，删除最大值，再算出一个中位数2，可得总中位数。

具体代码如下：

```
var bs = function(a, search) {
    var lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        var mid = lo + Math.floor((hi - lo) / 2);
        if (a[mid] > search) {
            hi = mid - 1;
        } else if (a[mid] < search) {
            lo = mid + 1;
        } else {
            return mid;
        }
    }
    return lo - 1;
};

var getMid = function(a) {
    if (a.length % 2 === 0) {
        return (a[a.length / 2] + a[a.length / 2 - 1]) / 2;
    } else {
        return a[Math.floor(a.length / 2)];
    }
};

var findMidInOddArray = function(a, b) {
    var k = Math.floor((a.length + b.length) / 2);
    var lo = 0; var hi = a.length - 1;
    var mid, a_remain, b_remain, b1, b2;
    while (lo <= hi) {
        mid = lo + Math.floor((hi - lo) / 2);
        a_remain = a.length - 1 - mid;
        b_remain = k - a_remain;
        b1 = b.length - b_remain - 1;
        b2 = b.length - b_remain;
        // console.log(b1, b2);
        if (b2 < 0) {
            hi = mid - 1;
        }
        if (b1 < 0) {
            if (a[mid] <= b[b2]) {
                return a[mid];
            } else {
                hi = mid - 1;
            }
        }
        if (b2 > b.length - 1) {
            if (a[mid] >= b[b1]) {
                return a[mid];
            } else {
                lo = mid + 1;
            }
        }
        if (a[mid] <= b[b2] && a[mid] >= b[b1]) {
            return a[mid];
        } else if (a[mid] > b[b2]) {
            hi = mid - 1;
        } else if (a[mid] < b[b1]) {
            lo = mid + 1;
        }
    }
    return null;
};

var findMid = function(nums1, nums2) {
    var can = findMidInOddArray(nums1, nums2);
    if (can === null) {
        can = findMidInOddArray(nums2, nums1);
    }
    return can;
};

var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length === 0) return getMid(nums2);
    if (nums2.length === 0) return getMid(nums1);
    var n = nums1.length; var m = nums2.length;
    if ((n + m) % 2 !== 0) {
        return findMid(nums1, nums2);
    } else {
        nums1.push(Infinity);
        var m1 = findMid(nums1, nums2);
        nums1.pop();
        if (nums1[nums1.length - 1] > nums2[nums2.length - 1]) {
            nums1.pop();
        } else {
            nums2.pop();
        }
        var m2;
        if (nums2.length === 0) {
            m2 = getMid(nums1);    
        } else if (nums1.length === 0) {
            m2 = getMid(nums2);
        } else {
            m2 = findMid(nums1, nums2);
        }
        return (m1 + m2) / 2;
    }
};
```