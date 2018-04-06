const htmlBinder = require('./htmlBinder');

module.exports = (dir, root) => htmlBinder(dir, root);

// todo
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// garbage collect handler bindings for removed elements
// name clashes with muleiple as's or as's & for's
// clean up package.json
// ${x} syntax to only affect inner text and not attributes
// allow defining and using components in any order
// bug changing object property doens't tirgger bind-for (e.g. `source.overdueBooks[0] = '1'`)
// known bug with having bind-for on array of objects, then changing field of one of the objects doesn't trigger bind
// double check readme function bind example is valid
