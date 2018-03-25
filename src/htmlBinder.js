const {getValue, setProperty, safeInit} = require('./objScafolding');
const {createSource} = require('./source');

let bindRoot = document => {
    let binds = {};
    let {source, handlers} = createSource();
    bindElem(document, binds, source, handlers);
    return source;
};

let bindElem = (elem, binds, source, handlers) => {
    if (elem.getAttribute) {
        let bindFor = elem.getAttribute('bind-for');
        let bindValue = elem.getAttribute('bind');

        if (bindFor) {
            createBind(bindFor, binds, source, handlers);
            let container = document.createElement('div');
            elem.removeAttribute('bind-for');
            let outerHtml = elem.outerHTML;
            binds[bindFor].fors.push({container, outerHtml});
            elem.replaceWith(container);
        }

        else if (bindValue) {
            createBind(bindValue, binds, source, handlers);
            binds[bindValue].values.push(elem);
            let handler = getValue(handlers, bindValue);
            handler && handler(getValue(source, bindValue));
        }
    }

    for (let i = 0; i < elem.children.length; i++)
        bindElem(elem.children[i], binds, source, handlers);
};

let createBind = (bindName, binds, source, handlers) => {
    if (binds[bindName])
        return;

    let bind = {values: [], fors: []};
    safeInit(binds, bindName, bind);

    setProperty(handlers, bindName, value => {
        bind.values.forEach(elem => {
            elem.innerHTML = value;
        });

        bind.fors.forEach(({container, outerHtml}) => {
            removeAllChildren(container);
            if (value && value.length)
                for (let i = 0; i < value.length; i++) {
                    let childElem = document.createElement('div');
                    childElem.innerHTML = outerHtml;
                    bindElem(childElem, binds, source, handlers);
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
// source = {
//     a: {
//         b: {
//             c: {}
//         }
//     }
// };

module.exports = bindRoot;
