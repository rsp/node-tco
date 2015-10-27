
var tco = require('./index');

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

var max = 10000;
run(nrec, max, 'normal recursion');
run(trec, max, 'tco recursion');

