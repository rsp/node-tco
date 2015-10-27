node tco
========

Tail call optimization in Node.

[https://github.com/rsp/node-tco](https://github.com/rsp/node-tco)
([readme](https://github.com/rsp/node-tco#readme))

This module lets you define deeply recursive functions without using any additional memory for stack frames. The recursion depth can grow infinitely and the memory consumption stays constant.

Every function built with this module can call other functions in the same way as it calls itself (mutual recursion is identical to self recursion), and it doesn't have to know whether those functions are themselves build with this module or not. Also, from other functions it can be called like any other function.

Performance
-----------
This is how it compares to other similar solutions:

* http://jsperf.com/tco/21

Background
----------
Sometimes recursion can be conceptually preferable to describe certain problems. But to have an arbitrarily deep recursion we have to find a way to implement a recursive function as an iterative process.

Tail call optimization has been known and used for almost 40 years but has been almost completely ignored by the vast majority of programmers.The result is that it is not implemented in most of the programming languages that we use today, including JavaScript.

Problem
-------
The problem is that in a language that doesn't optimize tail calls like JavaScript you cannot infinitely call functions inside of functions even in tail positions because every call is another stack frame and you will eventually hit the limit and get an exception:

```
[RangeError: Maximum call stack size exceeded]
```

Even if you go under the limit you are still wasting memory.

Solution
--------
This module helps you avoid that problem without the need to rewrite your functions as nested loops.

But because this cannot be done automatically in JavaScript, you will have to wrap your functions with `tco()` and make a slight change to your return statements:

1. change `return fun(a, b);` to `return [fun, [a, b]];`
2. change `return val;` to `return [null, val];`

This is the low level API that is not going to change but there are also some other ways to do the same that may be more convenient in some cases:

* `tco.value(val)` returns `[null, val]`

(more to come)

This is not perfect but it works and maintains certain important properies described in section [Philosophy](#philosophy).

Hopefully one day JavaScript will get real tail call optimization and this will no longer be needed.

Philosophy
----------
A function built with this module has the following properties:

1. other functions can call it as a normal function (they don't have to be aware whether it is tco-optimized or not)
2. it can call recursively other functions in exactly the same way as it calls itself (no special case for self-recursion)
3. it can call other non-optimized functions in the same way as it calls tco-optimized functions (it doesn't have to be aware whether other functions are optimized or not)

The cost of those properties is that the tco-optimized function needs to be aware that it is itself tco-optimized (you need to use special syntax but only for return statements).

Some other solutions take a different approach where the optimized function needs no changes to its code but it needs to be called in a special way by other optimized functions, making mutual recursion much harder.

With this module the optimized function can call other functions in the same way as it calls itself, and it doesn't have to know whether those functions are optimized or not. It means that all needed changes are contained inside the optimized function body and are needed only for its return statements.

Example
-------

```js
var tco = require('tco');

// normal recursive function:

var nrec = function (n, max) {
    if (n < max)
        return nrec(n+1, max);
    else
        return n;
};

// tco recursive function:

var trec = tco(function (n, max) {
    if (n < max)
        return [trec, [n+1, max]];
    else
        return [null, n];
});

// helper function to check for errors:

function run(f, max, t) {
    try {
        console.log(t+':');
        console.log(f(0, max));
    } catch(e) {
        console.log(e);
    }
}

// run both functions:

var max = 1000;
run(nrec, max, 'normal recursion');
run(trec, max, 'tco recursion');
```

For `max = 1000` this code will print:

```
normal recursion:
1000
tco recursion:
1000
```

For `max = 10000` it is still fine:

```
normal recursion:
10000
tco recursion:
10000
```

But for `max = 100000` we get:

```
normal recursion:
[RangeError: Maximum call stack size exceeded]
tco recursion:
100000
```

Even if we set the maximum recursion depth to a billion it will take a lot of time but it will still work and not use more memory than with `max = 5` or anyhning else.

Mutual recursion
----------------
The mutual recursion works in exactly the same way as simple self-recursion:

```
// normal recursive function:

var neven = function (n) {
    return n == 0 ? true : nodd(n - 1);
};
var nodd = function (n) {
    return n == 0 ? false : neven(n - 1);
};

// tco recursive function:

var teven = tco(function (n) {
    return n == 0 ? [null, true] : [todd, [n - 1]];
});
var todd = tco(function (n) {
    return n == 0 ? [null, false] : [teven, [n - 1]];
});
```
See [example2.js](example2.js) for more details.

Installation
------------
Install to use in your Node project, updating the dependencies in package.json:
```sh
npm install tco --save
```

Usage in browser
----------------
Example with CDN:

```html
<script src="https://cdn.rawgit.com/rsp/node-tco/v0.0.9/tco.min.js"></script>
```

This is work in progress - more to come.

Issues
------
For any bug reports or feature requests please
[post an issue on GitHub](https://github.com/rsp/node-tco/issues).

Author
------
Rafał Pocztarski - [https://github.com/rsp](https://github.com/rsp)

License
-------
MIT License (Expat). See [LICENSE.md](LICENSE.md) for details.
