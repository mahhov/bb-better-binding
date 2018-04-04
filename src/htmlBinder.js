const fs = require('fs');
const {getValue, setProperty, safeInit, clone, modify, translate, indexToDot, notUndefined, splitByWord, splitBySpace} = require('./objScafolding');
const {createSource} = require('./source');
const fileReader = require('./fileReader');

class HtmlBinder {

    constructor(dir, root) {
        this.binds = {};
        let {source, handlers} = createSource();
        this.source = source;
        this.handlers = handlers;
        this.components = {};
        HtmlBinder.replaceInlineBindings(root.children[0]);
        this.bindElem(root, {}, {}, dir);
    }

    bindElem(elem, sourceAugment, sourceLinks, linkBaseDir) {
        if (elem.getAttribute) {
            let bindComponentLink = HtmlBinder.getBindAttribute(elem, 'bind-component-link');
            let bindComponent = HtmlBinder.getBindAttribute(elem, 'bind-component');
            let bindUse = HtmlBinder.getBindAttribute(elem, 'bind-use');
            let bindAs = HtmlBinder.getBindAttribute(elem, 'bind-as');
            let bindFor = HtmlBinder.getBindAttribute(elem, 'bind-for');
            let bindIf = HtmlBinder.getBindAttribute(elem, 'bind-if');
            let bindValue = HtmlBinder.getBindAttribute(elem, 'bind');

            let attributes = elem.attributes;
            for (let i = 0; i < attributes.length; i++) {
                let {name, value} = attributes[i];
                let fieldMatches = value.match(/\$f?{([\w.[\]]+)}/g);
                fieldMatches && fieldMatches.forEach(match => {
                    let [, bindName] = match.match(/\$f?{([\w.[\]]+)}/);
                    bindName = translate(bindName, sourceLinks);
                    this.createBind(bindName, sourceAugment, sourceLinks, linkBaseDir);
                    this.binds[bindName].attributes.push({elem, name, value}); // todo prevent duplicates when same source bindName used multiple times in same attribute value
                });
                this.applyBindAttributes(elem, name, value);
            }

            if (bindComponentLink) {
                let {readDir, read} = fileReader(linkBaseDir, bindComponentLink);
                let loadedHtml = document.createElement('div');
                loadedHtml.innerHTML = read;
                HtmlBinder.replaceInlineBindings(loadedHtml);
                elem.replaceWith(loadedHtml);
                this.bindElem(loadedHtml, sourceAugment, sourceLinks, readDir);

            } else if (bindComponent) {
                let [componentName, paramsGroup] = splitByWord(bindComponent, 'with');
                let params = splitBySpace(paramsGroup);
                elem.remove();
                elem.removeAttribute('bind-component');
                let outerHtml = elem.outerHTML;
                this.components[componentName] = {outerHtml, params};

            } else if (bindUse) {
                let [componentName, paramsGroup] = splitByWord(bindUse, 'with');
                let paramsInput = splitBySpace(paramsGroup);
                let {outerHtml, params} = this.components[componentName];
                let componentElem = document.createElement('div');
                componentElem.innerHTML = outerHtml;
                elem.appendChild(componentElem);
                sourceLinks = clone(sourceLinks);
                params
                    .forEach((to, index) => {
                        sourceLinks[to] = paramsInput[index];
                    });

            } else if (bindAs) {
                sourceLinks = clone(sourceLinks);
                splitByWord(bindAs, ',')
                    .map(as => splitByWord(as, 'as'))
                    .forEach(([from, to]) => {
                        sourceLinks[to] = from;
                    });

            } else if (bindFor) {
                let [sourceMap, bindName] = splitByWord(bindFor, 'in');
                bindName = translate(bindName, sourceLinks);
                let sourceAugmentValue = getValue(sourceAugment, [bindName]);
                let container = document.createElement('div');
                elem.replaceWith(container);
                elem.removeAttribute('bind-for');
                let outerHtml = elem.outerHTML;

                if (sourceAugmentValue === undefined) {
                    this.createBind(bindName, sourceAugment, sourceLinks, linkBaseDir);
                    this.binds[bindName].fors.push({container, outerHtml, sourceMap});
                    let value = getValue(this.source, [bindName]);
                    this.applyBindFor(container, outerHtml, sourceMap, value, sourceAugment, linkBaseDir);
                } else
                    this.applyBindFor(container, outerHtml, sourceMap, sourceAugmentValue, sourceAugment, linkBaseDir);

            } else if (bindIf) {
                bindIf = translate(bindIf, sourceLinks);
                let sourceAugmentValue = getValue(sourceAugment, [bindIf]);

                if (sourceAugmentValue === undefined) {
                    this.createBind(bindIf, sourceAugment, sourceLinks, linkBaseDir);
                    this.binds[bindIf].ifs.push(elem);
                    let value = getValue(this.source, [bindIf]);
                    this.applyBindIf(elem, value);
                } else
                    this.applyBindIf(elem, sourceAugmentValue);

            } else if (bindValue) {
                bindValue = translate(bindValue, sourceLinks);
                let sourceAugmentValue = getValue(sourceAugment, [bindValue]);

                if (sourceAugmentValue === undefined) {
                    this.createBind(bindValue, sourceAugment, sourceLinks, linkBaseDir);
                    this.binds[bindValue].values.push(elem);
                    let value = getValue(this.source, [bindValue]);
                    this.applyBindValue(elem, value);
                } else
                    this.applyBindValue(elem, sourceAugmentValue);

            }
        }

        for (let i = elem.children.length - 1; i >= 0; i--)
            this.bindElem(elem.children[i], sourceAugment, sourceLinks, linkBaseDir);
    }

