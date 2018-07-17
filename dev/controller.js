const bb = require('bb-better-binding')();
bb.declareBlock('block', require('./block'));
const source = bb.boot(document.firstElementChild, window.bbd = {});

source.paramSource = 'this is from source';
source.paramSourceArray = ['this is from source array'];

source.print = (...args) => {
	return args;
};
