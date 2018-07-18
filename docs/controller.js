(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

let template = "<div bind-for=\"item in list\" bind=\"item\"></div>\n";
let controllerString = "module.exports = source => {\n    source.list = ['elephant', 'lion', 'rabbit'];\n};\n";
let controller = require('./controller');

module.exports = {template, controller, controllerString};


},{"./controller":2}],2:[function(require,module,exports){
module.exports = source => {
    source.list = ['elephant', 'lion', 'rabbit'];
};

},{}],3:[function(require,module,exports){

let template = "<div>\n    <span>truthy:</span>\n    <span bind-if=\"truthy\">whenever `source.truthy` is modified, my visibility will be updated to reflect the change</span>\n</div>\n\n<div>\n    <span>falsy:</span>\n    <span bind-if=\"falsy\">whenever `source.falsy` is modified, my visibility will be updated to reflect the change</span>\n</div>\n\n<div>\n    <span>isGreaterThan10(myVariable):</span>\n    <span bind-if=\"isGreaterThan10(myVariable)\">whenever `source.isGreaterThan10` or `source.myVariable` are modified, my visibility be updated to reflect the change</span>\n</div>\n\n<div>\n    <span>isGreaterThan10(5):</span>\n    <span bind-if=\"isGreaterThan10(5)\">whenever `source.isGreaterThan10` is modified, my visibility be updated to reflect the change</span>\n</div>\n";
let controllerString = "module.exports = source => {\n    source.truthy = true;\n\n    source.falsy = false;\n\n    source.isGreaterThan10 = a => a > 10;\n\n    source.myVariable = 15;\n};\n";
let controller = require('./controller');

module.exports = {template, controller, controllerString};


},{"./controller":4}],4:[function(require,module,exports){
module.exports = source => {
    source.truthy = true;

    source.falsy = false;

    source.isGreaterThan10 = a => a > 10;

    source.myVariable = 15;
};

},{}],5:[function(require,module,exports){

let template = "<div bind=\"myMessage\"></div>\n\n<div bind=\"myFunction(myVariable, 'string', 100, ['array', 30])\"></div>\n\n$s{mySpanMessage}\n";
let controllerString = "module.exports = source => {\n    source.myMessage = 'whenever `source.myMessage` is modified, my text be updated to reflect the change';\n\n    source.myFunction = (variable, string, integer, [string2, integer2]) =>\n        `whenever \\`source.myFunction\\` or \\`source.myVariable\\` are modified, my text be updated to reflect the change; ${variable} ${string} ${integer} ${string2} ${integer2}`;\n\n    source.myVariable = '-my variable is awesome-';\n\n    source.mySpanMessage = '$s{x} is shorthand for &lt;span bind=\"x\"&gt; &lt;/span&gt;';\n};\n";
let controller = require('./controller');

module.exports = {template, controller, controllerString};


},{"./controller":6}],6:[function(require,module,exports){
module.exports = source => {
    source.myMessage = 'whenever `source.myMessage` is modified, my text be updated to reflect the change';

    source.myFunction = (variable, string, integer, [string2, integer2]) =>
        `whenever \`source.myFunction\` or \`source.myVariable\` are modified, my text be updated to reflect the change; ${variable} ${string} ${integer} ${string2} ${integer2}`;

    source.myVariable = '-my variable is awesome-';

    source.mySpanMessage = '$s{x} is shorthand for &lt;span bind="x"&gt; &lt;/span&gt;';
};

},{}],7:[function(require,module,exports){
const bb = require('bb-better-binding')();

String.prototype.clean = function () {
    return this.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// block declarations

bb.declareBlock('navigation', require('./navigation/navigation'));

let valueBlockData = require('./bindValue/bindValue');
bb.declareBlock('bindValue', valueBlockData);

let ifBlockData = require('./bindIf/bindIf');
bb.declareBlock('bindIf', ifBlockData);

let forBlockData = require('./bindFor/bindFor');
bb.declareBlock('bindFor', forBlockData);

bb.declareBlock('helloWorld', require('./helloWorld/helloWorld'));

// booting

let source = bb.boot(document.firstElementChild, window);

// app controller


let snippets = [valueBlockData, ifBlockData, forBlockData];
let linkNames = ['bindValue', 'bindIf', 'bindFor', 'helloWorld'];
source.navigationPages = ['Value Binding', 'If Binding', 'For Binding', 'Hello World'];

source.setPageIndex = pageIndex => {
    source.pageIndex = pageIndex;
    source.snippet = snippets[pageIndex] && {
        template: snippets[pageIndex].template.clean(),
        controller: snippets[pageIndex].controllerString.clean()
    };

    let linkName = linkNames[pageIndex];
    let linkExpanded = `https://github.com/mahhov/bb-better-binding/blob/HEAD/liveExample/${linkName}/${linkName}`;
    source.links = [`${linkExpanded}.html`, `${linkExpanded}.js`];
};

source.setPageIndex(0);
source.navigationBlock.navigationRadio0.checked = true;

},{"./bindFor/bindFor":1,"./bindIf/bindIf":3,"./bindValue/bindValue":5,"./helloWorld/helloWorld":8,"./navigation/navigation":9,"bb-better-binding":12}],8:[function(require,module,exports){
let template = "<a href=\"https://github.com/mahhov/bb-better-binding/blob/HEAD/liveExample/helloWorld/helloWorld.html\">template source</a>\n<br/>\n<a href=\"https://github.com/mahhov/bb-better-binding/blob/HEAD/liveExample/helloWorld/helloWorld.js\">controller source</a>\n\n<div>\n    <div style=\"font-size:${largeFont}; color:${favoriteColor}\">\n        $s{greeting}, $s{name} $s{exclamation}\n    </div>\n    wuts ur favorite color?\n    <input value=\"${favoriteColor}\" onkeyup=\"${changeColor(this)}\">\n</div>\n\n<div style=\"margin-top:100px\">\n    <button onclick=\"${changeAnimation()}\">click me!</button>\n    <br/>\n    <img src=\"${animation}\">\n</div>\n\n<div style=\"margin-top:100px\">\n    <p>i have jokes:</p>\n    <input id=\"check\" type=\"checkbox\" onchange=\"${setJokeVisibility(this)}\"/><label for=\"check\">show jokes?</label>\n    <div bind-if=\"jokeVisibility\">\n        <div bind-for=\"joke in jokes\">\n            <h3 bind=\"index\"></h3>\n            <p bind-for=\"line in joke.lines\" bind=\"line\"></p>\n        </div>\n        <h3>Source: $s{jokesSource}</h3>\n    </div>\n</div>";

let controller = source => {

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
};

module.exports = {template, controller};


},{}],9:[function(require,module,exports){
let template = "<div>\n    <span bind-for=\"page in pages\">\n        <input type=\"radio\" id=\"navigationRadio${index}\" name=\"navigationRadios\" bind-elem=\"navigationRadio${index}\"\n               onchange=\"${setPageHandler(index)}\"/>\n        <label for=\"navigationRadio${index}\" bind=\"page\"></label>\n    </span>\n</div>\n";

let controller = source => {
};

let parameters = ['pages', 'setPageHandler'];

module.exports = {template, controller, parameters};


},{}],10:[function(require,module,exports){
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

},{"./htmlBinder":11}],11:[function(require,module,exports){
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

                // todo allow non-source parameters for bindUse
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
                    let paramsInput = paramsGroup ? splitByParams(paramsGroup) : [];
                    let paramValues = this.getParamValues(paramsInput, elem);
                    let {template, controller, parameters} = this.blocks[blockName];
                    elem.removeAttribute('bind-block');
                    elem.innerHTML = template;
                    let blockSource = new HtmlBinder(elem, this.blocks).source;
                    controller(blockSource);
                    parameters && parameters.forEach((to, index) => {
                        let from = translate(paramsInput[index], sourceLinks);
                        this.addPairBind(from, blockSource, to);
                        this.applyPairBind(from, blockSource, to);
                        blockSource[to] = paramValues[index];
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

},{"./objScafolding":13,"./paramSplitter":14,"./regex":15,"./source":16,"./stringSplitter":17}],12:[function(require,module,exports){
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

},{"./booter":10}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`));

let splitByComma = string =>
    string.split(/\s*,\s*/);

let splitBySpace = string =>
    string.split(/\s+/);

module.exports = {splitByWord, splitByComma, splitBySpace};

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaXZlRXhhbXBsZS9iaW5kRm9yL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZEZvci9jb250cm9sbGVyLmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvaW5wdXQuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvY29udHJvbGxlci5qcyIsImxpdmVFeGFtcGxlL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9oZWxsb1dvcmxkL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvbmF2aWdhdGlvbi9pbnB1dC5qcyIsInNyYy9ib290ZXIuanMiLCJzcmMvaHRtbEJpbmRlci5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9vYmpTY2Fmb2xkaW5nLmpzIiwic3JjL3BhcmFtU3BsaXR0ZXIuanMiLCJzcmMvcmVnZXguanMiLCJzcmMvc291cmNlLmpzIiwic3JjL3N0cmluZ1NwbGl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQXlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLHVEQUFvRCxDQUFDO0FBQ3BFLElBQUksZ0JBQWdCLEdBQUcsdUZBQXFELENBQUM7QUFDN0UsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0FDTDFEO0FBQ0E7QUFDQTtBQUNBOztBQ0h5QjtBQUN6QixJQUFJLFFBQVEsR0FBRyx1d0JBQW1ELENBQUM7QUFDbkUsSUFBSSxnQkFBZ0IsR0FBRyx3S0FBcUQsQ0FBQztBQUM3RSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXpDLE1BQU0sQ0FBQyxPQUFP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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xubGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vYmluZEZvci5odG1sYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vY29udHJvbGxlci5qc2AsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgY29udHJvbGxlclN0cmluZ307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNvdXJjZSA9PiB7XG4gICAgc291cmNlLmxpc3QgPSBbJ2VsZXBoYW50JywgJ2xpb24nLCAncmFiYml0J107XG59O1xuIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xubGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vYmluZElmLmh0bWxgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXJTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9jb250cm9sbGVyLmpzYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBjb250cm9sbGVyU3RyaW5nfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gc291cmNlID0+IHtcbiAgICBzb3VyY2UudHJ1dGh5ID0gdHJ1ZTtcblxuICAgIHNvdXJjZS5mYWxzeSA9IGZhbHNlO1xuXG4gICAgc291cmNlLmlzR3JlYXRlclRoYW4xMCA9IGEgPT4gYSA+IDEwO1xuXG4gICAgc291cmNlLm15VmFyaWFibGUgPSAxNTtcbn07XG4iLCJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5sZXQgdGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9iaW5kVmFsdWUuaHRtbGAsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlclN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2NvbnRyb2xsZXIuanNgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJTdHJpbmd9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBzb3VyY2UgPT4ge1xuICAgIHNvdXJjZS5teU1lc3NhZ2UgPSAnd2hlbmV2ZXIgYHNvdXJjZS5teU1lc3NhZ2VgIGlzIG1vZGlmaWVkLCBteSB0ZXh0IGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgY2hhbmdlJztcblxuICAgIHNvdXJjZS5teUZ1bmN0aW9uID0gKHZhcmlhYmxlLCBzdHJpbmcsIGludGVnZXIsIFtzdHJpbmcyLCBpbnRlZ2VyMl0pID0+XG4gICAgICAgIGB3aGVuZXZlciBcXGBzb3VyY2UubXlGdW5jdGlvblxcYCBvciBcXGBzb3VyY2UubXlWYXJpYWJsZVxcYCBhcmUgbW9kaWZpZWQsIG15IHRleHQgYmUgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBjaGFuZ2U7ICR7dmFyaWFibGV9ICR7c3RyaW5nfSAke2ludGVnZXJ9ICR7c3RyaW5nMn0gJHtpbnRlZ2VyMn1gO1xuXG4gICAgc291cmNlLm15VmFyaWFibGUgPSAnLW15IHZhcmlhYmxlIGlzIGF3ZXNvbWUtJztcblxuICAgIHNvdXJjZS5teVNwYW5NZXNzYWdlID0gJyRze3h9IGlzIHNob3J0aGFuZCBmb3IgJmx0O3NwYW4gYmluZD1cInhcIiZndDsgJmx0Oy9zcGFuJmd0Oyc7XG59O1xuIiwiY29uc3QgYmIgPSByZXF1aXJlKCdiYi1iZXR0ZXItYmluZGluZycpKCk7XG5cblN0cmluZy5wcm90b3R5cGUuY2xlYW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn07XG5cbi8vIGJsb2NrIGRlY2xhcmF0aW9uc1xuXG5iYi5kZWNsYXJlQmxvY2soJ25hdmlnYXRpb24nLCByZXF1aXJlKCcuL25hdmlnYXRpb24vbmF2aWdhdGlvbicpKTtcblxubGV0IHZhbHVlQmxvY2tEYXRhID0gcmVxdWlyZSgnLi9iaW5kVmFsdWUvYmluZFZhbHVlJyk7XG5iYi5kZWNsYXJlQmxvY2soJ2JpbmRWYWx1ZScsIHZhbHVlQmxvY2tEYXRhKTtcblxubGV0IGlmQmxvY2tEYXRhID0gcmVxdWlyZSgnLi9iaW5kSWYvYmluZElmJyk7XG5iYi5kZWNsYXJlQmxvY2soJ2JpbmRJZicsIGlmQmxvY2tEYXRhKTtcblxubGV0IGZvckJsb2NrRGF0YSA9IHJlcXVpcmUoJy4vYmluZEZvci9iaW5kRm9yJyk7XG5iYi5kZWNsYXJlQmxvY2soJ2JpbmRGb3InLCBmb3JCbG9ja0RhdGEpO1xuXG5iYi5kZWNsYXJlQmxvY2soJ2hlbGxvV29ybGQnLCByZXF1aXJlKCcuL2hlbGxvV29ybGQvaGVsbG9Xb3JsZCcpKTtcblxuLy8gYm9vdGluZ1xuXG5sZXQgc291cmNlID0gYmIuYm9vdChkb2N1bWVudC5maXJzdEVsZW1lbnRDaGlsZCwgd2luZG93KTtcblxuLy8gYXBwIGNvbnRyb2xsZXJcblxuXG5sZXQgc25pcHBldHMgPSBbdmFsdWVCbG9ja0RhdGEsIGlmQmxvY2tEYXRhLCBmb3JCbG9ja0RhdGFdO1xubGV0IGxpbmtOYW1lcyA9IFsnYmluZFZhbHVlJywgJ2JpbmRJZicsICdiaW5kRm9yJywgJ2hlbGxvV29ybGQnXTtcbnNvdXJjZS5uYXZpZ2F0aW9uUGFnZXMgPSBbJ1ZhbHVlIEJpbmRpbmcnLCAnSWYgQmluZGluZycsICdGb3IgQmluZGluZycsICdIZWxsbyBXb3JsZCddO1xuXG5zb3VyY2Uuc2V0UGFnZUluZGV4ID0gcGFnZUluZGV4ID0+IHtcbiAgICBzb3VyY2UucGFnZUluZGV4ID0gcGFnZUluZGV4O1xuICAgIHNvdXJjZS5zbmlwcGV0ID0gc25pcHBldHNbcGFnZUluZGV4XSAmJiB7XG4gICAgICAgIHRlbXBsYXRlOiBzbmlwcGV0c1twYWdlSW5kZXhdLnRlbXBsYXRlLmNsZWFuKCksXG4gICAgICAgIGNvbnRyb2xsZXI6IHNuaXBwZXRzW3BhZ2VJbmRleF0uY29udHJvbGxlclN0cmluZy5jbGVhbigpXG4gICAgfTtcblxuICAgIGxldCBsaW5rTmFtZSA9IGxpbmtOYW1lc1twYWdlSW5kZXhdO1xuICAgIGxldCBsaW5rRXhwYW5kZWQgPSBgaHR0cHM6Ly9naXRodWIuY29tL21haGhvdi9iYi1iZXR0ZXItYmluZGluZy9ibG9iL0hFQUQvbGl2ZUV4YW1wbGUvJHtsaW5rTmFtZX0vJHtsaW5rTmFtZX1gO1xuICAgIHNvdXJjZS5saW5rcyA9IFtgJHtsaW5rRXhwYW5kZWR9Lmh0bWxgLCBgJHtsaW5rRXhwYW5kZWR9LmpzYF07XG59O1xuXG5zb3VyY2Uuc2V0UGFnZUluZGV4KDApO1xuc291cmNlLm5hdmlnYXRpb25CbG9jay5uYXZpZ2F0aW9uUmFkaW8wLmNoZWNrZWQgPSB0cnVlO1xuIiwibGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9oZWxsb1dvcmxkLmh0bWxgLCAndXRmOCcpO1xuXG5sZXQgY29udHJvbGxlciA9IHNvdXJjZSA9PiB7XG5cbiAgICAvLyBncmVldGluZ1xuICAgIHNvdXJjZS5sYXJnZUZvbnQgPSA2MDtcbiAgICBzb3VyY2UuZmF2b3JpdGVDb2xvciA9ICdERUVQcGluayc7XG4gICAgc291cmNlLmdyZWV0aW5nID0gJ0kgaGF0ZSB5b3UnO1xuICAgIHNvdXJjZS5uYW1lID0gJ1dvcmxkJztcbiAgICBzb3VyY2UuZXhjbGFtYXRpb24gPSAnKOKVr8Kw4pahwrDvvInila/vuLUg4pS74pSB4pS7JztcbiAgICBzb3VyY2UuY2hhbmdlQ29sb3IgPSBpbnB1dCA9PiB7XG4gICAgICAgIHNvdXJjZS5mYXZvcml0ZUNvbG9yID0gaW5wdXQudmFsdWU7XG4gICAgfTtcblxuICAgIC8vIGFuaW1hdGlvblxuICAgIGxldCBhbmltYXRpb25zID0gW1xuICAgICAgICAnaHR0cDovL3d3dy5xcXByLmNvbS9hc2NpaS9pbWcvYXNjaWktMTA0My5naWYnLFxuICAgICAgICAnaHR0cHM6Ly9tZWRpYTAuZ2lwaHkuY29tL21lZGlhLzEyRWtKQ2JwYTNoR0tjL2dpcGh5LmdpZicsXG4gICAgICAgICdodHRwOi8vd3d3LnFxcHIuY29tL2FzY2lpL2ltZy9hc2NpaS0xMDA2LmdpZiddO1xuICAgIGxldCBhbmltYXRpb25JbmRleCA9IC0xO1xuICAgIHNvdXJjZS5jaGFuZ2VBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGFuaW1hdGlvbkluZGV4ID0gKGFuaW1hdGlvbkluZGV4ICsgMSkgJSBhbmltYXRpb25zLmxlbmd0aDtcbiAgICAgICAgc291cmNlLmFuaW1hdGlvbiA9IGFuaW1hdGlvbnNbYW5pbWF0aW9uSW5kZXhdO1xuICAgIH07XG4gICAgc291cmNlLmNoYW5nZUFuaW1hdGlvbigpO1xuXG4gICAgLy8gam9rZXNcbiAgICBzb3VyY2Uuc2V0Sm9rZVZpc2liaWxpdHkgPSBjaGVja2JveCA9PiB7XG4gICAgICAgIHNvdXJjZS5qb2tlVmlzaWJpbGl0eSA9IGNoZWNrYm94LmNoZWNrZWQ7XG4gICAgfTtcbiAgICBzb3VyY2Uuam9rZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkxlZnQgaW5zaWRlIG1haW4gdGlyZSBhbG1vc3QgbmVlZHMgcmVwbGFjZW1lbnQuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJBbG1vc3QgcmVwbGFjZWQgbGVmdCBpbnNpZGUgbWFpbiB0aXJlLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJUZXN0IGZsaWdodCBPSywgZXhjZXB0IGF1dG9sYW5kIHZlcnkgcm91Z2guXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJBdXRvbGFuZCBub3QgaW5zdGFsbGVkIG9uIHRoaXMgYWlyY3JhZnQuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW0gIzE6ICBcIiMyIFByb3BlbGxlciBzZWVwaW5nIHByb3AgZmx1aWQuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbiAjMTogXCIjMiBQcm9wZWxsZXIgc2VlcGFnZSBub3JtYWwuXCInLFxuICAgICAgICAgICAgICAgICdQcm9ibGVtICMyOiAgXCIjMSwgIzMsIGFuZCAjNCBwcm9wZWxsZXJzIGxhY2sgbm9ybWFsIHNlZXBhZ2UuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICAgIFwiVGhlIGF1dG9waWxvdCBkb2VzblxcJ3QuXCInLFxuICAgICAgICAgICAgICAgICdTaWduZWQgb2ZmOiBcIklUIERPRVMgTk9XLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJTb21ldGhpbmcgbG9vc2UgaW4gY29ja3BpdC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlNvbWV0aGluZyB0aWdodGVuZWQgaW4gY29ja3BpdC5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiRXZpZGVuY2Ugb2YgaHlkcmF1bGljIGxlYWsgb24gcmlnaHQgbWFpbiBsYW5kaW5nIGdlYXIuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJFdmlkZW5jZSByZW1vdmVkLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJETUUgdm9sdW1lIHVuYmVsaWV2YWJseSBsb3VkLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiVm9sdW1lIHNldCB0byBtb3JlIGJlbGlldmFibGUgbGV2ZWwuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRlYWQgYnVncyBvbiB3aW5kc2hpZWxkLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiTGl2ZSBidWdzIG9uIG9yZGVyLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJBdXRvcGlsb3QgaW4gYWx0aXR1ZGUgaG9sZCBtb2RlIHByb2R1Y2VzIGEgMjAwIGZwbSBkZXNjZW50LlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiQ2Fubm90IHJlcHJvZHVjZSBwcm9ibGVtIG9uIGdyb3VuZC5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiSUZGIGlub3BlcmF0aXZlLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiSUZGIGFsd2F5cyBpbm9wZXJhdGl2ZSBpbiBPRkYgbW9kZS5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiRnJpY3Rpb24gbG9ja3MgY2F1c2UgdGhyb3R0bGUgbGV2ZXJzIHRvIHN0aWNrLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiVGhhdFxcJ3Mgd2hhdCB0aGV5XFwncmUgdGhlcmUgZm9yLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJOdW1iZXIgdGhyZWUgZW5naW5lIG1pc3NpbmcuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJFbmdpbmUgZm91bmQgb24gcmlnaHQgd2luZyBhZnRlciBicmllZiBzZWFyY2guXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgXTtcbiAgICBzb3VyY2Uuam9rZXNTb3VyY2UgPSAnaHR0cHM6Ly93d3cubmV0ZnVubnkuY29tL3JoZi9qb2tlcy85Ny9KdW4vdXNhZi5odG1sJztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyfTtcbiIsImxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vbmF2aWdhdGlvbi5odG1sYCwgJ3V0ZjgnKTtcblxubGV0IGNvbnRyb2xsZXIgPSBzb3VyY2UgPT4ge1xufTtcblxubGV0IHBhcmFtZXRlcnMgPSBbJ3BhZ2VzJywgJ3NldFBhZ2VIYW5kbGVyJ107XG5cbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBwYXJhbWV0ZXJzfTsiLCJjb25zdCBIdG1sQmluZGVyID0gcmVxdWlyZSgnLi9odG1sQmluZGVyJyk7XG5cbmNsYXNzIEJvb3RlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSB7fTtcbiAgICB9XG5cbiAgICBkZWNsYXJlQmxvY2soYmxvY2tOYW1lLCBibG9jaykge1xuICAgICAgICB0aGlzLmJsb2Nrc1tibG9ja05hbWVdID0gYmxvY2s7XG4gICAgfVxuXG4gICAgYm9vdChyb290LCBkZWJ1Zykge1xuICAgICAgICBsZXQgYXJ0aWZhY3RzID0gbmV3IEh0bWxCaW5kZXIocm9vdCwgdGhpcy5ibG9ja3MpLmdldEFydGlmYWN0cygpO1xuICAgICAgICBkZWJ1ZyAmJiBPYmplY3QuYXNzaWduKGRlYnVnLCBhcnRpZmFjdHMpO1xuICAgICAgICByZXR1cm4gYXJ0aWZhY3RzLnNvdXJjZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9vdGVyO1xuIiwiY29uc3Qge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfSA9IHJlcXVpcmUoJy4vb2JqU2NhZm9sZGluZycpO1xuY29uc3Qge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX0gPSByZXF1aXJlKCcuL3N0cmluZ1NwbGl0dGVyJyk7XG5jb25zdCBzcGxpdEJ5UGFyYW1zID0gcmVxdWlyZSgnLi9wYXJhbVNwbGl0dGVyJyk7XG5jb25zdCB7Y3JlYXRlU291cmNlfSA9IHJlcXVpcmUoJy4vc291cmNlJyk7XG5jb25zdCB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9ID0gcmVxdWlyZSgnLi9yZWdleCcpO1xuXG5jbGFzcyBIdG1sQmluZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJvb3QsIGJsb2Nrcykge1xuICAgICAgICBsZXQge29yaWdpbiwgc291cmNlLCBoYW5kbGVyc30gPSBjcmVhdGVTb3VyY2UoKTtcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0gaGFuZGxlcnM7XG4gICAgICAgIHRoaXMuYmluZHMgPSB7fTtcbiAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0ge307XG4gICAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xuXG4gICAgICAgIEh0bWxCaW5kZXIucmVwbGFjZUlubGluZUJpbmRpbmdzKHJvb3QpO1xuICAgICAgICB0aGlzLmJpbmRFbGVtKHJvb3QsIHt9KTtcbiAgICB9XG5cbiAgICBiaW5kRWxlbShlbGVtLCBzb3VyY2VMaW5rcykge1xuICAgICAgICBsZXQgc2tpcCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBlbGVtLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQge25hbWU6IGF0dHJpYnV0ZU5hbWUsIHZhbHVlfSA9IGF0dHJpYnV0ZXNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubWF0Y2goYmluZFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICBsZXQge3BhcmFtc30gPSBhdHRyaWJ1dGVCaW5kO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5tYXRjaChmdW5jdGlvblJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZnVuY3Rpb25OYW1lLCBwYXJhbXN9ID0gYXR0cmlidXRlQmluZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmluZEVsZW0gPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZWxlbScpO1xuICAgICAgICAgICAgbGV0IGJpbmRDb21wb25lbnQgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtY29tcG9uZW50Jyk7XG4gICAgICAgICAgICBsZXQgYmluZFVzZSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC11c2UnKTtcbiAgICAgICAgICAgIGxldCBiaW5kQXMgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtYXMnKTtcbiAgICAgICAgICAgIGxldCBiaW5kRm9yID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWZvcicpO1xuICAgICAgICAgICAgbGV0IGJpbmRJZiA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1pZicpO1xuICAgICAgICAgICAgbGV0IGJpbmRCbG9jayA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1ibG9jaycpO1xuICAgICAgICAgICAgbGV0IGJpbmRWYWx1ZSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZCcpO1xuXG4gICAgICAgICAgICBpZiAoYmluZEVsZW0pIHtcbiAgICAgICAgICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLnNvdXJjZSwgW2JpbmRFbGVtXSwgZWxlbSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18gPSB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXyB8fCBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXy5wdXNoKGJpbmRFbGVtKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IFtjb21wb25lbnROYW1lLCBwYXJhbXNHcm91cF0gPSBzcGxpdEJ5V29yZChiaW5kQ29tcG9uZW50LCAnd2l0aCcpO1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5U3BhY2UocGFyYW1zR3JvdXApO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtY29tcG9uZW50Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdID0ge291dGVyRWxlbTogZWxlbSwgcGFyYW1zfTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kRm9yKSB7XG4gICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IFtzb3VyY2VUbywgYmluZE5hbWVdID0gc3BsaXRCeVdvcmQoYmluZEZvciwgJ2luJyk7XG4gICAgICAgICAgICAgICAgYmluZE5hbWUgPSB0cmFuc2xhdGUoYmluZE5hbWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9yLXBhcmVudCcpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVwbGFjZVdpdGgoY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1mb3InKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdLmZvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgb3V0ZXJFbGVtOiBlbGVtLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VUbyxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRnJvbTogYmluZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGb3IoY29udGFpbmVyLCBlbGVtLCBzb3VyY2VUbywgYmluZE5hbWUsIHNvdXJjZUxpbmtzKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYmluZEFzKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICBzcGxpdEJ5Q29tbWEoYmluZEFzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChhcyA9PiBzcGxpdEJ5V29yZChhcywgJ2FzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoW2Zyb20sIHRvXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3RvXSA9IHRyYW5zbGF0ZShmcm9tLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmluZElmKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9ID0gdGhpcy5leHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgYmluZElmLCAnaWZzJywgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZElmKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB0b2RvIGFsbG93IG5vbi1zb3VyY2UgcGFyYW1ldGVycyBmb3IgYmluZFVzZVxuICAgICAgICAgICAgICAgIGlmIChiaW5kVXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBbY29tcG9uZW50TmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmluZFVzZSwgJ3dpdGgnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtc0lucHV0ID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtvdXRlckVsZW0sIHBhcmFtc30gPSB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRFbGVtID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShvdXRlckVsZW0sIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGNvbXBvbmVudEVsZW0pO1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLmZvckVhY2goKHRvLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NbdG9dID0gdHJhbnNsYXRlKHBhcmFtc0lucHV0W2luZGV4XSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmluZEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgW2Jsb2NrLCBibG9ja1RvXSA9IHNwbGl0QnlXb3JkKGJpbmRCbG9jaywgJ2FzJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBbYmxvY2tOYW1lLCBwYXJhbXNHcm91cF0gPSBzcGxpdEJ5V29yZChibG9jaywgJ3dpdGgnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtc0lucHV0ID0gcGFyYW1zR3JvdXAgPyBzcGxpdEJ5UGFyYW1zKHBhcmFtc0dyb3VwKSA6IFtdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtc0lucHV0LCBlbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgcGFyYW1ldGVyc30gPSB0aGlzLmJsb2Nrc1tibG9ja05hbWVdO1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1ibG9jaycpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYmxvY2tTb3VyY2UgPSBuZXcgSHRtbEJpbmRlcihlbGVtLCB0aGlzLmJsb2Nrcykuc291cmNlO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyKGJsb2NrU291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycyAmJiBwYXJhbWV0ZXJzLmZvckVhY2goKHRvLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZyb20gPSB0cmFuc2xhdGUocGFyYW1zSW5wdXRbaW5kZXhdLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFBhaXJCaW5kKGZyb20sIGJsb2NrU291cmNlLCB0byk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UGFpckJpbmQoZnJvbSwgYmxvY2tTb3VyY2UsIHRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrU291cmNlW3RvXSA9IHBhcmFtVmFsdWVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrVG8pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZVtibG9ja1RvXSA9IGJsb2NrU291cmNlO1xuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIGRlYnVnZ2VyIGZvciBibG9jayBiaW5kaW5nc1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaW5kVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kVmFsdWUsICd2YWx1ZXMnLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2tpcClcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBlbGVtLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgIHRoaXMuYmluZEVsZW0oZWxlbS5jaGlsZHJlbltpXSwgc291cmNlTGlua3MpO1xuICAgIH1cblxuICAgIGNyZWF0ZUJpbmQoYmluZE5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuYmluZHNbYmluZE5hbWVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxldCBiaW5kID0ge2F0dHJpYnV0ZXM6IFtdLCBmb3JzOiBbXSwgaWZzOiBbXSwgcGFpcnM6IFtdLCB2YWx1ZXM6IFtdfTtcbiAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0gPSBiaW5kO1xuXG4gICAgICAgIHNldFByb3BlcnR5KHRoaXMuaGFuZGxlcnMsIFtiaW5kTmFtZSwgJ19mdW5jXyddLCAoKSA9PiB7XG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMgPSBiaW5kLmF0dHJpYnV0ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XG4gICAgICAgICAgICBiaW5kLmZvcnMgPSBiaW5kLmZvcnMuZmlsdGVyKCh7Y29udGFpbmVyfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGNvbnRhaW5lcikpO1xuICAgICAgICAgICAgYmluZC5pZnMgPSBiaW5kLmlmcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcbiAgICAgICAgICAgIGJpbmQudmFsdWVzID0gYmluZC52YWx1ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XG5cbiAgICAgICAgICAgIGJpbmQuYXR0cmlidXRlcy5mb3JFYWNoKCh7ZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXN9KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lID8gdGhpcy5hcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykgOiB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpbmQuZm9ycy5mb3JFYWNoKCh7Y29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rc30pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBiaW5kLmlmcy5mb3JFYWNoKCh7ZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC5wYWlycy5mb3JFYWNoKCh7ZnJvbSwgdG9PYmosIHRvS2V5fSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpbmQudmFsdWVzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZFZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBleHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgZXhwcmVzc2lvblN0ciwgdHlwZSwgc291cmNlTGlua3MpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnXG4gICAgICAgIGxldCBleHByZXNzaW9uTWF0Y2ggPSBleHByZXNzaW9uU3RyLm1hdGNoKGV4cHJlc3Npb25SZWdleCk7XG4gICAgICAgIGlmIChleHByZXNzaW9uTWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBbLCAsIGV4cHJlc3Npb25OYW1lLCBwYXJhbXNTdHJdID0gZXhwcmVzc2lvbk1hdGNoO1xuICAgICAgICAgICAgZXhwcmVzc2lvbk5hbWUgPSB0cmFuc2xhdGUoZXhwcmVzc2lvbk5hbWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5UGFyYW1zKHBhcmFtc1N0cik7XG4gICAgICAgICAgICBsZXQgYmluZFBhcmFtcyA9IHBhcmFtc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIocGFyYW0gPT4gcGFyYW1bMF0gIT09ICdfJylcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtc1xuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW1bMF0gPT09ICdfJyA/IHBhcmFtLnN1YnN0cigxKSA6IHBhcmFtKVxuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gdHJhbnNsYXRlKHBhcmFtLCBzb3VyY2VMaW5rcykpO1xuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zfTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoZXhwcmVzc2lvbk5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgICAgICBiaW5kUGFyYW1zXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEV4cHJlc3Npb25CaW5kKHBhcmFtLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGJpbmROYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25TdHIsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uVmFsdWUgPSB7ZWxlbSwgYmluZE5hbWV9O1xuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xuICAgICAgICBsZXQgcGFyYW1zID0gdmFsdWUuc3BsaXQoYmluZFJlZ2V4VW5jYXB0dXJpbmcpXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hMaXN0ID0gcGFyYW0ubWF0Y2goYmluZFJlZ2V4KTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoTGlzdClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdHJpbmdWYWx1ZTogcGFyYW19O1xuICAgICAgICAgICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgbWF0Y2hdID0gbWF0Y2hMaXN0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXhTbGFzaCA/IHtzdHJpbmdWYWx1ZTogYWxsLnN1YnN0cigxKX0gOiB7c291cmNlVmFsdWU6IHRyYW5zbGF0ZShtYXRjaCwgc291cmNlTGlua3MpfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0ge2VsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtc307XG5cbiAgICAgICAgcGFyYW1zXG4gICAgICAgICAgICAuZmlsdGVyKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlKVxuICAgICAgICAgICAgLmZvckVhY2goKHtzb3VyY2VWYWx1ZTogYmluZE5hbWV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYXR0cmlidXRlQmluZDtcbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVGdW5jdGlvbkJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgZnVuY3Rpb25OYW1lLCBwYXJhbXNTdHJdID0gdmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCk7IC8vIHRvZG8gcHJlZml4U2xhc2hcbiAgICAgICAgZnVuY3Rpb25OYW1lID0gdHJhbnNsYXRlKGZ1bmN0aW9uTmFtZSwgc291cmNlTGlua3MpO1xuICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB7ZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXN9O1xuXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmdW5jdGlvbk5hbWUpO1xuICAgICAgICB0aGlzLmJpbmRzW2Z1bmN0aW9uTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuXG4gICAgICAgIHBhcmFtc1xuICAgICAgICAgICAgLmZvckVhY2goYmluZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XG4gICAgICAgIC8vIHRvZG8gcHJldmVudCBiaW5kaW5nIG5vbiBzb3VyY2UgdmFsdWVzXG4gICAgfVxuXG4gICAgYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSkgeyAvLyB0eXBlID0gJ2lmcycgb3IgJ3ZhbHVlcydcbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgbGV0IGJpbmRlZCA9IHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnNvbWUob3RoZXJCaW5kID0+XG4gICAgICAgICAgICBvdGhlckJpbmQuZWxlbSA9PT0gZWxlbVxuICAgICAgICApO1xuICAgICAgICAhYmluZGVkICYmIHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnB1c2goZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgLy8gdG9kbyBwcmV2ZW50IGJpbmRpbmcgbm9uIHNvdXJjZSB2YWx1ZXNcbiAgICB9XG5cbiAgICBhZGRQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGZyb20pO1xuICAgICAgICB0aGlzLmJpbmRzW2Zyb21dLnBhaXJzLnB1c2goe2Zyb20sIHRvT2JqLCB0b0tleX0pO1xuICAgIH1cblxuICAgIGFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkVmFsdWUgPSBwYXJhbXNcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW0uc291cmNlVmFsdWUgPyBub3RVbmRlZmluZWQoZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtwYXJhbS5zb3VyY2VWYWx1ZV0pLCAnJykgOiBwYXJhbS5zdHJpbmdWYWx1ZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgbW9kaWZpZWRWYWx1ZSk7XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2Z1bmN0aW9uTmFtZV0pO1xuICAgICAgICBlbGVtW2F0dHJpYnV0ZU5hbWVdID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXMsIGVsZW0sIGV2ZW50KTtcbiAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkoZWxlbSwgcGFyYW1WYWx1ZXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbc291cmNlRnJvbV0pO1xuICAgICAgICBpZiAodmFsdWUgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHdoaWxlIChjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPiB2YWx1ZS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50OyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgc291cmNlTGlua3Nbc291cmNlVG9dID0gYCR7c291cmNlRnJvbX0uJHtpbmRleH1gO1xuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzLmluZGV4ID0gYF9udW1iZXJzXy4ke2luZGV4fWA7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShjaGlsZEVsZW0sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5QmluZElmKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMub2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgZWxlbS5oaWRkZW4gPSAhdmFsdWU7XG4gICAgfVxuXG4gICAgYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpIHtcbiAgICAgICAgdG9PYmpbdG9LZXldID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtmcm9tXSk7XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5vYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICBlbGVtLmlubmVySFRNTCA9IG5vdFVuZGVmaW5lZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgb2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XG4gICAgICAgIGlmICghZXhwcmVzc2lvbk5hbWUpXG4gICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtiaW5kTmFtZV0pO1xuXG4gICAgICAgIGxldCBleHByZXNzaW9uID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtleHByZXNzaW9uTmFtZV0pO1xuICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ2Z1bmN0aW9uJyAmJiBleHByZXNzaW9uKC4uLnBhcmFtVmFsdWVzKTtcbiAgICB9XG5cbiAgICAvLyB0b2RvIHVzZSBQYXJhbVNwbGl0dGVyIGluIG9yZGVyIHRvIHN1cHBvcnQgYXJyYXkgYW5kIG9iamVjdCBwYXJhbXRlcnNcbiAgICBnZXRQYXJhbVZhbHVlcyhwYXJhbXMsIHRoaXNzLCBldmVudCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLm1hcChwYXJhbSA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyYW1QYXRoID0gcGFyYW0uc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmIChwYXJhbVBhdGhbMF0gPT09ICd0aGlzJykge1xuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzcywgcGFyYW1QYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1QYXRoWzBdID09PSAnZXZlbnQnKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1QYXRoLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKGV2ZW50LCBwYXJhbVBhdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc291cmNlVmFsdWUgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3BhcmFtXSk7XG4gICAgICAgICAgICBpZiAoc291cmNlVmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlVmFsdWU7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocGFyYW0ucmVwbGFjZSgvJy9nLCAnXCInKSk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEFydGlmYWN0cygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgaGFuZGxlcnM6IHRoaXMuaGFuZGxlcnMsXG4gICAgICAgICAgICBiaW5kczogdGhpcy5iaW5kcyxcbiAgICAgICAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IHRoaXMuY29tcG9uZW50cyxcbiAgICAgICAgICAgIGJsb2NrczogdGhpcy5ibG9ja3NcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVwbGFjZUlubGluZUJpbmRpbmdzKGVsZW0pIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBlbGVtLmlubmVySFRNTC5yZXBsYWNlKGFsbFNwYW5SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xuICAgICAgICBlbGVtLmlubmVySFRNTCA9IGVsZW0uaW5uZXJIVE1MLnJlcGxhY2UoYWxsU3BhbkV4cHJlc3Npb25SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xuICAgIH1cblxuICAgIC8vIHRvZG8gdXNlIGluZGV4VG9Eb3QgZm9yIGF0dHJpYnV0ZSBiaW5kcyBhcyB3ZWxsLCBlLmcuIDxkaXYgc3R5bGU9XCIke2NvbG9yWzBdfVwiPiBhYmMgPC9kaXY+XG4gICAgc3RhdGljIGdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHJldHVybiBpbmRleFRvRG90KGVsZW0uZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkpO1xuICAgIH1cbn1cblxuLy8gYmluZHMgPSB7XG4vLyAgICAgJ2EuYi5jJzoge1xuLy8gICAgICAgICBhdHRyaWJ1dGVzOiBbYXR0cmlidXRlQmluZDEsIGF0dHJpYnV0ZUJpbmQyXSxcbi8vICAgICAgICAgZm9yczogW3tjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzfV0sXG4vLyAgICAgICAgIGlmczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQzXSxcbi8vICAgICAgICAgcGFpcnM6IFt7ZnJvbSwgdG9PYmosIHRvS2V5fV0sXG4vLyAgICAgICAgIHZhbHVlczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQyXVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gc291cmNlID0ge1xuLy8gICAgIGE6IHtcbi8vICAgICAgICAgYjoge1xuLy8gICAgICAgICAgICAgYzoge31cbi8vICAgICAgICAgfVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gaGFuZGxlcnMgPSB7XG4vLyAgICAgYToge1xuLy8gICAgICAgICBfZnVuY186ICdmdW5jJyxcbi8vICAgICAgICAgYjoge1xuLy8gICAgICAgICAgICAgYzoge1xuLy8gICAgICAgICAgICAgICAgIF9mdW5jXzogJ2Z1bmMnXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGNvbXBvbmVudHMgPSB7XG4vLyAgICAgYToge1xuLy8gICAgICAgICBvdXRlckVsZW06IG91dGVyRWxlbSxcbi8vICAgICAgICAgcGFyYW1zOiBbXVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gYXR0cmlidXRlQmluZCA9IHtcbi8vICAgICBlbGVtOiBlbGVtMSxcbi8vICAgICBhdHRyaWJ1dGVOYW1lLFxuLy8gICAgIGZ1bmN0aW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcbi8vICAgICBwYXJhbXM6IFt7c3RyaW5nVmFsdWUgfCBzb3VyY2VWYWx1ZTogc3RyaW5nfV0sIC8vIGZvciBudWxsIGZ1bmN0aW9uTmFtZVxuLy8gICAgIHBhcmFtczogW10gLy8gZm9yIG5vdCBudWxsIGZ1bmN0aW9uTmFtZVxuLy8gfTtcbi8vXG4vLyBleHByZXNzaW9uQmluZCA9IHtcbi8vICAgICBlbGVtOiBlbGVtMSxcbi8vICAgICBleHByZXNzaW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcbi8vICAgICBwYXJhbXM6IFtdLFxuLy8gICAgIGJpbmROYW1lIC8vIGNhbiBiZSBudWxsXG4vLyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWxCaW5kZXI7XG4iLCJjb25zdCBCb290ZXIgPSByZXF1aXJlKCcuL2Jvb3RlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IG5ldyBCb290ZXIoKTtcblxuLy8gdG9kb1xuLy8gYWxsb3cgYXJyYXkgYmluZGluZyBpbiBodG1sOiBgPGRpdiBiaW5kPVwieFt5XVwiPjwvZGl2PmBcbi8vIGNsZWFuIHVwIHBhY2thZ2UuanNvblxuLy8gJHN7eH0gc3ludGF4IHRvIG9ubHkgYWZmZWN0IGlubmVyIHRleHQgYW5kIG5vdCBhdHRyaWJ1dGVzXG4vLyBhbGxvdyBkZWZpbmluZyBhbmQgdXNpbmcgY29tcG9uZW50cyBpbiBhbnkgb3JkZXJcbi8vIGFsbG93IHVzaW5nIGV4cHJlc3Npb25zIGZvciBtb3JlIGJpbmRzIHRoYW4ganVzdCBpZnMgYW5kIHZhbHVlcyAoZS5nLiBhdHRyaWJ1dGVzLCBmb3JzLCBhcywgdXNlKVxuLy8gc3VwcG9ydCAkZSBuZXN0ZWQgaW5zaWRlICRzXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgc291cmNlLmEgPSBzb3VyY2UuYiBkb2Vzbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgYmluZC1mb3IgaW5kZXhWYXJzIGRvbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXG4vLyByb3V0aW5nIG9yIHN3YXBwaW5nIHN0YXRlc1xuIiwibGV0IGdldFByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gfHwge30pO1xuICAgIHJldHVybiBbb2JqLCBsYXN0RmllbGRdO1xufTtcblxubGV0IGdldFZhbHVlID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgcHJvcGVydHkgPSBnZXRQcm9wZXJ0eShvYmosIHBhdGhzKTtcbiAgICByZXR1cm4gcHJvcGVydHlbMV0gPT09IHVuZGVmaW5lZCA/IHByb3BlcnR5WzBdIDogcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dO1xufTtcblxubGV0IGNyZWF0ZVByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gPSBvYmpbZmllbGRdIHx8IHt9KTtcbiAgICByZXR1cm4gW29iaiwgbGFzdEZpZWxkXTtcbn07XG5cbmxldCBzZXRQcm9wZXJ0eSA9IChvYmosIHBhdGhzLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBwcm9wZXJ0eSA9IGNyZWF0ZVByb3BlcnR5KG9iaiwgcGF0aHMpO1xuICAgIHByb3BlcnR5WzBdW3Byb3BlcnR5WzFdXSA9IHZhbHVlO1xufTtcblxubGV0IGNsb25lID0gb3JpZ2luYWwgPT4ge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbCk7XG59O1xuXG5sZXQgdHJhbnNsYXRlID0gKG5hbWUsIGxpbmtzKSA9PiB7XG4gICAgbGV0IG9jY3VycmVkID0gW107XG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhbbmFtZV0pO1xuICAgIHdoaWxlIChmaWVsZHNbMF0gaW4gbGlua3MpIHtcbiAgICAgICAgb2NjdXJyZWQucHVzaChmaWVsZHNbMF0pO1xuICAgICAgICBmaWVsZHNbMF0gPSBsaW5rc1tmaWVsZHNbMF1dO1xuICAgICAgICBpZiAob2NjdXJyZWQuaW5jbHVkZXMoZmllbGRzWzBdKSlcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBmaWVsZHMgPSBnZXRGaWVsZHMoZmllbGRzKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoKGEsIGIpID0+IGAke2F9LiR7Yn1gKTtcbn07XG5cbmxldCBnZXRGaWVsZHMgPSBwYXRocyA9PlxuICAgIHBhdGhzXG4gICAgICAgIC5tYXAocGF0aCA9PiBwYXRoLnNwbGl0KCcuJykpXG4gICAgICAgIC5yZWR1Y2UoKGFnZ3JlZ2F0ZSwgaXRlbSkgPT4gYWdncmVnYXRlLmNvbmNhdChpdGVtKSwgW10pO1xuXG5sZXQgaW5kZXhUb0RvdCA9IGZpZWxkID0+IGZpZWxkICYmIGZpZWxkLnJlcGxhY2UoL1xcWyhcXHcrKVxcXS9nLCAoXywgbWF0Y2gpID0+IGAuJHttYXRjaH1gKTtcblxubGV0IG5vdFVuZGVmaW5lZCA9ICh2YWx1ZSwgdW5kZWZpbmVkVmFsdWUgPSBudWxsKSA9PlxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHVuZGVmaW5lZFZhbHVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIGNsb25lLCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZH07XG4iLCJjbGFzcyBQYXJhbVNwbGl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB9XG5cbiAgICBzcGxpdEJ5UGFyYW1zKCkge1xuICAgICAgICBsZXQgZGVwdGggPSAwO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHRJbmRleCgpICYmICghdGhpcy5hdFF1b3RlKCkgfHwgdGhpcy5za2lwUXVvdGUoKSkpIHtcbiAgICAgICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgICAgICBpZiAoY2hhciA9PT0gJ1snKVxuICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnXScpXG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICcsJyAmJiAhZGVwdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5pbmRleCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtcztcbiAgICB9XG5cbiAgICBmaW5kSW5kZXgocmVnZXgsIHN0YXJ0KSB7IC8vIHJldHVybnMgLTEgb3IgaW5kZXggb2YgbWF0Y2hcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zdHJpbmcuc3Vic3RyaW5nKHN0YXJ0KS5zZWFyY2gocmVnZXgpO1xuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCA/IGluZGV4ICsgc3RhcnQgOiAtMTtcbiAgICB9O1xuXG4gICAgbmV4dEluZGV4KCkge1xuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5maW5kSW5kZXgoL1ssJ1wiW1xcXV0vLCB0aGlzLmluZGV4ICsgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAtMTtcbiAgICB9XG5cbiAgICBhdFF1b3RlKCkge1xuICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xuICAgICAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIjtcbiAgICB9XG5cbiAgICBza2lwUXVvdGUoKSB7XG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleChjaGFyID09PSAnXCInID8gL1teXFxcXF1cIi8gOiAvW15cXFxcXScvLCB0aGlzLmluZGV4ICsgMSkgKyAxO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG5cbiAgICBhZGRQYXJhbSgpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMucHVzaCh0aGlzLnN0cmluZy5zdWJzdHJpbmcodGhpcy5zdGFydEluZGV4LCB0aGlzLmluZGV4ID4gMCA/IHRoaXMuaW5kZXggOiB0aGlzLnN0cmluZy5sZW5ndGgpLnRyaW0oKSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiBuZXcgUGFyYW1TcGxpdHRlcihzdHJpbmcpLnNwbGl0QnlQYXJhbXMoKTtcbiIsIi8vIChbXFx3LltcXF1dKylcblxubGV0IHNwYW5SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdXSspfS87XG5sZXQgYWxsU3BhblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuUmVnZXgsICdnJyk7XG5sZXQgc3BhbkV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdIT0+PHwmXStcXCguKlxcKSl9LztcbmxldCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuRXhwcmVzc2lvblJlZ2V4LCAnZycpO1xuXG5sZXQgYmluZFJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKX0vO1xubGV0IGJpbmRSZWdleFVuY2FwdHVyaW5nID0gLygoPzpcXFxcKT9cXCR7KD86W1xcdy5bXFxdXSspfSkvO1xuXG5sZXQgZnVuY3Rpb25SZWdleCA9IC8oXFxcXCk/XFwkeyhbXFx3LltcXF1dKylcXCgoLiopXFwpfS87XG5cbmxldCBleHByZXNzaW9uUmVnZXggPSAvKFxcXFwpPyhbXFx3LltcXF0hPT48fCZdKylcXCgoLiopXFwpLztcblxubW9kdWxlLmV4cG9ydHMgPSB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9O1xuIiwibGV0IGNyZWF0ZVNvdXJjZSA9ICgpID0+IHtcbiAgICBsZXQgaGFuZGxlcnMgPSB7fTtcbiAgICBsZXQgb3JpZ2luID0ge307XG4gICAgbGV0IHNvdXJjZSA9IGNyZWF0ZVByb3h5KG9yaWdpbiwgaGFuZGxlcnMpO1xuICAgIHNldERlZmF1bHRTb3VyY2Uob3JpZ2luKTtcbiAgICByZXR1cm4ge29yaWdpbiwgc291cmNlLCBoYW5kbGVyc307XG59O1xuXG5sZXQgaWdub3JlID0gW107XG5cbmxldCBpc0JpbmRJZ25vcmVkID0gKG9iaiwgcHJvcCkgPT4gb2JqLl9fYmluZElnbm9yZV9fICYmIG9iai5fX2JpbmRJZ25vcmVfXy5pbmNsdWRlcyhwcm9wKTtcblxuLy8gdG9kbyBtYWtlIF9fYmluZEF2b2lkQ3ljbGVzX18gaW5oZXJpdGVkIGFuZCBtYXliZSBhdm9pZCBwZXIgYmluZGluZyBpbnN0ZWFkIHBlciBjaGFuZ2VcbmxldCBpc0lnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBpc0JpbmRJZ25vcmVkKG9iaiwgcHJvcCkgfHwgKG9iai5fX2JpbmRBdm9pZEN5Y2xlc19fICYmIGlnbm9yZS5zb21lKGlnbm9yZSA9PiBpZ25vcmUub2JqID09PSBvYmogJiYgaWdub3JlLnByb3AgPT09IHByb3ApKTtcblxubGV0IGhhbmRsZVNldCA9IChvYmosIHByb3AsIGhhbmRsZXJzLCBhY2N1bXVsYXRlZEhhbmRsZXJzKSA9PiB7XG4gICAgaWdub3JlLnB1c2goe29iaiwgcHJvcH0pO1xuICAgIGFjY3VtdWxhdGVkSGFuZGxlcnMuZm9yRWFjaChkb0hhbmRsZXIpO1xuICAgIGhhbmRsZXJzICYmIHByb3BvZ2F0ZUhhbmRsZXJEb3duKGhhbmRsZXJzKTtcbiAgICBpZ25vcmUucG9wKCk7XG59O1xuXG5sZXQgY3JlYXRlUHJveHkgPSAob2JqLCBoYW5kbGVycyA9IHt9LCBhY2N1bXVsYXRlZEhhbmRsZXJzID0gW10pID0+IG5ldyBQcm94eShvYmosIHtcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3ApID0+IHtcbiAgICAgICAgbGV0IGdvdCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZ290ID09PSAnb2JqZWN0JyAmJiBnb3QgJiYgIWlzQmluZElnbm9yZWQob2JqLCBwcm9wKSA/IGNyZWF0ZVByb3h5KGdvdCwgaGFuZGxlcnNbcHJvcF0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSkgOiBnb3Q7XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XG4gICAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpO1xuICAgICAgICAhaXNJZ25vcmVkKG9iaiwgcHJvcCkgJiYgaGFuZGxlU2V0KG9iaiwgcHJvcCwgaGFuZGxlcnNbcHJvcF0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSk7IC8vIHRvZG8gd3JhcCBoYW5kbGVycyBhbmQgYWNjdW11bGF0ZWRIYW5kbGVycyBpbiBjbGFzcyB3aXRoIHBvcFByb3AgbWV0aG9kXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pO1xuXG5sZXQgcHJvcG9nYXRlSGFuZGxlckRvd24gPSBoYW5kbGVycyA9PiB7XG4gICAgZG9IYW5kbGVyKGhhbmRsZXJzKTtcbiAgICBPYmplY3QuZW50cmllcyhoYW5kbGVycylcbiAgICAgICAgLmZpbHRlcigoW2tleV0pID0+IGtleSAhPT0gJ19mdW5jXycpXG4gICAgICAgIC5mb3JFYWNoKChbLCBoYW5kbGVyXSkgPT4gcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcikpO1xufTtcblxubGV0IGRvSGFuZGxlciA9IGhhbmRsZXIgPT4gdHlwZW9mIGhhbmRsZXIuX2Z1bmNfID09PSAnZnVuY3Rpb24nICYmIGhhbmRsZXIuX2Z1bmNfKCk7XG5cbmxldCBzZXREZWZhdWx0U291cmNlID0gc291cmNlID0+IHtcbiAgICBzb3VyY2UuX251bWJlcnNfID0gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgIGdldDogKF8sIHByb3ApID0+IHBhcnNlSW50KHByb3ApLFxuICAgICAgICBzZXQ6ICgpID0+IGZhbHNlXG4gICAgfSk7XG4gICAgc291cmNlLm5vdCA9IGEgPT4gIWE7XG4gICAgc291cmNlWychJ10gPSBhID0+ICFhO1xuICAgIHNvdXJjZS5lcSA9IChhLCBiKSA9PiBhID09PSBiO1xuICAgIHNvdXJjZS5lcXVhbCA9IChhLCBiKSA9PiBhID09PSBiO1xuICAgIHNvdXJjZVsnPSddID0gKGEsIGIpID0+IGEgPT09IGI7XG4gICAgc291cmNlLm5FcSA9IChhLCBiKSA9PiBhICE9PSBiO1xuICAgIHNvdXJjZS5ub3RFcXVhbCA9IChhLCBiKSA9PiBhICE9PSBiO1xuICAgIHNvdXJjZVsnIT0nXSA9IChhLCBiKSA9PiBhICE9PSBiO1xuICAgIHNvdXJjZS5ncmVhdGVyID0gKGEsIGIpID0+IGEgPiBiO1xuICAgIHNvdXJjZVsnPiddID0gKGEsIGIpID0+IGEgPiBiO1xuICAgIHNvdXJjZS5sZXNzID0gKGEsIGIpID0+IGEgPCBiO1xuICAgIHNvdXJjZVsnPCddID0gKGEsIGIpID0+IGEgPCBiO1xuICAgIHNvdXJjZS5ncmVhdGVyRXEgPSAoYSwgYikgPT4gYSA+PSBiO1xuICAgIHNvdXJjZVsnPj0nXSA9IChhLCBiKSA9PiBhID49IGI7XG4gICAgc291cmNlLmxlc3NFcSA9IChhLCBiKSA9PiBhIDw9IGI7XG4gICAgc291cmNlWyc8PSddID0gKGEsIGIpID0+IGEgPD0gYjtcbiAgICBzb3VyY2Uub3IgPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcbiAgICBzb3VyY2VbJ3wnXSA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xuICAgIHNvdXJjZVsnfHwnXSA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xuICAgIHNvdXJjZS5hbmQgPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XG4gICAgc291cmNlWycmJ10gPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XG4gICAgc291cmNlWycmJiddID0gKC4uLmFzKSA9PiBhcy5ldmVyeShhID0+IGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7Y3JlYXRlU291cmNlfTtcbiIsImxldCBzcGxpdEJ5V29yZCA9IChzdHJpbmcsIHdvcmQpID0+XG4gICAgc3RyaW5nLnNwbGl0KG5ldyBSZWdFeHAoYFxcXFxzKyR7d29yZH1cXFxccytgKSk7XG5cbmxldCBzcGxpdEJ5Q29tbWEgPSBzdHJpbmcgPT5cbiAgICBzdHJpbmcuc3BsaXQoL1xccyosXFxzKi8pO1xuXG5sZXQgc3BsaXRCeVNwYWNlID0gc3RyaW5nID0+XG4gICAgc3RyaW5nLnNwbGl0KC9cXHMrLyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX07XG4iXX0=
