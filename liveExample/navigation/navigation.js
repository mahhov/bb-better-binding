let template = require('fs').readFileSync(`${__dirname}/navigation.html`, 'utf8');

let controller = source => {
    source.init = () => source.getElem('x.navigationRadio0').checked = true;
};

let parameters = ['pages', 'setPageHandler'];

module.exports = {template, controller, parameters};
