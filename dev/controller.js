const bb = require('bb-better-binding')();
bb.declareBlock('todoList', require('./block'));
const source = bb.boot(document.firstElementChild);
source.name = 'The Elephant\'s Todo List';
