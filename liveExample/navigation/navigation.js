let template = require('fs').readFileSync(`${__dirname}/navigation.html`, 'utf8');

let controller = source => {
    source.pages = ['Hello World', 'Bind For'];

    source.setPage = pageIndex => {
    }
};

module.exports = {template, controller};