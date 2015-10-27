node tco
========

Tail call optimization in Node.

[https://github.com/rsp/node-tco](https://github.com/rsp/node-tco)
([readme](https://github.com/rsp/node-tco#readme))

WORK IN PROGRESS

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
