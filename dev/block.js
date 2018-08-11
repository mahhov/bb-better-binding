let template = require('fs').readFileSync(`${__dirname}/block.html`, 'utf8');
let controller = source => {
    source.list = ['elephant', 'lion', 'rabbit'];
    source.transformed = source.name + 3;
    source.transform = (a, b) => a + '.' + b;
};
let parameters = ['color', 'name'];
module.exports = {template, controller, parameters};
