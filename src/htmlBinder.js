const {setProperty, addWatcher, safePush} = require('./objScafolding');

let bindRoot = document => {
    let binds = {};
    bind(document, binds);
    return processBinds(binds);
};

let bind = (elem, binds) => {
    if (elem.getAttribute) {
        let bindFor = elem.getAttribute('bind-for');
        let bind = elem.getAttribute('bind');

        if (bindFor) {
            safePush(binds, bindFor, {values: [], fors: []}, 'fors', elem);
            elem.style.display = 'none';
        }

        else if (bind)
            safePush(binds, bind, {values: [], fors: []}, 'values', elem);
    }

    for (let i = 0; i < elem.children.length; i++)
        bind(elem.children[i], binds);
};


let processBinds = binds => {
    let scope = {};

    for (value in binds)
        processBind(value, binds[value], scope);

    return scope;
};

let processBind = (value, bind, scope) => {
    setProperty(scope, value, '');

    addWatcher(scope, value, newValue => {
        bind.values.forEach(elem => {
            elem.innerHTML = newValue;
        });

        bind.fors.forEach(elem => {
            for (let i = 0; i < newValue.length; i++) {
                let eachElem = elem.cloneNode(true);
                eachElem.style.display = '';
                elem.insertAdjacentElement('afterend', eachElem);
            }
        });
    });
};

// binds = {
//     'a.b.c': {
//         values: [elem1, elem2],
//         fors: [elem3]
//     }
// };

module.exports = bindRoot;
