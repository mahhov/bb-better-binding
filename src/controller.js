const source = require('./htmlBinder')(document);

source.val = 10;
source.arr = [0, 1, 2];

window.source = source;

// todo
// html to support bind-component
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// garbage collect handler bindings for removed elements
