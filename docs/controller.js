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
        let artifacts = new HtmlBinder(root, this.blocks);
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
        this.binds = {};
        let {origin, source, handlers} = createSource();
        this.source = source;
        this.handlers = handlers;
        this.components = {};
        this.root = root;
        HtmlBinder.replaceInlineBindings(root);
        this.blocks = blocks;
        this.bindElem(root, {});
        return {origin, source, binds: this.binds, handlers, components: this.components};
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
            let bindBlock = HtmlBinder.getBindAttribute(elem, 'bind-block');
            let bindComponent = HtmlBinder.getBindAttribute(elem, 'bind-component');
            let bindUse = HtmlBinder.getBindAttribute(elem, 'bind-use');
            let bindAs = HtmlBinder.getBindAttribute(elem, 'bind-as');
            let bindFor = HtmlBinder.getBindAttribute(elem, 'bind-for');
            let bindIf = HtmlBinder.getBindAttribute(elem, 'bind-if');
            let bindValue = HtmlBinder.getBindAttribute(elem, 'bind');

            if (bindElem) {
                setProperty(this.source, [bindElem], elem);
                this.source.__bindIgnore__ = this.source.__bindIgnore__ || [];
                this.source.__bindIgnore__.push(bindElem);
            }

            if (bindBlock) {
                skip = true;
                let {template, controller} = this.blocks[bindBlock];
                let container = document.createElement('block-parent');
                container.innerHTML = template;
                elem.replaceWith(container);
                controller(new HtmlBinder(container, this.blocks).source);
                // todo debugger for block bindings

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

            bind.fors.forEach(({container, outerElem, sourceTo, sourceFrom, sourceLinks}) => {
                this.applyBindFor(container, outerElem, sourceTo, sourceFrom, sourceLinks);
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
//         fors: [{container, outerElem, sourceTo, sourceFrom, sourceLinks}],
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
// investigate how to set setters on non-source object assignments
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2NvbnRyb2xsZXIuanMiLCJzcmMvYm9vdGVyLmpzIiwic3JjL2h0bWxCaW5kZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvb2JqU2NhZm9sZGluZy5qcyIsInNyYy9wYXJhbVNwbGl0dGVyLmpzIiwic3JjL3JlZ2V4LmpzIiwic3JjL3NvdXJjZS5qcyIsInNyYy9zdHJpbmdTcGxpdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBzb3VyY2UgPSByZXF1aXJlKCdiYi1iZXR0ZXItYmluZGluZycpKCkuYm9vdChkb2N1bWVudC5maXJzdEVsZW1lbnRDaGlsZCwgd2luZG93KTtcclxuXHJcbi8vIGdyZWV0aW5nXHJcbnNvdXJjZS5sYXJnZUZvbnQgPSA2MDtcclxuc291cmNlLmZhdm9yaXRlQ29sb3IgPSAnREVFUHBpbmsnO1xyXG5zb3VyY2UuZ3JlZXRpbmcgPSAnSSBoYXRlIHlvdSc7XHJcbnNvdXJjZS5uYW1lID0gJ1dvcmxkJztcclxuc291cmNlLmV4Y2xhbWF0aW9uID0gJyjila/CsOKWocKw77yJ4pWv77i1IOKUu+KUgeKUuyc7XHJcbnNvdXJjZS5jaGFuZ2VDb2xvciA9IGlucHV0ID0+IHtcclxuICAgIHNvdXJjZS5mYXZvcml0ZUNvbG9yID0gaW5wdXQudmFsdWU7XHJcbn07XHJcblxyXG4vLyBhbmltYXRpb25cclxubGV0IGFuaW1hdGlvbnMgPSBbXHJcbiAgICAnaHR0cDovL3d3dy5xcXByLmNvbS9hc2NpaS9pbWcvYXNjaWktMTA0My5naWYnLFxyXG4gICAgJ2h0dHBzOi8vbWVkaWEwLmdpcGh5LmNvbS9tZWRpYS8xMkVrSkNicGEzaEdLYy9naXBoeS5naWYnLFxyXG4gICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwMDYuZ2lmJ107XHJcbmxldCBhbmltYXRpb25JbmRleCA9IC0xO1xyXG5zb3VyY2UuY2hhbmdlQW5pbWF0aW9uID0gKCkgPT4ge1xyXG4gICAgYW5pbWF0aW9uSW5kZXggPSAoYW5pbWF0aW9uSW5kZXggKyAxKSAlIGFuaW1hdGlvbnMubGVuZ3RoO1xyXG4gICAgc291cmNlLmFuaW1hdGlvbiA9IGFuaW1hdGlvbnNbYW5pbWF0aW9uSW5kZXhdO1xyXG59O1xyXG5zb3VyY2UuY2hhbmdlQW5pbWF0aW9uKCk7XHJcblxyXG4vLyBqb2tlc1xyXG5zb3VyY2Uuc2V0Sm9rZVZpc2liaWxpdHkgPSBjaGVja2JveCA9PiB7XHJcbiAgICBzb3VyY2Uuam9rZVZpc2liaWxpdHkgPSBjaGVja2JveC5jaGVja2VkO1xyXG59O1xyXG5zb3VyY2Uuam9rZXMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkxlZnQgaW5zaWRlIG1haW4gdGlyZSBhbG1vc3QgbmVlZHMgcmVwbGFjZW1lbnQuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiQWxtb3N0IHJlcGxhY2VkIGxlZnQgaW5zaWRlIG1haW4gdGlyZS5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIlRlc3QgZmxpZ2h0IE9LLCBleGNlcHQgYXV0b2xhbmQgdmVyeSByb3VnaC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJBdXRvbGFuZCBub3QgaW5zdGFsbGVkIG9uIHRoaXMgYWlyY3JhZnQuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtICMxOiAgXCIjMiBQcm9wZWxsZXIgc2VlcGluZyBwcm9wIGZsdWlkLlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uICMxOiBcIiMyIFByb3BlbGxlciBzZWVwYWdlIG5vcm1hbC5cIicsXHJcbiAgICAgICAgICAgICdQcm9ibGVtICMyOiAgXCIjMSwgIzMsIGFuZCAjNCBwcm9wZWxsZXJzIGxhY2sgbm9ybWFsIHNlZXBhZ2UuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgICBcIlRoZSBhdXRvcGlsb3QgZG9lc25cXCd0LlwiJyxcclxuICAgICAgICAgICAgJ1NpZ25lZCBvZmY6IFwiSVQgRE9FUyBOT1cuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJTb21ldGhpbmcgbG9vc2UgaW4gY29ja3BpdC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJTb21ldGhpbmcgdGlnaHRlbmVkIGluIGNvY2twaXQuXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSwge1xyXG4gICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJFdmlkZW5jZSBvZiBoeWRyYXVsaWMgbGVhayBvbiByaWdodCBtYWluIGxhbmRpbmcgZ2Vhci5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJFdmlkZW5jZSByZW1vdmVkLlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiRE1FIHZvbHVtZSB1bmJlbGlldmFibHkgbG91ZC5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJWb2x1bWUgc2V0IHRvIG1vcmUgYmVsaWV2YWJsZSBsZXZlbC5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRlYWQgYnVncyBvbiB3aW5kc2hpZWxkLlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkxpdmUgYnVncyBvbiBvcmRlci5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkF1dG9waWxvdCBpbiBhbHRpdHVkZSBob2xkIG1vZGUgcHJvZHVjZXMgYSAyMDAgZnBtIGRlc2NlbnQuXCInLFxyXG4gICAgICAgICAgICAnU29sdXRpb246IFwiQ2Fubm90IHJlcHJvZHVjZSBwcm9ibGVtIG9uIGdyb3VuZC5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIklGRiBpbm9wZXJhdGl2ZS5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJJRkYgYWx3YXlzIGlub3BlcmF0aXZlIGluIE9GRiBtb2RlLlwiJ1xyXG4gICAgICAgIF1cclxuICAgIH0sIHtcclxuICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiRnJpY3Rpb24gbG9ja3MgY2F1c2UgdGhyb3R0bGUgbGV2ZXJzIHRvIHN0aWNrLlwiJyxcclxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlRoYXRcXCdzIHdoYXQgdGhleVxcJ3JlIHRoZXJlIGZvci5cIidcclxuICAgICAgICBdXHJcbiAgICB9LCB7XHJcbiAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIk51bWJlciB0aHJlZSBlbmdpbmUgbWlzc2luZy5cIicsXHJcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJFbmdpbmUgZm91bmQgb24gcmlnaHQgd2luZyBhZnRlciBicmllZiBzZWFyY2guXCInXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuXTtcclxuc291cmNlLmpva2VzU291cmNlID0gJ2h0dHBzOi8vd3d3Lm5ldGZ1bm55LmNvbS9yaGYvam9rZXMvOTcvSnVuL3VzYWYuaHRtbCc7XHJcbiIsImNvbnN0IEh0bWxCaW5kZXIgPSByZXF1aXJlKCcuL2h0bWxCaW5kZXInKTtcclxuXHJcbmNsYXNzIEJvb3RlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBkZWNsYXJlQmxvY2soYmxvY2tOYW1lLCBibG9jaykge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzW2Jsb2NrTmFtZV0gPSBibG9jaztcclxuICAgIH1cclxuXHJcbiAgICBib290KHJvb3QsIGRlYnVnKSB7XHJcbiAgICAgICAgbGV0IGFydGlmYWN0cyA9IG5ldyBIdG1sQmluZGVyKHJvb3QsIHRoaXMuYmxvY2tzKTtcclxuICAgICAgICBkZWJ1ZyAmJiBPYmplY3QuYXNzaWduKGRlYnVnLCBhcnRpZmFjdHMpO1xyXG4gICAgICAgIHJldHVybiBhcnRpZmFjdHMuc291cmNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RlcjtcclxuIiwiY29uc3Qge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfSA9IHJlcXVpcmUoJy4vb2JqU2NhZm9sZGluZycpO1xyXG5jb25zdCB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfSA9IHJlcXVpcmUoJy4vc3RyaW5nU3BsaXR0ZXInKTtcclxuY29uc3Qgc3BsaXRCeVBhcmFtcyA9IHJlcXVpcmUoJy4vcGFyYW1TcGxpdHRlcicpO1xyXG5jb25zdCB7Y3JlYXRlU291cmNlfSA9IHJlcXVpcmUoJy4vc291cmNlJyk7XHJcbmNvbnN0IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH0gPSByZXF1aXJlKCcuL3JlZ2V4Jyk7XHJcblxyXG5jbGFzcyBIdG1sQmluZGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb290LCBibG9ja3MpIHtcclxuICAgICAgICB0aGlzLmJpbmRzID0ge307XHJcbiAgICAgICAgbGV0IHtvcmlnaW4sIHNvdXJjZSwgaGFuZGxlcnN9ID0gY3JlYXRlU291cmNlKCk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgSHRtbEJpbmRlci5yZXBsYWNlSW5saW5lQmluZGluZ3Mocm9vdCk7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XHJcbiAgICAgICAgdGhpcy5iaW5kRWxlbShyb290LCB7fSk7XHJcbiAgICAgICAgcmV0dXJuIHtvcmlnaW4sIHNvdXJjZSwgYmluZHM6IHRoaXMuYmluZHMsIGhhbmRsZXJzLCBjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHN9O1xyXG4gICAgfVxyXG5cclxuICAgIGJpbmRFbGVtKGVsZW0sIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHNraXAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gZWxlbS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB7bmFtZTogYXR0cmlidXRlTmFtZSwgdmFsdWV9ID0gYXR0cmlidXRlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubWF0Y2goYmluZFJlZ2V4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtwYXJhbXN9ID0gYXR0cmlidXRlQmluZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtmdW5jdGlvbk5hbWUsIHBhcmFtc30gPSBhdHRyaWJ1dGVCaW5kO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYmluZEVsZW0gPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZWxlbScpO1xyXG4gICAgICAgICAgICBsZXQgYmluZEJsb2NrID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWJsb2NrJyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kQ29tcG9uZW50ID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWNvbXBvbmVudCcpO1xyXG4gICAgICAgICAgICBsZXQgYmluZFVzZSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC11c2UnKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRBcyA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1hcycpO1xyXG4gICAgICAgICAgICBsZXQgYmluZEZvciA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1mb3InKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRJZiA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1pZicpO1xyXG4gICAgICAgICAgICBsZXQgYmluZFZhbHVlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYmluZEVsZW0pIHtcclxuICAgICAgICAgICAgICAgIHNldFByb3BlcnR5KHRoaXMuc291cmNlLCBbYmluZEVsZW1dLCBlbGVtKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fID0gdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18gfHwgW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXy5wdXNoKGJpbmRFbGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGJpbmRCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBsZXQge3RlbXBsYXRlLCBjb250cm9sbGVyfSA9IHRoaXMuYmxvY2tzW2JpbmRCbG9ja107XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYmxvY2stcGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlcGxhY2VXaXRoKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyKG5ldyBIdG1sQmluZGVyKGNvbnRhaW5lciwgdGhpcy5ibG9ja3MpLnNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvIGRlYnVnZ2VyIGZvciBibG9jayBiaW5kaW5nc1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBbY29tcG9uZW50TmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmluZENvbXBvbmVudCwgJ3dpdGgnKTtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5U3BhY2UocGFyYW1zR3JvdXApO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWNvbXBvbmVudCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdID0ge291dGVyRWxlbTogZWxlbSwgcGFyYW1zfTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZEZvcikge1xyXG4gICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgW3NvdXJjZVRvLCBiaW5kTmFtZV0gPSBzcGxpdEJ5V29yZChiaW5kRm9yLCAnaW4nKTtcclxuICAgICAgICAgICAgICAgIGJpbmROYW1lID0gdHJhbnNsYXRlKGJpbmROYW1lLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9yLXBhcmVudCcpO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5yZXBsYWNlV2l0aChjb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtZm9yJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uZm9ycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJFbGVtOiBlbGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVRvLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUZyb206IGJpbmROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgZWxlbSwgc291cmNlVG8sIGJpbmROYW1lLCBzb3VyY2VMaW5rcyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRVc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRVc2UsICd3aXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtc0lucHV0ID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQge291dGVyRWxlbSwgcGFyYW1zfSA9IHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50RWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGNvbXBvbmVudEVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NbdG9dID0gdHJhbnNsYXRlKHBhcmFtc0lucHV0W2luZGV4XSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiaW5kQXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgICAgICBzcGxpdEJ5Q29tbWEoYmluZEFzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGFzID0+IHNwbGl0QnlXb3JkKGFzLCAnYXMnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKFtmcm9tLCB0b10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3RvXSA9IHRyYW5zbGF0ZShmcm9tLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiaW5kSWYpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQge2V4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSA9IHRoaXMuZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGJpbmRJZiwgJ2lmcycsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZElmKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kVmFsdWUsICd2YWx1ZXMnLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc2tpcClcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGVsZW0uY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGVsZW0uY2hpbGRyZW5baV0sIHNvdXJjZUxpbmtzKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVCaW5kKGJpbmROYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYmluZHNbYmluZE5hbWVdKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBiaW5kID0ge2lmczogW10sIGZvcnM6IFtdLCB2YWx1ZXM6IFtdLCBhdHRyaWJ1dGVzOiBbXX07XHJcbiAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0gPSBiaW5kO1xyXG5cclxuICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLmhhbmRsZXJzLCBbYmluZE5hbWUsICdfZnVuY18nXSwgKCkgPT4ge1xyXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMgPSBiaW5kLmF0dHJpYnV0ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcbiAgICAgICAgICAgIGJpbmQuZm9ycyA9IGJpbmQuZm9ycy5maWx0ZXIoKHtjb250YWluZXJ9KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoY29udGFpbmVyKSk7XHJcbiAgICAgICAgICAgIGJpbmQuaWZzID0gYmluZC5pZnMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcbiAgICAgICAgICAgIGJpbmQudmFsdWVzID0gYmluZC52YWx1ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcblxyXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoe2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lID8gdGhpcy5hcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykgOiB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQuZm9ycy5mb3JFYWNoKCh7Y29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rc30pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQuaWZzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQudmFsdWVzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgZXhwcmVzc2lvblN0ciwgdHlwZSwgc291cmNlTGlua3MpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnXHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb25NYXRjaCA9IGV4cHJlc3Npb25TdHIubWF0Y2goZXhwcmVzc2lvblJlZ2V4KTtcclxuICAgICAgICBpZiAoZXhwcmVzc2lvbk1hdGNoKSB7XHJcbiAgICAgICAgICAgIGxldCBbLCAsIGV4cHJlc3Npb25OYW1lLCBwYXJhbXNTdHJdID0gZXhwcmVzc2lvbk1hdGNoO1xyXG4gICAgICAgICAgICBleHByZXNzaW9uTmFtZSA9IHRyYW5zbGF0ZShleHByZXNzaW9uTmFtZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpO1xyXG4gICAgICAgICAgICBsZXQgYmluZFBhcmFtcyA9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbVswXSAhPT0gJ18nKVxyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiBwYXJhbVswXSA9PT0gJ18nID8gcGFyYW0uc3Vic3RyKDEpIDogcGFyYW0pXHJcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcclxuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zfTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChleHByZXNzaW9uTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAgICAgYmluZFBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGFyYW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQocGFyYW0sIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGJpbmROYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25TdHIsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBiaW5kTmFtZX07XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZEF0dHJpYnV0ZUJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHZhbHVlLnNwbGl0KGJpbmRSZWdleFVuY2FwdHVyaW5nKVxyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXRjaExpc3QgPSBwYXJhbS5tYXRjaChiaW5kUmVnZXgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaExpc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdHJpbmdWYWx1ZTogcGFyYW19O1xyXG4gICAgICAgICAgICAgICAgbGV0IFthbGwsIHByZWZpeFNsYXNoLCBtYXRjaF0gPSBtYXRjaExpc3Q7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4U2xhc2ggPyB7c3RyaW5nVmFsdWU6IGFsbC5zdWJzdHIoMSl9IDoge3NvdXJjZVZhbHVlOiB0cmFuc2xhdGUobWF0Y2gsIHNvdXJjZUxpbmtzKX07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXN9O1xyXG5cclxuICAgICAgICBwYXJhbXNcclxuICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbS5zb3VyY2VWYWx1ZSlcclxuICAgICAgICAgICAgLmZvckVhY2goKHtzb3VyY2VWYWx1ZTogYmluZE5hbWV9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xyXG4gICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgZnVuY3Rpb25OYW1lLCBwYXJhbXNTdHJdID0gdmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCk7IC8vIHRvZG8gcHJlZml4U2xhc2hcclxuICAgICAgICBmdW5jdGlvbk5hbWUgPSB0cmFuc2xhdGUoZnVuY3Rpb25OYW1lLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlQYXJhbXMocGFyYW1zU3RyKVxyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcclxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtc307XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmdW5jdGlvbk5hbWUpO1xyXG4gICAgICAgIHRoaXMuYmluZHNbZnVuY3Rpb25OYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XHJcblxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICAgICAgICAuZm9yRWFjaChiaW5kTmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICAgICAgLy8gdG9kbyBwcmV2ZW50IGJpbmRpbmcgbm9uIHNvdXJjZSB2YWx1ZXNcclxuICAgIH1cclxuXHJcbiAgICBhZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKSB7IC8vIHR5cGUgPSAnaWZzJyBvciAndmFsdWVzJ1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XHJcbiAgICAgICAgbGV0IGJpbmRlZCA9IHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnNvbWUob3RoZXJCaW5kID0+XHJcbiAgICAgICAgICAgIG90aGVyQmluZC5lbGVtID09PSBlbGVtXHJcbiAgICAgICAgKTtcclxuICAgICAgICAhYmluZGVkICYmIHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnB1c2goZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICBsZXQgbW9kaWZpZWRWYWx1ZSA9IHBhcmFtc1xyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlID8gbm90VW5kZWZpbmVkKGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW0uc291cmNlVmFsdWVdKSwgJycpIDogcGFyYW0uc3RyaW5nVmFsdWUpXHJcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBtb2RpZmllZFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIGxldCBoYW5kbGVyID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtmdW5jdGlvbk5hbWVdKTtcclxuICAgICAgICBlbGVtW2F0dHJpYnV0ZU5hbWVdID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KGVsZW0sIHBhcmFtVmFsdWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtzb3VyY2VGcm9tXSk7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPiB2YWx1ZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3NvdXJjZVRvXSA9IGAke3NvdXJjZUZyb219LiR7aW5kZXh9YDtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzLmluZGV4ID0gYF9udW1iZXJzXy4ke2luZGV4fWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGNoaWxkRWxlbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkRWxlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgZWxlbS5oaWRkZW4gPSAhdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBub3RVbmRlZmluZWQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIG9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xyXG4gICAgICAgIGlmICghZXhwcmVzc2lvbk5hbWUpXHJcbiAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2JpbmROYW1lXSk7XHJcblxyXG4gICAgICAgIGxldCBleHByZXNzaW9uID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtleHByZXNzaW9uTmFtZV0pO1xyXG4gICAgICAgIGxldCBwYXJhbVZhbHVlcyA9IHRoaXMuZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCBlbGVtKTtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicgJiYgZXhwcmVzc2lvbiguLi5wYXJhbVZhbHVlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCB0aGlzcywgZXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gcGFyYW1zLm1hcChwYXJhbSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYXJhbVBhdGggPSBwYXJhbS5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICBpZiAocGFyYW1QYXRoWzBdID09PSAndGhpcycpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXNzLCBwYXJhbVBhdGgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ2V2ZW50Jykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1QYXRoLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUoZXZlbnQsIHBhcmFtUGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBzb3VyY2VWYWx1ZSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW1dKTtcclxuICAgICAgICAgICAgaWYgKHNvdXJjZVZhbHVlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlVmFsdWU7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocGFyYW0ucmVwbGFjZSgvJy9nLCAnXCInKSk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVwbGFjZUlubGluZUJpbmRpbmdzKGVsZW0pIHtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IGVsZW0uaW5uZXJIVE1MLnJlcGxhY2UoYWxsU3BhblJlZ2V4LCAoYWxsLCBwcmVmaXhTbGFzaCwgbWF0Y2gpID0+IHByZWZpeFNsYXNoID8gYWxsLnN1YnN0cigxKSA6IGA8c3BhbiBiaW5kPVwiJHttYXRjaH1cIj48L3NwYW4+YCk7XHJcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBlbGVtLmlubmVySFRNTC5yZXBsYWNlKGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIChhbGwsIHByZWZpeFNsYXNoLCBtYXRjaCkgPT4gcHJlZml4U2xhc2ggPyBhbGwuc3Vic3RyKDEpIDogYDxzcGFuIGJpbmQ9XCIke21hdGNofVwiPjwvc3Bhbj5gKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGUpIHtcclxuICAgICAgICByZXR1cm4gaW5kZXhUb0RvdChlbGVtLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gYmluZHMgPSB7XHJcbi8vICAgICAnYS5iLmMnOiB7XHJcbi8vICAgICAgICAgZm9yczogW3tjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzfV0sXHJcbi8vICAgICAgICAgaWZzOiBbZXhwcmVzc2lvbkJpbmQxLCBleHByZXNzaW9uQmluZDNdLFxyXG4vLyAgICAgICAgIHZhbHVlczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQyXSxcclxuLy8gICAgICAgICBhdHRyaWJ1dGVzOiBbYXR0cmlidXRlQmluZDEsIGF0dHJpYnV0ZUJpbmQyXVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBzb3VyY2UgPSB7XHJcbi8vICAgICBhOiB7XHJcbi8vICAgICAgICAgYjoge1xyXG4vLyAgICAgICAgICAgICBjOiB7fVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gfTtcclxuLy9cclxuLy8gaGFuZGxlcnMgPSB7XHJcbi8vICAgICBhOiB7XHJcbi8vICAgICAgICAgX2Z1bmNfOiAnZnVuYycsXHJcbi8vICAgICAgICAgYjoge1xyXG4vLyAgICAgICAgICAgICBjOiB7XHJcbi8vICAgICAgICAgICAgICAgICBfZnVuY186ICdmdW5jJ1xyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBjb21wb25lbnRzID0ge1xyXG4vLyAgICAgYToge1xyXG4vLyAgICAgICAgIG91dGVyRWxlbTogb3V0ZXJFbGVtLFxyXG4vLyAgICAgICAgIHBhcmFtczogW11cclxuLy8gICAgIH1cclxuLy8gfTtcclxuLy9cclxuLy8gYXR0cmlidXRlQmluZCA9IHtcclxuLy8gICAgIGVsZW06IGVsZW0xLFxyXG4vLyAgICAgYXR0cmlidXRlTmFtZSxcclxuLy8gICAgIGZ1bmN0aW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcclxuLy8gICAgIHBhcmFtczogW3tzdHJpbmdWYWx1ZSB8IHNvdXJjZVZhbHVlOiBzdHJpbmd9XSwgLy8gZm9yIG51bGwgZnVuY3Rpb25OYW1lXHJcbi8vICAgICBwYXJhbXM6IFtdIC8vIGZvciBub3QgbnVsbCBmdW5jdGlvbk5hbWVcclxuLy8gfTtcclxuLy9cclxuLy8gZXhwcmVzc2lvbkJpbmQgPSB7XHJcbi8vICAgICBlbGVtOiBlbGVtMSxcclxuLy8gICAgIGV4cHJlc3Npb25OYW1lLCAvLyBjYW4gYmUgbnVsbFxyXG4vLyAgICAgcGFyYW1zOiBbXSxcclxuLy8gICAgIGJpbmROYW1lIC8vIGNhbiBiZSBudWxsXHJcbi8vIH07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWxCaW5kZXI7XHJcbiIsImNvbnN0IEJvb3RlciA9IHJlcXVpcmUoJy4vYm9vdGVyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IG5ldyBCb290ZXIoKTtcclxuXHJcbi8vIHRvZG9cclxuLy8gYWxsb3cgYXJyYXkgYmluZGluZyBpbiBodG1sOiBgPGRpdiBiaW5kPVwieFt5XVwiPjwvZGl2PmBcclxuLy8gY2xlYW4gdXAgcGFja2FnZS5qc29uXHJcbi8vICRze3h9IHN5bnRheCB0byBvbmx5IGFmZmVjdCBpbm5lciB0ZXh0IGFuZCBub3QgYXR0cmlidXRlc1xyXG4vLyBhbGxvdyBkZWZpbmluZyBhbmQgdXNpbmcgY29tcG9uZW50cyBpbiBhbnkgb3JkZXJcclxuLy8gYWxsb3cgdXNpbmcgZXhwcmVzc2lvbnMgZm9yIG1vcmUgYmluZHMgdGhhbiBqdXN0IGlmcyBhbmQgdmFsdWVzIChlLmcuIGF0dHJpYnV0ZXMsIGZvcnMsIGFzLCB1c2UpXHJcbi8vIHN1cHBvcnQgJGUgbmVzdGVkIGluc2lkZSAkc1xyXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgc291cmNlLmEgPSBzb3VyY2UuYiBkb2Vzbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXHJcbi8vIGludmVzdGlnYXRlIHdoeSBiaW5kLWZvciBpbmRleFZhcnMgZG9uJ3QgcHJvcG9nYXRlIGNoYW5nZXNcclxuLy8gaW52ZXN0aWdhdGUgaG93IHRvIHNldCBzZXR0ZXJzIG9uIG5vbi1zb3VyY2Ugb2JqZWN0IGFzc2lnbm1lbnRzXHJcbi8vIHJvdXRpbmcgb3Igc3dhcHBpbmcgc3RhdGVzXHJcbiIsImxldCBnZXRQcm9wZXJ0eSA9IChvYmosIHBhdGhzKSA9PiB7XHJcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcclxuICAgIGxldCBsYXN0RmllbGQgPSBmaWVsZHMucG9wKCk7XHJcbiAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiBvYmogPSBvYmpbZmllbGRdIHx8IHt9KTtcclxuICAgIHJldHVybiBbb2JqLCBsYXN0RmllbGRdO1xyXG59O1xyXG5cclxubGV0IGdldFZhbHVlID0gKG9iaiwgcGF0aHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0eSA9IGdldFByb3BlcnR5KG9iaiwgcGF0aHMpO1xyXG4gICAgcmV0dXJuIHByb3BlcnR5WzFdID09PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVswXSA6IHByb3BlcnR5WzBdW3Byb3BlcnR5WzFdXTtcclxufTtcclxuXHJcbmxldCBjcmVhdGVQcm9wZXJ0eSA9IChvYmosIHBhdGhzKSA9PiB7XHJcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcclxuICAgIGxldCBsYXN0RmllbGQgPSBmaWVsZHMucG9wKCk7XHJcbiAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiBvYmogPSBvYmpbZmllbGRdID0gb2JqW2ZpZWxkXSB8fCB7fSk7XHJcbiAgICByZXR1cm4gW29iaiwgbGFzdEZpZWxkXTtcclxufTtcclxuXHJcbmxldCBzZXRQcm9wZXJ0eSA9IChvYmosIHBhdGhzLCB2YWx1ZSkgPT4ge1xyXG4gICAgbGV0IHByb3BlcnR5ID0gY3JlYXRlUHJvcGVydHkob2JqLCBwYXRocyk7XHJcbiAgICBwcm9wZXJ0eVswXVtwcm9wZXJ0eVsxXV0gPSB2YWx1ZTtcclxufTtcclxuXHJcbmxldCBjbG9uZSA9IG9yaWdpbmFsID0+IHtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbCk7XHJcbn07XHJcblxyXG5sZXQgdHJhbnNsYXRlID0gKG5hbWUsIGxpbmtzKSA9PiB7XHJcbiAgICBsZXQgb2NjdXJyZWQgPSBbXTtcclxuICAgIGxldCBmaWVsZHMgPSBnZXRGaWVsZHMoW25hbWVdKTtcclxuICAgIHdoaWxlIChmaWVsZHNbMF0gaW4gbGlua3MpIHtcclxuICAgICAgICBvY2N1cnJlZC5wdXNoKGZpZWxkc1swXSk7XHJcbiAgICAgICAgZmllbGRzWzBdID0gbGlua3NbZmllbGRzWzBdXTtcclxuICAgICAgICBpZiAob2NjdXJyZWQuaW5jbHVkZXMoZmllbGRzWzBdKSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZmllbGRzID0gZ2V0RmllbGRzKGZpZWxkcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmllbGRzLnJlZHVjZSgoYSwgYikgPT4gYCR7YX0uJHtifWApO1xyXG59O1xyXG5cclxubGV0IGdldEZpZWxkcyA9IHBhdGhzID0+XHJcbiAgICBwYXRoc1xyXG4gICAgICAgIC5tYXAocGF0aCA9PiBwYXRoLnNwbGl0KCcuJykpXHJcbiAgICAgICAgLnJlZHVjZSgoYWdncmVnYXRlLCBpdGVtKSA9PiBhZ2dyZWdhdGUuY29uY2F0KGl0ZW0pLCBbXSk7XHJcblxyXG5sZXQgaW5kZXhUb0RvdCA9IGZpZWxkID0+IGZpZWxkICYmIGZpZWxkLnJlcGxhY2UoL1xcWyhcXHcrKVxcXS9nLCAoXywgbWF0Y2gpID0+IGAuJHttYXRjaH1gKTtcclxuXHJcbmxldCBub3RVbmRlZmluZWQgPSAodmFsdWUsIHVuZGVmaW5lZFZhbHVlID0gbnVsbCkgPT5cclxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHVuZGVmaW5lZFZhbHVlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Z2V0VmFsdWUsIHNldFByb3BlcnR5LCBjbG9uZSwgdHJhbnNsYXRlLCBpbmRleFRvRG90LCBub3RVbmRlZmluZWR9O1xyXG4iLCJjbGFzcyBQYXJhbVNwbGl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLnN0YXJ0SW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMucGFyYW1zID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgc3BsaXRCeVBhcmFtcygpIHtcclxuICAgICAgICBsZXQgZGVwdGggPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0SW5kZXgoKSAmJiAoIXRoaXMuYXRRdW90ZSgpIHx8IHRoaXMuc2tpcFF1b3RlKCkpKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XHJcbiAgICAgICAgICAgIGlmIChjaGFyID09PSAnWycpXHJcbiAgICAgICAgICAgICAgICBkZXB0aCsrO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnXScpXHJcbiAgICAgICAgICAgICAgICBkZXB0aC0tO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnLCcgJiYgIWRlcHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0SW5kZXggPSB0aGlzLmluZGV4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hZGRQYXJhbSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW5kZXgocmVnZXgsIHN0YXJ0KSB7IC8vIHJldHVybnMgLTEgb3IgaW5kZXggb2YgbWF0Y2hcclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnN0cmluZy5zdWJzdHJpbmcoc3RhcnQpLnNlYXJjaChyZWdleCk7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgPyBpbmRleCArIHN0YXJ0IDogLTE7XHJcbiAgICB9O1xyXG5cclxuICAgIG5leHRJbmRleCgpIHtcclxuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5maW5kSW5kZXgoL1ssJ1wiW1xcXV0vLCB0aGlzLmluZGV4ICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggIT09IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGF0UXVvdGUoKSB7XHJcbiAgICAgICAgbGV0IGNoYXIgPSB0aGlzLnN0cmluZ1t0aGlzLmluZGV4XTtcclxuICAgICAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIjtcclxuICAgIH1cclxuXHJcbiAgICBza2lwUXVvdGUoKSB7XHJcbiAgICAgICAgbGV0IGNoYXIgPSB0aGlzLnN0cmluZ1t0aGlzLmluZGV4XTtcclxuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5maW5kSW5kZXgoY2hhciA9PT0gJ1wiJyA/IC9bXlxcXFxdXCIvIDogL1teXFxcXF0nLywgdGhpcy5pbmRleCArIDEpICsgMTtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXJhbSgpIHtcclxuICAgICAgICB0aGlzLnBhcmFtcy5wdXNoKHRoaXMuc3RyaW5nLnN1YnN0cmluZyh0aGlzLnN0YXJ0SW5kZXgsIHRoaXMuaW5kZXggPiAwID8gdGhpcy5pbmRleCA6IHRoaXMuc3RyaW5nLmxlbmd0aCkudHJpbSgpKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmcgPT4gbmV3IFBhcmFtU3BsaXR0ZXIoc3RyaW5nKS5zcGxpdEJ5UGFyYW1zKCk7XHJcbiIsIi8vIChbXFx3LltcXF1dKylcclxuXHJcbmxldCBzcGFuUmVnZXggPSAvKFxcXFwpP1xcJHN7KFtcXHcuW1xcXV0rKX0vO1xyXG5sZXQgYWxsU3BhblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuUmVnZXgsICdnJyk7XHJcbmxldCBzcGFuRXhwcmVzc2lvblJlZ2V4ID0gLyhcXFxcKT9cXCRzeyhbXFx3LltcXF0hPT48fCZdK1xcKC4qXFwpKX0vO1xyXG5sZXQgYWxsU3BhbkV4cHJlc3Npb25SZWdleCA9IG5ldyBSZWdFeHAoc3BhbkV4cHJlc3Npb25SZWdleCwgJ2cnKTtcclxuXHJcbmxldCBiaW5kUmVnZXggPSAvKFxcXFwpP1xcJHsoW1xcdy5bXFxdXSspfS87XHJcbmxldCBiaW5kUmVnZXhVbmNhcHR1cmluZyA9IC8oKD86XFxcXCk/XFwkeyg/OltcXHcuW1xcXV0rKX0pLztcclxuXHJcbmxldCBmdW5jdGlvblJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKVxcKCguKilcXCl9LztcclxuXHJcbmxldCBleHByZXNzaW9uUmVnZXggPSAvKFxcXFwpPyhbXFx3LltcXF0hPT48fCZdKylcXCgoLiopXFwpLztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2FsbFNwYW5SZWdleCwgYWxsU3BhbkV4cHJlc3Npb25SZWdleCwgYmluZFJlZ2V4LCBiaW5kUmVnZXhVbmNhcHR1cmluZywgZnVuY3Rpb25SZWdleCwgZXhwcmVzc2lvblJlZ2V4fTtcclxuIiwibGV0IGNyZWF0ZVNvdXJjZSA9ICgpID0+IHtcclxuICAgIGxldCBoYW5kbGVycyA9IHt9O1xyXG4gICAgbGV0IG9yaWdpbiA9IHt9O1xyXG4gICAgbGV0IHNvdXJjZSA9IGNyZWF0ZVByb3h5KG9yaWdpbiwgaGFuZGxlcnMpO1xyXG4gICAgc2V0RGVmYXVsdFNvdXJjZShvcmlnaW4pO1xyXG4gICAgcmV0dXJuIHtvcmlnaW4sIHNvdXJjZSwgaGFuZGxlcnN9O1xyXG59O1xyXG5cclxubGV0IGlnbm9yZSA9IFtdO1xyXG5cclxubGV0IGlzQmluZElnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBvYmouX19iaW5kSWdub3JlX18gJiYgb2JqLl9fYmluZElnbm9yZV9fLmluY2x1ZGVzKHByb3ApO1xyXG5cclxuLy8gdG9kbyBtYWtlIF9fYmluZEF2b2lkQ3ljbGVzX18gaW5oZXJpdGVkIGFuZCBtYXliZSBhdm9pZCBwZXIgYmluZGluZyBpbnN0ZWFkIHBlciBjaGFuZ2VcclxubGV0IGlzSWdub3JlZCA9IChvYmosIHByb3ApID0+IGlzQmluZElnbm9yZWQob2JqLCBwcm9wKSB8fCAob2JqLl9fYmluZEF2b2lkQ3ljbGVzX18gJiYgaWdub3JlLnNvbWUoaWdub3JlID0+IGlnbm9yZS5vYmogPT09IG9iaiAmJiBpZ25vcmUucHJvcCA9PT0gcHJvcCkpO1xyXG5cclxubGV0IGhhbmRsZVNldCA9IChvYmosIHByb3AsIGhhbmRsZXJzLCBhY2N1bXVsYXRlZEhhbmRsZXJzKSA9PiB7XHJcbiAgICBpZ25vcmUucHVzaCh7b2JqLCBwcm9wfSk7XHJcbiAgICBhY2N1bXVsYXRlZEhhbmRsZXJzLmZvckVhY2goZG9IYW5kbGVyKTtcclxuICAgIGhhbmRsZXJzICYmIHByb3BvZ2F0ZUhhbmRsZXJEb3duKGhhbmRsZXJzKTtcclxuICAgIGlnbm9yZS5wb3AoKTtcclxufTtcclxuXHJcbmxldCBjcmVhdGVQcm94eSA9IChvYmosIGhhbmRsZXJzID0ge30sIGFjY3VtdWxhdGVkSGFuZGxlcnMgPSBbXSkgPT4gbmV3IFByb3h5KG9iaiwge1xyXG4gICAgZ2V0OiAodGFyZ2V0LCBwcm9wKSA9PiB7XHJcbiAgICAgICAgbGV0IGdvdCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCk7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBnb3QgPT09ICdvYmplY3QnICYmIGdvdCAmJiAhaXNCaW5kSWdub3JlZChvYmosIHByb3ApID8gY3JlYXRlUHJveHkoZ290LCBoYW5kbGVyc1twcm9wXSwgYWNjdW11bGF0ZWRIYW5kbGVycy5jb25jYXQoaGFuZGxlcnMpKSA6IGdvdDtcclxuICAgIH0sXHJcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSk7XHJcbiAgICAgICAgIWlzSWdub3JlZChvYmosIHByb3ApICYmIGhhbmRsZVNldChvYmosIHByb3AsIGhhbmRsZXJzW3Byb3BdLCBhY2N1bXVsYXRlZEhhbmRsZXJzLmNvbmNhdChoYW5kbGVycykpOyAvLyB0b2RvIHdyYXAgaGFuZGxlcnMgYW5kIGFjY3VtdWxhdGVkSGFuZGxlcnMgaW4gY2xhc3Mgd2l0aCBwb3BQcm9wIG1ldGhvZFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmxldCBwcm9wb2dhdGVIYW5kbGVyRG93biA9IGhhbmRsZXJzID0+IHtcclxuICAgIGRvSGFuZGxlcihoYW5kbGVycyk7XHJcbiAgICBPYmplY3QuZW50cmllcyhoYW5kbGVycylcclxuICAgICAgICAuZmlsdGVyKChba2V5XSkgPT4ga2V5ICE9PSAnX2Z1bmNfJylcclxuICAgICAgICAuZm9yRWFjaCgoWywgaGFuZGxlcl0pID0+IHByb3BvZ2F0ZUhhbmRsZXJEb3duKGhhbmRsZXIpKTtcclxufTtcclxuXHJcbmxldCBkb0hhbmRsZXIgPSBoYW5kbGVyID0+IHR5cGVvZiBoYW5kbGVyLl9mdW5jXyA9PT0gJ2Z1bmN0aW9uJyAmJiBoYW5kbGVyLl9mdW5jXygpO1xyXG5cclxubGV0IHNldERlZmF1bHRTb3VyY2UgPSBzb3VyY2UgPT4ge1xyXG4gICAgc291cmNlLl9udW1iZXJzXyA9IG5ldyBQcm94eSh7fSwge1xyXG4gICAgICAgIGdldDogKF8sIHByb3ApID0+IHBhcnNlSW50KHByb3ApLFxyXG4gICAgICAgIHNldDogKCkgPT4gZmFsc2VcclxuICAgIH0pO1xyXG4gICAgc291cmNlLm5vdCA9IGEgPT4gIWE7XHJcbiAgICBzb3VyY2VbJyEnXSA9IGEgPT4gIWE7XHJcbiAgICBzb3VyY2UuZXEgPSAoYSwgYikgPT4gYSA9PT0gYjtcclxuICAgIHNvdXJjZS5lcXVhbCA9IChhLCBiKSA9PiBhID09PSBiO1xyXG4gICAgc291cmNlWyc9J10gPSAoYSwgYikgPT4gYSA9PT0gYjtcclxuICAgIHNvdXJjZS5uRXEgPSAoYSwgYikgPT4gYSAhPT0gYjtcclxuICAgIHNvdXJjZS5ub3RFcXVhbCA9IChhLCBiKSA9PiBhICE9PSBiO1xyXG4gICAgc291cmNlWychPSddID0gKGEsIGIpID0+IGEgIT09IGI7XHJcbiAgICBzb3VyY2UuZ3JlYXRlciA9IChhLCBiKSA9PiBhID4gYjtcclxuICAgIHNvdXJjZVsnPiddID0gKGEsIGIpID0+IGEgPiBiO1xyXG4gICAgc291cmNlLmxlc3MgPSAoYSwgYikgPT4gYSA8IGI7XHJcbiAgICBzb3VyY2VbJzwnXSA9IChhLCBiKSA9PiBhIDwgYjtcclxuICAgIHNvdXJjZS5ncmVhdGVyRXEgPSAoYSwgYikgPT4gYSA+PSBiO1xyXG4gICAgc291cmNlWyc+PSddID0gKGEsIGIpID0+IGEgPj0gYjtcclxuICAgIHNvdXJjZS5sZXNzRXEgPSAoYSwgYikgPT4gYSA8PSBiO1xyXG4gICAgc291cmNlWyc8PSddID0gKGEsIGIpID0+IGEgPD0gYjtcclxuICAgIHNvdXJjZS5vciA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xyXG4gICAgc291cmNlWyd8J10gPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcclxuICAgIHNvdXJjZVsnfHwnXSA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xyXG4gICAgc291cmNlLmFuZCA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcclxuICAgIHNvdXJjZVsnJiddID0gKC4uLmFzKSA9PiBhcy5ldmVyeShhID0+IGEpO1xyXG4gICAgc291cmNlWycmJiddID0gKC4uLmFzKSA9PiBhcy5ldmVyeShhID0+IGEpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y3JlYXRlU291cmNlfTtcclxuIiwibGV0IHNwbGl0QnlXb3JkID0gKHN0cmluZywgd29yZCkgPT5cclxuICAgIHN0cmluZy5zcGxpdChuZXcgUmVnRXhwKGBcXFxccyske3dvcmR9XFxcXHMrYCkpO1xyXG5cclxubGV0IHNwbGl0QnlDb21tYSA9IHN0cmluZyA9PlxyXG4gICAgc3RyaW5nLnNwbGl0KC9cXHMqLFxccyovKTtcclxuXHJcbmxldCBzcGxpdEJ5U3BhY2UgPSBzdHJpbmcgPT5cclxuICAgIHN0cmluZy5zcGxpdCgvXFxzKy8pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfTtcclxuIl19
