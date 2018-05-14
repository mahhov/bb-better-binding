let template = require('fs').readFileSync(`${__dirname}/bindFor.html`, 'utf8');

let controller = source => {
    source.name = 'james';
    source.list = ['elephant', 'lion', 'rabbit'];
};

module.exports = {template, controller};