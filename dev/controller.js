const bb = require('bb-better-binding')();

bb.declareBlock('myBlock', require('./block'));

let source = bb.boot(document.firstElementChild, window);

source.options = ['rainbow', 'unicorn', 'moon candy', 'kitten hamburger', 'fluffy headless teddy'];
source.getElem('option0');
source.option0.checked = true;
