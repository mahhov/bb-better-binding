const source = require('./htmlBinder')(document);

source.w = {y: 2};
source.x = {y: {}};
source.x.y.z = [1, 2, 3];
source.x.y.z.push(4);
source.x.y.z.push(4);
source.x.y.z = [1, 2];
source.w.y = 3;
source.x.y = {z: [1, 1, 1]};
source.x.y = null;
source.x.y = {};
source.x.y.z = 2;
source.x.y.z = [1, 2];
source.x = {y: {z: [1]}};
source.x = {yy: {z: [1, 2]}};
source.x = {y: {zz: [1, 2]}};
source.x.y.z = [1, 2, 3];
source.w = 3;
source.w = {};
source.w.y = 3;

window.source = source;

// todo
// wrap htmlBinder inside class
// expand html bind options for bind-if, bind-as and sharing bind-for & bind
// allow inline binding
// allow array binding in html
// nested for
