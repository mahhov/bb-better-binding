const {getValue, setProperty, safeInit, modify} = require('./objScafolding');
const {createSource} = require('./source');

class HtmlBinder {

    constructor(root) {
        this.binds = {};
        let {source, handlers} = createSource();
        this.source = source;
        this.handlers = handlers;
        this.bindElem(root, {});
    }

    bindElem(elem, sourceAugment) {
        if (elem.getAttribute) {
            let bindFor = elem.getAttribute('bind-for');
            let bindValue = elem.getAttribute('bind');

            if (bindFor) {
                let [sourceMap, bindName] = bindFor.split(' in ');
                this.createBind(bindName, sourceAugment);
                let container = document.createElement('div');
                elem.removeAttribute('bind-for');
                let outerHtml = elem.outerHTML;
                this.binds[bindName].fors.push({container, outerHtml, sourceMap});
                elem.replaceWith(container);
            }

            else if (bindValue) {
                let sourceAugmentValue = getValue(sourceAugment, [bindValue]);

                if (sourceAugmentValue === undefined) {
                    this.createBind(bindValue, sourceAugment);
                    this.binds[bindValue].values.push(elem);
                    let handler = getValue(this.handlers, [bindValue]);
                    handler && handler._func_ && handler._func_(getValue(this.source, [bindValue]));

                } else
                    elem.innerHTML = sourceAugmentValue;
            }
        }

        for (let i = 0; i < elem.children.length; i++)
            this.bindElem(elem.children[i], sourceAugment);
    }

    createBind(bindName, sourceAugment) {
        if (this.binds[bindName])
            return;

        let bind = {values: [], fors: []};
        safeInit(this.binds, bindName, bind);

        setProperty(this.handlers, [bindName, '_func_'], value => {
            bind.values.forEach(elem => {
                elem.innerHTML = value !== undefined ? value : null;
            });

            bind.fors.forEach(({container, outerHtml, sourceMap}) => {
                HtmlBinder.removeAllChildren(container);
                if (value && value.length)
                    value.forEach(valueItem => {
                        let childElem = document.createElement('div');
                        childElem.innerHTML = outerHtml;
                        let sourceAugmentModified = modify(sourceAugment, sourceMap, valueItem);
                        this.bindElem(childElem, sourceAugmentModified);
                        container.appendChild(childElem);
                    });
            });
        });

        return bind;
    }

    static removeAllChildren(elem) {
        while (elem.firstElementChild)
            elem.removeChild(elem.firstElementChild);
    }
}

// binds = {
//     'a.b.c': {
//         values: [elem1, elem2],
//         fors: [{container, outerHtml, sourceMap}]
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
