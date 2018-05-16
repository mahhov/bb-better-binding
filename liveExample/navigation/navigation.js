let template = require('fs').readFileSync(`${__dirname}/navigation.html`, 'utf8');

let controller = source => {
    source.pages = ['Hello World', 'Bind For'];

    source.setPage = pageIndex => {
        channels.parent.send()
    };

    window.x = source;
};

let parameters = ['pages2'];

module.exports = {template, controller, parameters};