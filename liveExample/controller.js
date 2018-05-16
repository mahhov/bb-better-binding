const bb = require('bb-better-binding')();

bb.declareBlock('navigation', require('./navigation/navigation'));
bb.declareBlock('helloWorld', require('./helloWorld/helloWorld'));
bb.declareBlock('bindFor', require('./bindFor/bindFor'));

let source = bb.boot(document.firstElementChild, window);

source.navigationPages = ['a', 'b', 'c'];