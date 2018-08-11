const bb = require('bb-better-binding')();

bb.declareBlock('myBlock', require('./block'));

let source = bb.boot(document.firstElementChild, window);

let mem = {};
source.func = (obj, key) => {
    mem[key] = mem[key] + 1 || 1;
    return key + ' : ' + mem[key] + ' : ' + JSON.stringify(obj);
};

let count = 0;
source.counter = () => {
    return count++;
};

source.x = {
    y1: {
        z1: 0,
        z2: 0
    },
    y2: {z: 0}
};


