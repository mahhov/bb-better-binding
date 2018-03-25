const scope = require('./htmlBinder')(document);
scope.x.y.z = [1, 2, 3, 4, 5];
scope.w = 3;
window.s = scope;
