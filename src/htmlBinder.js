const {getProperty, setProperty, addWatcher} = require('./objScafolding');

let bindRoot = document => {
    let binds = {values: {}, for: {}};
    bind(document, binds);
    return processBinds(binds);
};

let bind = (elem, binds) => {
    if (elem.getAttribute) {
        let bindFor = elem.getAttribute('bind-for');
        let bind = elem.getAttribute('bind');

        if (bindFor) {

        }

        else if (bind) {
            binds.values[bind] = binds.values[bind] || [];
            binds.values[bind].push(elem);
        }
    }

    for (let i = 0; i < elem.children.length; i++)
        bind(elem.children[i], binds);
};


let processBinds = binds => {
    let scope = {};
    for (value in binds.values) {
        processBindValue(value, binds.values[value], scope);
    }
    return scope;
};

let processBindValue = (value, elems, scope) => {
    setProperty(scope, value, '');
    addWatcher(scope, value, newValue => {
        elems.forEach(elem => {
            elem.innerHTML = newValue;
        });
    });
};

// binds = {
//     values: {
//         'x.y.z': [elem1],
//         't': [elem3, elem4]
//     }
// };

module.exports = bindRoot;
