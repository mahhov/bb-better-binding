const source = require('./htmlBinder')(document);

source.source = 'only once';
source.obj = {long: 10, longArray: [10, 11], longObj: {key: 'value'}};

window.source = source;

// todo
// html to support bind-component
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// garbage collect handler bindings for removed elements
// name clashes with muleiple as's or as's & for's
// binding via array index when resolving falsy; e.g., bind="x[0]", source.x = [false];