    createBind(bindName, sourceAugment, sourceLinks, linkBaseDir) {
        if (this.binds[bindName])
            return;

        let bind = {ifs: [], fors: [], values: [], attributes: []};
        safeInit(this.binds, bindName, bind);

        setProperty(this.handlers, [bindName, '_func_'], value => {
            bind.ifs.forEach(elem => {
                this.applyBindIf(elem, value);
            });

            bind.fors.forEach(({container, outerHtml, sourceMap}) => {
                this.applyBindFor(container, outerHtml, sourceMap, value, sourceAugment, sourceLinks, linkBaseDir);
            });

            bind.values.forEach(elem => {
                this.applyBindValue(elem, value);
            });

            bind.attributes.forEach(({elem, name, value}) => {
                this.applyBindAttributes(elem, name, value);
            });
        });

        return bind;
    }

    applyBindFor(container, outerHtml, sourceMap, value, sourceAugment, sourceLinks, linkBaseDir) {
        HtmlBinder.removeAllChildren(container);
        if (value && value.length)
            value.forEach(valueItem => {
                let childElem = document.createElement('div');
                childElem.innerHTML = outerHtml;
                let sourceAugmentModified = modify(sourceAugment, sourceMap, valueItem);
                this.bindElem(childElem, sourceAugmentModified, sourceLinks, linkBaseDir);
                container.appendChild(childElem);
            });
    }

    applyBindIf(elem, value) {
        elem.hidden = !value;
    }

    applyBindValue(elem, value) {
        elem.innerHTML = notUndefined(value);
    }

    applyBindAttributes(elem, name, value) {
        let modifiedValue = value.replace(/(\\)?\$(f)?{([\w.[\]]+)}/g, (all, prefixSlash, prefixF, match) => {
            if (prefixSlash)
                return all;
            let value = notUndefined(getValue(this.source, [match]), '');
            return prefixF ? `(${value})()` : value;
        });
        elem.setAttribute(name, modifiedValue);
    }

    static replaceInlineBindings(elem) {
        elem.innerHTML = elem.innerHTML.replace(/(\\)?\$s{([\w.[\]]+)}/g, (all, prefix, match) => prefix ? all : `<span bind="${match}"></span>`); // todo similar regex expressions extract
    }

    static removeAllChildren(elem) {
        while (elem.firstElementChild)
            elem.removeChild(elem.firstElementChild);
    }

    static getBindAttribute(elem, attribute) {
        return indexToDot(elem.getAttribute(attribute));
    }
}

// binds = {
//     'a.b.c': {
//         fors: [{container, outerHtml, sourceMap}],
//         ifs: [elem1, elem3],
//         values: [elem1, elem2],
//         attributes: [{elem1, attributeName, attributeOriginalValue}]
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
//
// components = {
//     a: {
//         outerHtml: outerHtml,
//         params: []
//     }
// };

module.exports = (dir, document) => new HtmlBinder(dir, document).source;
