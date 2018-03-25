const {getValue, setProperty, safeInit} = require('./objScafolding');
const {createSource} = require('./source');

class HtmlBinder {

    constructor(document) {
        this.binds = {};
        let {source, handlers} = createSource();
        this.source = source;
        this.handlers = handlers;
        this.bindElem(document);
    }

    bindElem(elem) {
        if (elem.getAttribute) {
            let bindFor = elem.getAttribute('bind-for');
            let bindValue = elem.getAttribute('bind');

            if (bindFor) {
                bindFor = bindFor.split(' in ');
                if (bindFor.length === 1) {
                    this.createBind(bindFor[0], this.binds, this.source, this.handlers);
                    let container = document.createElement('div');
                    elem.removeAttribute('bind-for');
                    let outerHtml = elem.outerHTML;
                    this.binds[bindFor[0]].fors.push({container, outerHtml});
                    elem.replaceWith(container);
                } else {
                    // todo support source mapping in for-binds
                }
            }

            else if (bindValue) {
                this.createBind(bindValue, this.binds, this.source, this.handlers);
                this.binds[bindValue].values.push(elem);
                let handler = getValue(this.handlers, [bindValue]);
                handler && handler._func_ && handler._func_(getValue(this.source, [bindValue])); // todo propogate?
            }
        }

        for (let i = 0; i < elem.children.length; i++)
            this.bindElem(elem.children[i], this.binds, this.source, this.handlers);
    }

    createBind(bindName) {
        if (this.binds[bindName])
            return;

        let bind = {values: [], fors: []};
        safeInit(this.binds, bindName, bind);

        setProperty(this.handlers, [bindName, '_func_'], value => {
            bind.values.forEach(elem => {
                elem.innerHTML = value !== undefined ? value : null;
            });

            bind.fors.forEach(({container, outerHtml}) => {
                this.removeAllChildren(container);
                if (value && value.length)
                    for (let i = 0; i < value.length; i++) {
                        let childElem = document.createElement('div');
                        childElem.innerHTML = outerHtml;
                        this.bindElem(childElem, this.binds, this.source, this.handlers);
                        container.appendChild(childElem);
                    }
            });
        });

        return bind;
    }

    removeAllChildren(elem) {
        while (elem.firstElementChild)
            elem.removeChild(elem.firstElementChild);
    }
}

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
//
// handlers = {
//     a: {
//         _func_: 'func',
//         b: {
//             c: {
//                 _func_: 'func'
//             }
//         }
//     }
// };

module.exports = document => new HtmlBinder(document).source;
