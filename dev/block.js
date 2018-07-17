let template = require('fs').readFileSync(`${__dirname}/block.html`, 'utf8');

let controller = source => {
};

let parameters = ['param1', 'param2', 'param3'];

module.exports = {template, controller, parameters};
