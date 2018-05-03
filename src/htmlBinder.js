const {getValue, setProperty, clone, modify, translate, indexToDot, notUndefined} = require('./objScafolding');
const {splitByWord, splitBySpace} = require('./stringSplitter');
const splitByParams = require('./paramSplitter');
const {createSource} = require('./source');
const fileReader = require('./fileReader');
const {allSpanRegex, allSpanExpressionRegex, bindRegex, bindRegexUncapturing, functionRegex, expressionRegex} = require('./regex');

class HtmlBinder {

    constructor(dir, root) {
        this.binds = {};
        this.source = {};
        this.handlers = {};
        this.components = {};
        this.root = root.children[0];
        HtmlBinder.replaceInlineBindings(this.root);
        this.bindElem(root, {}, dir);
        this.source = createSource(this.handlers);
        if (window) {
            window.source = this.source;
            window.binds = this.binds;
            window.handlers = this.handlers;
        }
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
                let {name: attributeName, value} = attributes[i];

                if (value.match(bindRegex)) {
                    let attributeBind = this.addAttributeBind(elem, attributeName, value, sourceLinks);
                    let {params} = attributeBind;
                    this.applyBindAttribute(elem, attributeName, params);

                } else if (value.match(functionRegex)) {
                    let attributeBind = this.addAttributeFunctionBind(elem, attributeName, value, sourceLinks);
                    let {functionName, params} = attributeBind;
                    this.applyBindFunctionAttribute(elem, attributeName, functionName, params);
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

            bind.attributes.forEach(({elem, attributeName, functionName, params}) => {
                functionName ? this.applyBindFunctionAttribute(elem, attributeName, functionName, params) : this.applyBindAttribute(elem, attributeName, params);
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
            let params = splitByParams(paramsStr);
            let bindParams = params.filter(param => param[0] !== '_');
            params = params
                .map(param => param[0] === '_' ? param.substr(1) : param)
                .map(param => translate(param, sourceLinks));
            let expressionValue = {elem, expressionName, params};
            this.addExpressionBind(expressionName, elem, type, expressionValue);
            bindParams
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

    addAttributeBind(elem, attributeName, value, sourceLinks) {
        let params = value.split(bindRegexUncapturing)
            .map(param => {
                let matchList = param.match(bindRegex);
                if (!matchList)
                    return {stringValue: param};
                let [all, prefixSlash, match] = matchList;
                return prefixSlash ? {stringValue: all.substr(1)} : {sourceValue: translate(match, sourceLinks)};
            });

        let attributeBind = {elem, attributeName, params};

        params
            .filter(param => param.sourceValue)
            .forEach(({sourceValue: bindName}) => {
                this.createBind(bindName);
                this.binds[bindName].attributes.push(attributeBind);
            });

        return attributeBind;
    }

    addAttributeFunctionBind(elem, attributeName, value, sourceLinks) {
        let [all, prefixSlash, functionName, paramsStr] = value.match(functionRegex); // todo prefixSlash
        functionName = translate(functionName, sourceLinks);
        let params = splitByParams(paramsStr)
            .map(param => translate(param, sourceLinks));
        let attributeBind = {elem, attributeName, functionName, params};

        this.createBind(functionName);
        this.binds[functionName].attributes.push(attributeBind);

        params
            .forEach(bindName => {
                this.createBind(bindName);
                this.binds[bindName].attributes.push(attributeBind);
            });

        return attributeBind;
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

    applyBindAttribute(elem, attributeName, params) {
        let modifiedValue = params
            .map(param => param.sourceValue ? notUndefined(getValue(this.source, [param.sourceValue]), '') : param.stringValue)
            .reduce((a, b) => a + b);
        elem.setAttribute(attributeName, modifiedValue);
    }

    applyBindFunctionAttribute(elem, attributeName, functionName, params) {
        let handler = getValue(this.source, [functionName]);
        elem[attributeName] = () => {
            let paramValues = this.getParamValues(params, elem);
            handler.apply(elem, paramValues);
        };
    }

    applyBindFor(container, outerHtml, sourceTo, sourceFrom, sourceLinks, linkBaseDir) {
        let value = getValue(this.source, [sourceFrom]);
        if (value && Array.isArray(value)) {
            while (container.childElementCount > value.length)
                container.removeChild(container.lastElementChild);
            for (let index = container.childElementCount; index < value.length; index++) {
                let childElem = document.createElement('div');
                childElem.innerHTML = outerHtml;
                sourceLinks = modify(sourceLinks, sourceTo, `${sourceFrom}.${index}`);
                this.bindElem(childElem, sourceLinks, linkBaseDir);
                container.appendChild(childElem);
            }
        }
    }

    applyBindIf(elem, expressionName, params, bindName) {
        let value = this.obtainExpressionValue(elem, expressionName, params, bindName);
        elem.hidden = !value;
    }

    applyBindValue(elem, expressionName, params, bindName) {
        let value = this.obtainExpressionValue(elem, expressionName, params, bindName);
        elem.innerHTML = notUndefined(value);
    }

    obtainExpressionValue(elem, expressionName, params, bindName) {
        if (!expressionName)
            return getValue(this.source, [bindName]);

        let expression = getValue(this.source, [expressionName]);
        let paramValues = this.getParamValues(params, elem);
        return typeof expression === 'function' && expression(...paramValues);
    }

    getParamValues(params, thiss) {
        return params.map(param => {
            let paramPath = param.split('.');
            if (paramPath[0] === 'this') {
                paramPath.shift();
                return getValue(thiss, paramPath);
            }

            let sourceValue = getValue(this.source, [param]);
            if (sourceValue !== undefined)
                return sourceValue;

            try {
                return JSON.parse(param.replace(/'/g, '"'));

            } catch (exception) {
                return undefined;
            }
        });
    }

    static replaceInlineBindings(elem) {
        elem.innerHTML = elem.innerHTML.replace(allSpanRegex, (all, prefixSlash, match) => prefixSlash ? all.substr(1) : `<span bind="${match}"></span>`);
        elem.innerHTML = elem.innerHTML.replace(allSpanExpressionRegex, (all, prefixSlash, match) => prefixSlash ? all.substr(1) : `<span bind="${match}"></span>`);
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
//         attributes: [attributeBind1, attributeBind2]
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
// attributeBind = {
//     elem: elem1,
//     attributeName,
//     functionName, // can be null
//     params: [{stringValue | sourceValue: string}], // for null functionName
//     params: [] // for not null functionName
// };
//
// expressionBind = {
//     elem: elem1,
//     expressionName, // can be null
//     params: [],
//     bindName // can be null
// };

module.exports = (dir, document) => new HtmlBinder(dir, document).source;
