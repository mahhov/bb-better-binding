const source = require('./htmlBinder')(document);

source.w = 2;
source.x = {y: {}};
source.x.y.z = [1, 2, 3];

// source.x.y.z = [1, 2, 3];
// source.w = 3;

// source.x.y.z.push(6);

// source.x.y.z = [1, 2, 3];

source.x.y = {z: [1, 2]};

// todo
// pushing to array
// assigning to array
// assigining to parent obj
// nested for

window.source = source;

// todo
// wrap htmlBinder inside class
// expand html bind options for bind-if, bind-as and sharing bind-for & bind
// allow inline binding
// allow array binding in html
// handler functions assigned to _func_ to allow for observing multi level
// propogate removing properties from source
