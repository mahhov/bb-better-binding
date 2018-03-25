const {setProperty, safeInit} = require('./objScafolding');
const {createScope} = require('./scope');

let bindRoot = document => {
    let binds = {};
    let {scope, handlers} = createScope();
    bindElem(document, binds, scope, handlers);
    return scope;
};

let bindElem = (elem, binds, scope, handlers) => {
    if (elem.getAttribute) {
        let bindFor = elem.getAttribute('bind-for');
        let bindValue = elem.getAttribute('bind');

        if (bindFor) {
            createBind(bindFor, binds, scope, handlers);
            let container = document.createElement('div');
            elem.removeAttribute('bind-for');
            let outerHtml = elem.outerHTML;
            binds[bindFor].fors.push({container, outerHtml});
            elem.replaceWith(container);
        }

        else if (bindValue) {
            createBind(bindValue, binds, scope, handlers);
            binds[bindValue].values.push(elem);
        }
    }

    for (let i = 0; i < elem.children.length; i++)
        bindElem(elem.children[i], binds, scope, handlers);
};

let createBind = (bindName, binds, scope, handlers) => {
    if (binds[bindName])
        return;

    setProperty(scope, bindName, null);

    let bind = {values: [], fors: []};
    safeInit(binds, bindName, bind);

    setProperty(handlers, bindName, value => {
        bind.values.forEach(elem => {
            elem.innerHTML = value;
        });

        bind.fors.forEach(({container, outerHtml}) => {
            removeAllChildren(container);
            for (let i = 0; i < value.length; i++) {
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
