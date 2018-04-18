const {getValue, setProperty, clone, modify, translate, indexToDot, notUndefined, splitByWord, splitBySpace, splitByComma} = require('./objScafolding');
const {createSource} = require('./source');
const fileReader = require('./fileReader');
const {spanRegex, allSpanRegex, bindRegex, allBindRegex, functionRegex, allFunctionRegex, expressionRegex, allExpressionMatches} = require('./regex');

class HtmlBinder {

    constructor(dir, root) {
        this.binds = {};
        let {source, handlers} = createSource();
        this.source = source;
        this.handlers = handlers;
        this.components = {};
        this.root = root.children[0];
        HtmlBinder.replaceInlineBindings(this.root);
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

                let bindMatches = value.match(allBindRegex);
                if (bindMatches) {
                    bindMatches.forEach(match => {
                        let [, , bindName] = match.match(bindRegex);
                        this.addAttributeBind(bindName, elem, name, value, sourceLinks);
                    });
                    this.applyBindAttributes(elem, name, value, sourceLinks);
                }

                let functionMatches = value.match(allFunctionRegex);
                if (functionMatches) {
                    functionMatches.forEach(match => {
                        let [, , functionName, params] = match.match(functionRegex);
                        this.addAttributeBind(functionName, elem, name, value, sourceLinks);
                        splitByComma(params)
                            .forEach(param => {
                                this.addAttributeBind(param, elem, name, value, sourceLinks);
                            });
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
                this.createBind(bindName);
                this.binds[bindName].fors.push({container, outerHtml, sourceTo, sourceFrom: bindName, sourceLinks});
                this.applyBindFor(container, outerHtml, sourceTo, bindName, linkBaseDir);

            } else if (bindIf) {
                let {expressionName, params, bindName} = this.extractExpressionBind(elem, bindIf, 'ifs', sourceLinks);
                this.applyBindIf(elem, expressionName, params, bindName);

            } else if (bindValue) {
                let {expressionName, params, bindName} = this.extractExpressionBind(elem, bindValue, 'values', sourceLinks);
                this.applyBindValue(elem, expressionName, params, bindName);
            }
        }

        if (!skip)
            for (let i = elem.children.length - 1; i >= 0; i--)
                this.bindElem(elem.children[i], sourceLinks, linkBaseDir);
    }

    createBind(bindName) {
        if (this.binds[bindName])
            return;

        let bind = {ifs: [], fors: [], values: [], attributes: []};
        this.binds[bindName] = bind;

        setProperty(this.handlers, [bindName, '_func_'], () => {
            bind.attributes = bind.attributes.filter(({elem}) => this.root.contains(elem));
            bind.fors = bind.fors.filter(({container}) => this.root.contains(container));
            bind.ifs = bind.ifs.filter(({elem}) => this.root.contains(elem));
            bind.values = bind.values.filter(({elem}) => this.root.contains(elem));

            bind.attributes.forEach(({elem, name, value, sourceLinks}) => {
                this.applyBindAttributes(elem, name, value, sourceLinks);
            });

            bind.fors.forEach(({container, outerHtml, sourceTo, sourceFrom, sourceLinks, linkBaseDir}) => {
                this.applyBindFor(container, outerHtml, sourceTo, sourceFrom, sourceLinks, linkBaseDir);
            });

            bind.ifs.forEach(({elem, expressionName, params, bindName}) => {
                this.applyBindIf(elem, expressionName, params, bindName);
            });

            bind.values.forEach(({elem, expressionName, params, bindName}) => {
                this.applyBindValue(elem, expressionName, params, bindName);
            });
        });
    }

    extractExpressionBind(elem, expressionStr, type, sourceLinks) { // type = 'ifs' or 'values' 
        let expressionMatch = expressionStr.match(expressionRegex);
        if (expressionMatch) {
            let [, , expressionName, paramsStr] = expressionMatch;
            expressionName = translate(expressionName, sourceLinks);
            let params = splitByComma(paramsStr)
                .map(param => translate(param, sourceLinks));
            let expressionValue = {elem, expressionName, params};
            this.addExpressionBind(expressionName, elem, type, expressionValue);
            params
                .forEach(param => {
                    this.addExpressionBind(param, elem, type, expressionValue);
                });
            return expressionValue;

        } else {
            let bindName = translate(expressionStr, sourceLinks);
            let expressionValue = {elem, bindName};
            this.addExpressionBind(bindName, elem, type, expressionValue);
            return expressionValue;
        }
    }

    addAttributeBind(bindName, elem, name, value, sourceLinks) {
        bindName = translate(bindName, sourceLinks);
        this.createBind(bindName);
        let binded = this.binds[bindName].attributes.some(bindAttribute =>
            bindAttribute.elem === elem && bindAttribute.name === name
        );
        !binded && this.binds[bindName].attributes.push({elem, name, value, sourceLinks});
        // todo prevent binding non source values
    }

    addExpressionBind(bindName, elem, type, expressionValue) { // type = 'ifs' or 'values' 
        this.createBind(bindName);
        let binded = this.binds[bindName][type].some(otherBind =>
            otherBind.elem === elem
        );
        !binded && this.binds[bindName][type].push(expressionValue);
        // todo prevent binding non source values
    }

    applyBindAttributes(elem, name, value, sourceLinks) {
        let replaceBind = (all, prefixSlash, match) => {
            if (prefixSlash)
                return all.substr(1);
            match = translate(match, sourceLinks);
            return notUndefined(getValue(this.source, [match]), '');
        };

        let replaceFunction = (all, prefixSlash, functionName, params) => {
            if (prefixSlash)
                return all.substr(1);
            functionName = translate(functionName, sourceLinks);
            let functionSource = notUndefined(getValue(this.source, [functionName]), '');
            let paramsJoined = splitByComma(params)
                .map(param => {
                    let paramTranslated = translate(param, sourceLinks);
                    let paramSourced = getValue(this.source, [paramTranslated]);
                    return paramSourced && JSON.stringify(paramSourced) || param;
                })
                .reduce((a, b) => `${a}, ${b}`);
            return `(${functionSource})(${paramsJoined})`;
        };

        let modifiedValue = value
            .replace(allBindRegex, (all, prefixSlash, match) => replaceBind(all, prefixSlash, match))
            .replace(allFunctionRegex, (all, prefixSlash, functionName, params) => replaceFunction(all, prefixSlash, functionName, params));
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

    applyBindIf(elem, expressionName, params, bindName) {
        let value = this.obtainExpressionValue(expressionName, params, bindName);
        elem.hidden = !value;
    }

    applyBindValue(elem, expressionName, params, bindName) {
        let value = this.obtainExpressionValue(expressionName, params, bindName);
        elem.innerHTML = notUndefined(value);
    }

    obtainExpressionValue(expressionName, params, bindName) {
        if (!expressionName)
            return getValue(this.source, [bindName]);

        let expression = getValue(this.source, [expressionName]);
        let paramValues = params.map(param => {
            let sourceValue = getValue(this.source, [param]);
            if (sourceValue)
                return sourceValue;
            try {
                return JSON.parse(param);
            } catch (exception) {
                return param;
            }
        });
        return typeof expression === 'function' && expression(...paramValues);
    }

    static replaceInlineBindings(elem) {
        elem.innerHTML = elem.innerHTML.replace(allSpanRegex, (all, prefix, match) => prefix ? all.substr(1) : `<span bind="${match}"></span>`);
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
//         fors: [{container, outerHtml, sourceTo, sourceFrom, sourceLinks}],
//         ifs: [expressionBind1, expressionBind3],
//         values: [expressionBind1, expressionBind2],
//         attributes: [{elem1, attributeName, attributeOriginalValue, sourceLinks}]
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
//
// expressionBind = {
//     elem: elem1,
//     expressionName, // can be null
//     params: [],
//     bindName // can be null
// };

module
    .exports = (dir, document) => new HtmlBinder(dir, document).source;
