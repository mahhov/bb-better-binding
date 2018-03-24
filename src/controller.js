const scope = require('./htmlBinder')(document);
// console.log(scope);
scope.x.y.z = [1, 2, 3, 4, 5];
scope.w = 3;
