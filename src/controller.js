const source = require('./htmlBinder')(document);

source.x = [false];
source.y = false;
source.z = {z: false};

window.source = source;

// todo
// html to support bind-component
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// garbage collect handler bindings for removed elements
// name clashes with muleiple as's or as's & for's
// clean up package.json
