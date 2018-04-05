const fs = require('fs');
const {getValue, setProperty, clone, modify, translate, indexToDot, notUndefined, splitByWord, splitBySpace} = require('./objScafolding');
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
        this.bindElem(root, {}, dir);
    }

    bindElem(elem, sourceLinks, linkBaseDir) {
        let skip = false;

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
                if (fieldMatches) {
                    fieldMatches.forEach(match => {
                        let [, bindName] = match.match(/\$f?{([\w.[\]]+)}/);
                        bindName = translate(bindName, sourceLinks);
                        this.createBind(bindName, sourceLinks, linkBaseDir);
                        this.binds[bindName].attributes.push({elem, name, value}); // todo prevent duplicates when same source bindName used multiple times in same attribute value
                    });
                    this.applyBindAttributes(elem, name, value, sourceLinks);
                }
            }

            if (bindComponentLink) {
                let {readDir, read} = fileReader(linkBaseDir, bindComponentLink);
                let loadedHtml = document.createElement('div');
                loadedHtml.innerHTML = read;
                HtmlBinder.replaceInlineBindings(loadedHtml);
                elem.replaceWith(loadedHtml);
                this.bindElem(loadedHtml, sourceLinks, readDir);

            } else if (bindComponent) {
                skip = true;
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
                params.forEach((to, index) => {
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
                skip = true;
                let [sourceTo, bindName] = splitByWord(bindFor, 'in');
                bindName = translate(bindName, sourceLinks);
                let container = document.createElement('div');
                elem.replaceWith(container);
                elem.removeAttribute('bind-for');
                let outerHtml = elem.outerHTML;
                this.createBind(bindName, sourceLinks, linkBaseDir);
                this.binds[bindName].fors.push({container, outerHtml, sourceTo, sourceFrom: bindName});
                this.applyBindFor(container, outerHtml, sourceTo, bindName, linkBaseDir);

            } else if (bindIf) {
                bindIf = translate(bindIf, sourceLinks);
                this.createBind(bindIf, sourceLinks, linkBaseDir);
                this.binds[bindIf].ifs.push(elem);
                let value = getValue(this.source, [bindIf]);
                this.applyBindIf(elem, value);

            } else if (bindValue) {
                bindValue = translate(bindValue, sourceLinks);
                this.createBind(bindValue, sourceLinks, linkBaseDir);
                this.binds[bindValue].values.push(elem);
                let value = getValue(this.source, [bindValue]);
                this.applyBindValue(elem, value);
            }
        }

        if (!skip)
            for (let i = elem.children.length - 1; i >= 0; i--)
                this.bindElem(elem.children[i], sourceLinks, linkBaseDir);
    }

    createBind(bindName, sourceLinks, linkBaseDir) {
        if (this.binds[bindName])
            return;

        let bind = {ifs: [], fors: [], values: [], attributes: []};
        this.binds[bindName] = bind;

        setProperty(this.handlers, [bindName, '_func_'], value => {
            bind.attributes.forEach(({elem, name, value}) => {
                this.applyBindAttributes(elem, name, value, sourceLinks);
            });

            bind.fors.forEach(({container, outerHtml, sourceTo, sourceFrom}) => {
                this.applyBindFor(container, outerHtml, sourceTo, sourceFrom, sourceLinks, linkBaseDir);
            });

            bind.ifs.forEach(elem => {
                this.applyBindIf(elem, value);
            });

            bind.values.forEach(elem => {
                this.applyBindValue(elem, value);
            });
        });
    }

    applyBindAttributes(elem, name, value, sourceLinks) {
        let modifiedValue = value.replace(/(\\)?\$(f)?{([\w.[\]]+)}/g, (all, prefixSlash, prefixF, match) => {
            if (prefixSlash)
                return all;
            match = translate(match, sourceLinks);
            let value = notUndefined(getValue(this.source, [match]), '');
            return prefixF ? `(${value})()` : value;
        });
        elem.setAttribute(name, modifiedValue);
    }

    applyBindFor(container, outerHtml, sourceTo, sourceFrom, sourceLinks, linkBaseDir) {
        HtmlBinder.removeAllChildren(container);
        let value = getValue(this.source, [sourceFrom]);
        if (value && value.length)
            value.forEach((_, index) => {
                let childElem = document.createElement('div');
                childElem.innerHTML = outerHtml;
                sourceLinks = modify(sourceLinks, sourceTo, `${sourceFrom}.${index}`);
                this.bindElem(childElem, sourceLinks, linkBaseDir);
                container.appendChild(childElem);
            });
    }

    applyBindIf(elem, value) {
        elem.hidden = !value;
    }

    applyBindValue(elem, value) {
        elem.innerHTML = notUndefined(value);
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
//         fors: [{container, outerHtml, sourceTo, sourceFrom}],
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
