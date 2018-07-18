let template = require('fs').readFileSync(`${__dirname}/block.html`, 'utf8');
let controller = source => {
    source.list = ['elephant', 'lion', 'rabbit'];
};
let parameters = ['color', 'name'];
module.exports = {template, controller, parameters};
