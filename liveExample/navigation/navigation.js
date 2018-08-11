let template = require('fs').readFileSync(`${__dirname}/navigation.html`, 'utf8');

let controller = source => {
};

let parameters = ['pages', 'setPageHandler'];

module.exports = {template, controller, parameters};
