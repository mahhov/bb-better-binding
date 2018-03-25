const scope = require('./htmlBinder')(document);
scope.x.y.z = [1, 2, 3];
scope.w = 3;

// scope.x.y.z.push(6);

// scope.x.y.z = [1, 2, 3];

// scope.x.y = {z: [1, 2]};

// todo
// pushing to array
// assigning to array
// assigining to parent obj
// nested for

window.scope = scope;

// todo
// rename scope -> source
// wrap htmlBinder inside class
// propogate changes down scope
// expand html bind options for bind-if, bind-as and sharing bind-for & bind
// allow inline binding
// allow array binding in html
// initialize scope as null
