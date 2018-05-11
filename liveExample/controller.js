const source = require('bb-better-binding')(__dirname, document, window);
const bindForExample = require('./bindFor/bindFor.js');
const fs = require('fs');

window.bindFor = fs.readFileSync(`${__dirname}/bindFor/bindFor.html`, 'utf8');

console.log(__dirname);
fs.readdir(__dirname, (err, files) => {
    console.log(files);
});
