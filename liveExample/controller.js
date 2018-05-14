const bbb = require('bb-better-binding')();

bbb.declareBlock('bindFor', require('./bindFor/bindFor'));

const source = bbb.boot(document.firstElementChild, window);

source.name = 'jay';