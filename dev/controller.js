const bb = require('bb-better-binding')();

bb.declareBlock('myBlock', require('./block'));

let source = bb.boot(document.firstElementChild, window);

source.func = (a, b) => a + ' + ' + b;

source.lines = [10];
