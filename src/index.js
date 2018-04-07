const htmlBinder = require('./htmlBinder');

module.exports = (dir, root) => htmlBinder(dir, root);

// todo
// allow array binding in html: `<div bind="x[y]"></div>`
// name clashes with muleiple as's or as's & for's
// clean up package.json
// $s{x} syntax to only affect inner text and not attributes
// allow defining and using components in any order
