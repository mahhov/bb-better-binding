const scope = require('./htmlBinder')(document);
scope.x.y.z = [1, 2, 3];
scope.w = 3;

scope.x.y.z.push(6);

// scope.x.y.z = [1, 2, 3];

// scope.x.y = {z: [1, 2]};

// todo
// pushing to array
// assigning to array
// assigining to parent obj

window.scope = scope;
