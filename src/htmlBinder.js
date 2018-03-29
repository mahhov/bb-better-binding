const {getValue, setProperty, safeInit, clone, modify, translate, indexToDot} = require('./objScafolding');
const {createSource} = require('./source');

class HtmlBinder {

    constructor(root) {
        this.binds = {};
        let {source, handlers} = createSource();
        this.source = source;
        this.handlers = handlers;
        HtmlBinder.replaceInlineBindings(root.children[0]);
        this.bindElem(root, {}, {});
    }

    bindElem(elem, sourceAugment, sourceLinks) {
        if (elem.getAttribute) {
            let bindAs = HtmlBinder.getBindAttribute(elem, 'bind-as');
            let bindFor = HtmlBinder.getBindAttribute(elem, 'bind-for');
            let bindIf = HtmlBinder.getBindAttribute(elem, 'bind-if');
            let bindValue = HtmlBinder.getBindAttribute(elem, 'bind');

            if (bindAs) {
                sourceLinks = clone(sourceLinks);
                bindAs
                    .split(/[,;]/)
                    .map(as => as.split(/\s+as\s+/))
                    .forEach(([from, to]) => {
                        sourceLinks[to] = from;
                    });

            } else if (bindFor) {
                let [sourceMap, bindName] = bindFor.split(/\s+in\s+/);
                bindName = translate(bindName, sourceLinks);
                let sourceAugmentValue = getValue(sourceAugment, [bindName]);
                let container = document.createElement('div');
                elem.replaceWith(container);
                elem.removeAttribute('bind-for');
                let outerHtml = elem.outerHTML;

                if (sourceAugmentValue === undefined) {
                    this.createBind(bindName, sourceAugment, sourceLinks);
                    this.binds[bindName].fors.push({container, outerHtml, sourceMap});
                    let value = getValue(this.source, [bindName]);
                    this.applyBindFor(container, outerHtml, sourceMap, value, sourceAugment);
                } else
                    this.applyBindFor(container, outerHtml, sourceMap, sourceAugmentValue, sourceAugment);

            } else if (bindIf) {
                bindIf = translate(bindIf, sourceLinks);
                let sourceAugmentValue = getValue(sourceAugment, [bindIf]);
                elem.removeAttribute('bind-if');

                if (sourceAugmentValue === undefined) {
                    this.createBind(bindIf, sourceAugment, sourceLinks);
                    this.binds[bindIf].ifs.push(elem);
                    let value = getValue(this.source, [bindIf]);
                    this.applyBindIf(elem, value);
                } else
                    this.applyBindIf(elem, sourceAugmentValue);

            } else if (bindValue) {
                bindValue = translate(bindValue, sourceLinks);
                let sourceAugmentValue = getValue(sourceAugment, [bindValue]);

                if (sourceAugmentValue === undefined) {
                    this.createBind(bindValue, sourceAugment, sourceLinks);
                    this.binds[bindValue].values.push(elem);
                    let value = getValue(this.source, [bindValue]);
                    this.applyBindValue(elem, value);
                } else
                    this.applyBindValue(elem, sourceAugmentValue);
            }
        }

        for (let i = 0; i < elem.children.length; i++)
            this.bindElem(elem.children[i], sourceAugment, sourceLinks);
    }

    createBind(bindName, sourceAugment, sourceLinks) {
        if (this.binds[bindName])
            return;

        let bind = {ifs: [], fors: [], values: []};
        safeInit(this.binds, bindName, bind);

        setProperty(this.handlers, [bindName, '_func_'], value => {
            bind.ifs.forEach(elem => {
                this.applyBindIf(elem, value);
            });

            bind.fors.forEach(({container, outerHtml, sourceMap}) => {
                this.applyBindFor(container, outerHtml, sourceMap, value, sourceAugment, sourceLinks);
            });

            bind.values.forEach(elem => {
                this.applyBindValue(elem, value);
            });
        });

        return bind;
    }

    applyBindFor(container, outerHtml, sourceMap, value, sourceAugment, sourceLinks) {
        HtmlBinder.removeAllChildren(container);
        if (value && value.length)
            value.forEach(valueItem => {
                let childElem = document.createElement('div');
                childElem.innerHTML = outerHtml;
                let sourceAugmentModified = modify(sourceAugment, sourceMap, valueItem);
                this.bindElem(childElem, sourceAugmentModified, sourceLinks);
                container.appendChild(childElem);
            });
    }

    applyBindIf(elem, value) {
        elem.hidden = !value;
    }

    applyBindValue(elem, value) {
        elem.innerHTML = HtmlBinder.notUndefined(value);
    }

    static replaceInlineBindings(elem) {
        elem.innerHTML = elem.innerHTML.replace(/([\\])?\${([\w.[\]]+)}/g, (all, prefix, match) => prefix ? all : `<span bind="${match}"></span>`);
    }

    static removeAllChildren(elem) {
        while (elem.firstElementChild)
            elem.removeChild(elem.firstElementChild);
    }

    static notUndefined(value) {
        return value !== undefined ? value : null;
    }

    static getBindAttribute(elem, attribute) {
        return indexToDot(elem.getAttribute(attribute));
    }
}

// binds = {
//     'a.b.c': {
//         fors: [{container, outerHtml, sourceMap}],
//         ifs: [elem1, elem3],
//         values: [elem1, elem2]
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
