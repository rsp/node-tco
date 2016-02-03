node tco
========

[![npm install tco](https://nodei.co/npm/tco.png?compact=true)](https://www.npmjs.com/package/tco)
<br>
[![Downloads](https://img.shields.io/npm/dt/tco.svg)](http://npm-stat.com/charts.html?package=tco)

Tail call optimization in Node.

[https://github.com/rsp/node-tco](https://github.com/rsp/node-tco)
([readme](https://github.com/rsp/node-tco#readme))

This module lets you define deeply recursive functions without using any additional memory for stack frames. The recursion depth can grow infinitely and the memory consumption stays constant.

Every function built with this module can call other functions in the same way as it calls itself (mutual recursion is identical to self recursion), and it doesn't have to know whether those functions are themselves build with this module or not. Also, from other functions it can be called like any other function.

Performance
-----------
This is how it compares to other similar solutions:

* [http://jsperf.com/tco/21](http://jsperf.com/tco/21)

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

This is the low level API that is not going to change but there are also some other ways to do the same that may be more convenient in some cases.

This can be greatly simplified using a simple macro:

1. change `return fun(a, b);` to `ret fun(a, b);`
2. change `return val;` to `ret val;`

See the [Macros](#macros) section below for details.

Alternative syntax
------------------
Here are some functions for convenience:

* `tco.value(val)` returns `[null, val]`

(more to come)

Macros
------

(Note: See below for a single macro that does the same with a simpler syntax.)

Using those two [Sweet.js](http://sweetjs.org/) macros:

```js
macro tail {
  rule { $f($x:expr (,) ...) } => {
    return [$f, [$x (,) ...]]
  }
}
macro ret {
  rule { $x:expr } => {
    return [null, $x]
  }
}
```

you can write:
```js
tail fun(a, b);
// ...
ret val;
```

instead of:
```js
return [fun, [a, b]];
// ...
return [null, val];
```

See: [**DEMO**](http://sweetjs.org/browser/editor.html#macro%20tail%20%7B%0A%20%20rule%20%7B%20$f%28$x:expr%20%28,%29%20...%29%20%7D%20=%3E%20%7B%0A%20%20%20%20return%20%5B$f,%20%5B$x%20%28,%29%20...%5D%5D%0A%20%20%7D%0A%7D%0A%0Amacro%20ret%20%7B%0A%20%20rule%20%7B%20$x:expr%20%7D%20=%3E%20%7B%0A%20%20%20%20return%20%5Bnull,%20$x%5D%0A%20%20%7D%0A%7D%0A%0Atail%20fun%28a,%20b%29;%0Aret%20val;%0A)

This may be a much better syntax for the tco module where sweet.js can be used - definitely to be explored in the future.

### Single macro

Another idea for future syntax: instead of those two macros above for tail calls and returning simple values, we could use one macro for both of those cases:

```js
macro ret {
  rule { $f($x:expr (,) ...) } => {
    return [$f, [$x (,) ...]]
  }
  rule { $x:expr } => {
    return [null, $x]
  }
}
```

Now the only difference of optimized function body as compared to a normal function would be changing `return` keywords to `ret`.

See [**DEMO**](http://sweetjs.org/browser/editor.html#macro%20ret%20%7B%0A%20%20rule%20%7B%20$f%28$x:expr%20%28,%29%20...%29%20%7D%20=%3E%20%7B%0A%20%20%20%20return%20%5B$f,%20%5B$x%20%28,%29%20...%5D%5D%0A%20%20%7D%0A%20%20rule%20%7B%20$x:expr%20%7D%20=%3E%20%7B%0A%20%20%20%20return%20%5Bnull,%20$x%5D%0A%20%20%7D%0A%7D%0A%0Aret%20fun%28a,%20b%29;%0Aret%20val;%0A)

Example:

```js
var teven = tco(function (n) {
    if (n == 0) ret true;
    else ret todd(n - 1);
});
var todd = tco(function (n) {
    if (n == 0) ret false;
    else ret teven(n - 1);
});
```

is converted by the `ret` macro into:

```js
var teven = tco(function (n) {
    if (n == 0) return [null, true];
    else return [todd, [n - 1]];
});
var todd = tco(function (n) {
    if (n == 0) return [null, false];
    else return [teven, [n - 1]];
});
```
See: [**DEMO**](http://sweetjs.org/browser/editor.html#macro%20ret%20%7B%0A%20%20rule%20%7B%20$f%28$x:expr%20%28,%29%20...%29%20%7D%20=%3E%20%7B%0A%20%20%20%20return%20%5B$f,%20%5B$x%20%28,%29%20...%5D%5D%0A%20%20%7D%0A%20%20rule%20%7B%20$x:expr%20%7D%20=%3E%20%7B%0A%20%20%20%20return%20%5Bnull,%20$x%5D%0A%20%20%7D%0A%7D%0A%0Avar%20teven%20=%20tco%28function%20%28n%29%20%7B%0A%20%20%20%20if%20%28n%20==%200%29%20ret%20true;%0A%20%20%20%20else%20ret%20todd%28n%20-%201%29;%0A%7D%29;%0Avar%20todd%20=%20tco%28function%20%28n%29%20%7B%0A%20%20%20%20if%20%28n%20==%200%29%20ret%20false;%0A%20%20%20%20else%20ret%20teven%28n%20-%201%29;%0A%7D%29;%0A)

And it works correctly - see [example4.sjs](example4.sjs).

Imperfection
------------
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
    if (n == 0) return true;
    else return nodd(n - 1);
};
var nodd = function (n) {
    if (n == 0) return false;
    else return neven(n - 1);
};

// tco recursive function:

var teven = tco(function (n) {
    if (n == 0) return [null, true];
    else return [todd, [n - 1]];
});
var todd = tco(function (n) {
    if (n == 0) return [null, false];
    else return [teven, [n - 1]];
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
<script src="https://cdn.rawgit.com/rsp/node-tco/v0.0.12/tco.min.js"></script>
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
