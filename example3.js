
var tco = require('./index');

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
    if (n == 0) return tco.value(true);
    else return [todd, [n - 1]];
});
var todd = tco(function (n) {
    if (n == 0) return tco.value(false);
    else return [teven, [n - 1]];
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

var n = 10000000;
run(neven, n, 'normal recursion');
run(teven, n, 'tco recursion');

