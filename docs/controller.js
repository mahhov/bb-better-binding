(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const source = require('bb-better-binding')().boot(document.firstElementChild, window);

// greeting
source.largeFont = 60;
source.favoriteColor = 'DEEPpink';
source.greeting = 'I hate you';
source.name = 'World';
source.exclamation = '(╯°□°）╯︵ ┻━┻';
source.changeColor = input => {
    source.favoriteColor = input.value;
};

// animation
let animations = [
    'http://www.qqpr.com/ascii/img/ascii-1043.gif',
    'https://media0.giphy.com/media/12EkJCbpa3hGKc/giphy.gif',
    'http://www.qqpr.com/ascii/img/ascii-1006.gif'];
let animationIndex = -1;
source.changeAnimation = () => {
    animationIndex = (animationIndex + 1) % animations.length;
    source.animation = animations[animationIndex];
};
source.changeAnimation();

// jokes
source.setJokeVisibility = checkbox => {
    source.jokeVisibility = checkbox.checked;
};
source.jokes = [
    {
        lines: [
            'Problem:  "Left inside main tire almost needs replacement."',
            'Solution: "Almost replaced left inside main tire."'
        ]
    }, {
        lines: [
            'Problem:  "Test flight OK, except autoland very rough."',
            'Solution: "Autoland not installed on this aircraft."'
        ]
    }, {
        lines: [
            'Problem #1:  "#2 Propeller seeping prop fluid."',
            'Solution #1: "#2 Propeller seepage normal."',
            'Problem #2:  "#1, #3, and #4 propellers lack normal seepage."'
        ]
    }, {
        lines: [
            'Problem:    "The autopilot doesn\'t."',
            'Signed off: "IT DOES NOW."'
        ]
    }, {
        lines: [
            'Problem:  "Something loose in cockpit."',
            'Solution: "Something tightened in cockpit."'
        ]
    }, {
        lines: [
            'Problem:  "Evidence of hydraulic leak on right main landing gear."',
            'Solution: "Evidence removed."'
        ]
    }, {
        lines: [
            'Problem:  "DME volume unbelievably loud."',
            'Solution: "Volume set to more believable level."'
        ]
    }, {
        lines: [
            'Problem:  "Dead bugs on windshield."',
            'Solution: "Live bugs on order."'
        ]
    }, {
        lines: [
            'Problem:  "Autopilot in altitude hold mode produces a 200 fpm descent."',
            'Solution: "Cannot reproduce problem on ground."'
        ]
    }, {
        lines: [
            'Problem:  "IFF inoperative."',
            'Solution: "IFF always inoperative in OFF mode."'
        ]
    }, {
        lines: [
            'Problem:  "Friction locks cause throttle levers to stick."',
            'Solution: "That\'s what they\'re there for."'
        ]
    }, {
        lines: [
            'Problem:  "Number three engine missing."',
            'Solution: "Engine found on right wing after brief search."'
        ]
    },
];
source.jokesSource = 'https://www.netfunny.com/rhf/jokes/97/Jun/usaf.html';

},{"bb-better-binding":4}],2:[function(require,module,exports){
const HtmlBinder = require('./htmlBinder');

class Booter {

    constructor() {
        this.blocks = {};
    }

    declareBlock(blockName, block) {
        this.blocks[blockName] = block;
    }

    boot(root, debug) {
        let artifacts = new HtmlBinder(root, this.blocks).getArtifacts();
        debug && Object.assign(debug, artifacts);
        return artifacts.source;
    }
}

module.exports = Booter;

},{"./htmlBinder":3}],3:[function(require,module,exports){
const {getValue, setProperty, clone, translate, indexToDot, notUndefined} = require('./objScafolding');
const {splitByWord, splitByComma, splitBySpace} = require('./stringSplitter');
const splitByParams = require('./paramSplitter');
const {createSource} = require('./source');
const {allSpanRegex, allSpanExpressionRegex, bindRegex, bindRegexUncapturing, functionRegex, expressionRegex} = require('./regex');

class HtmlBinder {

    constructor(root, blocks) {
        let {origin, source, handlers} = createSource();
        this.origin = origin;
        this.source = source;
        this.handlers = handlers;
        this.binds = {};
        this.root = root;
        this.components = {};
        this.blocks = blocks;

        HtmlBinder.replaceInlineBindings(root);
        this.bindElem(root, {});
    }

    bindElem(elem, sourceLinks) {
        let skip = false;

        if (elem.getAttribute) {
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

            let bindElem = HtmlBinder.getBindAttribute(elem, 'bind-elem');
            let bindComponent = HtmlBinder.getBindAttribute(elem, 'bind-component');
            let bindUse = HtmlBinder.getBindAttribute(elem, 'bind-use');
            let bindAs = HtmlBinder.getBindAttribute(elem, 'bind-as');
            let bindFor = HtmlBinder.getBindAttribute(elem, 'bind-for');
            let bindIf = HtmlBinder.getBindAttribute(elem, 'bind-if');
            let bindBlock = HtmlBinder.getBindAttribute(elem, 'bind-block');
            let bindValue = HtmlBinder.getBindAttribute(elem, 'bind');

            if (bindElem) {
                setProperty(this.source, [bindElem], elem);
                this.source.__bindIgnore__ = this.source.__bindIgnore__ || [];
                this.source.__bindIgnore__.push(bindElem);

            } else if (bindComponent) {
                skip = true;
                let [componentName, paramsGroup] = splitByWord(bindComponent, 'with');
                let params = splitBySpace(paramsGroup);
                elem.remove();
                elem.removeAttribute('bind-component');
                this.components[componentName] = {outerElem: elem, params};

            } else if (bindFor) {
                skip = true;
                let [sourceTo, bindName] = splitByWord(bindFor, 'in');
                bindName = translate(bindName, sourceLinks);
                let container = document.createElement('for-parent');
                elem.replaceWith(container);
                elem.removeAttribute('bind-for');
                this.createBind(bindName);
                this.binds[bindName].fors.push({
                    container,
                    outerElem: elem,
                    sourceTo,
                    sourceFrom: bindName,
                    sourceLinks
                });
                this.applyBindFor(container, elem, sourceTo, bindName, sourceLinks);

            } else {
                if (bindAs) {
                    sourceLinks = clone(sourceLinks);
                    splitByComma(bindAs)
                        .map(as => splitByWord(as, 'as'))
                        .forEach(([from, to]) => {
                            sourceLinks[to] = translate(from, sourceLinks);
                        });
                }

                if (bindIf) {
                    let {expressionName, params, bindName} = this.extractExpressionBind(elem, bindIf, 'ifs', sourceLinks);
                    this.applyBindIf(elem, expressionName, params, bindName);
                }

                // todo allow non-source parameters for bindUse and bindBlock
                if (bindUse) {
                    let [componentName, paramsGroup] = splitByWord(bindUse, 'with');
                    let paramsInput = splitBySpace(paramsGroup);
                    let {outerElem, params} = this.components[componentName];
                    let componentElem = document.importNode(outerElem, true);
                    elem.appendChild(componentElem);
                    sourceLinks = clone(sourceLinks);
                    params.forEach((to, index) => {
                        sourceLinks[to] = translate(paramsInput[index], sourceLinks);
                    });
                }

                if (bindBlock) {
                    skip = true;
                    let [block, blockTo] = splitByWord(bindBlock, 'as');
                    let [blockName, paramsGroup] = splitByWord(block, 'with');
                    let paramsInput = paramsGroup ? splitBySpace(paramsGroup) : [];
                    let {template, controller, parameters} = this.blocks[blockName];
                    elem.removeAttribute('bind-block');
                    elem.innerHTML = template;
                    let blockSource = new HtmlBinder(elem, this.blocks).source;
                    controller(blockSource);
                    parameters && parameters.forEach((to, index) => {
                        let from = translate(paramsInput[index], sourceLinks);
                        this.addPairBind(from, blockSource, to);
                        this.applyPairBind(from, blockSource, to);
                    });
                    if (blockTo)
                        this.source[blockTo] = blockSource;
                    // todo debugger for block bindings
                }

                if (bindValue) {
                    let {expressionName, params, bindName} = this.extractExpressionBind(elem, bindValue, 'values', sourceLinks);
                    this.applyBindValue(elem, expressionName, params, bindName);
                }
            }
        }

        if (!skip)
            for (let i = elem.children.length - 1; i >= 0; i--)
                this.bindElem(elem.children[i], sourceLinks);
    }

    createBind(bindName) {
        if (this.binds[bindName])
            return;

        let bind = {attributes: [], fors: [], ifs: [], pairs: [], values: []};
        this.binds[bindName] = bind;

        setProperty(this.handlers, [bindName, '_func_'], () => {
            bind.attributes = bind.attributes.filter(({elem}) => this.root.contains(elem));
            bind.fors = bind.fors.filter(({container}) => this.root.contains(container));
            bind.ifs = bind.ifs.filter(({elem}) => this.root.contains(elem));
            bind.values = bind.values.filter(({elem}) => this.root.contains(elem));

            bind.attributes.forEach(({elem, attributeName, functionName, params}) => {
                functionName ? this.applyBindFunctionAttribute(elem, attributeName, functionName, params) : this.applyBindAttribute(elem, attributeName, params);
            });

            bind.fors.forEach(({container, outerElem, sourceTo, sourceFrom, sourceLinks}) => {
                this.applyBindFor(container, outerElem, sourceTo, sourceFrom, sourceLinks);
            });

            bind.ifs.forEach(({elem, expressionName, params, bindName}) => {
                this.applyBindIf(elem, expressionName, params, bindName);
            });

            bind.pairs.forEach(({from, toObj, toKey}) => {
                this.applyPairBind(from, toObj, toKey);
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
            let bindParams = params
                .filter(param => param[0] !== '_')
                .map(param => translate(param, sourceLinks));
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

    addPairBind(from, toObj, toKey) {
        this.createBind(from);
        this.binds[from].pairs.push({from, toObj, toKey});
    }

    applyBindAttribute(elem, attributeName, params) {
        let modifiedValue = params
            .map(param => param.sourceValue ? notUndefined(getValue(this.source, [param.sourceValue]), '') : param.stringValue)
            .reduce((a, b) => a + b);
        elem.setAttribute(attributeName, modifiedValue);
    }

    applyBindFunctionAttribute(elem, attributeName, functionName, params) {
        let handler = getValue(this.source, [functionName]);
        elem[attributeName] = event => {
            let paramValues = this.getParamValues(params, elem, event);
            handler.apply(elem, paramValues);
        };
    }

    applyBindFor(container, outerElem, sourceTo, sourceFrom, sourceLinks) {
        let value = getValue(this.source, [sourceFrom]);
        if (value && Array.isArray(value)) {
            while (container.childElementCount > value.length)
                container.removeChild(container.lastElementChild);
            for (let index = container.childElementCount; index < value.length; index++) {
                let childElem = document.importNode(outerElem, true);
                sourceLinks = clone(sourceLinks);
                sourceLinks[sourceTo] = `${sourceFrom}.${index}`;
                sourceLinks.index = `_numbers_.${index}`;
                this.bindElem(childElem, sourceLinks);
                container.appendChild(childElem);
            }
        }
    }

    applyBindIf(elem, expressionName, params, bindName) {
        let value = this.obtainExpressionValue(elem, expressionName, params, bindName);
        elem.hidden = !value;
    }

    applyPairBind(from, toObj, toKey) {
        toObj[toKey] = getValue(this.source, [from]);
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

    // todo use ParamSplitter in order to support array and object paramters
    getParamValues(params, thiss, event) {
        return params.map(param => {
            let paramPath = param.split('.');
            if (paramPath[0] === 'this') {
                paramPath.shift();
                return getValue(thiss, paramPath);
            } else if (paramPath[0] === 'event') {
                paramPath.shift();
                return getValue(event, paramPath);
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

    getArtifacts() {
        return {
            origin: this.origin,
            source: this.source,
            handlers: this.handlers,
            binds: this.binds,
            root: this.root,
            components: this.components,
            blocks: this.blocks
        };
    }

    static replaceInlineBindings(elem) {
        elem.innerHTML = elem.innerHTML.replace(allSpanRegex, (all, prefixSlash, match) => prefixSlash ? all.substr(1) : `<span bind="${match}"></span>`);
        elem.innerHTML = elem.innerHTML.replace(allSpanExpressionRegex, (all, prefixSlash, match) => prefixSlash ? all.substr(1) : `<span bind="${match}"></span>`);
    }

    // todo use indexToDot for attribute binds as well, e.g. <div style="${color[0]}"> abc </div>
    static getBindAttribute(elem, attribute) {
        return indexToDot(elem.getAttribute(attribute));
    }
}

// binds = {
//     'a.b.c': {
//         attributes: [attributeBind1, attributeBind2],
//         fors: [{container, outerElem, sourceTo, sourceFrom, sourceLinks}],
//         ifs: [expressionBind1, expressionBind3],
//         pairs: [{from, toObj, toKey}],
//         values: [expressionBind1, expressionBind2]
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
//         outerElem: outerElem,
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

module.exports = HtmlBinder;

},{"./objScafolding":5,"./paramSplitter":6,"./regex":7,"./source":8,"./stringSplitter":9}],4:[function(require,module,exports){
const Booter = require('./booter');

module.exports = () => new Booter();

// todo
// allow array binding in html: `<div bind="x[y]"></div>`
// clean up package.json
// $s{x} syntax to only affect inner text and not attributes
// allow defining and using components in any order
// allow using expressions for more binds than just ifs and values (e.g. attributes, fors, as, use)
// support $e nested inside $s
// investigate why source.a = source.b doesn't propogate changes
// investigate why bind-for indexVars don't propogate changes
// routing or swapping states

},{"./booter":2}],5:[function(require,module,exports){
let getProperty = (obj, paths) => {
    let fields = getFields(paths);
    let lastField = fields.pop();
    fields.forEach(field => obj = obj[field] || {});
    return [obj, lastField];
};

let getValue = (obj, paths) => {
    let property = getProperty(obj, paths);
    return property[1] === undefined ? property[0] : property[0][property[1]];
};

let createProperty = (obj, paths) => {
    let fields = getFields(paths);
    let lastField = fields.pop();
    fields.forEach(field => obj = obj[field] = obj[field] || {});
    return [obj, lastField];
};

let setProperty = (obj, paths, value) => {
    let property = createProperty(obj, paths);
    property[0][property[1]] = value;
};

let clone = original => {
    return Object.assign({}, original);
};

let translate = (name, links) => {
    let occurred = [];
    let fields = getFields([name]);
    while (fields[0] in links) {
        occurred.push(fields[0]);
        fields[0] = links[fields[0]];
        if (occurred.includes(fields[0]))
            break;
        fields = getFields(fields);
    }
    return fields.reduce((a, b) => `${a}.${b}`);
};

let getFields = paths =>
    paths
        .map(path => path.split('.'))
        .reduce((aggregate, item) => aggregate.concat(item), []);

let indexToDot = field => field && field.replace(/\[(\w+)\]/g, (_, match) => `.${match}`);

let notUndefined = (value, undefinedValue = null) =>
    value !== undefined ? value : undefinedValue;

module.exports = {getValue, setProperty, clone, translate, indexToDot, notUndefined};

},{}],6:[function(require,module,exports){
class ParamSplitter {
    constructor(string) {
        this.string = string;
        this.index = -1;
        this.startIndex = 0;
        this.params = [];
    }

    splitByParams() {
        let depth = 0;

        while (this.nextIndex() && (!this.atQuote() || this.skipQuote())) {
            let char = this.string[this.index];
            if (char === '[')
                depth++;
            else if (char === ']')
                depth--;
            else if (char === ',' && !depth) {
                this.addParam();
                this.startIndex = this.index + 1;
            }
        }

        this.addParam();
        return this.params;
    }

    findIndex(regex, start) { // returns -1 or index of match
        let index = this.string.substring(start).search(regex);
        return index >= 0 ? index + start : -1;
    };

    nextIndex() {
        this.index = this.findIndex(/[,'"[\]]/, this.index + 1);
        return this.index !== -1;
    }

    atQuote() {
        let char = this.string[this.index];
        return char === '"' || char === "'";
    }

    skipQuote() {
        let char = this.string[this.index];
        this.index = this.findIndex(char === '"' ? /[^\\]"/ : /[^\\]'/, this.index + 1) + 1;
        return this.index;
    }

    addParam() {
        this.params.push(this.string.substring(this.startIndex, this.index > 0 ? this.index : this.string.length).trim());
    }
}

module.exports = string => new ParamSplitter(string).splitByParams();

},{}],7:[function(require,module,exports){
// ([\w.[\]]+)

let spanRegex = /(\\)?\$s{([\w.[\]]+)}/;
let allSpanRegex = new RegExp(spanRegex, 'g');
let spanExpressionRegex = /(\\)?\$s{([\w.[\]!=><|&]+\(.*\))}/;
let allSpanExpressionRegex = new RegExp(spanExpressionRegex, 'g');

let bindRegex = /(\\)?\${([\w.[\]]+)}/;
let bindRegexUncapturing = /((?:\\)?\${(?:[\w.[\]]+)})/;

let functionRegex = /(\\)?\${([\w.[\]]+)\((.*)\)}/;

let expressionRegex = /(\\)?([\w.[\]!=><|&]+)\((.*)\)/;

module.exports = {allSpanRegex, allSpanExpressionRegex, bindRegex, bindRegexUncapturing, functionRegex, expressionRegex};

},{}],8:[function(require,module,exports){
let createSource = () => {
    let handlers = {};
    let origin = {};
    let source = createProxy(origin, handlers);
    setDefaultSource(origin);
    return {origin, source, handlers};
};

let ignore = [];

let isBindIgnored = (obj, prop) => obj.__bindIgnore__ && obj.__bindIgnore__.includes(prop);

// todo make __bindAvoidCycles__ inherited and maybe avoid per binding instead per change
let isIgnored = (obj, prop) => isBindIgnored(obj, prop) || (obj.__bindAvoidCycles__ && ignore.some(ignore => ignore.obj === obj && ignore.prop === prop));

let handleSet = (obj, prop, handlers, accumulatedHandlers) => {
    ignore.push({obj, prop});
    accumulatedHandlers.forEach(doHandler);
    handlers && propogateHandlerDown(handlers);
    ignore.pop();
};

let createProxy = (obj, handlers = {}, accumulatedHandlers = []) => new Proxy(obj, {
    get: (target, prop) => {
        let got = Reflect.get(target, prop);
        return typeof got === 'object' && got && !isBindIgnored(obj, prop) ? createProxy(got, handlers[prop], accumulatedHandlers.concat(handlers)) : got;
    },
    set: (target, prop, value) => {
        Reflect.set(target, prop, value);
        !isIgnored(obj, prop) && handleSet(obj, prop, handlers[prop], accumulatedHandlers.concat(handlers)); // todo wrap handlers and accumulatedHandlers in class with popProp method
        return true;
    }
});

let propogateHandlerDown = handlers => {
    doHandler(handlers);
    Object.entries(handlers)
        .filter(([key]) => key !== '_func_')
        .forEach(([, handler]) => propogateHandlerDown(handler));
};

let doHandler = handler => typeof handler._func_ === 'function' && handler._func_();

let setDefaultSource = source => {
    source._numbers_ = new Proxy({}, {
        get: (_, prop) => parseInt(prop),
        set: () => false
    });
    source.not = a => !a;
    source['!'] = a => !a;
    source.eq = (a, b) => a === b;
    source.equal = (a, b) => a === b;
    source['='] = (a, b) => a === b;
    source.nEq = (a, b) => a !== b;
    source.notEqual = (a, b) => a !== b;
    source['!='] = (a, b) => a !== b;
    source.greater = (a, b) => a > b;
    source['>'] = (a, b) => a > b;
    source.less = (a, b) => a < b;
    source['<'] = (a, b) => a < b;
    source.greaterEq = (a, b) => a >= b;
    source['>='] = (a, b) => a >= b;
    source.lessEq = (a, b) => a <= b;
    source['<='] = (a, b) => a <= b;
    source.or = (...as) => as.some(a => a);
    source['|'] = (...as) => as.some(a => a);
    source['||'] = (...as) => as.some(a => a);
    source.and = (...as) => as.every(a => a);
    source['&'] = (...as) => as.every(a => a);
    source['&&'] = (...as) => as.every(a => a);
};

module.exports = {createSource};

},{}],9:[function(require,module,exports){
let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`));

let splitByComma = string =>
    string.split(/\s*,\s*/);

let splitBySpace = string =>
    string.split(/\s+/);

module.exports = {splitByWord, splitByComma, splitBySpace};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2NvbnRyb2xsZXIuanMiLCJzcmMvYm9vdGVyLmpzIiwic3JjL2h0bWxCaW5kZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvb2JqU2NhZm9sZGluZy5qcyIsInNyYy9wYXJhbVNwbGl0dGVyLmpzIiwic3JjL3JlZ2V4LmpzIiwic3JjL3NvdXJjZS5qcyIsInNyYy9zdHJpbmdTcGxpdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBzb3VyY2UgPSByZXF1aXJlKCdiYi1iZXR0ZXItYmluZGluZycpKCkuYm9vdChkb2N1bWVudC5maXJzdEVsZW1lbnRDaGlsZCwgd2luZG93KTtcclxuXHJcbi8vIGdyZWV0aW5nXHJcbnNvdXJjZS5sYXJnZUZvbnQgPSA2MDtcclxuc291cmNlLmZhdm9yaXRlQ29sb3IgPSAnREVFUHBpbmsnO1xyXG5zb3VyY2UuZ3JlZXRpbmcgPSAnSSBoYXRlIHlvdSc7XHJcbnNvdXJjZS5uYW1lID0gJ1dvcmxkJztcclxuc291cmNlLmV4Y2xhbWF0aW9uID0gJyjila/CsOKWocKw77yJ4pWv77i1IOKUu+KUgeKUuyc7XHJcbnNvdXJjZS5jaGFuZ2VDb2xvciA9IGlucHV0ID0+IHtcclxuICAgIHNvdXJjZS5mYXZvcml0ZUNvbG9yID0gaW5wdXQudmFsdWU7XHJcbn07XHJcblxyXG4vLyBhbmltYXRpb25cclxubGV0IGFuaW1hdGlvbnMgPSBbXHJcbiAgICAnaHR0cDovL3d3dy5xcXByLmNvbS9hc2NpaS9pbWcvYXNjaWktMTA0My5naWYnLFxyXG4gICAgJ2h0dHBzOi8vbWVkaWEwLmdpcGh5LmNvbS9tZWRpYS8xMkVrSkNicGEzaEdLYy9naXBoeS5naWYnLFxyXG4gICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwMDYuZ2lmJ107XHJcbmxldCBhbmltYXRpb25JbmRleCA9IC0xO1xyXG5zb3VyY2UuY2hhbmdlQW5pbWF0aW9uID0gKCkgPT4ge1xyXG4gICAgYW5pbWF0aW9uSW5kZXggPSAoYW5pbWF0aW9uSW5kZXggKyAxKSAlIGFuaW1hdGlvbnMubGVuZ3RoO1xyXG4gICAgc291cmNlLmFuaW1hdGlvbiA9IGFuaW1hdGlvbnNbYW5pbWF0aW9uSW5kZXhdO1xyXG59O1xyXG5zb3VyY2UuY2hhbmdlQW5pbWF0aW9uKCk7XHJcblxyXG4vLyBqb2tlc1xyXG5zb3VyY2Uuc2V0Sm9rZVZpc2liaWxpdHkgPSBjaGVja2JveCA9PiB7XHJcbiAgICBzb3VyY2Uuam9rZVZpc2liaWxpdHkgPSBjaGVja2JveC5jaGVja2VkO1xyXG59O1xyXG5zb3VyY2Uuam9rZXMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkxlZnQgaW5zaWRlIG1haW4gdGlyZSBhbG1vc3QgbmVlZHMgcmVwbGFjZW1lbnQuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiQWxtb3N0IHJlcGxhY2VkIGxlZnQgaW5zaWRlIG1haW4gdGlyZS5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIlRlc3QgZmxpZ2h0IE9LLCBleGNlcHQgYXV0b2xhbmQgdmVyeSByb3VnaC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJBdXRvbGFuZCBub3QgaW5zdGFsbGVkIG9uIHRoaXMgYWlyY3JhZnQuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtICMxOiAgXCIjMiBQcm9wZWxsZXIgc2VlcGluZyBwcm9wIGZsdWlkLlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uICMxOiBcIiMyIFByb3BlbGxlciBzZWVwYWdlIG5vcm1hbC5cIicsXHJcbiAgICAgICAgICAgICdQcm9ibGVtICMyOiAgXCIjMSwgIzMsIGFuZCAjNCBwcm9wZWxsZXJzIGxhY2sgbm9ybWFsIHNlZXBhZ2UuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgICBcIlRoZSBhdXRvcGlsb3QgZG9lc25cXCd0LlwiJyxcclxuICAgICAgICAgICAgJ1NpZ25lZCBvZmY6IFwiSVQgRE9FUyBOT1cuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJTb21ldGhpbmcgbG9vc2UgaW4gY29ja3BpdC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJTb21ldGhpbmcgdGlnaHRlbmVkIGluIGNvY2twaXQuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJFdmlkZW5jZSBvZiBoeWRyYXVsaWMgbGVhayBvbiByaWdodCBtYWluIGxhbmRpbmcgZ2Vhci5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJFdmlkZW5jZSByZW1vdmVkLlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiRE1FIHZvbHVtZSB1bmJlbGlldmFibHkgbG91ZC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJWb2x1bWUgc2V0IHRvIG1vcmUgYmVsaWV2YWJsZSBsZXZlbC5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRlYWQgYnVncyBvbiB3aW5kc2hpZWxkLlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkxpdmUgYnVncyBvbiBvcmRlci5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkF1dG9waWxvdCBpbiBhbHRpdHVkZSBob2xkIG1vZGUgcHJvZHVjZXMgYSAyMDAgZnBtIGRlc2NlbnQuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiQ2Fubm90IHJlcHJvZHVjZSBwcm9ibGVtIG9uIGdyb3VuZC5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIklGRiBpbm9wZXJhdGl2ZS5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJJRkYgYWx3YXlzIGlub3BlcmF0aXZlIGluIE9GRiBtb2RlLlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiRnJpY3Rpb24gbG9ja3MgY2F1c2UgdGhyb3R0bGUgbGV2ZXJzIHRvIHN0aWNrLlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlRoYXRcXCdzIHdoYXQgdGhleVxcJ3JlIHRoZXJlIGZvci5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIk51bWJlciB0aHJlZSBlbmdpbmUgbWlzc2luZy5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJFbmdpbmUgZm91bmQgb24gcmlnaHQgd2luZyBhZnRlciBicmllZiBzZWFyY2guXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXTtcclxuc291cmNlLmpva2VzU291cmNlID0gJ2h0dHBzOi8vd3d3Lm5ldGZ1bm55LmNvbS9yaGYvam9rZXMvOTcvSnVuL3VzYWYuaHRtbCc7XHJcbiIsImNvbnN0IEh0bWxCaW5kZXIgPSByZXF1aXJlKCcuL2h0bWxCaW5kZXInKTtcclxuXHJcbmNsYXNzIEJvb3RlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBkZWNsYXJlQmxvY2soYmxvY2tOYW1lLCBibG9jaykge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzW2Jsb2NrTmFtZV0gPSBibG9jaztcclxuICAgIH1cclxuXHJcbiAgICBib290KHJvb3QsIGRlYnVnKSB7XHJcbiAgICAgICAgbGV0IGFydGlmYWN0cyA9IG5ldyBIdG1sQmluZGVyKHJvb3QsIHRoaXMuYmxvY2tzKS5nZXRBcnRpZmFjdHMoKTtcclxuICAgICAgICBkZWJ1ZyAmJiBPYmplY3QuYXNzaWduKGRlYnVnLCBhcnRpZmFjdHMpO1xyXG4gICAgICAgIHJldHVybiBhcnRpZmFjdHMuc291cmNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RlcjtcclxuIiwiY29uc3Qge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfSA9IHJlcXVpcmUoJy4vb2JqU2NhZm9sZGluZycpO1xyXG5jb25zdCB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfSA9IHJlcXVpcmUoJy4vc3RyaW5nU3BsaXR0ZXInKTtcclxuY29uc3Qgc3BsaXRCeVBhcmFtcyA9IHJlcXVpcmUoJy4vcGFyYW1TcGxpdHRlcicpO1xyXG5jb25zdCB7Y3JlYXRlU291cmNlfSA9IHJlcXVpcmUoJy4vc291cmNlJyk7XHJcbmNvbnN0IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH0gPSByZXF1aXJlKCcuL3JlZ2V4Jyk7XHJcblxyXG5jbGFzcyBIdG1sQmluZGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb290LCBibG9ja3MpIHtcclxuICAgICAgICBsZXQge29yaWdpbiwgc291cmNlLCBoYW5kbGVyc30gPSBjcmVhdGVTb3VyY2UoKTtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcclxuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzID0gaGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5iaW5kcyA9IHt9O1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0ge307XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XHJcblxyXG4gICAgICAgIEh0bWxCaW5kZXIucmVwbGFjZUlubGluZUJpbmRpbmdzKHJvb3QpO1xyXG4gICAgICAgIHRoaXMuYmluZEVsZW0ocm9vdCwge30pO1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRFbGVtKGVsZW0sIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHNraXAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gZWxlbS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB7bmFtZTogYXR0cmlidXRlTmFtZSwgdmFsdWV9ID0gYXR0cmlidXRlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubWF0Y2goYmluZFJlZ2V4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtwYXJhbXN9ID0gYXR0cmlidXRlQmluZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtmdW5jdGlvbk5hbWUsIHBhcmFtc30gPSBhdHRyaWJ1dGVCaW5kO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYmluZEVsZW0gPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZWxlbScpO1xyXG4gICAgICAgICAgICBsZXQgYmluZENvbXBvbmVudCA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1jb21wb25lbnQnKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRVc2UgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtdXNlJyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kQXMgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtYXMnKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRGb3IgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZm9yJyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kSWYgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtaWYnKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRCbG9jayA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1ibG9jaycpO1xyXG4gICAgICAgICAgICBsZXQgYmluZFZhbHVlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYmluZEVsZW0pIHtcclxuICAgICAgICAgICAgICAgIHNldFByb3BlcnR5KHRoaXMuc291cmNlLCBbYmluZEVsZW1dLCBlbGVtKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fID0gdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18gfHwgW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXy5wdXNoKGJpbmRFbGVtKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZENvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRDb21wb25lbnQsICd3aXRoJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcclxuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1jb21wb25lbnQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHtvdXRlckVsZW06IGVsZW0sIHBhcmFtc307XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJpbmRGb3IpIHtcclxuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbGV0IFtzb3VyY2VUbywgYmluZE5hbWVdID0gc3BsaXRCeVdvcmQoYmluZEZvciwgJ2luJyk7XHJcbiAgICAgICAgICAgICAgICBiaW5kTmFtZSA9IHRyYW5zbGF0ZShiaW5kTmFtZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvci1wYXJlbnQnKTtcclxuICAgICAgICAgICAgICAgIGVsZW0ucmVwbGFjZVdpdGgoY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWZvcicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdLmZvcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIG91dGVyRWxlbTogZWxlbSxcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VUbyxcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VGcm9tOiBiaW5kTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZvcihjb250YWluZXIsIGVsZW0sIHNvdXJjZVRvLCBiaW5kTmFtZSwgc291cmNlTGlua3MpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChiaW5kQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgICAgICBzcGxpdEJ5Q29tbWEoYmluZEFzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGFzID0+IHNwbGl0QnlXb3JkKGFzLCAnYXMnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKFtmcm9tLCB0b10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3RvXSA9IHRyYW5zbGF0ZShmcm9tLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiaW5kSWYpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQge2V4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSA9IHRoaXMuZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGJpbmRJZiwgJ2lmcycsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZElmKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvIGFsbG93IG5vbi1zb3VyY2UgcGFyYW1ldGVycyBmb3IgYmluZFVzZSBhbmQgYmluZEJsb2NrXHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZFVzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBbY29tcG9uZW50TmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmluZFVzZSwgJ3dpdGgnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1zSW5wdXQgPSBzcGxpdEJ5U3BhY2UocGFyYW1zR3JvdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7b3V0ZXJFbGVtLCBwYXJhbXN9ID0gdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRFbGVtID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShvdXRlckVsZW0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY29tcG9uZW50RWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLmZvckVhY2goKHRvLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUocGFyYW1zSW5wdXRbaW5kZXhdLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBbYmxvY2ssIGJsb2NrVG9dID0gc3BsaXRCeVdvcmQoYmluZEJsb2NrLCAnYXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW2Jsb2NrTmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmxvY2ssICd3aXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtc0lucHV0ID0gcGFyYW1zR3JvdXAgPyBzcGxpdEJ5U3BhY2UocGFyYW1zR3JvdXApIDogW107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgcGFyYW1ldGVyc30gPSB0aGlzLmJsb2Nrc1tibG9ja05hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWJsb2NrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2tTb3VyY2UgPSBuZXcgSHRtbEJpbmRlcihlbGVtLCB0aGlzLmJsb2Nrcykuc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIoYmxvY2tTb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMgJiYgcGFyYW1ldGVycy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZyb20gPSB0cmFuc2xhdGUocGFyYW1zSW5wdXRbaW5kZXhdLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUGFpckJpbmQoZnJvbSwgYmxvY2tTb3VyY2UsIHRvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVBhaXJCaW5kKGZyb20sIGJsb2NrU291cmNlLCB0byk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrVG8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlW2Jsb2NrVG9dID0gYmxvY2tTb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyBkZWJ1Z2dlciBmb3IgYmxvY2sgYmluZGluZ3NcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kVmFsdWUsICd2YWx1ZXMnLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc2tpcClcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGVsZW0uY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGVsZW0uY2hpbGRyZW5baV0sIHNvdXJjZUxpbmtzKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVCaW5kKGJpbmROYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYmluZHNbYmluZE5hbWVdKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBiaW5kID0ge2F0dHJpYnV0ZXM6IFtdLCBmb3JzOiBbXSwgaWZzOiBbXSwgcGFpcnM6IFtdLCB2YWx1ZXM6IFtdfTtcclxuICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXSA9IGJpbmQ7XHJcblxyXG4gICAgICAgIHNldFByb3BlcnR5KHRoaXMuaGFuZGxlcnMsIFtiaW5kTmFtZSwgJ19mdW5jXyddLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGJpbmQuYXR0cmlidXRlcyA9IGJpbmQuYXR0cmlidXRlcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcclxuICAgICAgICAgICAgYmluZC5mb3JzID0gYmluZC5mb3JzLmZpbHRlcigoe2NvbnRhaW5lcn0pID0+IHRoaXMucm9vdC5jb250YWlucyhjb250YWluZXIpKTtcclxuICAgICAgICAgICAgYmluZC5pZnMgPSBiaW5kLmlmcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcclxuICAgICAgICAgICAgYmluZC52YWx1ZXMgPSBiaW5kLnZhbHVlcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQuYXR0cmlidXRlcy5mb3JFYWNoKCh7ZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXN9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUgPyB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKSA6IHRoaXMuYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYmluZC5mb3JzLmZvckVhY2goKHtjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGb3IoY29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYmluZC5pZnMuZm9yRWFjaCgoe2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYmluZC5wYWlycy5mb3JFYWNoKCh7ZnJvbSwgdG9PYmosIHRvS2V5fSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseVBhaXJCaW5kKGZyb20sIHRvT2JqLCB0b0tleSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYmluZC52YWx1ZXMuZm9yRWFjaCgoe2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBleHByZXNzaW9uU3RyLCB0eXBlLCBzb3VyY2VMaW5rcykgeyAvLyB0eXBlID0gJ2lmcycgb3IgJ3ZhbHVlcydcclxuICAgICAgICBsZXQgZXhwcmVzc2lvbk1hdGNoID0gZXhwcmVzc2lvblN0ci5tYXRjaChleHByZXNzaW9uUmVnZXgpO1xyXG4gICAgICAgIGlmIChleHByZXNzaW9uTWF0Y2gpIHtcclxuICAgICAgICAgICAgbGV0IFssICwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtc1N0cl0gPSBleHByZXNzaW9uTWF0Y2g7XHJcbiAgICAgICAgICAgIGV4cHJlc3Npb25OYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25OYW1lLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5UGFyYW1zKHBhcmFtc1N0cik7XHJcbiAgICAgICAgICAgIGxldCBiaW5kUGFyYW1zID0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHBhcmFtID0+IHBhcmFtWzBdICE9PSAnXycpXHJcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHBhcmFtWzBdID09PSAnXycgPyBwYXJhbS5zdWJzdHIoMSkgOiBwYXJhbSlcclxuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gdHJhbnNsYXRlKHBhcmFtLCBzb3VyY2VMaW5rcykpO1xyXG4gICAgICAgICAgICBsZXQgZXhwcmVzc2lvblZhbHVlID0ge2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXN9O1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV4cHJlc3Npb25CaW5kKGV4cHJlc3Npb25OYW1lLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpO1xyXG4gICAgICAgICAgICBiaW5kUGFyYW1zXHJcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChwYXJhbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChwYXJhbSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvblZhbHVlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYmluZE5hbWUgPSB0cmFuc2xhdGUoZXhwcmVzc2lvblN0ciwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICBsZXQgZXhwcmVzc2lvblZhbHVlID0ge2VsZW0sIGJpbmROYW1lfTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQXR0cmlidXRlQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpIHtcclxuICAgICAgICBsZXQgcGFyYW1zID0gdmFsdWUuc3BsaXQoYmluZFJlZ2V4VW5jYXB0dXJpbmcpXHJcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoTGlzdCA9IHBhcmFtLm1hdGNoKGJpbmRSZWdleCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoTGlzdClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3N0cmluZ1ZhbHVlOiBwYXJhbX07XHJcbiAgICAgICAgICAgICAgICBsZXQgW2FsbCwgcHJlZml4U2xhc2gsIG1hdGNoXSA9IG1hdGNoTGlzdDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXhTbGFzaCA/IHtzdHJpbmdWYWx1ZTogYWxsLnN1YnN0cigxKX0gOiB7c291cmNlVmFsdWU6IHRyYW5zbGF0ZShtYXRjaCwgc291cmNlTGlua3MpfTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0ge2VsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtc307XHJcblxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICAgICAgICAuZmlsdGVyKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoe3NvdXJjZVZhbHVlOiBiaW5kTmFtZX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYXR0cmlidXRlQmluZDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBdHRyaWJ1dGVGdW5jdGlvbkJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IFthbGwsIHByZWZpeFNsYXNoLCBmdW5jdGlvbk5hbWUsIHBhcmFtc1N0cl0gPSB2YWx1ZS5tYXRjaChmdW5jdGlvblJlZ2V4KTsgLy8gdG9kbyBwcmVmaXhTbGFzaFxyXG4gICAgICAgIGZ1bmN0aW9uTmFtZSA9IHRyYW5zbGF0ZShmdW5jdGlvbk5hbWUsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpXHJcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gdHJhbnNsYXRlKHBhcmFtLCBzb3VyY2VMaW5rcykpO1xyXG4gICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0ge2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGZ1bmN0aW9uTmFtZSk7XHJcbiAgICAgICAgdGhpcy5iaW5kc1tmdW5jdGlvbk5hbWVdLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVCaW5kKTtcclxuXHJcbiAgICAgICAgcGFyYW1zXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKGJpbmROYW1lID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYXR0cmlidXRlQmluZDtcclxuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEV4cHJlc3Npb25CaW5kKGJpbmROYW1lLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnXHJcbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcclxuICAgICAgICBsZXQgYmluZGVkID0gdGhpcy5iaW5kc1tiaW5kTmFtZV1bdHlwZV0uc29tZShvdGhlckJpbmQgPT5cclxuICAgICAgICAgICAgb3RoZXJCaW5kLmVsZW0gPT09IGVsZW1cclxuICAgICAgICApO1xyXG4gICAgICAgICFiaW5kZWQgJiYgdGhpcy5iaW5kc1tiaW5kTmFtZV1bdHlwZV0ucHVzaChleHByZXNzaW9uVmFsdWUpO1xyXG4gICAgICAgIC8vIHRvZG8gcHJldmVudCBiaW5kaW5nIG5vbiBzb3VyY2UgdmFsdWVzXHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFpckJpbmQoZnJvbSwgdG9PYmosIHRvS2V5KSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGZyb20pO1xyXG4gICAgICAgIHRoaXMuYmluZHNbZnJvbV0ucGFpcnMucHVzaCh7ZnJvbSwgdG9PYmosIHRvS2V5fSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIGxldCBtb2RpZmllZFZhbHVlID0gcGFyYW1zXHJcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW0uc291cmNlVmFsdWUgPyBub3RVbmRlZmluZWQoZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtwYXJhbS5zb3VyY2VWYWx1ZV0pLCAnJykgOiBwYXJhbS5zdHJpbmdWYWx1ZSlcclxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIG1vZGlmaWVkVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2Z1bmN0aW9uTmFtZV0pO1xyXG4gICAgICAgIGVsZW1bYXR0cmlidXRlTmFtZV0gPSBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYXJhbVZhbHVlcyA9IHRoaXMuZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCBlbGVtLCBldmVudCk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkoZWxlbSwgcGFyYW1WYWx1ZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3NvdXJjZUZyb21dKTtcclxuICAgICAgICBpZiAodmFsdWUgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgd2hpbGUgKGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCA+IHZhbHVlLmxlbmd0aClcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50OyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkRWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgc291cmNlTGlua3Nbc291cmNlVG9dID0gYCR7c291cmNlRnJvbX0uJHtpbmRleH1gO1xyXG4gICAgICAgICAgICAgICAgc291cmNlTGlua3MuaW5kZXggPSBgX251bWJlcnNfLiR7aW5kZXh9YDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmluZEVsZW0oY2hpbGRFbGVtLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMub2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcclxuICAgICAgICBlbGVtLmhpZGRlbiA9ICF2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseVBhaXJCaW5kKGZyb20sIHRvT2JqLCB0b0tleSkge1xyXG4gICAgICAgIHRvT2JqW3RvS2V5XSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbZnJvbV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZFZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5vYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gbm90VW5kZWZpbmVkKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBvYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcclxuICAgICAgICBpZiAoIWV4cHJlc3Npb25OYW1lKVxyXG4gICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtiaW5kTmFtZV0pO1xyXG5cclxuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbZXhwcmVzc2lvbk5hbWVdKTtcclxuICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSk7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBleHByZXNzaW9uID09PSAnZnVuY3Rpb24nICYmIGV4cHJlc3Npb24oLi4ucGFyYW1WYWx1ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRvZG8gdXNlIFBhcmFtU3BsaXR0ZXIgaW4gb3JkZXIgdG8gc3VwcG9ydCBhcnJheSBhbmQgb2JqZWN0IHBhcmFtdGVyc1xyXG4gICAgZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCB0aGlzcywgZXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gcGFyYW1zLm1hcChwYXJhbSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYXJhbVBhdGggPSBwYXJhbS5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICBpZiAocGFyYW1QYXRoWzBdID09PSAndGhpcycpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXNzLCBwYXJhbVBhdGgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ2V2ZW50Jykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1QYXRoLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUoZXZlbnQsIHBhcmFtUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBzb3VyY2VWYWx1ZSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW1dKTtcclxuICAgICAgICAgICAgaWYgKHNvdXJjZVZhbHVlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlVmFsdWU7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocGFyYW0ucmVwbGFjZSgvJy9nLCAnXCInKSk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBcnRpZmFjdHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbixcclxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcclxuICAgICAgICAgICAgaGFuZGxlcnM6IHRoaXMuaGFuZGxlcnMsXHJcbiAgICAgICAgICAgIGJpbmRzOiB0aGlzLmJpbmRzLFxyXG4gICAgICAgICAgICByb290OiB0aGlzLnJvb3QsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IHRoaXMuY29tcG9uZW50cyxcclxuICAgICAgICAgICAgYmxvY2tzOiB0aGlzLmJsb2Nrc1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlcGxhY2VJbmxpbmVCaW5kaW5ncyhlbGVtKSB7XHJcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBlbGVtLmlubmVySFRNTC5yZXBsYWNlKGFsbFNwYW5SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xyXG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gZWxlbS5pbm5lckhUTUwucmVwbGFjZShhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCAoYWxsLCBwcmVmaXhTbGFzaCwgbWF0Y2gpID0+IHByZWZpeFNsYXNoID8gYWxsLnN1YnN0cigxKSA6IGA8c3BhbiBiaW5kPVwiJHttYXRjaH1cIj48L3NwYW4+YCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9kbyB1c2UgaW5kZXhUb0RvdCBmb3IgYXR0cmlidXRlIGJpbmRzIGFzIHdlbGwsIGUuZy4gPGRpdiBzdHlsZT1cIiR7Y29sb3JbMF19XCI+IGFiYyA8L2Rpdj5cclxuICAgIHN0YXRpYyBnZXRCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZSkge1xyXG4gICAgICAgIHJldHVybiBpbmRleFRvRG90KGVsZW0uZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBiaW5kcyA9IHtcclxuLy8gICAgICdhLmIuYyc6IHtcclxuLy8gICAgICAgICBhdHRyaWJ1dGVzOiBbYXR0cmlidXRlQmluZDEsIGF0dHJpYnV0ZUJpbmQyXSxcclxuLy8gICAgICAgICBmb3JzOiBbe2NvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3N9XSxcclxuLy8gICAgICAgICBpZnM6IFtleHByZXNzaW9uQmluZDEsIGV4cHJlc3Npb25CaW5kM10sXHJcbi8vICAgICAgICAgcGFpcnM6IFt7ZnJvbSwgdG9PYmosIHRvS2V5fV0sXHJcbi8vICAgICAgICAgdmFsdWVzOiBbZXhwcmVzc2lvbkJpbmQxLCBleHByZXNzaW9uQmluZDJdXHJcbi8vICAgICB9XHJcbi8vIH07XHJcbi8vXHJcbi8vIHNvdXJjZSA9IHtcclxuLy8gICAgIGE6IHtcclxuLy8gICAgICAgICBiOiB7XHJcbi8vICAgICAgICAgICAgIGM6IHt9XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBoYW5kbGVycyA9IHtcclxuLy8gICAgIGE6IHtcclxuLy8gICAgICAgICBfZnVuY186ICdmdW5jJyxcclxuLy8gICAgICAgICBiOiB7XHJcbi8vICAgICAgICAgICAgIGM6IHtcclxuLy8gICAgICAgICAgICAgICAgIF9mdW5jXzogJ2Z1bmMnXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vIH07XHJcbi8vXHJcbi8vIGNvbXBvbmVudHMgPSB7XHJcbi8vICAgICBhOiB7XHJcbi8vICAgICAgICAgb3V0ZXJFbGVtOiBvdXRlckVsZW0sXHJcbi8vICAgICAgICAgcGFyYW1zOiBbXVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBhdHRyaWJ1dGVCaW5kID0ge1xyXG4vLyAgICAgZWxlbTogZWxlbTEsXHJcbi8vICAgICBhdHRyaWJ1dGVOYW1lLFxyXG4vLyAgICAgZnVuY3Rpb25OYW1lLCAvLyBjYW4gYmUgbnVsbFxyXG4vLyAgICAgcGFyYW1zOiBbe3N0cmluZ1ZhbHVlIHwgc291cmNlVmFsdWU6IHN0cmluZ31dLCAvLyBmb3IgbnVsbCBmdW5jdGlvbk5hbWVcclxuLy8gICAgIHBhcmFtczogW10gLy8gZm9yIG5vdCBudWxsIGZ1bmN0aW9uTmFtZVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBleHByZXNzaW9uQmluZCA9IHtcclxuLy8gICAgIGVsZW06IGVsZW0xLFxyXG4vLyAgICAgZXhwcmVzc2lvbk5hbWUsIC8vIGNhbiBiZSBudWxsXHJcbi8vICAgICBwYXJhbXM6IFtdLFxyXG4vLyAgICAgYmluZE5hbWUgLy8gY2FuIGJlIG51bGxcclxuLy8gfTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSHRtbEJpbmRlcjtcclxuIiwiY29uc3QgQm9vdGVyID0gcmVxdWlyZSgnLi9ib290ZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4gbmV3IEJvb3RlcigpO1xyXG5cclxuLy8gdG9kb1xyXG4vLyBhbGxvdyBhcnJheSBiaW5kaW5nIGluIGh0bWw6IGA8ZGl2IGJpbmQ9XCJ4W3ldXCI+PC9kaXY+YFxyXG4vLyBjbGVhbiB1cCBwYWNrYWdlLmpzb25cclxuLy8gJHN7eH0gc3ludGF4IHRvIG9ubHkgYWZmZWN0IGlubmVyIHRleHQgYW5kIG5vdCBhdHRyaWJ1dGVzXHJcbi8vIGFsbG93IGRlZmluaW5nIGFuZCB1c2luZyBjb21wb25lbnRzIGluIGFueSBvcmRlclxyXG4vLyBhbGxvdyB1c2luZyBleHByZXNzaW9ucyBmb3IgbW9yZSBiaW5kcyB0aGFuIGp1c3QgaWZzIGFuZCB2YWx1ZXMgKGUuZy4gYXR0cmlidXRlcywgZm9ycywgYXMsIHVzZSlcclxuLy8gc3VwcG9ydCAkZSBuZXN0ZWQgaW5zaWRlICRzXHJcbi8vIGludmVzdGlnYXRlIHdoeSBzb3VyY2UuYSA9IHNvdXJjZS5iIGRvZXNuJ3QgcHJvcG9nYXRlIGNoYW5nZXNcclxuLy8gaW52ZXN0aWdhdGUgd2h5IGJpbmQtZm9yIGluZGV4VmFycyBkb24ndCBwcm9wb2dhdGUgY2hhbmdlc1xyXG4vLyByb3V0aW5nIG9yIHN3YXBwaW5nIHN0YXRlc1xyXG4iLCJsZXQgZ2V0UHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xyXG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhwYXRocyk7XHJcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xyXG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSB8fCB7fSk7XHJcbiAgICByZXR1cm4gW29iaiwgbGFzdEZpZWxkXTtcclxufTtcclxuXHJcbmxldCBnZXRWYWx1ZSA9IChvYmosIHBhdGhzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydHkgPSBnZXRQcm9wZXJ0eShvYmosIHBhdGhzKTtcclxuICAgIHJldHVybiBwcm9wZXJ0eVsxXSA9PT0gdW5kZWZpbmVkID8gcHJvcGVydHlbMF0gOiBwcm9wZXJ0eVswXVtwcm9wZXJ0eVsxXV07XHJcbn07XHJcblxyXG5sZXQgY3JlYXRlUHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xyXG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhwYXRocyk7XHJcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xyXG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSA9IG9ialtmaWVsZF0gfHwge30pO1xyXG4gICAgcmV0dXJuIFtvYmosIGxhc3RGaWVsZF07XHJcbn07XHJcblxyXG5sZXQgc2V0UHJvcGVydHkgPSAob2JqLCBwYXRocywgdmFsdWUpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0eSA9IGNyZWF0ZVByb3BlcnR5KG9iaiwgcGF0aHMpO1xyXG4gICAgcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dID0gdmFsdWU7XHJcbn07XHJcblxyXG5sZXQgY2xvbmUgPSBvcmlnaW5hbCA9PiB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgb3JpZ2luYWwpO1xyXG59O1xyXG5cclxubGV0IHRyYW5zbGF0ZSA9IChuYW1lLCBsaW5rcykgPT4ge1xyXG4gICAgbGV0IG9jY3VycmVkID0gW107XHJcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKFtuYW1lXSk7XHJcbiAgICB3aGlsZSAoZmllbGRzWzBdIGluIGxpbmtzKSB7XHJcbiAgICAgICAgb2NjdXJyZWQucHVzaChmaWVsZHNbMF0pO1xyXG4gICAgICAgIGZpZWxkc1swXSA9IGxpbmtzW2ZpZWxkc1swXV07XHJcbiAgICAgICAgaWYgKG9jY3VycmVkLmluY2x1ZGVzKGZpZWxkc1swXSkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGZpZWxkcyA9IGdldEZpZWxkcyhmaWVsZHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoKGEsIGIpID0+IGAke2F9LiR7Yn1gKTtcclxufTtcclxuXHJcbmxldCBnZXRGaWVsZHMgPSBwYXRocyA9PlxyXG4gICAgcGF0aHNcclxuICAgICAgICAubWFwKHBhdGggPT4gcGF0aC5zcGxpdCgnLicpKVxyXG4gICAgICAgIC5yZWR1Y2UoKGFnZ3JlZ2F0ZSwgaXRlbSkgPT4gYWdncmVnYXRlLmNvbmNhdChpdGVtKSwgW10pO1xyXG5cclxubGV0IGluZGV4VG9Eb3QgPSBmaWVsZCA9PiBmaWVsZCAmJiBmaWVsZC5yZXBsYWNlKC9cXFsoXFx3KylcXF0vZywgKF8sIG1hdGNoKSA9PiBgLiR7bWF0Y2h9YCk7XHJcblxyXG5sZXQgbm90VW5kZWZpbmVkID0gKHZhbHVlLCB1bmRlZmluZWRWYWx1ZSA9IG51bGwpID0+XHJcbiAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB1bmRlZmluZWRWYWx1ZTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfTtcclxuIiwiY2xhc3MgUGFyYW1TcGxpdHRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcclxuICAgICAgICB0aGlzLmluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gMDtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0QnlQYXJhbXMoKSB7XHJcbiAgICAgICAgbGV0IGRlcHRoID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dEluZGV4KCkgJiYgKCF0aGlzLmF0UXVvdGUoKSB8fCB0aGlzLnNraXBRdW90ZSgpKSkge1xyXG4gICAgICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoY2hhciA9PT0gJ1snKVxyXG4gICAgICAgICAgICAgICAgZGVwdGgrKztcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJ10nKVxyXG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJywnICYmICFkZXB0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQYXJhbSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5pbmRleCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGFyYW0oKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEluZGV4KHJlZ2V4LCBzdGFydCkgeyAvLyByZXR1cm5zIC0xIG9yIGluZGV4IG9mIG1hdGNoXHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zdHJpbmcuc3Vic3RyaW5nKHN0YXJ0KS5zZWFyY2gocmVnZXgpO1xyXG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwID8gaW5kZXggKyBzdGFydCA6IC0xO1xyXG4gICAgfTtcclxuXHJcbiAgICBuZXh0SW5kZXgoKSB7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZmluZEluZGV4KC9bLCdcIltcXF1dLywgdGhpcy5pbmRleCArIDEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBhdFF1b3RlKCkge1xyXG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XHJcbiAgICAgICAgcmV0dXJuIGNoYXIgPT09ICdcIicgfHwgY2hhciA9PT0gXCInXCI7XHJcbiAgICB9XHJcblxyXG4gICAgc2tpcFF1b3RlKCkge1xyXG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZmluZEluZGV4KGNoYXIgPT09ICdcIicgPyAvW15cXFxcXVwiLyA6IC9bXlxcXFxdJy8sIHRoaXMuaW5kZXggKyAxKSArIDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFyYW0oKSB7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMucHVzaCh0aGlzLnN0cmluZy5zdWJzdHJpbmcodGhpcy5zdGFydEluZGV4LCB0aGlzLmluZGV4ID4gMCA/IHRoaXMuaW5kZXggOiB0aGlzLnN0cmluZy5sZW5ndGgpLnRyaW0oKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nID0+IG5ldyBQYXJhbVNwbGl0dGVyKHN0cmluZykuc3BsaXRCeVBhcmFtcygpO1xyXG4iLCIvLyAoW1xcdy5bXFxdXSspXHJcblxyXG5sZXQgc3BhblJlZ2V4ID0gLyhcXFxcKT9cXCRzeyhbXFx3LltcXF1dKyl9LztcclxubGV0IGFsbFNwYW5SZWdleCA9IG5ldyBSZWdFeHAoc3BhblJlZ2V4LCAnZycpO1xyXG5sZXQgc3BhbkV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdIT0+PHwmXStcXCguKlxcKSl9LztcclxubGV0IGFsbFNwYW5FeHByZXNzaW9uUmVnZXggPSBuZXcgUmVnRXhwKHNwYW5FeHByZXNzaW9uUmVnZXgsICdnJyk7XHJcblxyXG5sZXQgYmluZFJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKX0vO1xyXG5sZXQgYmluZFJlZ2V4VW5jYXB0dXJpbmcgPSAvKCg/OlxcXFwpP1xcJHsoPzpbXFx3LltcXF1dKyl9KS87XHJcblxyXG5sZXQgZnVuY3Rpb25SZWdleCA9IC8oXFxcXCk/XFwkeyhbXFx3LltcXF1dKylcXCgoLiopXFwpfS87XHJcblxyXG5sZXQgZXhwcmVzc2lvblJlZ2V4ID0gLyhcXFxcKT8oW1xcdy5bXFxdIT0+PHwmXSspXFwoKC4qKVxcKS87XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH07XHJcbiIsImxldCBjcmVhdGVTb3VyY2UgPSAoKSA9PiB7XHJcbiAgICBsZXQgaGFuZGxlcnMgPSB7fTtcclxuICAgIGxldCBvcmlnaW4gPSB7fTtcclxuICAgIGxldCBzb3VyY2UgPSBjcmVhdGVQcm94eShvcmlnaW4sIGhhbmRsZXJzKTtcclxuICAgIHNldERlZmF1bHRTb3VyY2Uob3JpZ2luKTtcclxuICAgIHJldHVybiB7b3JpZ2luLCBzb3VyY2UsIGhhbmRsZXJzfTtcclxufTtcclxuXHJcbmxldCBpZ25vcmUgPSBbXTtcclxuXHJcbmxldCBpc0JpbmRJZ25vcmVkID0gKG9iaiwgcHJvcCkgPT4gb2JqLl9fYmluZElnbm9yZV9fICYmIG9iai5fX2JpbmRJZ25vcmVfXy5pbmNsdWRlcyhwcm9wKTtcclxuXHJcbi8vIHRvZG8gbWFrZSBfX2JpbmRBdm9pZEN5Y2xlc19fIGluaGVyaXRlZCBhbmQgbWF5YmUgYXZvaWQgcGVyIGJpbmRpbmcgaW5zdGVhZCBwZXIgY2hhbmdlXHJcbmxldCBpc0lnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBpc0JpbmRJZ25vcmVkKG9iaiwgcHJvcCkgfHwgKG9iai5fX2JpbmRBdm9pZEN5Y2xlc19fICYmIGlnbm9yZS5zb21lKGlnbm9yZSA9PiBpZ25vcmUub2JqID09PSBvYmogJiYgaWdub3JlLnByb3AgPT09IHByb3ApKTtcclxuXHJcbmxldCBoYW5kbGVTZXQgPSAob2JqLCBwcm9wLCBoYW5kbGVycywgYWNjdW11bGF0ZWRIYW5kbGVycykgPT4ge1xyXG4gICAgaWdub3JlLnB1c2goe29iaiwgcHJvcH0pO1xyXG4gICAgYWNjdW11bGF0ZWRIYW5kbGVycy5mb3JFYWNoKGRvSGFuZGxlcik7XHJcbiAgICBoYW5kbGVycyAmJiBwcm9wb2dhdGVIYW5kbGVyRG93bihoYW5kbGVycyk7XHJcbiAgICBpZ25vcmUucG9wKCk7XHJcbn07XHJcblxyXG5sZXQgY3JlYXRlUHJveHkgPSAob2JqLCBoYW5kbGVycyA9IHt9LCBhY2N1bXVsYXRlZEhhbmRsZXJzID0gW10pID0+IG5ldyBQcm94eShvYmosIHtcclxuICAgIGdldDogKHRhcmdldCwgcHJvcCkgPT4ge1xyXG4gICAgICAgIGxldCBnb3QgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3ApO1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZ290ID09PSAnb2JqZWN0JyAmJiBnb3QgJiYgIWlzQmluZElnbm9yZWQob2JqLCBwcm9wKSA/IGNyZWF0ZVByb3h5KGdvdCwgaGFuZGxlcnNbcHJvcF0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSkgOiBnb3Q7XHJcbiAgICB9LFxyXG4gICAgc2V0OiAodGFyZ2V0LCBwcm9wLCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpO1xyXG4gICAgICAgICFpc0lnbm9yZWQob2JqLCBwcm9wKSAmJiBoYW5kbGVTZXQob2JqLCBwcm9wLCBoYW5kbGVyc1twcm9wXSwgYWNjdW11bGF0ZWRIYW5kbGVycy5jb25jYXQoaGFuZGxlcnMpKTsgLy8gdG9kbyB3cmFwIGhhbmRsZXJzIGFuZCBhY2N1bXVsYXRlZEhhbmRsZXJzIGluIGNsYXNzIHdpdGggcG9wUHJvcCBtZXRob2RcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufSk7XHJcblxyXG5sZXQgcHJvcG9nYXRlSGFuZGxlckRvd24gPSBoYW5kbGVycyA9PiB7XHJcbiAgICBkb0hhbmRsZXIoaGFuZGxlcnMpO1xyXG4gICAgT2JqZWN0LmVudHJpZXMoaGFuZGxlcnMpXHJcbiAgICAgICAgLmZpbHRlcigoW2tleV0pID0+IGtleSAhPT0gJ19mdW5jXycpXHJcbiAgICAgICAgLmZvckVhY2goKFssIGhhbmRsZXJdKSA9PiBwcm9wb2dhdGVIYW5kbGVyRG93bihoYW5kbGVyKSk7XHJcbn07XHJcblxyXG5sZXQgZG9IYW5kbGVyID0gaGFuZGxlciA9PiB0eXBlb2YgaGFuZGxlci5fZnVuY18gPT09ICdmdW5jdGlvbicgJiYgaGFuZGxlci5fZnVuY18oKTtcclxuXHJcbmxldCBzZXREZWZhdWx0U291cmNlID0gc291cmNlID0+IHtcclxuICAgIHNvdXJjZS5fbnVtYmVyc18gPSBuZXcgUHJveHkoe30sIHtcclxuICAgICAgICBnZXQ6IChfLCBwcm9wKSA9PiBwYXJzZUludChwcm9wKSxcclxuICAgICAgICBzZXQ6ICgpID0+IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIHNvdXJjZS5ub3QgPSBhID0+ICFhO1xyXG4gICAgc291cmNlWychJ10gPSBhID0+ICFhO1xyXG4gICAgc291cmNlLmVxID0gKGEsIGIpID0+IGEgPT09IGI7XHJcbiAgICBzb3VyY2UuZXF1YWwgPSAoYSwgYikgPT4gYSA9PT0gYjtcclxuICAgIHNvdXJjZVsnPSddID0gKGEsIGIpID0+IGEgPT09IGI7XHJcbiAgICBzb3VyY2UubkVxID0gKGEsIGIpID0+IGEgIT09IGI7XHJcbiAgICBzb3VyY2Uubm90RXF1YWwgPSAoYSwgYikgPT4gYSAhPT0gYjtcclxuICAgIHNvdXJjZVsnIT0nXSA9IChhLCBiKSA9PiBhICE9PSBiO1xyXG4gICAgc291cmNlLmdyZWF0ZXIgPSAoYSwgYikgPT4gYSA+IGI7XHJcbiAgICBzb3VyY2VbJz4nXSA9IChhLCBiKSA9PiBhID4gYjtcclxuICAgIHNvdXJjZS5sZXNzID0gKGEsIGIpID0+IGEgPCBiO1xyXG4gICAgc291cmNlWyc8J10gPSAoYSwgYikgPT4gYSA8IGI7XHJcbiAgICBzb3VyY2UuZ3JlYXRlckVxID0gKGEsIGIpID0+IGEgPj0gYjtcclxuICAgIHNvdXJjZVsnPj0nXSA9IChhLCBiKSA9PiBhID49IGI7XHJcbiAgICBzb3VyY2UubGVzc0VxID0gKGEsIGIpID0+IGEgPD0gYjtcclxuICAgIHNvdXJjZVsnPD0nXSA9IChhLCBiKSA9PiBhIDw9IGI7XHJcbiAgICBzb3VyY2Uub3IgPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcclxuICAgIHNvdXJjZVsnfCddID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XHJcbiAgICBzb3VyY2VbJ3x8J10gPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcclxuICAgIHNvdXJjZS5hbmQgPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XHJcbiAgICBzb3VyY2VbJyYnXSA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcclxuICAgIHNvdXJjZVsnJiYnXSA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZVNvdXJjZX07XHJcbiIsImxldCBzcGxpdEJ5V29yZCA9IChzdHJpbmcsIHdvcmQpID0+XHJcbiAgICBzdHJpbmcuc3BsaXQobmV3IFJlZ0V4cChgXFxcXHMrJHt3b3JkfVxcXFxzK2ApKTtcclxuXHJcbmxldCBzcGxpdEJ5Q29tbWEgPSBzdHJpbmcgPT5cclxuICAgIHN0cmluZy5zcGxpdCgvXFxzKixcXHMqLyk7XHJcblxyXG5sZXQgc3BsaXRCeVNwYWNlID0gc3RyaW5nID0+XHJcbiAgICBzdHJpbmcuc3BsaXQoL1xccysvKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX07XHJcbiJdfQ==
