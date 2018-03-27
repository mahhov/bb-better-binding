const source = require('./htmlBinder')(document);

// source.w = {y: 2};
// source.x = {y: {}};
// source.x.y.z = [1, 2, 3];
// source.x.y.z.push(4);
// source.x.y.z.push(4);
// source.x.y.z = [1, 2];
// source.w.y = 3;
// source.x.y = {z: [1, 1, 1]};
// source.x.y = null;
// source.x.y = {};
// source.x.y.z = 2;
// source.x.y.z = [1, 2];
// source.x = {y: {z: [1]}};
// source.x = {yy: {z: [1, 2]}};
// source.x = {y: {zz: [1, 2]}};
// source.x.y.z = [1, 2, 3];
// source.w = 3;
// source.w = {};
// source.w.y = 3;
// source.x.y.zz = [1, 2];
// source.x.y.z = [{val: 10, o: 100}, {val: 12, o: 122}];

source.list = [{x: [1, 2]}, {x: [3, 4]}, {x: [5, 6]}];

window.source = source;

// todo
// expand html bind options for bind-if, bind-component
// allow inline binding: `{{x}}`
// allow array binding in html: `bind="x[0]"` and `bind="x[y]"`
// nested for
// garbage collect handler bindings for removed elements
