
var tco = require('./index');

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

// helper function to check for errors:

function run(f, num, t) {
    try {
        console.log(t+' for '+num+':');
        console.log(f(num));
    } catch(e) {
        console.log(e);
    }
}

// run both functions:

var n = 1000000;
run(neven, n, 'normal recursion');
run(teven, n, 'tco recursion');

