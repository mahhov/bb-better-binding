const bb = require('bb-better-binding')();

bb.declareBlock('bindFor', require('./bindFor/bindFor'));

const source = bb.boot(document.firstElementChild, window);

source.name = 'jay';