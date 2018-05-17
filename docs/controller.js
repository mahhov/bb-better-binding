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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2NvbnRyb2xsZXIuanMiLCJzcmMvYm9vdGVyLmpzIiwic3JjL2h0bWxCaW5kZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvb2JqU2NhZm9sZGluZy5qcyIsInNyYy9wYXJhbVNwbGl0dGVyLmpzIiwic3JjL3JlZ2V4LmpzIiwic3JjL3NvdXJjZS5qcyIsInNyYy9zdHJpbmdTcGxpdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3Qgc291cmNlID0gcmVxdWlyZSgnYmItYmV0dGVyLWJpbmRpbmcnKSgpLmJvb3QoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHdpbmRvdyk7XHJcblxyXG4vLyBncmVldGluZ1xyXG5zb3VyY2UubGFyZ2VGb250ID0gNjA7XHJcbnNvdXJjZS5mYXZvcml0ZUNvbG9yID0gJ0RFRVBwaW5rJztcclxuc291cmNlLmdyZWV0aW5nID0gJ0kgaGF0ZSB5b3UnO1xyXG5zb3VyY2UubmFtZSA9ICdXb3JsZCc7XHJcbnNvdXJjZS5leGNsYW1hdGlvbiA9ICco4pWvwrDilqHCsO+8ieKVr++4tSDilLvilIHilLsnO1xyXG5zb3VyY2UuY2hhbmdlQ29sb3IgPSBpbnB1dCA9PiB7XHJcbiAgICBzb3VyY2UuZmF2b3JpdGVDb2xvciA9IGlucHV0LnZhbHVlO1xyXG59O1xyXG5cclxuLy8gYW5pbWF0aW9uXHJcbmxldCBhbmltYXRpb25zID0gW1xyXG4gICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwNDMuZ2lmJyxcclxuICAgICdodHRwczovL21lZGlhMC5naXBoeS5jb20vbWVkaWEvMTJFa0pDYnBhM2hHS2MvZ2lwaHkuZ2lmJyxcclxuICAgICdodHRwOi8vd3d3LnFxcHIuY29tL2FzY2lpL2ltZy9hc2NpaS0xMDA2LmdpZiddO1xyXG5sZXQgYW5pbWF0aW9uSW5kZXggPSAtMTtcclxuc291cmNlLmNoYW5nZUFuaW1hdGlvbiA9ICgpID0+IHtcclxuICAgIGFuaW1hdGlvbkluZGV4ID0gKGFuaW1hdGlvbkluZGV4ICsgMSkgJSBhbmltYXRpb25zLmxlbmd0aDtcclxuICAgIHNvdXJjZS5hbmltYXRpb24gPSBhbmltYXRpb25zW2FuaW1hdGlvbkluZGV4XTtcclxufTtcclxuc291cmNlLmNoYW5nZUFuaW1hdGlvbigpO1xyXG5cclxuLy8gam9rZXNcclxuc291cmNlLnNldEpva2VWaXNpYmlsaXR5ID0gY2hlY2tib3ggPT4ge1xyXG4gICAgc291cmNlLmpva2VWaXNpYmlsaXR5ID0gY2hlY2tib3guY2hlY2tlZDtcclxufTtcclxuc291cmNlLmpva2VzID0gW1xyXG4gICAge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJMZWZ0IGluc2lkZSBtYWluIHRpcmUgYWxtb3N0IG5lZWRzIHJlcGxhY2VtZW50LlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkFsbW9zdCByZXBsYWNlZCBsZWZ0IGluc2lkZSBtYWluIHRpcmUuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJUZXN0IGZsaWdodCBPSywgZXhjZXB0IGF1dG9sYW5kIHZlcnkgcm91Z2guXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiQXV0b2xhbmQgbm90IGluc3RhbGxlZCBvbiB0aGlzIGFpcmNyYWZ0LlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbSAjMTogIFwiIzIgUHJvcGVsbGVyIHNlZXBpbmcgcHJvcCBmbHVpZC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbiAjMTogXCIjMiBQcm9wZWxsZXIgc2VlcGFnZSBub3JtYWwuXCInLFxyXG4gICAgICAgICAgICAnUHJvYmxlbSAjMjogIFwiIzEsICMzLCBhbmQgIzQgcHJvcGVsbGVycyBsYWNrIG5vcm1hbCBzZWVwYWdlLlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbTogICAgXCJUaGUgYXV0b3BpbG90IGRvZXNuXFwndC5cIicsXHJcbiAgICAgICAgICAgICdTaWduZWQgb2ZmOiBcIklUIERPRVMgTk9XLlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiU29tZXRoaW5nIGxvb3NlIGluIGNvY2twaXQuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiU29tZXRoaW5nIHRpZ2h0ZW5lZCBpbiBjb2NrcGl0LlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiRXZpZGVuY2Ugb2YgaHlkcmF1bGljIGxlYWsgb24gcmlnaHQgbWFpbiBsYW5kaW5nIGdlYXIuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiRXZpZGVuY2UgcmVtb3ZlZC5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRNRSB2b2x1bWUgdW5iZWxpZXZhYmx5IGxvdWQuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiVm9sdW1lIHNldCB0byBtb3JlIGJlbGlldmFibGUgbGV2ZWwuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJEZWFkIGJ1Z3Mgb24gd2luZHNoaWVsZC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJMaXZlIGJ1Z3Mgb24gb3JkZXIuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJBdXRvcGlsb3QgaW4gYWx0aXR1ZGUgaG9sZCBtb2RlIHByb2R1Y2VzIGEgMjAwIGZwbSBkZXNjZW50LlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkNhbm5vdCByZXByb2R1Y2UgcHJvYmxlbSBvbiBncm91bmQuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJJRkYgaW5vcGVyYXRpdmUuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiSUZGIGFsd2F5cyBpbm9wZXJhdGl2ZSBpbiBPRkYgbW9kZS5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkZyaWN0aW9uIGxvY2tzIGNhdXNlIHRocm90dGxlIGxldmVycyB0byBzdGljay5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJUaGF0XFwncyB3aGF0IHRoZXlcXCdyZSB0aGVyZSBmb3IuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJOdW1iZXIgdGhyZWUgZW5naW5lIG1pc3NpbmcuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiRW5naW5lIGZvdW5kIG9uIHJpZ2h0IHdpbmcgYWZ0ZXIgYnJpZWYgc2VhcmNoLlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbl07XHJcbnNvdXJjZS5qb2tlc1NvdXJjZSA9ICdodHRwczovL3d3dy5uZXRmdW5ueS5jb20vcmhmL2pva2VzLzk3L0p1bi91c2FmLmh0bWwnO1xyXG4iLCJjb25zdCBIdG1sQmluZGVyID0gcmVxdWlyZSgnLi9odG1sQmluZGVyJyk7XHJcblxyXG5jbGFzcyBCb290ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZGVjbGFyZUJsb2NrKGJsb2NrTmFtZSwgYmxvY2spIHtcclxuICAgICAgICB0aGlzLmJsb2Nrc1tibG9ja05hbWVdID0gYmxvY2s7XHJcbiAgICB9XHJcblxyXG4gICAgYm9vdChyb290LCBkZWJ1Zykge1xyXG4gICAgICAgIGxldCBhcnRpZmFjdHMgPSBuZXcgSHRtbEJpbmRlcihyb290LCB0aGlzLmJsb2NrcykuZ2V0QXJ0aWZhY3RzKCk7XHJcbiAgICAgICAgZGVidWcgJiYgT2JqZWN0LmFzc2lnbihkZWJ1ZywgYXJ0aWZhY3RzKTtcclxuICAgICAgICByZXR1cm4gYXJ0aWZhY3RzLnNvdXJjZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290ZXI7XHJcbiIsImNvbnN0IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIGNsb25lLCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZH0gPSByZXF1aXJlKCcuL29ialNjYWZvbGRpbmcnKTtcclxuY29uc3Qge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX0gPSByZXF1aXJlKCcuL3N0cmluZ1NwbGl0dGVyJyk7XHJcbmNvbnN0IHNwbGl0QnlQYXJhbXMgPSByZXF1aXJlKCcuL3BhcmFtU3BsaXR0ZXInKTtcclxuY29uc3Qge2NyZWF0ZVNvdXJjZX0gPSByZXF1aXJlKCcuL3NvdXJjZScpO1xyXG5jb25zdCB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9ID0gcmVxdWlyZSgnLi9yZWdleCcpO1xyXG5cclxuY2xhc3MgSHRtbEJpbmRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iocm9vdCwgYmxvY2tzKSB7XHJcbiAgICAgICAgbGV0IHtvcmlnaW4sIHNvdXJjZSwgaGFuZGxlcnN9ID0gY3JlYXRlU291cmNlKCk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xyXG4gICAgICAgIHRoaXMuYmluZHMgPSB7fTtcclxuICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG5cclxuICAgICAgICBIdG1sQmluZGVyLnJlcGxhY2VJbmxpbmVCaW5kaW5ncyhyb290KTtcclxuICAgICAgICB0aGlzLmJpbmRFbGVtKHJvb3QsIHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kRWxlbShlbGVtLCBzb3VyY2VMaW5rcykge1xyXG4gICAgICAgIGxldCBza2lwID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGVsZW0uYXR0cmlidXRlcztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQge25hbWU6IGF0dHJpYnV0ZU5hbWUsIHZhbHVlfSA9IGF0dHJpYnV0ZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLm1hdGNoKGJpbmRSZWdleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7cGFyYW1zfSA9IGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgcGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLm1hdGNoKGZ1bmN0aW9uUmVnZXgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB0aGlzLmFkZEF0dHJpYnV0ZUZ1bmN0aW9uQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZnVuY3Rpb25OYW1lLCBwYXJhbXN9ID0gYXR0cmlidXRlQmluZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJpbmRFbGVtID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWVsZW0nKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRDb21wb25lbnQgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtY29tcG9uZW50Jyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kVXNlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLXVzZScpO1xyXG4gICAgICAgICAgICBsZXQgYmluZEFzID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWFzJyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kRm9yID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWZvcicpO1xyXG4gICAgICAgICAgICBsZXQgYmluZElmID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWlmJyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kQmxvY2sgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtYmxvY2snKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRWYWx1ZSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJpbmRFbGVtKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLnNvdXJjZSwgW2JpbmRFbGVtXSwgZWxlbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXyA9IHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18ucHVzaChiaW5kRWxlbSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJpbmRDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbGV0IFtjb21wb25lbnROYW1lLCBwYXJhbXNHcm91cF0gPSBzcGxpdEJ5V29yZChiaW5kQ29tcG9uZW50LCAnd2l0aCcpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlTcGFjZShwYXJhbXNHcm91cCk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtY29tcG9uZW50Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0gPSB7b3V0ZXJFbGVtOiBlbGVtLCBwYXJhbXN9O1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kRm9yKSB7XHJcbiAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBbc291cmNlVG8sIGJpbmROYW1lXSA9IHNwbGl0QnlXb3JkKGJpbmRGb3IsICdpbicpO1xyXG4gICAgICAgICAgICAgICAgYmluZE5hbWUgPSB0cmFuc2xhdGUoYmluZE5hbWUsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3ItcGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlcGxhY2VXaXRoKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1mb3InKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5mb3JzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcixcclxuICAgICAgICAgICAgICAgICAgICBvdXRlckVsZW06IGVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlVG8sXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRnJvbTogYmluZE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGb3IoY29udGFpbmVyLCBlbGVtLCBzb3VyY2VUbywgYmluZE5hbWUsIHNvdXJjZUxpbmtzKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZEFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRCeUNvbW1hKGJpbmRBcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChhcyA9PiBzcGxpdEJ5V29yZChhcywgJ2FzJykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChbZnJvbSwgdG9dKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUoZnJvbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZElmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kSWYsICdpZnMnLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdG9kbyBhbGxvdyBub24tc291cmNlIHBhcmFtZXRlcnMgZm9yIGJpbmRVc2UgYW5kIGJpbmRCbG9ja1xyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRVc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRVc2UsICd3aXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtc0lucHV0ID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQge291dGVyRWxlbSwgcGFyYW1zfSA9IHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50RWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGNvbXBvbmVudEVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NbdG9dID0gdHJhbnNsYXRlKHBhcmFtc0lucHV0W2luZGV4XSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiaW5kQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW2Jsb2NrLCBibG9ja1RvXSA9IHNwbGl0QnlXb3JkKGJpbmRCbG9jaywgJ2FzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtibG9ja05hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJsb2NrLCAnd2l0aCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNJbnB1dCA9IHBhcmFtc0dyb3VwID8gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKSA6IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIHBhcmFtZXRlcnN9ID0gdGhpcy5ibG9ja3NbYmxvY2tOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1ibG9jaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrU291cmNlID0gbmV3IEh0bWxCaW5kZXIoZWxlbSwgdGhpcy5ibG9ja3MpLnNvdXJjZTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyKGJsb2NrU291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzICYmIHBhcmFtZXRlcnMuZm9yRWFjaCgodG8sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcm9tID0gdHJhbnNsYXRlKHBhcmFtc0lucHV0W2luZGV4XSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFBhaXJCaW5kKGZyb20sIGJsb2NrU291cmNlLCB0byk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWlyQmluZChmcm9tLCBibG9ja1NvdXJjZSwgdG8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9ja1RvKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZVtibG9ja1RvXSA9IGJsb2NrU291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gZGVidWdnZXIgZm9yIGJsb2NrIGJpbmRpbmdzXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9ID0gdGhpcy5leHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgYmluZFZhbHVlLCAndmFsdWVzJywgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXNraXApXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBlbGVtLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShlbGVtLmNoaWxkcmVuW2ldLCBzb3VyY2VMaW5rcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQmluZChiaW5kTmFtZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmJpbmRzW2JpbmROYW1lXSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgYmluZCA9IHthdHRyaWJ1dGVzOiBbXSwgZm9yczogW10sIGlmczogW10sIHBhaXJzOiBbXSwgdmFsdWVzOiBbXX07XHJcbiAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0gPSBiaW5kO1xyXG5cclxuICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLmhhbmRsZXJzLCBbYmluZE5hbWUsICdfZnVuY18nXSwgKCkgPT4ge1xyXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMgPSBiaW5kLmF0dHJpYnV0ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcbiAgICAgICAgICAgIGJpbmQuZm9ycyA9IGJpbmQuZm9ycy5maWx0ZXIoKHtjb250YWluZXJ9KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoY29udGFpbmVyKSk7XHJcbiAgICAgICAgICAgIGJpbmQuaWZzID0gYmluZC5pZnMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcbiAgICAgICAgICAgIGJpbmQudmFsdWVzID0gYmluZC52YWx1ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcblxyXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoe2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lID8gdGhpcy5hcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykgOiB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQuZm9ycy5mb3JFYWNoKCh7Y29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rc30pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQuaWZzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQucGFpcnMuZm9yRWFjaCgoe2Zyb20sIHRvT2JqLCB0b0tleX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQudmFsdWVzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgZXhwcmVzc2lvblN0ciwgdHlwZSwgc291cmNlTGlua3MpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnXHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb25NYXRjaCA9IGV4cHJlc3Npb25TdHIubWF0Y2goZXhwcmVzc2lvblJlZ2V4KTtcclxuICAgICAgICBpZiAoZXhwcmVzc2lvbk1hdGNoKSB7XHJcbiAgICAgICAgICAgIGxldCBbLCAsIGV4cHJlc3Npb25OYW1lLCBwYXJhbXNTdHJdID0gZXhwcmVzc2lvbk1hdGNoO1xyXG4gICAgICAgICAgICBleHByZXNzaW9uTmFtZSA9IHRyYW5zbGF0ZShleHByZXNzaW9uTmFtZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpO1xyXG4gICAgICAgICAgICBsZXQgYmluZFBhcmFtcyA9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbVswXSAhPT0gJ18nKVxyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiBwYXJhbVswXSA9PT0gJ18nID8gcGFyYW0uc3Vic3RyKDEpIDogcGFyYW0pXHJcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcclxuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zfTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChleHByZXNzaW9uTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAgICAgYmluZFBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGFyYW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQocGFyYW0sIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGJpbmROYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25TdHIsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBiaW5kTmFtZX07XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZEF0dHJpYnV0ZUJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHZhbHVlLnNwbGl0KGJpbmRSZWdleFVuY2FwdHVyaW5nKVxyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXRjaExpc3QgPSBwYXJhbS5tYXRjaChiaW5kUmVnZXgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaExpc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdHJpbmdWYWx1ZTogcGFyYW19O1xyXG4gICAgICAgICAgICAgICAgbGV0IFthbGwsIHByZWZpeFNsYXNoLCBtYXRjaF0gPSBtYXRjaExpc3Q7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4U2xhc2ggPyB7c3RyaW5nVmFsdWU6IGFsbC5zdWJzdHIoMSl9IDoge3NvdXJjZVZhbHVlOiB0cmFuc2xhdGUobWF0Y2gsIHNvdXJjZUxpbmtzKX07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXN9O1xyXG5cclxuICAgICAgICBwYXJhbXNcclxuICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbS5zb3VyY2VWYWx1ZSlcclxuICAgICAgICAgICAgLmZvckVhY2goKHtzb3VyY2VWYWx1ZTogYmluZE5hbWV9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xyXG4gICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgZnVuY3Rpb25OYW1lLCBwYXJhbXNTdHJdID0gdmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCk7IC8vIHRvZG8gcHJlZml4U2xhc2hcclxuICAgICAgICBmdW5jdGlvbk5hbWUgPSB0cmFuc2xhdGUoZnVuY3Rpb25OYW1lLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlQYXJhbXMocGFyYW1zU3RyKVxyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcclxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtc307XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmdW5jdGlvbk5hbWUpO1xyXG4gICAgICAgIHRoaXMuYmluZHNbZnVuY3Rpb25OYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XHJcblxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICAgICAgICAuZm9yRWFjaChiaW5kTmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICAgICAgLy8gdG9kbyBwcmV2ZW50IGJpbmRpbmcgbm9uIHNvdXJjZSB2YWx1ZXNcclxuICAgIH1cclxuXHJcbiAgICBhZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKSB7IC8vIHR5cGUgPSAnaWZzJyBvciAndmFsdWVzJ1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XHJcbiAgICAgICAgbGV0IGJpbmRlZCA9IHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnNvbWUob3RoZXJCaW5kID0+XHJcbiAgICAgICAgICAgIG90aGVyQmluZC5lbGVtID09PSBlbGVtXHJcbiAgICAgICAgKTtcclxuICAgICAgICAhYmluZGVkICYmIHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnB1c2goZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhaXJCaW5kKGZyb20sIHRvT2JqLCB0b0tleSkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmcm9tKTtcclxuICAgICAgICB0aGlzLmJpbmRzW2Zyb21dLnBhaXJzLnB1c2goe2Zyb20sIHRvT2JqLCB0b0tleX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICBsZXQgbW9kaWZpZWRWYWx1ZSA9IHBhcmFtc1xyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlID8gbm90VW5kZWZpbmVkKGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW0uc291cmNlVmFsdWVdKSwgJycpIDogcGFyYW0uc3RyaW5nVmFsdWUpXHJcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBtb2RpZmllZFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIGxldCBoYW5kbGVyID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtmdW5jdGlvbk5hbWVdKTtcclxuICAgICAgICBlbGVtW2F0dHJpYnV0ZU5hbWVdID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KGVsZW0sIHBhcmFtVmFsdWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtzb3VyY2VGcm9tXSk7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPiB2YWx1ZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3NvdXJjZVRvXSA9IGAke3NvdXJjZUZyb219LiR7aW5kZXh9YDtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzLmluZGV4ID0gYF9udW1iZXJzXy4ke2luZGV4fWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGNoaWxkRWxlbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkRWxlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgZWxlbS5oaWRkZW4gPSAhdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpIHtcclxuICAgICAgICB0b09ialt0b0tleV0gPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2Zyb21dKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMub2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IG5vdFVuZGVmaW5lZCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgb2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XHJcbiAgICAgICAgaWYgKCFleHByZXNzaW9uTmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXMuc291cmNlLCBbYmluZE5hbWVdKTtcclxuXHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2V4cHJlc3Npb25OYW1lXSk7XHJcbiAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXMsIGVsZW0pO1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ2Z1bmN0aW9uJyAmJiBleHByZXNzaW9uKC4uLnBhcmFtVmFsdWVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0b2RvIHVzZSBQYXJhbVNwbGl0dGVyIGluIG9yZGVyIHRvIHN1cHBvcnQgYXJyYXkgYW5kIG9iamVjdCBwYXJhbXRlcnNcclxuICAgIGdldFBhcmFtVmFsdWVzKHBhcmFtcywgdGhpc3MsIGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5tYXAocGFyYW0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1QYXRoID0gcGFyYW0uc3BsaXQoJy4nKTtcclxuICAgICAgICAgICAgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ3RoaXMnKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbVBhdGguc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzcywgcGFyYW1QYXRoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbVBhdGhbMF0gPT09ICdldmVudCcpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKGV2ZW50LCBwYXJhbVBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgc291cmNlVmFsdWUgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3BhcmFtXSk7XHJcbiAgICAgICAgICAgIGlmIChzb3VyY2VWYWx1ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVZhbHVlO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHBhcmFtLnJlcGxhY2UoLycvZywgJ1wiJykpO1xyXG5cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXJ0aWZhY3RzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXHJcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXHJcbiAgICAgICAgICAgIGhhbmRsZXJzOiB0aGlzLmhhbmRsZXJzLFxyXG4gICAgICAgICAgICBiaW5kczogdGhpcy5iaW5kcyxcclxuICAgICAgICAgICAgcm9vdDogdGhpcy5yb290LFxyXG4gICAgICAgICAgICBjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHMsXHJcbiAgICAgICAgICAgIGJsb2NrczogdGhpcy5ibG9ja3NcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXBsYWNlSW5saW5lQmluZGluZ3MoZWxlbSkge1xyXG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gZWxlbS5pbm5lckhUTUwucmVwbGFjZShhbGxTcGFuUmVnZXgsIChhbGwsIHByZWZpeFNsYXNoLCBtYXRjaCkgPT4gcHJlZml4U2xhc2ggPyBhbGwuc3Vic3RyKDEpIDogYDxzcGFuIGJpbmQ9XCIke21hdGNofVwiPjwvc3Bhbj5gKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IGVsZW0uaW5uZXJIVE1MLnJlcGxhY2UoYWxsU3BhbkV4cHJlc3Npb25SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZSkge1xyXG4gICAgICAgIHJldHVybiBpbmRleFRvRG90KGVsZW0uZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBiaW5kcyA9IHtcclxuLy8gICAgICdhLmIuYyc6IHtcclxuLy8gICAgICAgICBhdHRyaWJ1dGVzOiBbYXR0cmlidXRlQmluZDEsIGF0dHJpYnV0ZUJpbmQyXSxcclxuLy8gICAgICAgICBmb3JzOiBbe2NvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3N9XSxcclxuLy8gICAgICAgICBpZnM6IFtleHByZXNzaW9uQmluZDEsIGV4cHJlc3Npb25CaW5kM10sXHJcbi8vICAgICAgICAgcGFpcnM6IFt7ZnJvbSwgdG9PYmosIHRvS2V5fV0sXHJcbi8vICAgICAgICAgdmFsdWVzOiBbZXhwcmVzc2lvbkJpbmQxLCBleHByZXNzaW9uQmluZDJdXHJcbi8vICAgICB9XHJcbi8vIH07XHJcbi8vXHJcbi8vIHNvdXJjZSA9IHtcclxuLy8gICAgIGE6IHtcclxuLy8gICAgICAgICBiOiB7XHJcbi8vICAgICAgICAgICAgIGM6IHt9XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBoYW5kbGVycyA9IHtcclxuLy8gICAgIGE6IHtcclxuLy8gICAgICAgICBfZnVuY186ICdmdW5jJyxcclxuLy8gICAgICAgICBiOiB7XHJcbi8vICAgICAgICAgICAgIGM6IHtcclxuLy8gICAgICAgICAgICAgICAgIF9mdW5jXzogJ2Z1bmMnXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vIH07XHJcbi8vXHJcbi8vIGNvbXBvbmVudHMgPSB7XHJcbi8vICAgICBhOiB7XHJcbi8vICAgICAgICAgb3V0ZXJFbGVtOiBvdXRlckVsZW0sXHJcbi8vICAgICAgICAgcGFyYW1zOiBbXVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBhdHRyaWJ1dGVCaW5kID0ge1xyXG4vLyAgICAgZWxlbTogZWxlbTEsXHJcbi8vICAgICBhdHRyaWJ1dGVOYW1lLFxyXG4vLyAgICAgZnVuY3Rpb25OYW1lLCAvLyBjYW4gYmUgbnVsbFxyXG4vLyAgICAgcGFyYW1zOiBbe3N0cmluZ1ZhbHVlIHwgc291cmNlVmFsdWU6IHN0cmluZ31dLCAvLyBmb3IgbnVsbCBmdW5jdGlvbk5hbWVcclxuLy8gICAgIHBhcmFtczogW10gLy8gZm9yIG5vdCBudWxsIGZ1bmN0aW9uTmFtZVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBleHByZXNzaW9uQmluZCA9IHtcclxuLy8gICAgIGVsZW06IGVsZW0xLFxyXG4vLyAgICAgZXhwcmVzc2lvbk5hbWUsIC8vIGNhbiBiZSBudWxsXHJcbi8vICAgICBwYXJhbXM6IFtdLFxyXG4vLyAgICAgYmluZE5hbWUgLy8gY2FuIGJlIG51bGxcclxuLy8gfTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSHRtbEJpbmRlcjtcclxuIiwiY29uc3QgQm9vdGVyID0gcmVxdWlyZSgnLi9ib290ZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4gbmV3IEJvb3RlcigpO1xyXG5cclxuLy8gdG9kb1xyXG4vLyBhbGxvdyBhcnJheSBiaW5kaW5nIGluIGh0bWw6IGA8ZGl2IGJpbmQ9XCJ4W3ldXCI+PC9kaXY+YFxyXG4vLyBjbGVhbiB1cCBwYWNrYWdlLmpzb25cclxuLy8gJHN7eH0gc3ludGF4IHRvIG9ubHkgYWZmZWN0IGlubmVyIHRleHQgYW5kIG5vdCBhdHRyaWJ1dGVzXHJcbi8vIGFsbG93IGRlZmluaW5nIGFuZCB1c2luZyBjb21wb25lbnRzIGluIGFueSBvcmRlclxyXG4vLyBhbGxvdyB1c2luZyBleHByZXNzaW9ucyBmb3IgbW9yZSBiaW5kcyB0aGFuIGp1c3QgaWZzIGFuZCB2YWx1ZXMgKGUuZy4gYXR0cmlidXRlcywgZm9ycywgYXMsIHVzZSlcclxuLy8gc3VwcG9ydCAkZSBuZXN0ZWQgaW5zaWRlICRzXHJcbi8vIGludmVzdGlnYXRlIHdoeSBzb3VyY2UuYSA9IHNvdXJjZS5iIGRvZXNuJ3QgcHJvcG9nYXRlIGNoYW5nZXNcclxuLy8gaW52ZXN0aWdhdGUgd2h5IGJpbmQtZm9yIGluZGV4VmFycyBkb24ndCBwcm9wb2dhdGUgY2hhbmdlc1xyXG4vLyByb3V0aW5nIG9yIHN3YXBwaW5nIHN0YXRlc1xyXG4iLCJsZXQgZ2V0UHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xyXG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhwYXRocyk7XHJcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xyXG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSB8fCB7fSk7XHJcbiAgICByZXR1cm4gW29iaiwgbGFzdEZpZWxkXTtcclxufTtcclxuXHJcbmxldCBnZXRWYWx1ZSA9IChvYmosIHBhdGhzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydHkgPSBnZXRQcm9wZXJ0eShvYmosIHBhdGhzKTtcclxuICAgIHJldHVybiBwcm9wZXJ0eVsxXSA9PT0gdW5kZWZpbmVkID8gcHJvcGVydHlbMF0gOiBwcm9wZXJ0eVswXVtwcm9wZXJ0eVsxXV07XHJcbn07XHJcblxyXG5sZXQgY3JlYXRlUHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xyXG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhwYXRocyk7XHJcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xyXG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSA9IG9ialtmaWVsZF0gfHwge30pO1xyXG4gICAgcmV0dXJuIFtvYmosIGxhc3RGaWVsZF07XHJcbn07XHJcblxyXG5sZXQgc2V0UHJvcGVydHkgPSAob2JqLCBwYXRocywgdmFsdWUpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0eSA9IGNyZWF0ZVByb3BlcnR5KG9iaiwgcGF0aHMpO1xyXG4gICAgcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dID0gdmFsdWU7XHJcbn07XHJcblxyXG5sZXQgY2xvbmUgPSBvcmlnaW5hbCA9PiB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgb3JpZ2luYWwpO1xyXG59O1xyXG5cclxubGV0IHRyYW5zbGF0ZSA9IChuYW1lLCBsaW5rcykgPT4ge1xyXG4gICAgbGV0IG9jY3VycmVkID0gW107XHJcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKFtuYW1lXSk7XHJcbiAgICB3aGlsZSAoZmllbGRzWzBdIGluIGxpbmtzKSB7XHJcbiAgICAgICAgb2NjdXJyZWQucHVzaChmaWVsZHNbMF0pO1xyXG4gICAgICAgIGZpZWxkc1swXSA9IGxpbmtzW2ZpZWxkc1swXV07XHJcbiAgICAgICAgaWYgKG9jY3VycmVkLmluY2x1ZGVzKGZpZWxkc1swXSkpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGZpZWxkcyA9IGdldEZpZWxkcyhmaWVsZHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoKGEsIGIpID0+IGAke2F9LiR7Yn1gKTtcclxufTtcclxuXHJcbmxldCBnZXRGaWVsZHMgPSBwYXRocyA9PlxyXG4gICAgcGF0aHNcclxuICAgICAgICAubWFwKHBhdGggPT4gcGF0aC5zcGxpdCgnLicpKVxyXG4gICAgICAgIC5yZWR1Y2UoKGFnZ3JlZ2F0ZSwgaXRlbSkgPT4gYWdncmVnYXRlLmNvbmNhdChpdGVtKSwgW10pO1xyXG5cclxubGV0IGluZGV4VG9Eb3QgPSBmaWVsZCA9PiBmaWVsZCAmJiBmaWVsZC5yZXBsYWNlKC9cXFsoXFx3KylcXF0vZywgKF8sIG1hdGNoKSA9PiBgLiR7bWF0Y2h9YCk7XHJcblxyXG5sZXQgbm90VW5kZWZpbmVkID0gKHZhbHVlLCB1bmRlZmluZWRWYWx1ZSA9IG51bGwpID0+XHJcbiAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB1bmRlZmluZWRWYWx1ZTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfTtcclxuIiwiY2xhc3MgUGFyYW1TcGxpdHRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcclxuICAgICAgICB0aGlzLmluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gMDtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0QnlQYXJhbXMoKSB7XHJcbiAgICAgICAgbGV0IGRlcHRoID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dEluZGV4KCkgJiYgKCF0aGlzLmF0UXVvdGUoKSB8fCB0aGlzLnNraXBRdW90ZSgpKSkge1xyXG4gICAgICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoY2hhciA9PT0gJ1snKVxyXG4gICAgICAgICAgICAgICAgZGVwdGgrKztcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJ10nKVxyXG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJywnICYmICFkZXB0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQYXJhbSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5pbmRleCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGFyYW0oKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbXM7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEluZGV4KHJlZ2V4LCBzdGFydCkgeyAvLyByZXR1cm5zIC0xIG9yIGluZGV4IG9mIG1hdGNoXHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zdHJpbmcuc3Vic3RyaW5nKHN0YXJ0KS5zZWFyY2gocmVnZXgpO1xyXG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwID8gaW5kZXggKyBzdGFydCA6IC0xO1xyXG4gICAgfTtcclxuXHJcbiAgICBuZXh0SW5kZXgoKSB7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZmluZEluZGV4KC9bLCdcIltcXF1dLywgdGhpcy5pbmRleCArIDEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBhdFF1b3RlKCkge1xyXG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XHJcbiAgICAgICAgcmV0dXJuIGNoYXIgPT09ICdcIicgfHwgY2hhciA9PT0gXCInXCI7XHJcbiAgICB9XHJcblxyXG4gICAgc2tpcFF1b3RlKCkge1xyXG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZmluZEluZGV4KGNoYXIgPT09ICdcIicgPyAvW15cXFxcXVwiLyA6IC9bXlxcXFxdJy8sIHRoaXMuaW5kZXggKyAxKSArIDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGFyYW0oKSB7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMucHVzaCh0aGlzLnN0cmluZy5zdWJzdHJpbmcodGhpcy5zdGFydEluZGV4LCB0aGlzLmluZGV4ID4gMCA/IHRoaXMuaW5kZXggOiB0aGlzLnN0cmluZy5sZW5ndGgpLnRyaW0oKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nID0+IG5ldyBQYXJhbVNwbGl0dGVyKHN0cmluZykuc3BsaXRCeVBhcmFtcygpO1xyXG4iLCIvLyAoW1xcdy5bXFxdXSspXHJcblxyXG5sZXQgc3BhblJlZ2V4ID0gLyhcXFxcKT9cXCRzeyhbXFx3LltcXF1dKyl9LztcclxubGV0IGFsbFNwYW5SZWdleCA9IG5ldyBSZWdFeHAoc3BhblJlZ2V4LCAnZycpO1xyXG5sZXQgc3BhbkV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdIT0+PHwmXStcXCguKlxcKSl9LztcclxubGV0IGFsbFNwYW5FeHByZXNzaW9uUmVnZXggPSBuZXcgUmVnRXhwKHNwYW5FeHByZXNzaW9uUmVnZXgsICdnJyk7XHJcblxyXG5sZXQgYmluZFJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKX0vO1xyXG5sZXQgYmluZFJlZ2V4VW5jYXB0dXJpbmcgPSAvKCg/OlxcXFwpP1xcJHsoPzpbXFx3LltcXF1dKyl9KS87XHJcblxyXG5sZXQgZnVuY3Rpb25SZWdleCA9IC8oXFxcXCk/XFwkeyhbXFx3LltcXF1dKylcXCgoLiopXFwpfS87XHJcblxyXG5sZXQgZXhwcmVzc2lvblJlZ2V4ID0gLyhcXFxcKT8oW1xcdy5bXFxdIT0+PHwmXSspXFwoKC4qKVxcKS87XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH07XHJcbiIsImxldCBjcmVhdGVTb3VyY2UgPSAoKSA9PiB7XHJcbiAgICBsZXQgaGFuZGxlcnMgPSB7fTtcclxuICAgIGxldCBvcmlnaW4gPSB7fTtcclxuICAgIGxldCBzb3VyY2UgPSBjcmVhdGVQcm94eShvcmlnaW4sIGhhbmRsZXJzKTtcclxuICAgIHNldERlZmF1bHRTb3VyY2Uob3JpZ2luKTtcclxuICAgIHJldHVybiB7b3JpZ2luLCBzb3VyY2UsIGhhbmRsZXJzfTtcclxufTtcclxuXHJcbmxldCBpZ25vcmUgPSBbXTtcclxuXHJcbmxldCBpc0JpbmRJZ25vcmVkID0gKG9iaiwgcHJvcCkgPT4gb2JqLl9fYmluZElnbm9yZV9fICYmIG9iai5fX2JpbmRJZ25vcmVfXy5pbmNsdWRlcyhwcm9wKTtcclxuXHJcbi8vIHRvZG8gbWFrZSBfX2JpbmRBdm9pZEN5Y2xlc19fIGluaGVyaXRlZCBhbmQgbWF5YmUgYXZvaWQgcGVyIGJpbmRpbmcgaW5zdGVhZCBwZXIgY2hhbmdlXHJcbmxldCBpc0lnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBpc0JpbmRJZ25vcmVkKG9iaiwgcHJvcCkgfHwgKG9iai5fX2JpbmRBdm9pZEN5Y2xlc19fICYmIGlnbm9yZS5zb21lKGlnbm9yZSA9PiBpZ25vcmUub2JqID09PSBvYmogJiYgaWdub3JlLnByb3AgPT09IHByb3ApKTtcclxuXHJcbmxldCBoYW5kbGVTZXQgPSAob2JqLCBwcm9wLCBoYW5kbGVycywgYWNjdW11bGF0ZWRIYW5kbGVycykgPT4ge1xyXG4gICAgaWdub3JlLnB1c2goe29iaiwgcHJvcH0pO1xyXG4gICAgYWNjdW11bGF0ZWRIYW5kbGVycy5mb3JFYWNoKGRvSGFuZGxlcik7XHJcbiAgICBoYW5kbGVycyAmJiBwcm9wb2dhdGVIYW5kbGVyRG93bihoYW5kbGVycyk7XHJcbiAgICBpZ25vcmUucG9wKCk7XHJcbn07XHJcblxyXG5sZXQgY3JlYXRlUHJveHkgPSAob2JqLCBoYW5kbGVycyA9IHt9LCBhY2N1bXVsYXRlZEhhbmRsZXJzID0gW10pID0+IG5ldyBQcm94eShvYmosIHtcclxuICAgIGdldDogKHRhcmdldCwgcHJvcCkgPT4ge1xyXG4gICAgICAgIGxldCBnb3QgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3ApO1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZ290ID09PSAnb2JqZWN0JyAmJiBnb3QgJiYgIWlzQmluZElnbm9yZWQob2JqLCBwcm9wKSA/IGNyZWF0ZVByb3h5KGdvdCwgaGFuZGxlcnNbcHJvcF0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSkgOiBnb3Q7XHJcbiAgICB9LFxyXG4gICAgc2V0OiAodGFyZ2V0LCBwcm9wLCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpO1xyXG4gICAgICAgICFpc0lnbm9yZWQob2JqLCBwcm9wKSAmJiBoYW5kbGVTZXQob2JqLCBwcm9wLCBoYW5kbGVyc1twcm9wXSwgYWNjdW11bGF0ZWRIYW5kbGVycy5jb25jYXQoaGFuZGxlcnMpKTsgLy8gdG9kbyB3cmFwIGhhbmRsZXJzIGFuZCBhY2N1bXVsYXRlZEhhbmRsZXJzIGluIGNsYXNzIHdpdGggcG9wUHJvcCBtZXRob2RcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufSk7XHJcblxyXG5sZXQgcHJvcG9nYXRlSGFuZGxlckRvd24gPSBoYW5kbGVycyA9PiB7XHJcbiAgICBkb0hhbmRsZXIoaGFuZGxlcnMpO1xyXG4gICAgT2JqZWN0LmVudHJpZXMoaGFuZGxlcnMpXHJcbiAgICAgICAgLmZpbHRlcigoW2tleV0pID0+IGtleSAhPT0gJ19mdW5jXycpXHJcbiAgICAgICAgLmZvckVhY2goKFssIGhhbmRsZXJdKSA9PiBwcm9wb2dhdGVIYW5kbGVyRG93bihoYW5kbGVyKSk7XHJcbn07XHJcblxyXG5sZXQgZG9IYW5kbGVyID0gaGFuZGxlciA9PiB0eXBlb2YgaGFuZGxlci5fZnVuY18gPT09ICdmdW5jdGlvbicgJiYgaGFuZGxlci5fZnVuY18oKTtcclxuXHJcbmxldCBzZXREZWZhdWx0U291cmNlID0gc291cmNlID0+IHtcclxuICAgIHNvdXJjZS5fbnVtYmVyc18gPSBuZXcgUHJveHkoe30sIHtcclxuICAgICAgICBnZXQ6IChfLCBwcm9wKSA9PiBwYXJzZUludChwcm9wKSxcclxuICAgICAgICBzZXQ6ICgpID0+IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIHNvdXJjZS5ub3QgPSBhID0+ICFhO1xyXG4gICAgc291cmNlWychJ10gPSBhID0+ICFhO1xyXG4gICAgc291cmNlLmVxID0gKGEsIGIpID0+IGEgPT09IGI7XHJcbiAgICBzb3VyY2UuZXF1YWwgPSAoYSwgYikgPT4gYSA9PT0gYjtcclxuICAgIHNvdXJjZVsnPSddID0gKGEsIGIpID0+IGEgPT09IGI7XHJcbiAgICBzb3VyY2UubkVxID0gKGEsIGIpID0+IGEgIT09IGI7XHJcbiAgICBzb3VyY2Uubm90RXF1YWwgPSAoYSwgYikgPT4gYSAhPT0gYjtcclxuICAgIHNvdXJjZVsnIT0nXSA9IChhLCBiKSA9PiBhICE9PSBiO1xyXG4gICAgc291cmNlLmdyZWF0ZXIgPSAoYSwgYikgPT4gYSA+IGI7XHJcbiAgICBzb3VyY2VbJz4nXSA9IChhLCBiKSA9PiBhID4gYjtcclxuICAgIHNvdXJjZS5sZXNzID0gKGEsIGIpID0+IGEgPCBiO1xyXG4gICAgc291cmNlWyc8J10gPSAoYSwgYikgPT4gYSA8IGI7XHJcbiAgICBzb3VyY2UuZ3JlYXRlckVxID0gKGEsIGIpID0+IGEgPj0gYjtcclxuICAgIHNvdXJjZVsnPj0nXSA9IChhLCBiKSA9PiBhID49IGI7XHJcbiAgICBzb3VyY2UubGVzc0VxID0gKGEsIGIpID0+IGEgPD0gYjtcclxuICAgIHNvdXJjZVsnPD0nXSA9IChhLCBiKSA9PiBhIDw9IGI7XHJcbiAgICBzb3VyY2Uub3IgPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcclxuICAgIHNvdXJjZVsnfCddID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XHJcbiAgICBzb3VyY2VbJ3x8J10gPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcclxuICAgIHNvdXJjZS5hbmQgPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XHJcbiAgICBzb3VyY2VbJyYnXSA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcclxuICAgIHNvdXJjZVsnJiYnXSA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZVNvdXJjZX07XHJcbiIsImxldCBzcGxpdEJ5V29yZCA9IChzdHJpbmcsIHdvcmQpID0+XHJcbiAgICBzdHJpbmcuc3BsaXQobmV3IFJlZ0V4cChgXFxcXHMrJHt3b3JkfVxcXFxzK2ApKTtcclxuXHJcbmxldCBzcGxpdEJ5Q29tbWEgPSBzdHJpbmcgPT5cclxuICAgIHN0cmluZy5zcGxpdCgvXFxzKixcXHMqLyk7XHJcblxyXG5sZXQgc3BsaXRCeVNwYWNlID0gc3RyaW5nID0+XHJcbiAgICBzdHJpbmcuc3BsaXQoL1xccysvKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX07XHJcbiJdfQ==
