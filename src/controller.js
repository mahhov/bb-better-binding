const source = require('./htmlBinder')(document);

source.val = 10;
source.arr = [1, 0, 2, 3, false, true];

window.source = source;

// todo
// expand html bind options for bind-if, bind-component
// allow inline binding: `{{x}}`
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// nested for
// garbage collect handler bindings for removed elements
