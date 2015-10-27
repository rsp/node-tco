
var tco = require('./index');

var nrec = function (n, max) {
    if (n < max)
        return nrec(n+1, max);
    else
        return n;
};

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
