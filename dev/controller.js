const bb = require('bb-better-binding')();

bb.declareBlock('myBlock', require('./block'));

let source = bb.boot(document.firstElementChild, window);

source.update = () => {
    source.output = 'x ' + source.input.value + ' x';
    console.log(source.outputDiv.innerHTML);
};
