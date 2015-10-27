
var tco = require('./index');

var nrec = function (n) {
    if (n < 100000)
        return nrec(n+1);
    else
        return n;
}

var trec = tco(function (n) {
    if (n < 100000)
        return [trec, [n+1]];
    else
        return [null, n];
});

var x = function (y) { return y; };

run(nrec, 'normal recursion');
run(trec, 'tco recursion');

function run(f) {
    try {
        console.log('normal recursion:');
        console.log(f(0));
    } catch(e) {
        console.log(e);
    }
}
