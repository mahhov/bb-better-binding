const {hasProperty, setProperty, addWatcher, safeInit} = require('./objScafolding');

let bindRoot = document => {
    let binds = {};
    let scope = {};
    bindElem(document, binds, scope);
    return scope;
};

let bindElem = (elem, binds, scope) => {
    if (elem.getAttribute) {
        let bindFor = elem.getAttribute('bind-for');
        let bindValue = elem.getAttribute('bind');

        if (bindFor) {
            createBind(bindFor, binds, scope);
            let container = document.createElement('div');
            elem.removeAttribute('bind-for');
            let outerHtml = elem.outerHTML;
            binds[bindFor].fors.push({container, outerHtml});
            elem.replaceWith(container);
        }

        else if (bindValue) {
            createBind(bindValue, binds, scope);
            binds[bindValue].values.push(elem);
        }
    }

    for (let i = 0; i < elem.children.length; i++)
        bindElem(elem.children[i], binds, scope);
};

let createBind = (bindName, binds, scope) => {
    if (binds[bindName])
        return;

    setProperty(scope, bindName, '');

    let bind = {values: [], fors: []};
    safeInit(binds, bindName, bind);

    addWatcher(scope, bindName, newValue => {
        bind.values.forEach(elem => {
            elem.innerHTML = newValue;
        });

        bind.fors.forEach(({container, outerHtml}) => {
            removeAllChildren(container);
            for (let i = 0; i < newValue.length; i++) {
                let childElem = document.createElement('div');
                childElem.innerHTML = outerHtml;
                bindElem(childElem, binds, scope);
                container.appendChild(childElem);
            }
        });
    });

    return bind;
};

let removeAllChildren = elem => {
    while (elem.firstElementChild)
        elem.removeChild(elem.firstElementChild);
};

// binds = {
//     'a.b.c': {
//         values: [elem1, elem2],
//         fors: [{container, outerHtml}]
//     }
// };
//
// scope = {
//     a: {
//         b: {
//             c: {}
//         }
//     }
// };

module.exports = bindRoot;
