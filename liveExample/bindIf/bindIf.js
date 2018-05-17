const fs = require('fs');
let template = fs.readFileSync(`${__dirname}/bindIf.html`, 'utf8');
let controllerString = fs.readFileSync(`${__dirname}/controller.js`, 'utf8');
let controller = require('./controller');

module.exports = {template, controller, controllerString};
