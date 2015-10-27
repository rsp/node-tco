
"use strict";

function tco(f) {

    if (typeof f == 'function') {
        var tf = function () {
            var nf = f, na = arguments;
            while (1) {
                var r = nf.apply(null, na);
                if (typeof r[0] == 'function') {
                    if (typeof r[0].tco == 'function') {
                        nf = r[0].tco;
                        na = r[1];
                    } else {
                        return r[0].apply(null, r[1]);
                    }
                } else if (r[0] == null) {
                    return r[1];
                } else {
                    throw new Error('tco: bad value returned');
                }
            }
        };
        tf.tco = f;
        return tf;
    } else {
        throw new Error('tco() expects a function');
    }
}

tco.value = function (v) {
    return [null, v];
};

module.exports = tco;

