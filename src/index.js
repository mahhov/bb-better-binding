const htmlBinder = require('./htmlBinder');

module.exports = (dir, root) => htmlBinder(dir, root);

// todo
// allow array binding in html: `<div bind="x[y]"></div>`
// clean up package.json
// $s{x} syntax to only affect inner text and not attributes
// allow defining and using components in any order
// allow using expressions for more binds than just ifs and values (e.g. attributes, fors, as, use)
// support $e nested inside $s
// investigate why source.a = source.b doesn't propogate changes
// investigate why bind-for indexVars don't propogate changes
// investigate how to set setters on non-source object assignments
// routing or swapping states
