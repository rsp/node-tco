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

var max = 10000000;
run(nrec, max, 'normal recursion');
run(trec, max, 'tco recursion');

function run(f, max, t) {
    try {
        console.log(t+':');
        console.log(f(0, max));
    } catch(e) {
        console.log(e);
    }
}
```

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
