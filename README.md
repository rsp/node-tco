node tco
========

Tail call optimization in Node.

[https://github.com/rsp/node-tco](https://github.com/rsp/node-tco)
([readme](https://github.com/rsp/node-tco#readme))

This module lets you define deeply recursive functions without using any additional memory for stack frames. The recursion depth can grow infinitely and the memory consumption stays constant.

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

This is not perfect but it works now. Hopefully one day JavaScript will get real tail call optimization and this will no longer be needed.

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

Installation
------------
Install to use in your project, updating the dependencies in package.json:
```sh
npm install tco --save
```

Usage
-----

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
