const htmlBinder = require('./htmlBinder');

module.exports = root => htmlBinder(root);

// todo
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// garbage collect handler bindings for removed elements
// name clashes with muleiple as's or as's & for's
// clean up package.json
// ${x} syntax to only affect inner text and not attributes
// allow defining and using components in any order
