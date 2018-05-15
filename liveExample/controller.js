const bb = require('bb-better-binding')();

bb.declareBlock('helloWorld', require('./helloWorld/helloWorld'));
bb.declareBlock('bindFor', require('./bindFor/bindFor'));

bb.boot(document.firstElementChild, window);