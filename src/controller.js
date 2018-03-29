const source = require('./htmlBinder')(document);

source.arr = [1, 2];
source.obj = {key: 10, key2: 12};

window.source = source;

// todo
// html to support bind-component
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// garbage collect handler bindings for removed elements
