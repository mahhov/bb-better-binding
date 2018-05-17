(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

let template = "<div bind-for=\"item in list\" bind=\"item\"></div>\r\n";
let controllerString = "module.exports = source => {\r\n    source.list = ['elephant', 'lion', 'rabbit'];\r\n};\r\n";
let controller = require('./controller');

module.exports = {template, controller, controllerString};

},{"./controller":2}],2:[function(require,module,exports){
module.exports = source => {
    source.list = ['elephant', 'lion', 'rabbit'];
};

},{}],3:[function(require,module,exports){

let template = "<div>\r\n    <span>truthy:</span>\r\n    <span bind-if=\"truthy\">whenever `source.truthy` is modified, my visibility will be updated to reflect the change</span>\r\n</div>\r\n\r\n<div>\r\n    <span>falsy:</span>\r\n    <span bind-if=\"falsy\">whenever `source.falsy` is modified, my visibility will be updated to reflect the change</span>\r\n</div>\r\n\r\n<div>\r\n    <span>isGreaterThan10(myVariable):</span>\r\n    <span bind-if=\"isGreaterThan10(myVariable)\">whenever `source.isGreaterThan10` or `source.myVariable` are modified, my visibility be updated to reflect the change</span>\r\n</div>\r\n\r\n<div>\r\n    <span>isGreaterThan10(5):</span>\r\n    <span bind-if=\"isGreaterThan10(5)\">whenever `source.isGreaterThan10` is modified, my visibility be updated to reflect the change</span>\r\n</div>\r\n";
let controllerString = "module.exports = source => {\r\n    source.truthy = true;\r\n\r\n    source.falsy = false;\r\n\r\n    source.isGreaterThan10 = a => a > 10;\r\n\r\n    source.myVariable = 15;\r\n};\r\n";
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

let template = "<div bind=\"myMessage\"></div>\r\n\r\n<div bind=\"myFunction(myVariable, 'string', 100, ['array', 30])\"></div>\r\n\r\n$s{mySpanMessage}\r\n";
let controllerString = "module.exports = source => {\r\n    source.myMessage = 'whenever `source.myMessage` is modified, my text be updated to reflect the change';\r\n\r\n    source.myFunction = (variable, string, integer, [string2, integer2]) =>\r\n        `whenever \\`source.myFunction\\` or \\`source.myVariable\\` are modified, my text be updated to reflect the change; ${variable} ${string} ${integer} ${string2} ${integer2}`;\r\n\r\n    source.myVariable = '-my variable is awesome-';\r\n\r\n    source.mySpanMessage = '$s{x} is shorthand for &lt;span bind=\"x\"&gt; &lt;/span&gt;';\r\n};\r\n";
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
let template = "<div>\r\n    <div style=\"font-size:${largeFont}; color:${favoriteColor}\">\r\n        $s{greeting}, $s{name} $s{exclamation}\r\n    </div>\r\n    wuts ur favorite color?\r\n    <input value=\"${favoriteColor}\" onkeyup=\"${changeColor(this)}\">\r\n</div>\r\n\r\n<div style=\"margin-top:100px\">\r\n    <button onclick=\"${changeAnimation()}\">click me!</button>\r\n    <br/>\r\n    <img src=\"${animation}\">\r\n</div>\r\n\r\n<div style=\"margin-top:100px\">\r\n    <p>i have jokes:</p>\r\n    <input id=\"check\" type=\"checkbox\" onchange=\"${setJokeVisibility(this)}\"/><label for=\"check\">show jokes?</label>\r\n    <div bind-if=\"jokeVisibility\">\r\n        <div bind-for=\"joke in jokes\">\r\n            <h3 bind=\"index\"></h3>\r\n            <p bind-for=\"line in joke.lines\" bind=\"line\"></p>\r\n        </div>\r\n        <h3>Source: $s{jokesSource}</h3>\r\n    </div>\r\n</div>";

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
let template = "<div>\r\n    <span bind-for=\"page in pages\">\r\n        <input type=\"radio\" id=\"navigationRadio${index}\" name=\"navigationRadios\" bind-elem=\"navigationRadio${index}\"\r\n               onchange=\"${setPageHandler(index)}\"/>\r\n        <label for=\"navigationRadio${index}\" bind=\"page\"></label>\r\n    </span>\r\n</div>\r\n";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaXZlRXhhbXBsZS9iaW5kRm9yL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZEZvci9jb250cm9sbGVyLmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvaW5wdXQuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvY29udHJvbGxlci5qcyIsImxpdmVFeGFtcGxlL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9oZWxsb1dvcmxkL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvbmF2aWdhdGlvbi9pbnB1dC5qcyIsInNyYy9ib290ZXIuanMiLCJzcmMvaHRtbEJpbmRlci5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9vYmpTY2Fmb2xkaW5nLmpzIiwic3JjL3BhcmFtU3BsaXR0ZXIuanMiLCJzcmMvcmVnZXguanMiLCJzcmMvc291cmNlLmpzIiwic3JjL3N0cmluZ1NwbGl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQXlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLHlEQUFvRCxDQUFDO0FBQ3BFLElBQUksZ0JBQWdCLEdBQUcsNkZBQXFELENBQUM7QUFDN0UsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUNMMUQ7QUFDQTtBQUNBO0FBQ0E7O0FDSHlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLDZ5QkFBbUQsQ0FBQztBQUNuRSxJQUFJLGdCQUFnQixHQUFHLDBMQUFxRCxDQUFDO0FBQzdFLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFekMsTUFBTSxDQUFDLE9BQU8s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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmxldCB0ZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2JpbmRGb3IuaHRtbGAsICd1dGY4Jyk7XHJcbmxldCBjb250cm9sbGVyU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vY29udHJvbGxlci5qc2AsICd1dGY4Jyk7XHJcbmxldCBjb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgY29udHJvbGxlclN0cmluZ307XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gc291cmNlID0+IHtcclxuICAgIHNvdXJjZS5saXN0ID0gWydlbGVwaGFudCcsICdsaW9uJywgJ3JhYmJpdCddO1xyXG59O1xyXG4iLCJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmxldCB0ZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2JpbmRJZi5odG1sYCwgJ3V0ZjgnKTtcclxubGV0IGNvbnRyb2xsZXJTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9jb250cm9sbGVyLmpzYCwgJ3V0ZjgnKTtcclxubGV0IGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXInKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBjb250cm9sbGVyU3RyaW5nfTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBzb3VyY2UgPT4ge1xyXG4gICAgc291cmNlLnRydXRoeSA9IHRydWU7XHJcblxyXG4gICAgc291cmNlLmZhbHN5ID0gZmFsc2U7XHJcblxyXG4gICAgc291cmNlLmlzR3JlYXRlclRoYW4xMCA9IGEgPT4gYSA+IDEwO1xyXG5cclxuICAgIHNvdXJjZS5teVZhcmlhYmxlID0gMTU7XHJcbn07XHJcbiIsImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxubGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vYmluZFZhbHVlLmh0bWxgLCAndXRmOCcpO1xyXG5sZXQgY29udHJvbGxlclN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2NvbnRyb2xsZXIuanNgLCAndXRmOCcpO1xyXG5sZXQgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcicpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJTdHJpbmd9O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNvdXJjZSA9PiB7XHJcbiAgICBzb3VyY2UubXlNZXNzYWdlID0gJ3doZW5ldmVyIGBzb3VyY2UubXlNZXNzYWdlYCBpcyBtb2RpZmllZCwgbXkgdGV4dCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIGNoYW5nZSc7XHJcblxyXG4gICAgc291cmNlLm15RnVuY3Rpb24gPSAodmFyaWFibGUsIHN0cmluZywgaW50ZWdlciwgW3N0cmluZzIsIGludGVnZXIyXSkgPT5cclxuICAgICAgICBgd2hlbmV2ZXIgXFxgc291cmNlLm15RnVuY3Rpb25cXGAgb3IgXFxgc291cmNlLm15VmFyaWFibGVcXGAgYXJlIG1vZGlmaWVkLCBteSB0ZXh0IGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgY2hhbmdlOyAke3ZhcmlhYmxlfSAke3N0cmluZ30gJHtpbnRlZ2VyfSAke3N0cmluZzJ9ICR7aW50ZWdlcjJ9YDtcclxuXHJcbiAgICBzb3VyY2UubXlWYXJpYWJsZSA9ICctbXkgdmFyaWFibGUgaXMgYXdlc29tZS0nO1xyXG5cclxuICAgIHNvdXJjZS5teVNwYW5NZXNzYWdlID0gJyRze3h9IGlzIHNob3J0aGFuZCBmb3IgJmx0O3NwYW4gYmluZD1cInhcIiZndDsgJmx0Oy9zcGFuJmd0Oyc7XHJcbn07XHJcbiIsImNvbnN0IGJiID0gcmVxdWlyZSgnYmItYmV0dGVyLWJpbmRpbmcnKSgpO1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5jbGVhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XHJcbn07XHJcblxyXG4vLyBibG9jayBkZWNsYXJhdGlvbnNcclxuXHJcbmJiLmRlY2xhcmVCbG9jaygnbmF2aWdhdGlvbicsIHJlcXVpcmUoJy4vbmF2aWdhdGlvbi9uYXZpZ2F0aW9uJykpO1xyXG5cclxubGV0IHZhbHVlQmxvY2tEYXRhID0gcmVxdWlyZSgnLi9iaW5kVmFsdWUvYmluZFZhbHVlJyk7XHJcbmJiLmRlY2xhcmVCbG9jaygnYmluZFZhbHVlJywgdmFsdWVCbG9ja0RhdGEpO1xyXG5cclxubGV0IGlmQmxvY2tEYXRhID0gcmVxdWlyZSgnLi9iaW5kSWYvYmluZElmJyk7XHJcbmJiLmRlY2xhcmVCbG9jaygnYmluZElmJywgaWZCbG9ja0RhdGEpO1xyXG5cclxubGV0IGZvckJsb2NrRGF0YSA9IHJlcXVpcmUoJy4vYmluZEZvci9iaW5kRm9yJyk7XHJcbmJiLmRlY2xhcmVCbG9jaygnYmluZEZvcicsIGZvckJsb2NrRGF0YSk7XHJcblxyXG5iYi5kZWNsYXJlQmxvY2soJ2hlbGxvV29ybGQnLCByZXF1aXJlKCcuL2hlbGxvV29ybGQvaGVsbG9Xb3JsZCcpKTtcclxuXHJcbi8vIGJvb3RpbmdcclxuXHJcbmxldCBzb3VyY2UgPSBiYi5ib290KGRvY3VtZW50LmZpcnN0RWxlbWVudENoaWxkLCB3aW5kb3cpO1xyXG5cclxuLy8gYXBwIGNvbnRyb2xsZXJcclxuXHJcblxyXG5sZXQgc25pcHBldHMgPSBbdmFsdWVCbG9ja0RhdGEsIGlmQmxvY2tEYXRhLCBmb3JCbG9ja0RhdGFdO1xyXG5sZXQgbGlua05hbWVzID0gWydiaW5kVmFsdWUnLCAnYmluZElmJywgJ2JpbmRGb3InLCAnaGVsbG9Xb3JsZCddO1xyXG5zb3VyY2UubmF2aWdhdGlvblBhZ2VzID0gWydWYWx1ZSBCaW5kaW5nJywgJ0lmIEJpbmRpbmcnLCAnRm9yIEJpbmRpbmcnLCAnSGVsbG8gV29ybGQnXTtcclxuXHJcbnNvdXJjZS5zZXRQYWdlSW5kZXggPSBwYWdlSW5kZXggPT4ge1xyXG4gICAgc291cmNlLnBhZ2VJbmRleCA9IHBhZ2VJbmRleDtcclxuICAgIHNvdXJjZS5zbmlwcGV0ID0gc25pcHBldHNbcGFnZUluZGV4XSAmJiB7XHJcbiAgICAgICAgdGVtcGxhdGU6IHNuaXBwZXRzW3BhZ2VJbmRleF0udGVtcGxhdGUuY2xlYW4oKSxcclxuICAgICAgICBjb250cm9sbGVyOiBzbmlwcGV0c1twYWdlSW5kZXhdLmNvbnRyb2xsZXJTdHJpbmcuY2xlYW4oKVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgbGlua05hbWUgPSBsaW5rTmFtZXNbcGFnZUluZGV4XTtcclxuICAgIGxldCBsaW5rRXhwYW5kZWQgPSBgaHR0cHM6Ly9naXRodWIuY29tL21haGhvdi9iYi1iZXR0ZXItYmluZGluZy9ibG9iL0hFQUQvbGl2ZUV4YW1wbGUvJHtsaW5rTmFtZX0vJHtsaW5rTmFtZX1gO1xyXG4gICAgc291cmNlLmxpbmtzID0gW2Ake2xpbmtFeHBhbmRlZH0uaHRtbGAsIGAke2xpbmtFeHBhbmRlZH0uanNgXTtcclxufTtcclxuXHJcbnNvdXJjZS5zZXRQYWdlSW5kZXgoMCk7XHJcbnNvdXJjZS5uYXZpZ2F0aW9uQmxvY2submF2aWdhdGlvblJhZGlvMC5jaGVja2VkID0gdHJ1ZTtcclxuIiwibGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9oZWxsb1dvcmxkLmh0bWxgLCAndXRmOCcpO1xyXG5cclxubGV0IGNvbnRyb2xsZXIgPSBzb3VyY2UgPT4ge1xyXG5cclxuICAgIC8vIGdyZWV0aW5nXHJcbiAgICBzb3VyY2UubGFyZ2VGb250ID0gNjA7XHJcbiAgICBzb3VyY2UuZmF2b3JpdGVDb2xvciA9ICdERUVQcGluayc7XHJcbiAgICBzb3VyY2UuZ3JlZXRpbmcgPSAnSSBoYXRlIHlvdSc7XHJcbiAgICBzb3VyY2UubmFtZSA9ICdXb3JsZCc7XHJcbiAgICBzb3VyY2UuZXhjbGFtYXRpb24gPSAnKOKVr8Kw4pahwrDvvInila/vuLUg4pS74pSB4pS7JztcclxuICAgIHNvdXJjZS5jaGFuZ2VDb2xvciA9IGlucHV0ID0+IHtcclxuICAgICAgICBzb3VyY2UuZmF2b3JpdGVDb2xvciA9IGlucHV0LnZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBhbmltYXRpb25cclxuICAgIGxldCBhbmltYXRpb25zID0gW1xyXG4gICAgICAgICdodHRwOi8vd3d3LnFxcHIuY29tL2FzY2lpL2ltZy9hc2NpaS0xMDQzLmdpZicsXHJcbiAgICAgICAgJ2h0dHBzOi8vbWVkaWEwLmdpcGh5LmNvbS9tZWRpYS8xMkVrSkNicGEzaEdLYy9naXBoeS5naWYnLFxyXG4gICAgICAgICdodHRwOi8vd3d3LnFxcHIuY29tL2FzY2lpL2ltZy9hc2NpaS0xMDA2LmdpZiddO1xyXG4gICAgbGV0IGFuaW1hdGlvbkluZGV4ID0gLTE7XHJcbiAgICBzb3VyY2UuY2hhbmdlQW5pbWF0aW9uID0gKCkgPT4ge1xyXG4gICAgICAgIGFuaW1hdGlvbkluZGV4ID0gKGFuaW1hdGlvbkluZGV4ICsgMSkgJSBhbmltYXRpb25zLmxlbmd0aDtcclxuICAgICAgICBzb3VyY2UuYW5pbWF0aW9uID0gYW5pbWF0aW9uc1thbmltYXRpb25JbmRleF07XHJcbiAgICB9O1xyXG4gICAgc291cmNlLmNoYW5nZUFuaW1hdGlvbigpO1xyXG5cclxuICAgIC8vIGpva2VzXHJcbiAgICBzb3VyY2Uuc2V0Sm9rZVZpc2liaWxpdHkgPSBjaGVja2JveCA9PiB7XHJcbiAgICAgICAgc291cmNlLmpva2VWaXNpYmlsaXR5ID0gY2hlY2tib3guY2hlY2tlZDtcclxuICAgIH07XHJcbiAgICBzb3VyY2Uuam9rZXMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkxlZnQgaW5zaWRlIG1haW4gdGlyZSBhbG1vc3QgbmVlZHMgcmVwbGFjZW1lbnQuXCInLFxyXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkFsbW9zdCByZXBsYWNlZCBsZWZ0IGluc2lkZSBtYWluIHRpcmUuXCInXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiVGVzdCBmbGlnaHQgT0ssIGV4Y2VwdCBhdXRvbGFuZCB2ZXJ5IHJvdWdoLlwiJyxcclxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJBdXRvbGFuZCBub3QgaW5zdGFsbGVkIG9uIHRoaXMgYWlyY3JhZnQuXCInXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICAgICAnUHJvYmxlbSAjMTogIFwiIzIgUHJvcGVsbGVyIHNlZXBpbmcgcHJvcCBmbHVpZC5cIicsXHJcbiAgICAgICAgICAgICAgICAnU29sdXRpb24gIzE6IFwiIzIgUHJvcGVsbGVyIHNlZXBhZ2Ugbm9ybWFsLlwiJyxcclxuICAgICAgICAgICAgICAgICdQcm9ibGVtICMyOiAgXCIjMSwgIzMsIGFuZCAjNCBwcm9wZWxsZXJzIGxhY2sgbm9ybWFsIHNlZXBhZ2UuXCInXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogICAgXCJUaGUgYXV0b3BpbG90IGRvZXNuXFwndC5cIicsXHJcbiAgICAgICAgICAgICAgICAnU2lnbmVkIG9mZjogXCJJVCBET0VTIE5PVy5cIidcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJTb21ldGhpbmcgbG9vc2UgaW4gY29ja3BpdC5cIicsXHJcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiU29tZXRoaW5nIHRpZ2h0ZW5lZCBpbiBjb2NrcGl0LlwiJ1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkV2aWRlbmNlIG9mIGh5ZHJhdWxpYyBsZWFrIG9uIHJpZ2h0IG1haW4gbGFuZGluZyBnZWFyLlwiJyxcclxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJFdmlkZW5jZSByZW1vdmVkLlwiJ1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRNRSB2b2x1bWUgdW5iZWxpZXZhYmx5IGxvdWQuXCInLFxyXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlZvbHVtZSBzZXQgdG8gbW9yZSBiZWxpZXZhYmxlIGxldmVsLlwiJ1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBsaW5lczogW1xyXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRlYWQgYnVncyBvbiB3aW5kc2hpZWxkLlwiJyxcclxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJMaXZlIGJ1Z3Mgb24gb3JkZXIuXCInXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiQXV0b3BpbG90IGluIGFsdGl0dWRlIGhvbGQgbW9kZSBwcm9kdWNlcyBhIDIwMCBmcG0gZGVzY2VudC5cIicsXHJcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiQ2Fubm90IHJlcHJvZHVjZSBwcm9ibGVtIG9uIGdyb3VuZC5cIidcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgbGluZXM6IFtcclxuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJJRkYgaW5vcGVyYXRpdmUuXCInLFxyXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIklGRiBhbHdheXMgaW5vcGVyYXRpdmUgaW4gT0ZGIG1vZGUuXCInXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiRnJpY3Rpb24gbG9ja3MgY2F1c2UgdGhyb3R0bGUgbGV2ZXJzIHRvIHN0aWNrLlwiJyxcclxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJUaGF0XFwncyB3aGF0IHRoZXlcXCdyZSB0aGVyZSBmb3IuXCInXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxpbmVzOiBbXHJcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiTnVtYmVyIHRocmVlIGVuZ2luZSBtaXNzaW5nLlwiJyxcclxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJFbmdpbmUgZm91bmQgb24gcmlnaHQgd2luZyBhZnRlciBicmllZiBzZWFyY2guXCInXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgXTtcclxuICAgIHNvdXJjZS5qb2tlc1NvdXJjZSA9ICdodHRwczovL3d3dy5uZXRmdW5ueS5jb20vcmhmL2pva2VzLzk3L0p1bi91c2FmLmh0bWwnO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGUsIGNvbnRyb2xsZXJ9O1xyXG4iLCJsZXQgdGVtcGxhdGUgPSByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L25hdmlnYXRpb24uaHRtbGAsICd1dGY4Jyk7XHJcblxyXG5sZXQgY29udHJvbGxlciA9IHNvdXJjZSA9PiB7XHJcbn07XHJcblxyXG5sZXQgcGFyYW1ldGVycyA9IFsncGFnZXMnLCAnc2V0UGFnZUhhbmRsZXInXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBwYXJhbWV0ZXJzfTsiLCJjb25zdCBIdG1sQmluZGVyID0gcmVxdWlyZSgnLi9odG1sQmluZGVyJyk7XHJcblxyXG5jbGFzcyBCb290ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYmxvY2tzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZGVjbGFyZUJsb2NrKGJsb2NrTmFtZSwgYmxvY2spIHtcclxuICAgICAgICB0aGlzLmJsb2Nrc1tibG9ja05hbWVdID0gYmxvY2s7XHJcbiAgICB9XHJcblxyXG4gICAgYm9vdChyb290LCBkZWJ1Zykge1xyXG4gICAgICAgIGxldCBhcnRpZmFjdHMgPSBuZXcgSHRtbEJpbmRlcihyb290LCB0aGlzLmJsb2NrcykuZ2V0QXJ0aWZhY3RzKCk7XHJcbiAgICAgICAgZGVidWcgJiYgT2JqZWN0LmFzc2lnbihkZWJ1ZywgYXJ0aWZhY3RzKTtcclxuICAgICAgICByZXR1cm4gYXJ0aWZhY3RzLnNvdXJjZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb290ZXI7XHJcbiIsImNvbnN0IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIGNsb25lLCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZH0gPSByZXF1aXJlKCcuL29ialNjYWZvbGRpbmcnKTtcclxuY29uc3Qge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX0gPSByZXF1aXJlKCcuL3N0cmluZ1NwbGl0dGVyJyk7XHJcbmNvbnN0IHNwbGl0QnlQYXJhbXMgPSByZXF1aXJlKCcuL3BhcmFtU3BsaXR0ZXInKTtcclxuY29uc3Qge2NyZWF0ZVNvdXJjZX0gPSByZXF1aXJlKCcuL3NvdXJjZScpO1xyXG5jb25zdCB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9ID0gcmVxdWlyZSgnLi9yZWdleCcpO1xyXG5cclxuY2xhc3MgSHRtbEJpbmRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iocm9vdCwgYmxvY2tzKSB7XHJcbiAgICAgICAgbGV0IHtvcmlnaW4sIHNvdXJjZSwgaGFuZGxlcnN9ID0gY3JlYXRlU291cmNlKCk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xyXG4gICAgICAgIHRoaXMuYmluZHMgPSB7fTtcclxuICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuYmxvY2tzID0gYmxvY2tzO1xyXG5cclxuICAgICAgICBIdG1sQmluZGVyLnJlcGxhY2VJbmxpbmVCaW5kaW5ncyhyb290KTtcclxuICAgICAgICB0aGlzLmJpbmRFbGVtKHJvb3QsIHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kRWxlbShlbGVtLCBzb3VyY2VMaW5rcykge1xyXG4gICAgICAgIGxldCBza2lwID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGVsZW0uYXR0cmlidXRlcztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQge25hbWU6IGF0dHJpYnV0ZU5hbWUsIHZhbHVlfSA9IGF0dHJpYnV0ZXNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLm1hdGNoKGJpbmRSZWdleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7cGFyYW1zfSA9IGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgcGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLm1hdGNoKGZ1bmN0aW9uUmVnZXgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB0aGlzLmFkZEF0dHJpYnV0ZUZ1bmN0aW9uQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZnVuY3Rpb25OYW1lLCBwYXJhbXN9ID0gYXR0cmlidXRlQmluZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGJpbmRFbGVtID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWVsZW0nKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRDb21wb25lbnQgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtY29tcG9uZW50Jyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kVXNlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLXVzZScpO1xyXG4gICAgICAgICAgICBsZXQgYmluZEFzID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWFzJyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kRm9yID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWZvcicpO1xyXG4gICAgICAgICAgICBsZXQgYmluZElmID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWlmJyk7XHJcbiAgICAgICAgICAgIGxldCBiaW5kQmxvY2sgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtYmxvY2snKTtcclxuICAgICAgICAgICAgbGV0IGJpbmRWYWx1ZSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJpbmRFbGVtKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLnNvdXJjZSwgW2JpbmRFbGVtXSwgZWxlbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXyA9IHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18ucHVzaChiaW5kRWxlbSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJpbmRDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbGV0IFtjb21wb25lbnROYW1lLCBwYXJhbXNHcm91cF0gPSBzcGxpdEJ5V29yZChiaW5kQ29tcG9uZW50LCAnd2l0aCcpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlTcGFjZShwYXJhbXNHcm91cCk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtY29tcG9uZW50Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0gPSB7b3V0ZXJFbGVtOiBlbGVtLCBwYXJhbXN9O1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kRm9yKSB7XHJcbiAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBbc291cmNlVG8sIGJpbmROYW1lXSA9IHNwbGl0QnlXb3JkKGJpbmRGb3IsICdpbicpO1xyXG4gICAgICAgICAgICAgICAgYmluZE5hbWUgPSB0cmFuc2xhdGUoYmluZE5hbWUsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3ItcGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlcGxhY2VXaXRoKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1mb3InKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5mb3JzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcixcclxuICAgICAgICAgICAgICAgICAgICBvdXRlckVsZW06IGVsZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlVG8sXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRnJvbTogYmluZE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGb3IoY29udGFpbmVyLCBlbGVtLCBzb3VyY2VUbywgYmluZE5hbWUsIHNvdXJjZUxpbmtzKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZEFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRCeUNvbW1hKGJpbmRBcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChhcyA9PiBzcGxpdEJ5V29yZChhcywgJ2FzJykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChbZnJvbSwgdG9dKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUoZnJvbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmluZElmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kSWYsICdpZnMnLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdG9kbyBhbGxvdyBub24tc291cmNlIHBhcmFtZXRlcnMgZm9yIGJpbmRVc2UgYW5kIGJpbmRCbG9ja1xyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRVc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRVc2UsICd3aXRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtc0lucHV0ID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQge291dGVyRWxlbSwgcGFyYW1zfSA9IHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50RWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGNvbXBvbmVudEVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NbdG9dID0gdHJhbnNsYXRlKHBhcmFtc0lucHV0W2luZGV4XSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiaW5kQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW2Jsb2NrLCBibG9ja1RvXSA9IHNwbGl0QnlXb3JkKGJpbmRCbG9jaywgJ2FzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtibG9ja05hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJsb2NrLCAnd2l0aCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNJbnB1dCA9IHBhcmFtc0dyb3VwID8gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKSA6IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIHBhcmFtZXRlcnN9ID0gdGhpcy5ibG9ja3NbYmxvY2tOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1ibG9jaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrU291cmNlID0gbmV3IEh0bWxCaW5kZXIoZWxlbSwgdGhpcy5ibG9ja3MpLnNvdXJjZTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyKGJsb2NrU291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzICYmIHBhcmFtZXRlcnMuZm9yRWFjaCgodG8sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcm9tID0gdHJhbnNsYXRlKHBhcmFtc0lucHV0W2luZGV4XSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFBhaXJCaW5kKGZyb20sIGJsb2NrU291cmNlLCB0byk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWlyQmluZChmcm9tLCBibG9ja1NvdXJjZSwgdG8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9ja1RvKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZVtibG9ja1RvXSA9IGJsb2NrU291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gZGVidWdnZXIgZm9yIGJsb2NrIGJpbmRpbmdzXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9ID0gdGhpcy5leHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgYmluZFZhbHVlLCAndmFsdWVzJywgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXNraXApXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBlbGVtLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShlbGVtLmNoaWxkcmVuW2ldLCBzb3VyY2VMaW5rcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQmluZChiaW5kTmFtZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmJpbmRzW2JpbmROYW1lXSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgYmluZCA9IHthdHRyaWJ1dGVzOiBbXSwgZm9yczogW10sIGlmczogW10sIHBhaXJzOiBbXSwgdmFsdWVzOiBbXX07XHJcbiAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0gPSBiaW5kO1xyXG5cclxuICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLmhhbmRsZXJzLCBbYmluZE5hbWUsICdfZnVuY18nXSwgKCkgPT4ge1xyXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMgPSBiaW5kLmF0dHJpYnV0ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcbiAgICAgICAgICAgIGJpbmQuZm9ycyA9IGJpbmQuZm9ycy5maWx0ZXIoKHtjb250YWluZXJ9KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoY29udGFpbmVyKSk7XHJcbiAgICAgICAgICAgIGJpbmQuaWZzID0gYmluZC5pZnMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcbiAgICAgICAgICAgIGJpbmQudmFsdWVzID0gYmluZC52YWx1ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XHJcblxyXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoe2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lID8gdGhpcy5hcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykgOiB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQuZm9ycy5mb3JFYWNoKCh7Y29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rc30pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQuaWZzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQucGFpcnMuZm9yRWFjaCgoe2Zyb20sIHRvT2JqLCB0b0tleX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGJpbmQudmFsdWVzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBleHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgZXhwcmVzc2lvblN0ciwgdHlwZSwgc291cmNlTGlua3MpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnXHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb25NYXRjaCA9IGV4cHJlc3Npb25TdHIubWF0Y2goZXhwcmVzc2lvblJlZ2V4KTtcclxuICAgICAgICBpZiAoZXhwcmVzc2lvbk1hdGNoKSB7XHJcbiAgICAgICAgICAgIGxldCBbLCAsIGV4cHJlc3Npb25OYW1lLCBwYXJhbXNTdHJdID0gZXhwcmVzc2lvbk1hdGNoO1xyXG4gICAgICAgICAgICBleHByZXNzaW9uTmFtZSA9IHRyYW5zbGF0ZShleHByZXNzaW9uTmFtZSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpO1xyXG4gICAgICAgICAgICBsZXQgYmluZFBhcmFtcyA9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbVswXSAhPT0gJ18nKVxyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiBwYXJhbVswXSA9PT0gJ18nID8gcGFyYW0uc3Vic3RyKDEpIDogcGFyYW0pXHJcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcclxuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zfTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChleHByZXNzaW9uTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAgICAgYmluZFBhcmFtc1xyXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGFyYW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQocGFyYW0sIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGJpbmROYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25TdHIsIHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBiaW5kTmFtZX07XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZEF0dHJpYnV0ZUJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHZhbHVlLnNwbGl0KGJpbmRSZWdleFVuY2FwdHVyaW5nKVxyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXRjaExpc3QgPSBwYXJhbS5tYXRjaChiaW5kUmVnZXgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaExpc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdHJpbmdWYWx1ZTogcGFyYW19O1xyXG4gICAgICAgICAgICAgICAgbGV0IFthbGwsIHByZWZpeFNsYXNoLCBtYXRjaF0gPSBtYXRjaExpc3Q7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4U2xhc2ggPyB7c3RyaW5nVmFsdWU6IGFsbC5zdWJzdHIoMSl9IDoge3NvdXJjZVZhbHVlOiB0cmFuc2xhdGUobWF0Y2gsIHNvdXJjZUxpbmtzKX07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXN9O1xyXG5cclxuICAgICAgICBwYXJhbXNcclxuICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbS5zb3VyY2VWYWx1ZSlcclxuICAgICAgICAgICAgLmZvckVhY2goKHtzb3VyY2VWYWx1ZTogYmluZE5hbWV9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xyXG4gICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgZnVuY3Rpb25OYW1lLCBwYXJhbXNTdHJdID0gdmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCk7IC8vIHRvZG8gcHJlZml4U2xhc2hcclxuICAgICAgICBmdW5jdGlvbk5hbWUgPSB0cmFuc2xhdGUoZnVuY3Rpb25OYW1lLCBzb3VyY2VMaW5rcyk7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlQYXJhbXMocGFyYW1zU3RyKVxyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcclxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtc307XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmdW5jdGlvbk5hbWUpO1xyXG4gICAgICAgIHRoaXMuYmluZHNbZnVuY3Rpb25OYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XHJcblxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICAgICAgICAuZm9yRWFjaChiaW5kTmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XHJcbiAgICAgICAgLy8gdG9kbyBwcmV2ZW50IGJpbmRpbmcgbm9uIHNvdXJjZSB2YWx1ZXNcclxuICAgIH1cclxuXHJcbiAgICBhZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKSB7IC8vIHR5cGUgPSAnaWZzJyBvciAndmFsdWVzJ1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XHJcbiAgICAgICAgbGV0IGJpbmRlZCA9IHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnNvbWUob3RoZXJCaW5kID0+XHJcbiAgICAgICAgICAgIG90aGVyQmluZC5lbGVtID09PSBlbGVtXHJcbiAgICAgICAgKTtcclxuICAgICAgICAhYmluZGVkICYmIHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnB1c2goZXhwcmVzc2lvblZhbHVlKTtcclxuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhaXJCaW5kKGZyb20sIHRvT2JqLCB0b0tleSkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmcm9tKTtcclxuICAgICAgICB0aGlzLmJpbmRzW2Zyb21dLnBhaXJzLnB1c2goe2Zyb20sIHRvT2JqLCB0b0tleX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICBsZXQgbW9kaWZpZWRWYWx1ZSA9IHBhcmFtc1xyXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlID8gbm90VW5kZWZpbmVkKGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW0uc291cmNlVmFsdWVdKSwgJycpIDogcGFyYW0uc3RyaW5nVmFsdWUpXHJcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcclxuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBtb2RpZmllZFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIGxldCBoYW5kbGVyID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtmdW5jdGlvbk5hbWVdKTtcclxuICAgICAgICBlbGVtW2F0dHJpYnV0ZU5hbWVdID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSwgZXZlbnQpO1xyXG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KGVsZW0sIHBhcmFtVmFsdWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtzb3VyY2VGcm9tXSk7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPiB2YWx1ZS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3NvdXJjZVRvXSA9IGAke3NvdXJjZUZyb219LiR7aW5kZXh9YDtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzLmluZGV4ID0gYF9udW1iZXJzXy4ke2luZGV4fWA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGNoaWxkRWxlbSwgc291cmNlTGlua3MpO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkRWxlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XHJcbiAgICAgICAgZWxlbS5oaWRkZW4gPSAhdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpIHtcclxuICAgICAgICB0b09ialt0b0tleV0gPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2Zyb21dKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMub2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IG5vdFVuZGVmaW5lZCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgb2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XHJcbiAgICAgICAgaWYgKCFleHByZXNzaW9uTmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXMuc291cmNlLCBbYmluZE5hbWVdKTtcclxuXHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2V4cHJlc3Npb25OYW1lXSk7XHJcbiAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXMsIGVsZW0pO1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ2Z1bmN0aW9uJyAmJiBleHByZXNzaW9uKC4uLnBhcmFtVmFsdWVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0b2RvIHVzZSBQYXJhbVNwbGl0dGVyIGluIG9yZGVyIHRvIHN1cHBvcnQgYXJyYXkgYW5kIG9iamVjdCBwYXJhbXRlcnNcclxuICAgIGdldFBhcmFtVmFsdWVzKHBhcmFtcywgdGhpc3MsIGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5tYXAocGFyYW0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGFyYW1QYXRoID0gcGFyYW0uc3BsaXQoJy4nKTtcclxuICAgICAgICAgICAgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ3RoaXMnKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbVBhdGguc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzcywgcGFyYW1QYXRoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbVBhdGhbMF0gPT09ICdldmVudCcpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKGV2ZW50LCBwYXJhbVBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgc291cmNlVmFsdWUgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3BhcmFtXSk7XHJcbiAgICAgICAgICAgIGlmIChzb3VyY2VWYWx1ZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVZhbHVlO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHBhcmFtLnJlcGxhY2UoLycvZywgJ1wiJykpO1xyXG5cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXJ0aWZhY3RzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXHJcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXHJcbiAgICAgICAgICAgIGhhbmRsZXJzOiB0aGlzLmhhbmRsZXJzLFxyXG4gICAgICAgICAgICBiaW5kczogdGhpcy5iaW5kcyxcclxuICAgICAgICAgICAgcm9vdDogdGhpcy5yb290LFxyXG4gICAgICAgICAgICBjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHMsXHJcbiAgICAgICAgICAgIGJsb2NrczogdGhpcy5ibG9ja3NcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXBsYWNlSW5saW5lQmluZGluZ3MoZWxlbSkge1xyXG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gZWxlbS5pbm5lckhUTUwucmVwbGFjZShhbGxTcGFuUmVnZXgsIChhbGwsIHByZWZpeFNsYXNoLCBtYXRjaCkgPT4gcHJlZml4U2xhc2ggPyBhbGwuc3Vic3RyKDEpIDogYDxzcGFuIGJpbmQ9XCIke21hdGNofVwiPjwvc3Bhbj5gKTtcclxuICAgICAgICBlbGVtLmlubmVySFRNTCA9IGVsZW0uaW5uZXJIVE1MLnJlcGxhY2UoYWxsU3BhbkV4cHJlc3Npb25SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRvZG8gdXNlIGluZGV4VG9Eb3QgZm9yIGF0dHJpYnV0ZSBiaW5kcyBhcyB3ZWxsLCBlLmcuIDxkaXYgc3R5bGU9XCIke2NvbG9yWzBdfVwiPiBhYmMgPC9kaXY+XHJcbiAgICBzdGF0aWMgZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGUpIHtcclxuICAgICAgICByZXR1cm4gaW5kZXhUb0RvdChlbGVtLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gYmluZHMgPSB7XHJcbi8vICAgICAnYS5iLmMnOiB7XHJcbi8vICAgICAgICAgYXR0cmlidXRlczogW2F0dHJpYnV0ZUJpbmQxLCBhdHRyaWJ1dGVCaW5kMl0sXHJcbi8vICAgICAgICAgZm9yczogW3tjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzfV0sXHJcbi8vICAgICAgICAgaWZzOiBbZXhwcmVzc2lvbkJpbmQxLCBleHByZXNzaW9uQmluZDNdLFxyXG4vLyAgICAgICAgIHBhaXJzOiBbe2Zyb20sIHRvT2JqLCB0b0tleX1dLFxyXG4vLyAgICAgICAgIHZhbHVlczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQyXVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBzb3VyY2UgPSB7XHJcbi8vICAgICBhOiB7XHJcbi8vICAgICAgICAgYjoge1xyXG4vLyAgICAgICAgICAgICBjOiB7fVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gfTtcclxuLy9cclxuLy8gaGFuZGxlcnMgPSB7XHJcbi8vICAgICBhOiB7XHJcbi8vICAgICAgICAgX2Z1bmNfOiAnZnVuYycsXHJcbi8vICAgICAgICAgYjoge1xyXG4vLyAgICAgICAgICAgICBjOiB7XHJcbi8vICAgICAgICAgICAgICAgICBfZnVuY186ICdmdW5jJ1xyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyB9O1xyXG4vL1xyXG4vLyBjb21wb25lbnRzID0ge1xyXG4vLyAgICAgYToge1xyXG4vLyAgICAgICAgIG91dGVyRWxlbTogb3V0ZXJFbGVtLFxyXG4vLyAgICAgICAgIHBhcmFtczogW11cclxuLy8gICAgIH1cclxuLy8gfTtcclxuLy9cclxuLy8gYXR0cmlidXRlQmluZCA9IHtcclxuLy8gICAgIGVsZW06IGVsZW0xLFxyXG4vLyAgICAgYXR0cmlidXRlTmFtZSxcclxuLy8gICAgIGZ1bmN0aW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcclxuLy8gICAgIHBhcmFtczogW3tzdHJpbmdWYWx1ZSB8IHNvdXJjZVZhbHVlOiBzdHJpbmd9XSwgLy8gZm9yIG51bGwgZnVuY3Rpb25OYW1lXHJcbi8vICAgICBwYXJhbXM6IFtdIC8vIGZvciBub3QgbnVsbCBmdW5jdGlvbk5hbWVcclxuLy8gfTtcclxuLy9cclxuLy8gZXhwcmVzc2lvbkJpbmQgPSB7XHJcbi8vICAgICBlbGVtOiBlbGVtMSxcclxuLy8gICAgIGV4cHJlc3Npb25OYW1lLCAvLyBjYW4gYmUgbnVsbFxyXG4vLyAgICAgcGFyYW1zOiBbXSxcclxuLy8gICAgIGJpbmROYW1lIC8vIGNhbiBiZSBudWxsXHJcbi8vIH07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWxCaW5kZXI7XHJcbiIsImNvbnN0IEJvb3RlciA9IHJlcXVpcmUoJy4vYm9vdGVyJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IG5ldyBCb290ZXIoKTtcclxuXHJcbi8vIHRvZG9cclxuLy8gYWxsb3cgYXJyYXkgYmluZGluZyBpbiBodG1sOiBgPGRpdiBiaW5kPVwieFt5XVwiPjwvZGl2PmBcclxuLy8gY2xlYW4gdXAgcGFja2FnZS5qc29uXHJcbi8vICRze3h9IHN5bnRheCB0byBvbmx5IGFmZmVjdCBpbm5lciB0ZXh0IGFuZCBub3QgYXR0cmlidXRlc1xyXG4vLyBhbGxvdyBkZWZpbmluZyBhbmQgdXNpbmcgY29tcG9uZW50cyBpbiBhbnkgb3JkZXJcclxuLy8gYWxsb3cgdXNpbmcgZXhwcmVzc2lvbnMgZm9yIG1vcmUgYmluZHMgdGhhbiBqdXN0IGlmcyBhbmQgdmFsdWVzIChlLmcuIGF0dHJpYnV0ZXMsIGZvcnMsIGFzLCB1c2UpXHJcbi8vIHN1cHBvcnQgJGUgbmVzdGVkIGluc2lkZSAkc1xyXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgc291cmNlLmEgPSBzb3VyY2UuYiBkb2Vzbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXHJcbi8vIGludmVzdGlnYXRlIHdoeSBiaW5kLWZvciBpbmRleFZhcnMgZG9uJ3QgcHJvcG9nYXRlIGNoYW5nZXNcclxuLy8gcm91dGluZyBvciBzd2FwcGluZyBzdGF0ZXNcclxuIiwibGV0IGdldFByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcclxuICAgIGxldCBmaWVsZHMgPSBnZXRGaWVsZHMocGF0aHMpO1xyXG4gICAgbGV0IGxhc3RGaWVsZCA9IGZpZWxkcy5wb3AoKTtcclxuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gfHwge30pO1xyXG4gICAgcmV0dXJuIFtvYmosIGxhc3RGaWVsZF07XHJcbn07XHJcblxyXG5sZXQgZ2V0VmFsdWUgPSAob2JqLCBwYXRocykgPT4ge1xyXG4gICAgbGV0IHByb3BlcnR5ID0gZ2V0UHJvcGVydHkob2JqLCBwYXRocyk7XHJcbiAgICByZXR1cm4gcHJvcGVydHlbMV0gPT09IHVuZGVmaW5lZCA/IHByb3BlcnR5WzBdIDogcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dO1xyXG59O1xyXG5cclxubGV0IGNyZWF0ZVByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcclxuICAgIGxldCBmaWVsZHMgPSBnZXRGaWVsZHMocGF0aHMpO1xyXG4gICAgbGV0IGxhc3RGaWVsZCA9IGZpZWxkcy5wb3AoKTtcclxuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gPSBvYmpbZmllbGRdIHx8IHt9KTtcclxuICAgIHJldHVybiBbb2JqLCBsYXN0RmllbGRdO1xyXG59O1xyXG5cclxubGV0IHNldFByb3BlcnR5ID0gKG9iaiwgcGF0aHMsIHZhbHVlKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydHkgPSBjcmVhdGVQcm9wZXJ0eShvYmosIHBhdGhzKTtcclxuICAgIHByb3BlcnR5WzBdW3Byb3BlcnR5WzFdXSA9IHZhbHVlO1xyXG59O1xyXG5cclxubGV0IGNsb25lID0gb3JpZ2luYWwgPT4ge1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsKTtcclxufTtcclxuXHJcbmxldCB0cmFuc2xhdGUgPSAobmFtZSwgbGlua3MpID0+IHtcclxuICAgIGxldCBvY2N1cnJlZCA9IFtdO1xyXG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhbbmFtZV0pO1xyXG4gICAgd2hpbGUgKGZpZWxkc1swXSBpbiBsaW5rcykge1xyXG4gICAgICAgIG9jY3VycmVkLnB1c2goZmllbGRzWzBdKTtcclxuICAgICAgICBmaWVsZHNbMF0gPSBsaW5rc1tmaWVsZHNbMF1dO1xyXG4gICAgICAgIGlmIChvY2N1cnJlZC5pbmNsdWRlcyhmaWVsZHNbMF0pKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBmaWVsZHMgPSBnZXRGaWVsZHMoZmllbGRzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmaWVsZHMucmVkdWNlKChhLCBiKSA9PiBgJHthfS4ke2J9YCk7XHJcbn07XHJcblxyXG5sZXQgZ2V0RmllbGRzID0gcGF0aHMgPT5cclxuICAgIHBhdGhzXHJcbiAgICAgICAgLm1hcChwYXRoID0+IHBhdGguc3BsaXQoJy4nKSlcclxuICAgICAgICAucmVkdWNlKChhZ2dyZWdhdGUsIGl0ZW0pID0+IGFnZ3JlZ2F0ZS5jb25jYXQoaXRlbSksIFtdKTtcclxuXHJcbmxldCBpbmRleFRvRG90ID0gZmllbGQgPT4gZmllbGQgJiYgZmllbGQucmVwbGFjZSgvXFxbKFxcdyspXFxdL2csIChfLCBtYXRjaCkgPT4gYC4ke21hdGNofWApO1xyXG5cclxubGV0IG5vdFVuZGVmaW5lZCA9ICh2YWx1ZSwgdW5kZWZpbmVkVmFsdWUgPSBudWxsKSA9PlxyXG4gICAgdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogdW5kZWZpbmVkVmFsdWU7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIGNsb25lLCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZH07XHJcbiIsImNsYXNzIFBhcmFtU3BsaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMuc3RhcnRJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBzcGxpdEJ5UGFyYW1zKCkge1xyXG4gICAgICAgIGxldCBkZXB0aCA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHRJbmRleCgpICYmICghdGhpcy5hdFF1b3RlKCkgfHwgdGhpcy5za2lwUXVvdGUoKSkpIHtcclxuICAgICAgICAgICAgbGV0IGNoYXIgPSB0aGlzLnN0cmluZ1t0aGlzLmluZGV4XTtcclxuICAgICAgICAgICAgaWYgKGNoYXIgPT09ICdbJylcclxuICAgICAgICAgICAgICAgIGRlcHRoKys7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICddJylcclxuICAgICAgICAgICAgICAgIGRlcHRoLS07XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICcsJyAmJiAhZGVwdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGFyYW0oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRJbmRleCA9IHRoaXMuaW5kZXggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbmRleChyZWdleCwgc3RhcnQpIHsgLy8gcmV0dXJucyAtMSBvciBpbmRleCBvZiBtYXRjaFxyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc3RyaW5nLnN1YnN0cmluZyhzdGFydCkuc2VhcmNoKHJlZ2V4KTtcclxuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCA/IGluZGV4ICsgc3RhcnQgOiAtMTtcclxuICAgIH07XHJcblxyXG4gICAgbmV4dEluZGV4KCkge1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleCgvWywnXCJbXFxdXS8sIHRoaXMuaW5kZXggKyAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCAhPT0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgYXRRdW90ZSgpIHtcclxuICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xyXG4gICAgICAgIHJldHVybiBjaGFyID09PSAnXCInIHx8IGNoYXIgPT09IFwiJ1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHNraXBRdW90ZSgpIHtcclxuICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleChjaGFyID09PSAnXCInID8gL1teXFxcXF1cIi8gOiAvW15cXFxcXScvLCB0aGlzLmluZGV4ICsgMSkgKyAxO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhcmFtKCkge1xyXG4gICAgICAgIHRoaXMucGFyYW1zLnB1c2godGhpcy5zdHJpbmcuc3Vic3RyaW5nKHRoaXMuc3RhcnRJbmRleCwgdGhpcy5pbmRleCA+IDAgPyB0aGlzLmluZGV4IDogdGhpcy5zdHJpbmcubGVuZ3RoKS50cmltKCkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiBuZXcgUGFyYW1TcGxpdHRlcihzdHJpbmcpLnNwbGl0QnlQYXJhbXMoKTtcclxuIiwiLy8gKFtcXHcuW1xcXV0rKVxyXG5cclxubGV0IHNwYW5SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdXSspfS87XHJcbmxldCBhbGxTcGFuUmVnZXggPSBuZXcgUmVnRXhwKHNwYW5SZWdleCwgJ2cnKTtcclxubGV0IHNwYW5FeHByZXNzaW9uUmVnZXggPSAvKFxcXFwpP1xcJHN7KFtcXHcuW1xcXSE9Pjx8Jl0rXFwoLipcXCkpfS87XHJcbmxldCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuRXhwcmVzc2lvblJlZ2V4LCAnZycpO1xyXG5cclxubGV0IGJpbmRSZWdleCA9IC8oXFxcXCk/XFwkeyhbXFx3LltcXF1dKyl9LztcclxubGV0IGJpbmRSZWdleFVuY2FwdHVyaW5nID0gLygoPzpcXFxcKT9cXCR7KD86W1xcdy5bXFxdXSspfSkvO1xyXG5cclxubGV0IGZ1bmN0aW9uUmVnZXggPSAvKFxcXFwpP1xcJHsoW1xcdy5bXFxdXSspXFwoKC4qKVxcKX0vO1xyXG5cclxubGV0IGV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/KFtcXHcuW1xcXSE9Pjx8Jl0rKVxcKCguKilcXCkvO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9O1xyXG4iLCJsZXQgY3JlYXRlU291cmNlID0gKCkgPT4ge1xyXG4gICAgbGV0IGhhbmRsZXJzID0ge307XHJcbiAgICBsZXQgb3JpZ2luID0ge307XHJcbiAgICBsZXQgc291cmNlID0gY3JlYXRlUHJveHkob3JpZ2luLCBoYW5kbGVycyk7XHJcbiAgICBzZXREZWZhdWx0U291cmNlKG9yaWdpbik7XHJcbiAgICByZXR1cm4ge29yaWdpbiwgc291cmNlLCBoYW5kbGVyc307XHJcbn07XHJcblxyXG5sZXQgaWdub3JlID0gW107XHJcblxyXG5sZXQgaXNCaW5kSWdub3JlZCA9IChvYmosIHByb3ApID0+IG9iai5fX2JpbmRJZ25vcmVfXyAmJiBvYmouX19iaW5kSWdub3JlX18uaW5jbHVkZXMocHJvcCk7XHJcblxyXG4vLyB0b2RvIG1ha2UgX19iaW5kQXZvaWRDeWNsZXNfXyBpbmhlcml0ZWQgYW5kIG1heWJlIGF2b2lkIHBlciBiaW5kaW5nIGluc3RlYWQgcGVyIGNoYW5nZVxyXG5sZXQgaXNJZ25vcmVkID0gKG9iaiwgcHJvcCkgPT4gaXNCaW5kSWdub3JlZChvYmosIHByb3ApIHx8IChvYmouX19iaW5kQXZvaWRDeWNsZXNfXyAmJiBpZ25vcmUuc29tZShpZ25vcmUgPT4gaWdub3JlLm9iaiA9PT0gb2JqICYmIGlnbm9yZS5wcm9wID09PSBwcm9wKSk7XHJcblxyXG5sZXQgaGFuZGxlU2V0ID0gKG9iaiwgcHJvcCwgaGFuZGxlcnMsIGFjY3VtdWxhdGVkSGFuZGxlcnMpID0+IHtcclxuICAgIGlnbm9yZS5wdXNoKHtvYmosIHByb3B9KTtcclxuICAgIGFjY3VtdWxhdGVkSGFuZGxlcnMuZm9yRWFjaChkb0hhbmRsZXIpO1xyXG4gICAgaGFuZGxlcnMgJiYgcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcnMpO1xyXG4gICAgaWdub3JlLnBvcCgpO1xyXG59O1xyXG5cclxubGV0IGNyZWF0ZVByb3h5ID0gKG9iaiwgaGFuZGxlcnMgPSB7fSwgYWNjdW11bGF0ZWRIYW5kbGVycyA9IFtdKSA9PiBuZXcgUHJveHkob2JqLCB7XHJcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3ApID0+IHtcclxuICAgICAgICBsZXQgZ290ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wKTtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGdvdCA9PT0gJ29iamVjdCcgJiYgZ290ICYmICFpc0JpbmRJZ25vcmVkKG9iaiwgcHJvcCkgPyBjcmVhdGVQcm94eShnb3QsIGhhbmRsZXJzW3Byb3BdLCBhY2N1bXVsYXRlZEhhbmRsZXJzLmNvbmNhdChoYW5kbGVycykpIDogZ290O1xyXG4gICAgfSxcclxuICAgIHNldDogKHRhcmdldCwgcHJvcCwgdmFsdWUpID0+IHtcclxuICAgICAgICBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3AsIHZhbHVlKTtcclxuICAgICAgICAhaXNJZ25vcmVkKG9iaiwgcHJvcCkgJiYgaGFuZGxlU2V0KG9iaiwgcHJvcCwgaGFuZGxlcnNbcHJvcF0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSk7IC8vIHRvZG8gd3JhcCBoYW5kbGVycyBhbmQgYWNjdW11bGF0ZWRIYW5kbGVycyBpbiBjbGFzcyB3aXRoIHBvcFByb3AgbWV0aG9kXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubGV0IHByb3BvZ2F0ZUhhbmRsZXJEb3duID0gaGFuZGxlcnMgPT4ge1xyXG4gICAgZG9IYW5kbGVyKGhhbmRsZXJzKTtcclxuICAgIE9iamVjdC5lbnRyaWVzKGhhbmRsZXJzKVxyXG4gICAgICAgIC5maWx0ZXIoKFtrZXldKSA9PiBrZXkgIT09ICdfZnVuY18nKVxyXG4gICAgICAgIC5mb3JFYWNoKChbLCBoYW5kbGVyXSkgPT4gcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcikpO1xyXG59O1xyXG5cclxubGV0IGRvSGFuZGxlciA9IGhhbmRsZXIgPT4gdHlwZW9mIGhhbmRsZXIuX2Z1bmNfID09PSAnZnVuY3Rpb24nICYmIGhhbmRsZXIuX2Z1bmNfKCk7XHJcblxyXG5sZXQgc2V0RGVmYXVsdFNvdXJjZSA9IHNvdXJjZSA9PiB7XHJcbiAgICBzb3VyY2UuX251bWJlcnNfID0gbmV3IFByb3h5KHt9LCB7XHJcbiAgICAgICAgZ2V0OiAoXywgcHJvcCkgPT4gcGFyc2VJbnQocHJvcCksXHJcbiAgICAgICAgc2V0OiAoKSA9PiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBzb3VyY2Uubm90ID0gYSA9PiAhYTtcclxuICAgIHNvdXJjZVsnISddID0gYSA9PiAhYTtcclxuICAgIHNvdXJjZS5lcSA9IChhLCBiKSA9PiBhID09PSBiO1xyXG4gICAgc291cmNlLmVxdWFsID0gKGEsIGIpID0+IGEgPT09IGI7XHJcbiAgICBzb3VyY2VbJz0nXSA9IChhLCBiKSA9PiBhID09PSBiO1xyXG4gICAgc291cmNlLm5FcSA9IChhLCBiKSA9PiBhICE9PSBiO1xyXG4gICAgc291cmNlLm5vdEVxdWFsID0gKGEsIGIpID0+IGEgIT09IGI7XHJcbiAgICBzb3VyY2VbJyE9J10gPSAoYSwgYikgPT4gYSAhPT0gYjtcclxuICAgIHNvdXJjZS5ncmVhdGVyID0gKGEsIGIpID0+IGEgPiBiO1xyXG4gICAgc291cmNlWyc+J10gPSAoYSwgYikgPT4gYSA+IGI7XHJcbiAgICBzb3VyY2UubGVzcyA9IChhLCBiKSA9PiBhIDwgYjtcclxuICAgIHNvdXJjZVsnPCddID0gKGEsIGIpID0+IGEgPCBiO1xyXG4gICAgc291cmNlLmdyZWF0ZXJFcSA9IChhLCBiKSA9PiBhID49IGI7XHJcbiAgICBzb3VyY2VbJz49J10gPSAoYSwgYikgPT4gYSA+PSBiO1xyXG4gICAgc291cmNlLmxlc3NFcSA9IChhLCBiKSA9PiBhIDw9IGI7XHJcbiAgICBzb3VyY2VbJzw9J10gPSAoYSwgYikgPT4gYSA8PSBiO1xyXG4gICAgc291cmNlLm9yID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XHJcbiAgICBzb3VyY2VbJ3wnXSA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xyXG4gICAgc291cmNlWyd8fCddID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XHJcbiAgICBzb3VyY2UuYW5kID0gKC4uLmFzKSA9PiBhcy5ldmVyeShhID0+IGEpO1xyXG4gICAgc291cmNlWycmJ10gPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XHJcbiAgICBzb3VyY2VbJyYmJ10gPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGVTb3VyY2V9O1xyXG4iLCJsZXQgc3BsaXRCeVdvcmQgPSAoc3RyaW5nLCB3b3JkKSA9PlxyXG4gICAgc3RyaW5nLnNwbGl0KG5ldyBSZWdFeHAoYFxcXFxzKyR7d29yZH1cXFxccytgKSk7XHJcblxyXG5sZXQgc3BsaXRCeUNvbW1hID0gc3RyaW5nID0+XHJcbiAgICBzdHJpbmcuc3BsaXQoL1xccyosXFxzKi8pO1xyXG5cclxubGV0IHNwbGl0QnlTcGFjZSA9IHN0cmluZyA9PlxyXG4gICAgc3RyaW5nLnNwbGl0KC9cXHMrLyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtzcGxpdEJ5V29yZCwgc3BsaXRCeUNvbW1hLCBzcGxpdEJ5U3BhY2V9O1xyXG4iXX0=
