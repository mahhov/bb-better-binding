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

source.navigationBlock.init();

},{"./bindFor/bindFor":1,"./bindIf/bindIf":3,"./bindValue/bindValue":5,"./helloWorld/helloWorld":8,"./navigation/navigation":9,"bb-better-binding":12}],8:[function(require,module,exports){
let template = "<a href=\"https://github.com/mahhov/bb-better-binding/blob/HEAD/liveExample/helloWorld/helloWorld.html\">template source</a>\n<br/>\n<a href=\"https://github.com/mahhov/bb-better-binding/blob/HEAD/liveExample/helloWorld/helloWorld.js\">controller source</a>\n\n<div>\n    <div style=\"font-size:${largeFont}; color:${favoriteColor}\">\n        $s{greeting}, $s{name} $s{exclamation}\n    </div>\n    wuts ur favorite color?\n    <input value=\"${favoriteColor}\" onkeyup=\"${changeColor(this)}\">\n</div>\n\n<div style=\"margin-top:100px\">\n    <button onclick=\"${changeAnimation()}\">click me!</button>\n    <br/>\n    <img src=\"${animation}\">\n</div>\n\n<div style=\"margin-top:100px\">\n    <p>i have jokes:</p>\n    <input id=\"check\" type=\"checkbox\" onchange=\"${setJokeVisibility(this)}\"/><label for=\"check\">show jokes?</label>\n    <div bind-if=\"jokeVisibility\">\n        <div bind-for=\"joke in jokes\">\n            <h3 bind=\"index\"></h3>\n            <p bind-for=\"line in joke.lines\" bind=\"line\"></p>\n        </div>\n        <h3>Source: $s{jokesSource}</h3>\n    </div>\n</div>\n";

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
    source.init = () => source.getElem('navigationRadio0').checked = true;
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

    boot(root, debug, manual) {
        let artifacts = new HtmlBinder(root, this.blocks).getArtifacts();
        debug && Object.assign(debug, artifacts);
        if (!manual)
            this.loop();
        return this.source = artifacts.source;
    }

    tick() {
        this.source._invokeAllHandlers_();
    }

    loop(interval = 1) {
        setInterval(() => this.source._invokeAllHandlers_(), interval);
    }
}

module.exports = Booter;

},{"./htmlBinder":11}],11:[function(require,module,exports){
const {getValue, setProperty, setGetProperty, translate, indexToDot, notUndefined, clone} = require('./objScafolding');
const {splitByWord, splitByComma, splitBySpace} = require('./stringSplitter');
const splitByParams = require('./paramSplitter');
const {createSource} = require('./source');
const {allSpanRegex, allSpanExpressionRegex, bindRegex, bindRegexUncapturing, functionRegex, expressionRegex} = require('./regex');

class HtmlBinder {
    constructor(root, blocks, parentSource) {
        let {source, handlers} = createSource(parentSource);
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
                setGetProperty(this.source, [bindElem], elem, this.source._invokeAllHandlers_);
                this.source._bindIgnore_ = this.source._bindIgnore_ || [];
                this.source._bindIgnore_.push(bindElem);
            }

            if (bindComponent) {
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
                    let {source: blockSource, handlers: blockHandlers} = new HtmlBinder(elem, this.blocks, this.source);
                    controller(blockSource);
                    parameters && parameters.forEach((to, index) => {
                        let from = translate(paramsInput[index], sourceLinks);
                        this.addPairBind(from, blockSource, to);
                        this.applyPairBind(from, blockSource, to);
                        blockSource[to] = paramValues[index];
                    });

                    if (blockTo) {
                        this.source[blockTo] = blockSource;
                        this.handlers[blockTo] = blockHandlers;
                    } else {
                        this.source._unnamedBlocks_ = this.source._unnamedBlocks_ || [];
                        this.handlers._unnamedBlocks_ = this.handlers._unnamedBlocks_ || [];
                        this.source._unnamedBlocks_.push(blockSource);
                        this.handlers._unnamedBlocks_.push(blockHandlers);
                    }
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

let setGetProperty = (obj, paths, value, handler) => {
    let property = createProperty(obj, paths);
    let key = property[1] + '_';
    property[0][key] = value;

    Object.defineProperty(property[0], property[1], {
        get: () => {
            handler();
            return property[0][key];
        }
    });
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

let isObject = obj => typeof obj === 'object' && obj;

let areEqual = (a, b) => a === b || Number.isNaN(a) && Number.isNaN(b); // because NaN != NaN and isNan(undefined) == true, but Number.IsNan(undefined) == false

let clone = original => {
    return {...original};
};

let cloneDeep = obj => {
    if (!isObject(obj))
        return obj;
    let cloneObj = {};
    Object.entries(obj).forEach(([key, value]) => cloneObj[key] = cloneDeep(value));
    return cloneObj;
};

module.exports = {getValue, setProperty, setGetProperty, translate, indexToDot, notUndefined, isObject, areEqual, clone, cloneDeep};

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
const {getValue, isObject, areEqual, cloneDeep} = require('./objScafolding');

// todo wrap these functions in a class
let createSource = parentSource => {
    let handlers = {};
    let source = {};
    setDefaultSource(source);
    let compareSource = {};
    source._invokeAllHandlers_ = parentSource ? parentSource._invokeAllHandlers_ : () => handleOriginChanges(source, compareSource, handlers);
    return {source, handlers};
};

let ignore = [];

let isBindIgnored = (obj, prop) => obj._bindIgnore_ && obj._bindIgnore_.includes(prop);

// todo make _bindAvoidCycles_ inherited and maybe avoid per binding instead per change
let isIgnored = (obj, prop) => isBindIgnored(obj, prop) || (obj._bindAvoidCycles_ && ignore.some(ignore => ignore.obj === obj && ignore.prop === prop));

let handleSet = (obj, prop, handlers, accumulatedHandlers) => {
    ignore.push({obj, prop});
    accumulatedHandlers.forEach(doHandler);
    handlers && propogateHandlerDown(handlers);
    ignore.pop();
};

let propogateHandlerDown = handlers => {
    doHandler(handlers);
    Object.entries(handlers)
        .filter(([key]) => key !== '_func_')
        .forEach(([, handler]) => propogateHandlerDown(handler));
};

let doHandler = handler => typeof handler._func_ === 'function' && handler._func_();

let handleOriginChangesKey = (source, compareSource, key, handlers = {}, accumulatedHandlers = []) => {
    if (isBindIgnored(source, key))
        return;
    let value = source[key];
    let compareValue = compareSource[key];
    if (isObject(value) && isObject(compareValue))
        return handleOriginChanges(value, compareValue, handlers[key], accumulatedHandlers.concat(handlers));
    if (!areEqual(value, compareValue)) {
        compareSource[key] = cloneDeep(value);
        handleSet(source, key, handlers[key], accumulatedHandlers.concat(handlers)); // todo wrap handlers and accumulatedHandlers in class with popProp method
        return true;
    }
};

// source and compareSource must not be null or undefined
let handleOriginChanges = (source, compareSource, handlers = {}, accumulatedHandlers = []) => {
    if (!handlers)
        return;
    let changed = true;
    while (changed) {
        changed = false;
        Object.keys(source).forEach(key =>
            changed = handleOriginChangesKey(source, compareSource, key, handlers, accumulatedHandlers) || changed);
        Object.keys(compareSource).forEach(key =>
            changed = !source.hasOwnProperty(key) && handleOriginChangesKey(source, compareSource, key, handlers, accumulatedHandlers) || changed);
    }
};

let setDefaultSource = source => {
    source._numbers_ = new Proxy({}, {
        get: (_, prop) => parseInt(prop),
        set: () => false
    });
    source.not = a => !a;
    source['!'] = source.not;
    source.eq = (a, b) => a === b;
    source.equal = source.eq;
    source['='] = source.eq;
    source.nEq = (a, b) => a !== b;
    source.notEqual = source.nEq;
    source['!='] = source.nEq;
    source.greater = (a, b) => a > b;
    source['>'] = source.greater;
    source.less = (a, b) => a < b;
    source['<'] = source.less;
    source.greaterEq = (a, b) => a >= b;
    source['>='] = source.greaterEq;
    source.lessEq = (a, b) => a <= b;
    source['<='] = source.lessEq;
    source.or = (...as) => as.some(a => a);
    source['|'] = source.or;
    source['||'] = source.or;
    source.and = (...as) => as.every(a => a);
    source['&'] = source.and;
    source['&&'] = source.and;
    source.getElem = elem => {
        source._invokeAllHandlers_();
        return elem && getValue(source, [elem]);
    }
};

module.exports = {createSource};

},{"./objScafolding":13}],17:[function(require,module,exports){
let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`));

let splitByComma = string =>
    string.split(/\s*,\s*/);

let splitBySpace = string =>
    string.split(/\s+/);

module.exports = {splitByWord, splitByComma, splitBySpace};

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaXZlRXhhbXBsZS9iaW5kRm9yL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZEZvci9jb250cm9sbGVyLmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvaW5wdXQuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvY29udHJvbGxlci5qcyIsImxpdmVFeGFtcGxlL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9oZWxsb1dvcmxkL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvbmF2aWdhdGlvbi9pbnB1dC5qcyIsInNyYy9ib290ZXIuanMiLCJzcmMvaHRtbEJpbmRlci5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9vYmpTY2Fmb2xkaW5nLmpzIiwic3JjL3BhcmFtU3BsaXR0ZXIuanMiLCJzcmMvcmVnZXguanMiLCJzcmMvc291cmNlLmpzIiwic3JjL3N0cmluZ1NwbGl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQXlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLHVEQUFvRCxDQUFDO0FBQ3BFLElBQUksZ0JBQWdCLEdBQUcsdUZBQXFELENBQUM7QUFDN0UsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0FDTDFEO0FBQ0E7QUFDQTtBQUNBOztBQ0h5QjtBQUN6QixJQUFJLFFBQVEsR0FBRyx1d0JBQW1ELENBQUM7QUFDbkUsSUFBSSxnQkFBZ0IsR0FBRyx3S0FBcUQsQ0FBQztBQUM3RSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7Ozs7QUNMMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVHlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLG9JQUFzRCxDQUFDO0FBQ3RFLElBQUksZ0JBQWdCLEdBQUcsNmlCQUFxRCxDQUFDO0FBQzdFLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFekMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7OztBQ0wxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBLElBQUksUUFBUSxHQUFHLHNsQ0FBa0UsQ0FBQzs7QUFFbEYsSUFBSSxVQUFVLEdBQUcsTUFBTSxJQUFJOzs7SUFHdkIsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsTUFBTSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7SUFDbEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7SUFDL0IsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFDdEIsTUFBTSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7SUFDcEMsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLElBQUk7UUFDMUIsTUFBTSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ3RDLENBQUM7OztJQUdGLElBQUksVUFBVSxHQUFHO1FBQ2IsOENBQThDO1FBQzlDLHlEQUF5RDtRQUN6RCw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ3BELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLE1BQU0sQ0FBQyxlQUFlLEdBQUcsTUFBTTtRQUMzQixjQUFjLEdBQUcsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDMUQsTUFBTSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakQsQ0FBQztJQUNGLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7O0lBR3pCLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLElBQUk7UUFDbkMsTUFBTSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQzVDLENBQUM7SUFDRixNQUFNLENBQUMsS0FBSyxHQUFHO1FBQ1g7WUFDSSxLQUFLLEVBQUU7Z0JBQ0gsNkRBQTZEO2dCQUM3RCxvREFBb0Q7YUFDdkQ7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILHlEQUF5RDtnQkFDekQsc0RBQXNEO2FBQ3pEO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCxpREFBaUQ7Z0JBQ2pELDZDQUE2QztnQkFDN0MsK0RBQStEO2FBQ2xFO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCx1Q0FBdUM7Z0JBQ3ZDLDRCQUE0QjthQUMvQjtTQUNKLEVBQUU7WUFDQyxLQUFLLEVBQUU7Z0JBQ0gseUNBQXlDO2dCQUN6Qyw2Q0FBNkM7YUFDaEQ7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILG9FQUFvRTtnQkFDcEUsK0JBQStCO2FBQ2xDO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCwyQ0FBMkM7Z0JBQzNDLGtEQUFrRDthQUNyRDtTQUNKLEVBQUU7WUFDQyxLQUFLLEVBQUU7Z0JBQ0gsc0NBQXNDO2dCQUN0QyxpQ0FBaUM7YUFDcEM7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILHlFQUF5RTtnQkFDekUsaURBQWlEO2FBQ3BEO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCw4QkFBOEI7Z0JBQzlCLGlEQUFpRDthQUNwRDtTQUNKLEVBQUU7WUFDQyxLQUFLLEVBQUU7Z0JBQ0gsNERBQTREO2dCQUM1RCw4Q0FBOEM7YUFDakQ7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILDBDQUEwQztnQkFDMUMsNERBQTREO2FBQy9EO1NBQ0o7S0FDSixDQUFDO0lBQ0YsTUFBTSxDQUFDLFdBQVcsR0FBRyxxREFBcUQsQ0FBQztDQUM5RSxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7Ozs7QUNqR3hDLElBQUksUUFBUSxHQUFHLGtVQUFrRSxDQUFDOztBQUVsRixJQUFJLFVBQVUsR0FBRyxNQUFNLElBQUk7SUFDdkIsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0NBQ3pFLENBQUM7O0FBRUYsSUFBSSxVQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7Ozs7QUNScEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xubGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vYmluZEZvci5odG1sYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vY29udHJvbGxlci5qc2AsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgY29udHJvbGxlclN0cmluZ307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNvdXJjZSA9PiB7XG4gICAgc291cmNlLmxpc3QgPSBbJ2VsZXBoYW50JywgJ2xpb24nLCAncmFiYml0J107XG59O1xuIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xubGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vYmluZElmLmh0bWxgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXJTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9jb250cm9sbGVyLmpzYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBjb250cm9sbGVyU3RyaW5nfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gc291cmNlID0+IHtcbiAgICBzb3VyY2UudHJ1dGh5ID0gdHJ1ZTtcblxuICAgIHNvdXJjZS5mYWxzeSA9IGZhbHNlO1xuXG4gICAgc291cmNlLmlzR3JlYXRlclRoYW4xMCA9IGEgPT4gYSA+IDEwO1xuXG4gICAgc291cmNlLm15VmFyaWFibGUgPSAxNTtcbn07XG4iLCJjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5sZXQgdGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9iaW5kVmFsdWUuaHRtbGAsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlclN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2NvbnRyb2xsZXIuanNgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJTdHJpbmd9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBzb3VyY2UgPT4ge1xuICAgIHNvdXJjZS5teU1lc3NhZ2UgPSAnd2hlbmV2ZXIgYHNvdXJjZS5teU1lc3NhZ2VgIGlzIG1vZGlmaWVkLCBteSB0ZXh0IGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgY2hhbmdlJztcblxuICAgIHNvdXJjZS5teUZ1bmN0aW9uID0gKHZhcmlhYmxlLCBzdHJpbmcsIGludGVnZXIsIFtzdHJpbmcyLCBpbnRlZ2VyMl0pID0+XG4gICAgICAgIGB3aGVuZXZlciBcXGBzb3VyY2UubXlGdW5jdGlvblxcYCBvciBcXGBzb3VyY2UubXlWYXJpYWJsZVxcYCBhcmUgbW9kaWZpZWQsIG15IHRleHQgYmUgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBjaGFuZ2U7ICR7dmFyaWFibGV9ICR7c3RyaW5nfSAke2ludGVnZXJ9ICR7c3RyaW5nMn0gJHtpbnRlZ2VyMn1gO1xuXG4gICAgc291cmNlLm15VmFyaWFibGUgPSAnLW15IHZhcmlhYmxlIGlzIGF3ZXNvbWUtJztcblxuICAgIHNvdXJjZS5teVNwYW5NZXNzYWdlID0gJyRze3h9IGlzIHNob3J0aGFuZCBmb3IgJmx0O3NwYW4gYmluZD1cInhcIiZndDsgJmx0Oy9zcGFuJmd0Oyc7XG59O1xuIiwiY29uc3QgYmIgPSByZXF1aXJlKCdiYi1iZXR0ZXItYmluZGluZycpKCk7XG5cblN0cmluZy5wcm90b3R5cGUuY2xlYW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn07XG5cbi8vIGJsb2NrIGRlY2xhcmF0aW9uc1xuXG5iYi5kZWNsYXJlQmxvY2soJ25hdmlnYXRpb24nLCByZXF1aXJlKCcuL25hdmlnYXRpb24vbmF2aWdhdGlvbicpKTtcblxubGV0IHZhbHVlQmxvY2tEYXRhID0gcmVxdWlyZSgnLi9iaW5kVmFsdWUvYmluZFZhbHVlJyk7XG5iYi5kZWNsYXJlQmxvY2soJ2JpbmRWYWx1ZScsIHZhbHVlQmxvY2tEYXRhKTtcblxubGV0IGlmQmxvY2tEYXRhID0gcmVxdWlyZSgnLi9iaW5kSWYvYmluZElmJyk7XG5iYi5kZWNsYXJlQmxvY2soJ2JpbmRJZicsIGlmQmxvY2tEYXRhKTtcblxubGV0IGZvckJsb2NrRGF0YSA9IHJlcXVpcmUoJy4vYmluZEZvci9iaW5kRm9yJyk7XG5iYi5kZWNsYXJlQmxvY2soJ2JpbmRGb3InLCBmb3JCbG9ja0RhdGEpO1xuXG5iYi5kZWNsYXJlQmxvY2soJ2hlbGxvV29ybGQnLCByZXF1aXJlKCcuL2hlbGxvV29ybGQvaGVsbG9Xb3JsZCcpKTtcblxuLy8gYm9vdGluZ1xuXG5sZXQgc291cmNlID0gYmIuYm9vdChkb2N1bWVudC5maXJzdEVsZW1lbnRDaGlsZCwgd2luZG93KTtcblxuLy8gYXBwIGNvbnRyb2xsZXJcblxubGV0IHNuaXBwZXRzID0gW3ZhbHVlQmxvY2tEYXRhLCBpZkJsb2NrRGF0YSwgZm9yQmxvY2tEYXRhXTtcbmxldCBsaW5rTmFtZXMgPSBbJ2JpbmRWYWx1ZScsICdiaW5kSWYnLCAnYmluZEZvcicsICdoZWxsb1dvcmxkJ107XG5zb3VyY2UubmF2aWdhdGlvblBhZ2VzID0gWydWYWx1ZSBCaW5kaW5nJywgJ0lmIEJpbmRpbmcnLCAnRm9yIEJpbmRpbmcnLCAnSGVsbG8gV29ybGQnXTtcblxuc291cmNlLnNldFBhZ2VJbmRleCA9IHBhZ2VJbmRleCA9PiB7XG4gICAgc291cmNlLnBhZ2VJbmRleCA9IHBhZ2VJbmRleDtcbiAgICBzb3VyY2Uuc25pcHBldCA9IHNuaXBwZXRzW3BhZ2VJbmRleF0gJiYge1xuICAgICAgICB0ZW1wbGF0ZTogc25pcHBldHNbcGFnZUluZGV4XS50ZW1wbGF0ZS5jbGVhbigpLFxuICAgICAgICBjb250cm9sbGVyOiBzbmlwcGV0c1twYWdlSW5kZXhdLmNvbnRyb2xsZXJTdHJpbmcuY2xlYW4oKVxuICAgIH07XG5cbiAgICBsZXQgbGlua05hbWUgPSBsaW5rTmFtZXNbcGFnZUluZGV4XTtcbiAgICBsZXQgbGlua0V4cGFuZGVkID0gYGh0dHBzOi8vZ2l0aHViLmNvbS9tYWhob3YvYmItYmV0dGVyLWJpbmRpbmcvYmxvYi9IRUFEL2xpdmVFeGFtcGxlLyR7bGlua05hbWV9LyR7bGlua05hbWV9YDtcbiAgICBzb3VyY2UubGlua3MgPSBbYCR7bGlua0V4cGFuZGVkfS5odG1sYCwgYCR7bGlua0V4cGFuZGVkfS5qc2BdO1xufTtcblxuc291cmNlLnNldFBhZ2VJbmRleCgwKTtcblxuc291cmNlLm5hdmlnYXRpb25CbG9jay5pbml0KCk7XG4iLCJsZXQgdGVtcGxhdGUgPSByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2hlbGxvV29ybGQuaHRtbGAsICd1dGY4Jyk7XG5cbmxldCBjb250cm9sbGVyID0gc291cmNlID0+IHtcblxuICAgIC8vIGdyZWV0aW5nXG4gICAgc291cmNlLmxhcmdlRm9udCA9IDYwO1xuICAgIHNvdXJjZS5mYXZvcml0ZUNvbG9yID0gJ0RFRVBwaW5rJztcbiAgICBzb3VyY2UuZ3JlZXRpbmcgPSAnSSBoYXRlIHlvdSc7XG4gICAgc291cmNlLm5hbWUgPSAnV29ybGQnO1xuICAgIHNvdXJjZS5leGNsYW1hdGlvbiA9ICco4pWvwrDilqHCsO+8ieKVr++4tSDilLvilIHilLsnO1xuICAgIHNvdXJjZS5jaGFuZ2VDb2xvciA9IGlucHV0ID0+IHtcbiAgICAgICAgc291cmNlLmZhdm9yaXRlQ29sb3IgPSBpbnB1dC52YWx1ZTtcbiAgICB9O1xuXG4gICAgLy8gYW5pbWF0aW9uXG4gICAgbGV0IGFuaW1hdGlvbnMgPSBbXG4gICAgICAgICdodHRwOi8vd3d3LnFxcHIuY29tL2FzY2lpL2ltZy9hc2NpaS0xMDQzLmdpZicsXG4gICAgICAgICdodHRwczovL21lZGlhMC5naXBoeS5jb20vbWVkaWEvMTJFa0pDYnBhM2hHS2MvZ2lwaHkuZ2lmJyxcbiAgICAgICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwMDYuZ2lmJ107XG4gICAgbGV0IGFuaW1hdGlvbkluZGV4ID0gLTE7XG4gICAgc291cmNlLmNoYW5nZUFuaW1hdGlvbiA9ICgpID0+IHtcbiAgICAgICAgYW5pbWF0aW9uSW5kZXggPSAoYW5pbWF0aW9uSW5kZXggKyAxKSAlIGFuaW1hdGlvbnMubGVuZ3RoO1xuICAgICAgICBzb3VyY2UuYW5pbWF0aW9uID0gYW5pbWF0aW9uc1thbmltYXRpb25JbmRleF07XG4gICAgfTtcbiAgICBzb3VyY2UuY2hhbmdlQW5pbWF0aW9uKCk7XG5cbiAgICAvLyBqb2tlc1xuICAgIHNvdXJjZS5zZXRKb2tlVmlzaWJpbGl0eSA9IGNoZWNrYm94ID0+IHtcbiAgICAgICAgc291cmNlLmpva2VWaXNpYmlsaXR5ID0gY2hlY2tib3guY2hlY2tlZDtcbiAgICB9O1xuICAgIHNvdXJjZS5qb2tlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiTGVmdCBpbnNpZGUgbWFpbiB0aXJlIGFsbW9zdCBuZWVkcyByZXBsYWNlbWVudC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkFsbW9zdCByZXBsYWNlZCBsZWZ0IGluc2lkZSBtYWluIHRpcmUuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIlRlc3QgZmxpZ2h0IE9LLCBleGNlcHQgYXV0b2xhbmQgdmVyeSByb3VnaC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkF1dG9sYW5kIG5vdCBpbnN0YWxsZWQgb24gdGhpcyBhaXJjcmFmdC5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbSAjMTogIFwiIzIgUHJvcGVsbGVyIHNlZXBpbmcgcHJvcCBmbHVpZC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uICMxOiBcIiMyIFByb3BlbGxlciBzZWVwYWdlIG5vcm1hbC5cIicsXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW0gIzI6ICBcIiMxLCAjMywgYW5kICM0IHByb3BlbGxlcnMgbGFjayBub3JtYWwgc2VlcGFnZS5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogICAgXCJUaGUgYXV0b3BpbG90IGRvZXNuXFwndC5cIicsXG4gICAgICAgICAgICAgICAgJ1NpZ25lZCBvZmY6IFwiSVQgRE9FUyBOT1cuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIlNvbWV0aGluZyBsb29zZSBpbiBjb2NrcGl0LlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiU29tZXRoaW5nIHRpZ2h0ZW5lZCBpbiBjb2NrcGl0LlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJFdmlkZW5jZSBvZiBoeWRyYXVsaWMgbGVhayBvbiByaWdodCBtYWluIGxhbmRpbmcgZ2Vhci5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkV2aWRlbmNlIHJlbW92ZWQuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRNRSB2b2x1bWUgdW5iZWxpZXZhYmx5IGxvdWQuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJWb2x1bWUgc2V0IHRvIG1vcmUgYmVsaWV2YWJsZSBsZXZlbC5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiRGVhZCBidWdzIG9uIHdpbmRzaGllbGQuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJMaXZlIGJ1Z3Mgb24gb3JkZXIuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkF1dG9waWxvdCBpbiBhbHRpdHVkZSBob2xkIG1vZGUgcHJvZHVjZXMgYSAyMDAgZnBtIGRlc2NlbnQuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJDYW5ub3QgcmVwcm9kdWNlIHByb2JsZW0gb24gZ3JvdW5kLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJJRkYgaW5vcGVyYXRpdmUuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJJRkYgYWx3YXlzIGlub3BlcmF0aXZlIGluIE9GRiBtb2RlLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJGcmljdGlvbiBsb2NrcyBjYXVzZSB0aHJvdHRsZSBsZXZlcnMgdG8gc3RpY2suXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJUaGF0XFwncyB3aGF0IHRoZXlcXCdyZSB0aGVyZSBmb3IuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIk51bWJlciB0aHJlZSBlbmdpbmUgbWlzc2luZy5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkVuZ2luZSBmb3VuZCBvbiByaWdodCB3aW5nIGFmdGVyIGJyaWVmIHNlYXJjaC5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICBdO1xuICAgIHNvdXJjZS5qb2tlc1NvdXJjZSA9ICdodHRwczovL3d3dy5uZXRmdW5ueS5jb20vcmhmL2pva2VzLzk3L0p1bi91c2FmLmh0bWwnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGUsIGNvbnRyb2xsZXJ9O1xuIiwibGV0IHRlbXBsYXRlID0gcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9uYXZpZ2F0aW9uLmh0bWxgLCAndXRmOCcpO1xuXG5sZXQgY29udHJvbGxlciA9IHNvdXJjZSA9PiB7XG4gICAgc291cmNlLmluaXQgPSAoKSA9PiBzb3VyY2UuZ2V0RWxlbSgnbmF2aWdhdGlvblJhZGlvMCcpLmNoZWNrZWQgPSB0cnVlO1xufTtcblxubGV0IHBhcmFtZXRlcnMgPSBbJ3BhZ2VzJywgJ3NldFBhZ2VIYW5kbGVyJ107XG5cbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBwYXJhbWV0ZXJzfTtcbiIsImNvbnN0IEh0bWxCaW5kZXIgPSByZXF1aXJlKCcuL2h0bWxCaW5kZXInKTtcblxuY2xhc3MgQm9vdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmJsb2NrcyA9IHt9O1xuICAgIH1cblxuICAgIGRlY2xhcmVCbG9jayhibG9ja05hbWUsIGJsb2NrKSB7XG4gICAgICAgIHRoaXMuYmxvY2tzW2Jsb2NrTmFtZV0gPSBibG9jaztcbiAgICB9XG5cbiAgICBib290KHJvb3QsIGRlYnVnLCBtYW51YWwpIHtcbiAgICAgICAgbGV0IGFydGlmYWN0cyA9IG5ldyBIdG1sQmluZGVyKHJvb3QsIHRoaXMuYmxvY2tzKS5nZXRBcnRpZmFjdHMoKTtcbiAgICAgICAgZGVidWcgJiYgT2JqZWN0LmFzc2lnbihkZWJ1ZywgYXJ0aWZhY3RzKTtcbiAgICAgICAgaWYgKCFtYW51YWwpXG4gICAgICAgICAgICB0aGlzLmxvb3AoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlID0gYXJ0aWZhY3RzLnNvdXJjZTtcbiAgICB9XG5cbiAgICB0aWNrKCkge1xuICAgICAgICB0aGlzLnNvdXJjZS5faW52b2tlQWxsSGFuZGxlcnNfKCk7XG4gICAgfVxuXG4gICAgbG9vcChpbnRlcnZhbCA9IDEpIHtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5zb3VyY2UuX2ludm9rZUFsbEhhbmRsZXJzXygpLCBpbnRlcnZhbCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RlcjtcbiIsImNvbnN0IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIHNldEdldFByb3BlcnR5LCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZCwgY2xvbmV9ID0gcmVxdWlyZSgnLi9vYmpTY2Fmb2xkaW5nJyk7XG5jb25zdCB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfSA9IHJlcXVpcmUoJy4vc3RyaW5nU3BsaXR0ZXInKTtcbmNvbnN0IHNwbGl0QnlQYXJhbXMgPSByZXF1aXJlKCcuL3BhcmFtU3BsaXR0ZXInKTtcbmNvbnN0IHtjcmVhdGVTb3VyY2V9ID0gcmVxdWlyZSgnLi9zb3VyY2UnKTtcbmNvbnN0IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH0gPSByZXF1aXJlKCcuL3JlZ2V4Jyk7XG5cbmNsYXNzIEh0bWxCaW5kZXIge1xuICAgIGNvbnN0cnVjdG9yKHJvb3QsIGJsb2NrcywgcGFyZW50U291cmNlKSB7XG4gICAgICAgIGxldCB7c291cmNlLCBoYW5kbGVyc30gPSBjcmVhdGVTb3VyY2UocGFyZW50U291cmNlKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICAgICAgdGhpcy5iaW5kcyA9IHt9O1xuICAgICAgICB0aGlzLnJvb3QgPSByb290O1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7fTtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG5cbiAgICAgICAgSHRtbEJpbmRlci5yZXBsYWNlSW5saW5lQmluZGluZ3Mocm9vdCk7XG4gICAgICAgIHRoaXMuYmluZEVsZW0ocm9vdCwge30pO1xuICAgIH1cblxuICAgIGJpbmRFbGVtKGVsZW0sIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCBza2lwID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGVsZW0uYXR0cmlidXRlcztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB7bmFtZTogYXR0cmlidXRlTmFtZSwgdmFsdWV9ID0gYXR0cmlidXRlc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5tYXRjaChiaW5kUmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7cGFyYW1zfSA9IGF0dHJpYnV0ZUJpbmQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLm1hdGNoKGZ1bmN0aW9uUmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVGdW5jdGlvbkJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtmdW5jdGlvbk5hbWUsIHBhcmFtc30gPSBhdHRyaWJ1dGVCaW5kO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBiaW5kRWxlbSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1lbGVtJyk7XG4gICAgICAgICAgICBsZXQgYmluZENvbXBvbmVudCA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1jb21wb25lbnQnKTtcbiAgICAgICAgICAgIGxldCBiaW5kVXNlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLXVzZScpO1xuICAgICAgICAgICAgbGV0IGJpbmRBcyA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1hcycpO1xuICAgICAgICAgICAgbGV0IGJpbmRGb3IgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZm9yJyk7XG4gICAgICAgICAgICBsZXQgYmluZElmID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWlmJyk7XG4gICAgICAgICAgICBsZXQgYmluZEJsb2NrID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWJsb2NrJyk7XG4gICAgICAgICAgICBsZXQgYmluZFZhbHVlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kJyk7XG5cbiAgICAgICAgICAgIGlmIChiaW5kRWxlbSkge1xuICAgICAgICAgICAgICAgIHNldEdldFByb3BlcnR5KHRoaXMuc291cmNlLCBbYmluZEVsZW1dLCBlbGVtLCB0aGlzLnNvdXJjZS5faW52b2tlQWxsSGFuZGxlcnNfKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fYmluZElnbm9yZV8gPSB0aGlzLnNvdXJjZS5fYmluZElnbm9yZV8gfHwgW107XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UuX2JpbmRJZ25vcmVfLnB1c2goYmluZEVsZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYmluZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBbY29tcG9uZW50TmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmluZENvbXBvbmVudCwgJ3dpdGgnKTtcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWNvbXBvbmVudCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHtvdXRlckVsZW06IGVsZW0sIHBhcmFtc307XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZEZvcikge1xuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBbc291cmNlVG8sIGJpbmROYW1lXSA9IHNwbGl0QnlXb3JkKGJpbmRGb3IsICdpbicpO1xuICAgICAgICAgICAgICAgIGJpbmROYW1lID0gdHJhbnNsYXRlKGJpbmROYW1lLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvci1wYXJlbnQnKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlcGxhY2VXaXRoKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtZm9yJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5mb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgIG91dGVyRWxlbTogZWxlbSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlVG8sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUZyb206IGJpbmROYW1lLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgZWxlbSwgc291cmNlVG8sIGJpbmROYW1lLCBzb3VyY2VMaW5rcyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRBcykge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRCeUNvbW1hKGJpbmRBcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYXMgPT4gc3BsaXRCeVdvcmQoYXMsICdhcycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKFtmcm9tLCB0b10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUoZnJvbSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRJZikge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2V4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSA9IHRoaXMuZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGJpbmRJZiwgJ2lmcycsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gdG9kbyBhbGxvdyBub24tc291cmNlIHBhcmFtZXRlcnMgZm9yIGJpbmRVc2VcbiAgICAgICAgICAgICAgICBpZiAoYmluZFVzZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRVc2UsICd3aXRoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNJbnB1dCA9IHNwbGl0QnlTcGFjZShwYXJhbXNHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7b3V0ZXJFbGVtLCBwYXJhbXN9ID0gdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50RWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjb21wb25lbnRFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3RvXSA9IHRyYW5zbGF0ZShwYXJhbXNJbnB1dFtpbmRleF0sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtibG9jaywgYmxvY2tUb10gPSBzcGxpdEJ5V29yZChiaW5kQmxvY2ssICdhcycpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgW2Jsb2NrTmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmxvY2ssICd3aXRoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNJbnB1dCA9IHBhcmFtc0dyb3VwID8gc3BsaXRCeVBhcmFtcyhwYXJhbXNHcm91cCkgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXNJbnB1dCwgZWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIHBhcmFtZXRlcnN9ID0gdGhpcy5ibG9ja3NbYmxvY2tOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtYmxvY2snKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtzb3VyY2U6IGJsb2NrU291cmNlLCBoYW5kbGVyczogYmxvY2tIYW5kbGVyc30gPSBuZXcgSHRtbEJpbmRlcihlbGVtLCB0aGlzLmJsb2NrcywgdGhpcy5zb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyKGJsb2NrU291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycyAmJiBwYXJhbWV0ZXJzLmZvckVhY2goKHRvLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZyb20gPSB0cmFuc2xhdGUocGFyYW1zSW5wdXRbaW5kZXhdLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFBhaXJCaW5kKGZyb20sIGJsb2NrU291cmNlLCB0byk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UGFpckJpbmQoZnJvbSwgYmxvY2tTb3VyY2UsIHRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrU291cmNlW3RvXSA9IHBhcmFtVmFsdWVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrVG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlW2Jsb2NrVG9dID0gYmxvY2tTb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzW2Jsb2NrVG9dID0gYmxvY2tIYW5kbGVycztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLl91bm5hbWVkQmxvY2tzXyA9IHRoaXMuc291cmNlLl91bm5hbWVkQmxvY2tzXyB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMuX3VubmFtZWRCbG9ja3NfID0gdGhpcy5oYW5kbGVycy5fdW5uYW1lZEJsb2Nrc18gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fdW5uYW1lZEJsb2Nrc18ucHVzaChibG9ja1NvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzLl91bm5hbWVkQmxvY2tzXy5wdXNoKGJsb2NrSGFuZGxlcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2V4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSA9IHRoaXMuZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGJpbmRWYWx1ZSwgJ3ZhbHVlcycsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFza2lwKVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGVsZW0uY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShlbGVtLmNoaWxkcmVuW2ldLCBzb3VyY2VMaW5rcyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQmluZChiaW5kTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5iaW5kc1tiaW5kTmFtZV0pXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbGV0IGJpbmQgPSB7YXR0cmlidXRlczogW10sIGZvcnM6IFtdLCBpZnM6IFtdLCBwYWlyczogW10sIHZhbHVlczogW119O1xuICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXSA9IGJpbmQ7XG5cbiAgICAgICAgc2V0UHJvcGVydHkodGhpcy5oYW5kbGVycywgW2JpbmROYW1lLCAnX2Z1bmNfJ10sICgpID0+IHtcbiAgICAgICAgICAgIGJpbmQuYXR0cmlidXRlcyA9IGJpbmQuYXR0cmlidXRlcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcbiAgICAgICAgICAgIGJpbmQuZm9ycyA9IGJpbmQuZm9ycy5maWx0ZXIoKHtjb250YWluZXJ9KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoY29udGFpbmVyKSk7XG4gICAgICAgICAgICBiaW5kLmlmcyA9IGJpbmQuaWZzLmZpbHRlcigoe2VsZW19KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoZWxlbSkpO1xuICAgICAgICAgICAgYmluZC52YWx1ZXMgPSBiaW5kLnZhbHVlcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcblxuICAgICAgICAgICAgYmluZC5hdHRyaWJ1dGVzLmZvckVhY2goKHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtc30pID0+IHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUgPyB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKSA6IHRoaXMuYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC5mb3JzLmZvckVhY2goKHtjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpbmQuaWZzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZElmKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBiaW5kLnBhaXJzLmZvckVhY2goKHtmcm9tLCB0b09iaiwgdG9LZXl9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseVBhaXJCaW5kKGZyb20sIHRvT2JqLCB0b0tleSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC52YWx1ZXMuZm9yRWFjaCgoe2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBleHByZXNzaW9uU3RyLCB0eXBlLCBzb3VyY2VMaW5rcykgeyAvLyB0eXBlID0gJ2lmcycgb3IgJ3ZhbHVlcydcbiAgICAgICAgbGV0IGV4cHJlc3Npb25NYXRjaCA9IGV4cHJlc3Npb25TdHIubWF0Y2goZXhwcmVzc2lvblJlZ2V4KTtcbiAgICAgICAgaWYgKGV4cHJlc3Npb25NYXRjaCkge1xuICAgICAgICAgICAgbGV0IFssICwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtc1N0cl0gPSBleHByZXNzaW9uTWF0Y2g7XG4gICAgICAgICAgICBleHByZXNzaW9uTmFtZSA9IHRyYW5zbGF0ZShleHByZXNzaW9uTmFtZSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlQYXJhbXMocGFyYW1zU3RyKTtcbiAgICAgICAgICAgIGxldCBiaW5kUGFyYW1zID0gcGFyYW1zXG4gICAgICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbVswXSAhPT0gJ18nKVxuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gdHJhbnNsYXRlKHBhcmFtLCBzb3VyY2VMaW5rcykpO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiBwYXJhbVswXSA9PT0gJ18nID8gcGFyYW0uc3Vic3RyKDEpIDogcGFyYW0pXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XG4gICAgICAgICAgICBsZXQgZXhwcmVzc2lvblZhbHVlID0ge2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXN9O1xuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChleHByZXNzaW9uTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgICAgIGJpbmRQYXJhbXNcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChwYXJhbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQocGFyYW0sIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvblZhbHVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYmluZE5hbWUgPSB0cmFuc2xhdGUoZXhwcmVzc2lvblN0ciwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBiaW5kTmFtZX07XG4gICAgICAgICAgICB0aGlzLmFkZEV4cHJlc3Npb25CaW5kKGJpbmROYW1lLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZEF0dHJpYnV0ZUJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCBwYXJhbXMgPSB2YWx1ZS5zcGxpdChiaW5kUmVnZXhVbmNhcHR1cmluZylcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtYXRjaExpc3QgPSBwYXJhbS5tYXRjaChiaW5kUmVnZXgpO1xuICAgICAgICAgICAgICAgIGlmICghbWF0Y2hMaXN0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3N0cmluZ1ZhbHVlOiBwYXJhbX07XG4gICAgICAgICAgICAgICAgbGV0IFthbGwsIHByZWZpeFNsYXNoLCBtYXRjaF0gPSBtYXRjaExpc3Q7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeFNsYXNoID8ge3N0cmluZ1ZhbHVlOiBhbGwuc3Vic3RyKDEpfSA6IHtzb3VyY2VWYWx1ZTogdHJhbnNsYXRlKG1hdGNoLCBzb3VyY2VMaW5rcyl9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB7ZWxlbSwgYXR0cmlidXRlTmFtZSwgcGFyYW1zfTtcblxuICAgICAgICBwYXJhbXNcbiAgICAgICAgICAgIC5maWx0ZXIocGFyYW0gPT4gcGFyYW0uc291cmNlVmFsdWUpXG4gICAgICAgICAgICAuZm9yRWFjaCgoe3NvdXJjZVZhbHVlOiBiaW5kTmFtZX0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVCaW5kKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVCaW5kO1xuICAgIH1cblxuICAgIGFkZEF0dHJpYnV0ZUZ1bmN0aW9uQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpIHtcbiAgICAgICAgbGV0IFthbGwsIHByZWZpeFNsYXNoLCBmdW5jdGlvbk5hbWUsIHBhcmFtc1N0cl0gPSB2YWx1ZS5tYXRjaChmdW5jdGlvblJlZ2V4KTsgLy8gdG9kbyBwcmVmaXhTbGFzaFxuICAgICAgICBmdW5jdGlvbk5hbWUgPSB0cmFuc2xhdGUoZnVuY3Rpb25OYW1lLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5UGFyYW1zKHBhcmFtc1N0cilcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gdHJhbnNsYXRlKHBhcmFtLCBzb3VyY2VMaW5rcykpO1xuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtc307XG5cbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGZ1bmN0aW9uTmFtZSk7XG4gICAgICAgIHRoaXMuYmluZHNbZnVuY3Rpb25OYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XG5cbiAgICAgICAgcGFyYW1zXG4gICAgICAgICAgICAuZm9yRWFjaChiaW5kTmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYXR0cmlidXRlQmluZDtcbiAgICAgICAgLy8gdG9kbyBwcmV2ZW50IGJpbmRpbmcgbm9uIHNvdXJjZSB2YWx1ZXNcbiAgICB9XG5cbiAgICBhZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKSB7IC8vIHR5cGUgPSAnaWZzJyBvciAndmFsdWVzJ1xuICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xuICAgICAgICBsZXQgYmluZGVkID0gdGhpcy5iaW5kc1tiaW5kTmFtZV1bdHlwZV0uc29tZShvdGhlckJpbmQgPT5cbiAgICAgICAgICAgIG90aGVyQmluZC5lbGVtID09PSBlbGVtXG4gICAgICAgICk7XG4gICAgICAgICFiaW5kZWQgJiYgdGhpcy5iaW5kc1tiaW5kTmFtZV1bdHlwZV0ucHVzaChleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xuICAgIH1cblxuICAgIGFkZFBhaXJCaW5kKGZyb20sIHRvT2JqLCB0b0tleSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoZnJvbSk7XG4gICAgICAgIHRoaXMuYmluZHNbZnJvbV0ucGFpcnMucHVzaCh7ZnJvbSwgdG9PYmosIHRvS2V5fSk7XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcykge1xuICAgICAgICBsZXQgbW9kaWZpZWRWYWx1ZSA9IHBhcmFtc1xuICAgICAgICAgICAgLm1hcChwYXJhbSA9PiBwYXJhbS5zb3VyY2VWYWx1ZSA/IG5vdFVuZGVmaW5lZChnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3BhcmFtLnNvdXJjZVZhbHVlXSksICcnKSA6IHBhcmFtLnN0cmluZ1ZhbHVlKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBtb2RpZmllZFZhbHVlKTtcbiAgICB9XG5cbiAgICBhcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICBsZXQgaGFuZGxlciA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbZnVuY3Rpb25OYW1lXSk7XG4gICAgICAgIGVsZW1bYXR0cmlidXRlTmFtZV0gPSBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSwgZXZlbnQpO1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseShlbGVtLCBwYXJhbVZhbHVlcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtzb3VyY2VGcm9tXSk7XG4gICAgICAgIGlmICh2YWx1ZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgd2hpbGUgKGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCA+IHZhbHVlLmxlbmd0aClcbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSBjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQ7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkRWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1tzb3VyY2VUb10gPSBgJHtzb3VyY2VGcm9tfS4ke2luZGV4fWA7XG4gICAgICAgICAgICAgICAgc291cmNlTGlua3MuaW5kZXggPSBgX251bWJlcnNfLiR7aW5kZXh9YDtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGNoaWxkRWxlbSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZEVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5vYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICBlbGVtLmhpZGRlbiA9ICF2YWx1ZTtcbiAgICB9XG5cbiAgICBhcHBseVBhaXJCaW5kKGZyb20sIHRvT2JqLCB0b0tleSkge1xuICAgICAgICB0b09ialt0b0tleV0gPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2Zyb21dKTtcbiAgICB9XG5cbiAgICBhcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gbm90VW5kZWZpbmVkKHZhbHVlKTtcbiAgICB9XG5cbiAgICBvYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcbiAgICAgICAgaWYgKCFleHByZXNzaW9uTmFtZSlcbiAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2JpbmROYW1lXSk7XG5cbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2V4cHJlc3Npb25OYW1lXSk7XG4gICAgICAgIGxldCBwYXJhbVZhbHVlcyA9IHRoaXMuZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCBlbGVtKTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBleHByZXNzaW9uID09PSAnZnVuY3Rpb24nICYmIGV4cHJlc3Npb24oLi4ucGFyYW1WYWx1ZXMpO1xuICAgIH1cblxuICAgIC8vIHRvZG8gdXNlIFBhcmFtU3BsaXR0ZXIgaW4gb3JkZXIgdG8gc3VwcG9ydCBhcnJheSBhbmQgb2JqZWN0IHBhcmFtdGVyc1xuICAgIGdldFBhcmFtVmFsdWVzKHBhcmFtcywgdGhpc3MsIGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBwYXJhbXMubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgIGxldCBwYXJhbVBhdGggPSBwYXJhbS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1QYXRoLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXNzLCBwYXJhbVBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbVBhdGhbMF0gPT09ICdldmVudCcpIHtcbiAgICAgICAgICAgICAgICBwYXJhbVBhdGguc2hpZnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUoZXZlbnQsIHBhcmFtUGF0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VWYWx1ZSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW1dKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VWYWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VWYWx1ZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJhbS5yZXBsYWNlKC8nL2csICdcIicpKTtcblxuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0QXJ0aWZhY3RzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgIGhhbmRsZXJzOiB0aGlzLmhhbmRsZXJzLFxuICAgICAgICAgICAgYmluZHM6IHRoaXMuYmluZHMsXG4gICAgICAgICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICAgICAgICBjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHMsXG4gICAgICAgICAgICBibG9ja3M6IHRoaXMuYmxvY2tzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIHJlcGxhY2VJbmxpbmVCaW5kaW5ncyhlbGVtKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gZWxlbS5pbm5lckhUTUwucmVwbGFjZShhbGxTcGFuUmVnZXgsIChhbGwsIHByZWZpeFNsYXNoLCBtYXRjaCkgPT4gcHJlZml4U2xhc2ggPyBhbGwuc3Vic3RyKDEpIDogYDxzcGFuIGJpbmQ9XCIke21hdGNofVwiPjwvc3Bhbj5gKTtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBlbGVtLmlubmVySFRNTC5yZXBsYWNlKGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIChhbGwsIHByZWZpeFNsYXNoLCBtYXRjaCkgPT4gcHJlZml4U2xhc2ggPyBhbGwuc3Vic3RyKDEpIDogYDxzcGFuIGJpbmQ9XCIke21hdGNofVwiPjwvc3Bhbj5gKTtcbiAgICB9XG5cbiAgICAvLyB0b2RvIHVzZSBpbmRleFRvRG90IGZvciBhdHRyaWJ1dGUgYmluZHMgYXMgd2VsbCwgZS5nLiA8ZGl2IHN0eWxlPVwiJHtjb2xvclswXX1cIj4gYWJjIDwvZGl2PlxuICAgIHN0YXRpYyBnZXRCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZSkge1xuICAgICAgICByZXR1cm4gaW5kZXhUb0RvdChlbGVtLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpKTtcbiAgICB9XG59XG5cbi8vIGJpbmRzID0ge1xuLy8gICAgICdhLmIuYyc6IHtcbi8vICAgICAgICAgYXR0cmlidXRlczogW2F0dHJpYnV0ZUJpbmQxLCBhdHRyaWJ1dGVCaW5kMl0sXG4vLyAgICAgICAgIGZvcnM6IFt7Y29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rc31dLFxuLy8gICAgICAgICBpZnM6IFtleHByZXNzaW9uQmluZDEsIGV4cHJlc3Npb25CaW5kM10sXG4vLyAgICAgICAgIHBhaXJzOiBbe2Zyb20sIHRvT2JqLCB0b0tleX1dLFxuLy8gICAgICAgICB2YWx1ZXM6IFtleHByZXNzaW9uQmluZDEsIGV4cHJlc3Npb25CaW5kMl1cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIHNvdXJjZSA9IHtcbi8vICAgICBhOiB7XG4vLyAgICAgICAgIGI6IHtcbi8vICAgICAgICAgICAgIGM6IHt9XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGhhbmRsZXJzID0ge1xuLy8gICAgIGE6IHtcbi8vICAgICAgICAgX2Z1bmNfOiAnZnVuYycsXG4vLyAgICAgICAgIGI6IHtcbi8vICAgICAgICAgICAgIGM6IHtcbi8vICAgICAgICAgICAgICAgICBfZnVuY186ICdmdW5jJ1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gfTtcbi8vXG4vLyBjb21wb25lbnRzID0ge1xuLy8gICAgIGE6IHtcbi8vICAgICAgICAgb3V0ZXJFbGVtOiBvdXRlckVsZW0sXG4vLyAgICAgICAgIHBhcmFtczogW11cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGF0dHJpYnV0ZUJpbmQgPSB7XG4vLyAgICAgZWxlbTogZWxlbTEsXG4vLyAgICAgYXR0cmlidXRlTmFtZSxcbi8vICAgICBmdW5jdGlvbk5hbWUsIC8vIGNhbiBiZSBudWxsXG4vLyAgICAgcGFyYW1zOiBbe3N0cmluZ1ZhbHVlIHwgc291cmNlVmFsdWU6IHN0cmluZ31dLCAvLyBmb3IgbnVsbCBmdW5jdGlvbk5hbWVcbi8vICAgICBwYXJhbXM6IFtdIC8vIGZvciBub3QgbnVsbCBmdW5jdGlvbk5hbWVcbi8vIH07XG4vL1xuLy8gZXhwcmVzc2lvbkJpbmQgPSB7XG4vLyAgICAgZWxlbTogZWxlbTEsXG4vLyAgICAgZXhwcmVzc2lvbk5hbWUsIC8vIGNhbiBiZSBudWxsXG4vLyAgICAgcGFyYW1zOiBbXSxcbi8vICAgICBiaW5kTmFtZSAvLyBjYW4gYmUgbnVsbFxuLy8gfTtcblxubW9kdWxlLmV4cG9ydHMgPSBIdG1sQmluZGVyO1xuIiwiY29uc3QgQm9vdGVyID0gcmVxdWlyZSgnLi9ib290ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiBuZXcgQm9vdGVyKCk7XG5cbi8vIHRvZG9cbi8vIGFsbG93IGFycmF5IGJpbmRpbmcgaW4gaHRtbDogYDxkaXYgYmluZD1cInhbeV1cIj48L2Rpdj5gXG4vLyBjbGVhbiB1cCBwYWNrYWdlLmpzb25cbi8vICRze3h9IHN5bnRheCB0byBvbmx5IGFmZmVjdCBpbm5lciB0ZXh0IGFuZCBub3QgYXR0cmlidXRlc1xuLy8gYWxsb3cgZGVmaW5pbmcgYW5kIHVzaW5nIGNvbXBvbmVudHMgaW4gYW55IG9yZGVyXG4vLyBhbGxvdyB1c2luZyBleHByZXNzaW9ucyBmb3IgbW9yZSBiaW5kcyB0aGFuIGp1c3QgaWZzIGFuZCB2YWx1ZXMgKGUuZy4gYXR0cmlidXRlcywgZm9ycywgYXMsIHVzZSlcbi8vIHN1cHBvcnQgJGUgbmVzdGVkIGluc2lkZSAkc1xuLy8gaW52ZXN0aWdhdGUgd2h5IHNvdXJjZS5hID0gc291cmNlLmIgZG9lc24ndCBwcm9wb2dhdGUgY2hhbmdlc1xuLy8gaW52ZXN0aWdhdGUgd2h5IGJpbmQtZm9yIGluZGV4VmFycyBkb24ndCBwcm9wb2dhdGUgY2hhbmdlc1xuLy8gcm91dGluZyBvciBzd2FwcGluZyBzdGF0ZXNcbiIsImxldCBnZXRQcm9wZXJ0eSA9IChvYmosIHBhdGhzKSA9PiB7XG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhwYXRocyk7XG4gICAgbGV0IGxhc3RGaWVsZCA9IGZpZWxkcy5wb3AoKTtcbiAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiBvYmogPSBvYmpbZmllbGRdIHx8IHt9KTtcbiAgICByZXR1cm4gW29iaiwgbGFzdEZpZWxkXTtcbn07XG5cbmxldCBnZXRWYWx1ZSA9IChvYmosIHBhdGhzKSA9PiB7XG4gICAgbGV0IHByb3BlcnR5ID0gZ2V0UHJvcGVydHkob2JqLCBwYXRocyk7XG4gICAgcmV0dXJuIHByb3BlcnR5WzFdID09PSB1bmRlZmluZWQgPyBwcm9wZXJ0eVswXSA6IHByb3BlcnR5WzBdW3Byb3BlcnR5WzFdXTtcbn07XG5cbmxldCBjcmVhdGVQcm9wZXJ0eSA9IChvYmosIHBhdGhzKSA9PiB7XG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhwYXRocyk7XG4gICAgbGV0IGxhc3RGaWVsZCA9IGZpZWxkcy5wb3AoKTtcbiAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiBvYmogPSBvYmpbZmllbGRdID0gb2JqW2ZpZWxkXSB8fCB7fSk7XG4gICAgcmV0dXJuIFtvYmosIGxhc3RGaWVsZF07XG59O1xuXG5sZXQgc2V0UHJvcGVydHkgPSAob2JqLCBwYXRocywgdmFsdWUpID0+IHtcbiAgICBsZXQgcHJvcGVydHkgPSBjcmVhdGVQcm9wZXJ0eShvYmosIHBhdGhzKTtcbiAgICBwcm9wZXJ0eVswXVtwcm9wZXJ0eVsxXV0gPSB2YWx1ZTtcbn07XG5cbmxldCBzZXRHZXRQcm9wZXJ0eSA9IChvYmosIHBhdGhzLCB2YWx1ZSwgaGFuZGxlcikgPT4ge1xuICAgIGxldCBwcm9wZXJ0eSA9IGNyZWF0ZVByb3BlcnR5KG9iaiwgcGF0aHMpO1xuICAgIGxldCBrZXkgPSBwcm9wZXJ0eVsxXSArICdfJztcbiAgICBwcm9wZXJ0eVswXVtrZXldID0gdmFsdWU7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcGVydHlbMF0sIHByb3BlcnR5WzFdLCB7XG4gICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5WzBdW2tleV07XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmxldCB0cmFuc2xhdGUgPSAobmFtZSwgbGlua3MpID0+IHtcbiAgICBsZXQgb2NjdXJyZWQgPSBbXTtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKFtuYW1lXSk7XG4gICAgd2hpbGUgKGZpZWxkc1swXSBpbiBsaW5rcykge1xuICAgICAgICBvY2N1cnJlZC5wdXNoKGZpZWxkc1swXSk7XG4gICAgICAgIGZpZWxkc1swXSA9IGxpbmtzW2ZpZWxkc1swXV07XG4gICAgICAgIGlmIChvY2N1cnJlZC5pbmNsdWRlcyhmaWVsZHNbMF0pKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGZpZWxkcyA9IGdldEZpZWxkcyhmaWVsZHMpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzLnJlZHVjZSgoYSwgYikgPT4gYCR7YX0uJHtifWApO1xufTtcblxubGV0IGdldEZpZWxkcyA9IHBhdGhzID0+XG4gICAgcGF0aHNcbiAgICAgICAgLm1hcChwYXRoID0+IHBhdGguc3BsaXQoJy4nKSlcbiAgICAgICAgLnJlZHVjZSgoYWdncmVnYXRlLCBpdGVtKSA9PiBhZ2dyZWdhdGUuY29uY2F0KGl0ZW0pLCBbXSk7XG5cbmxldCBpbmRleFRvRG90ID0gZmllbGQgPT4gZmllbGQgJiYgZmllbGQucmVwbGFjZSgvXFxbKFxcdyspXFxdL2csIChfLCBtYXRjaCkgPT4gYC4ke21hdGNofWApO1xuXG5sZXQgbm90VW5kZWZpbmVkID0gKHZhbHVlLCB1bmRlZmluZWRWYWx1ZSA9IG51bGwpID0+XG4gICAgdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogdW5kZWZpbmVkVmFsdWU7XG5cbmxldCBpc09iamVjdCA9IG9iaiA9PiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmo7XG5cbmxldCBhcmVFcXVhbCA9IChhLCBiKSA9PiBhID09PSBiIHx8IE51bWJlci5pc05hTihhKSAmJiBOdW1iZXIuaXNOYU4oYik7IC8vIGJlY2F1c2UgTmFOICE9IE5hTiBhbmQgaXNOYW4odW5kZWZpbmVkKSA9PSB0cnVlLCBidXQgTnVtYmVyLklzTmFuKHVuZGVmaW5lZCkgPT0gZmFsc2VcblxubGV0IGNsb25lID0gb3JpZ2luYWwgPT4ge1xuICAgIHJldHVybiB7Li4ub3JpZ2luYWx9O1xufTtcblxubGV0IGNsb25lRGVlcCA9IG9iaiA9PiB7XG4gICAgaWYgKCFpc09iamVjdChvYmopKVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIGxldCBjbG9uZU9iaiA9IHt9O1xuICAgIE9iamVjdC5lbnRyaWVzKG9iaikuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiBjbG9uZU9ialtrZXldID0gY2xvbmVEZWVwKHZhbHVlKSk7XG4gICAgcmV0dXJuIGNsb25lT2JqO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7Z2V0VmFsdWUsIHNldFByb3BlcnR5LCBzZXRHZXRQcm9wZXJ0eSwgdHJhbnNsYXRlLCBpbmRleFRvRG90LCBub3RVbmRlZmluZWQsIGlzT2JqZWN0LCBhcmVFcXVhbCwgY2xvbmUsIGNsb25lRGVlcH07XG4iLCJjbGFzcyBQYXJhbVNwbGl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB9XG5cbiAgICBzcGxpdEJ5UGFyYW1zKCkge1xuICAgICAgICBsZXQgZGVwdGggPSAwO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHRJbmRleCgpICYmICghdGhpcy5hdFF1b3RlKCkgfHwgdGhpcy5za2lwUXVvdGUoKSkpIHtcbiAgICAgICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgICAgICBpZiAoY2hhciA9PT0gJ1snKVxuICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnXScpXG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICcsJyAmJiAhZGVwdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5pbmRleCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtcztcbiAgICB9XG5cbiAgICBmaW5kSW5kZXgocmVnZXgsIHN0YXJ0KSB7IC8vIHJldHVybnMgLTEgb3IgaW5kZXggb2YgbWF0Y2hcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zdHJpbmcuc3Vic3RyaW5nKHN0YXJ0KS5zZWFyY2gocmVnZXgpO1xuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCA/IGluZGV4ICsgc3RhcnQgOiAtMTtcbiAgICB9O1xuXG4gICAgbmV4dEluZGV4KCkge1xuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5maW5kSW5kZXgoL1ssJ1wiW1xcXV0vLCB0aGlzLmluZGV4ICsgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAtMTtcbiAgICB9XG5cbiAgICBhdFF1b3RlKCkge1xuICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xuICAgICAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIjtcbiAgICB9XG5cbiAgICBza2lwUXVvdGUoKSB7XG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleChjaGFyID09PSAnXCInID8gL1teXFxcXF1cIi8gOiAvW15cXFxcXScvLCB0aGlzLmluZGV4ICsgMSkgKyAxO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG5cbiAgICBhZGRQYXJhbSgpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMucHVzaCh0aGlzLnN0cmluZy5zdWJzdHJpbmcodGhpcy5zdGFydEluZGV4LCB0aGlzLmluZGV4ID4gMCA/IHRoaXMuaW5kZXggOiB0aGlzLnN0cmluZy5sZW5ndGgpLnRyaW0oKSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiBuZXcgUGFyYW1TcGxpdHRlcihzdHJpbmcpLnNwbGl0QnlQYXJhbXMoKTtcbiIsIi8vIChbXFx3LltcXF1dKylcblxubGV0IHNwYW5SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdXSspfS87XG5sZXQgYWxsU3BhblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuUmVnZXgsICdnJyk7XG5sZXQgc3BhbkV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdIT0+PHwmXStcXCguKlxcKSl9LztcbmxldCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuRXhwcmVzc2lvblJlZ2V4LCAnZycpO1xuXG5sZXQgYmluZFJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKX0vO1xubGV0IGJpbmRSZWdleFVuY2FwdHVyaW5nID0gLygoPzpcXFxcKT9cXCR7KD86W1xcdy5bXFxdXSspfSkvO1xuXG5sZXQgZnVuY3Rpb25SZWdleCA9IC8oXFxcXCk/XFwkeyhbXFx3LltcXF1dKylcXCgoLiopXFwpfS87XG5cbmxldCBleHByZXNzaW9uUmVnZXggPSAvKFxcXFwpPyhbXFx3LltcXF0hPT48fCZdKylcXCgoLiopXFwpLztcblxubW9kdWxlLmV4cG9ydHMgPSB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9O1xuIiwiY29uc3Qge2dldFZhbHVlLCBpc09iamVjdCwgYXJlRXF1YWwsIGNsb25lRGVlcH0gPSByZXF1aXJlKCcuL29ialNjYWZvbGRpbmcnKTtcblxuLy8gdG9kbyB3cmFwIHRoZXNlIGZ1bmN0aW9ucyBpbiBhIGNsYXNzXG5sZXQgY3JlYXRlU291cmNlID0gcGFyZW50U291cmNlID0+IHtcbiAgICBsZXQgaGFuZGxlcnMgPSB7fTtcbiAgICBsZXQgc291cmNlID0ge307XG4gICAgc2V0RGVmYXVsdFNvdXJjZShzb3VyY2UpO1xuICAgIGxldCBjb21wYXJlU291cmNlID0ge307XG4gICAgc291cmNlLl9pbnZva2VBbGxIYW5kbGVyc18gPSBwYXJlbnRTb3VyY2UgPyBwYXJlbnRTb3VyY2UuX2ludm9rZUFsbEhhbmRsZXJzXyA6ICgpID0+IGhhbmRsZU9yaWdpbkNoYW5nZXMoc291cmNlLCBjb21wYXJlU291cmNlLCBoYW5kbGVycyk7XG4gICAgcmV0dXJuIHtzb3VyY2UsIGhhbmRsZXJzfTtcbn07XG5cbmxldCBpZ25vcmUgPSBbXTtcblxubGV0IGlzQmluZElnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBvYmouX2JpbmRJZ25vcmVfICYmIG9iai5fYmluZElnbm9yZV8uaW5jbHVkZXMocHJvcCk7XG5cbi8vIHRvZG8gbWFrZSBfYmluZEF2b2lkQ3ljbGVzXyBpbmhlcml0ZWQgYW5kIG1heWJlIGF2b2lkIHBlciBiaW5kaW5nIGluc3RlYWQgcGVyIGNoYW5nZVxubGV0IGlzSWdub3JlZCA9IChvYmosIHByb3ApID0+IGlzQmluZElnbm9yZWQob2JqLCBwcm9wKSB8fCAob2JqLl9iaW5kQXZvaWRDeWNsZXNfICYmIGlnbm9yZS5zb21lKGlnbm9yZSA9PiBpZ25vcmUub2JqID09PSBvYmogJiYgaWdub3JlLnByb3AgPT09IHByb3ApKTtcblxubGV0IGhhbmRsZVNldCA9IChvYmosIHByb3AsIGhhbmRsZXJzLCBhY2N1bXVsYXRlZEhhbmRsZXJzKSA9PiB7XG4gICAgaWdub3JlLnB1c2goe29iaiwgcHJvcH0pO1xuICAgIGFjY3VtdWxhdGVkSGFuZGxlcnMuZm9yRWFjaChkb0hhbmRsZXIpO1xuICAgIGhhbmRsZXJzICYmIHByb3BvZ2F0ZUhhbmRsZXJEb3duKGhhbmRsZXJzKTtcbiAgICBpZ25vcmUucG9wKCk7XG59O1xuXG5sZXQgcHJvcG9nYXRlSGFuZGxlckRvd24gPSBoYW5kbGVycyA9PiB7XG4gICAgZG9IYW5kbGVyKGhhbmRsZXJzKTtcbiAgICBPYmplY3QuZW50cmllcyhoYW5kbGVycylcbiAgICAgICAgLmZpbHRlcigoW2tleV0pID0+IGtleSAhPT0gJ19mdW5jXycpXG4gICAgICAgIC5mb3JFYWNoKChbLCBoYW5kbGVyXSkgPT4gcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcikpO1xufTtcblxubGV0IGRvSGFuZGxlciA9IGhhbmRsZXIgPT4gdHlwZW9mIGhhbmRsZXIuX2Z1bmNfID09PSAnZnVuY3Rpb24nICYmIGhhbmRsZXIuX2Z1bmNfKCk7XG5cbmxldCBoYW5kbGVPcmlnaW5DaGFuZ2VzS2V5ID0gKHNvdXJjZSwgY29tcGFyZVNvdXJjZSwga2V5LCBoYW5kbGVycyA9IHt9LCBhY2N1bXVsYXRlZEhhbmRsZXJzID0gW10pID0+IHtcbiAgICBpZiAoaXNCaW5kSWdub3JlZChzb3VyY2UsIGtleSkpXG4gICAgICAgIHJldHVybjtcbiAgICBsZXQgdmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICBsZXQgY29tcGFyZVZhbHVlID0gY29tcGFyZVNvdXJjZVtrZXldO1xuICAgIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgaXNPYmplY3QoY29tcGFyZVZhbHVlKSlcbiAgICAgICAgcmV0dXJuIGhhbmRsZU9yaWdpbkNoYW5nZXModmFsdWUsIGNvbXBhcmVWYWx1ZSwgaGFuZGxlcnNba2V5XSwgYWNjdW11bGF0ZWRIYW5kbGVycy5jb25jYXQoaGFuZGxlcnMpKTtcbiAgICBpZiAoIWFyZUVxdWFsKHZhbHVlLCBjb21wYXJlVmFsdWUpKSB7XG4gICAgICAgIGNvbXBhcmVTb3VyY2Vba2V5XSA9IGNsb25lRGVlcCh2YWx1ZSk7XG4gICAgICAgIGhhbmRsZVNldChzb3VyY2UsIGtleSwgaGFuZGxlcnNba2V5XSwgYWNjdW11bGF0ZWRIYW5kbGVycy5jb25jYXQoaGFuZGxlcnMpKTsgLy8gdG9kbyB3cmFwIGhhbmRsZXJzIGFuZCBhY2N1bXVsYXRlZEhhbmRsZXJzIGluIGNsYXNzIHdpdGggcG9wUHJvcCBtZXRob2RcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufTtcblxuLy8gc291cmNlIGFuZCBjb21wYXJlU291cmNlIG11c3Qgbm90IGJlIG51bGwgb3IgdW5kZWZpbmVkXG5sZXQgaGFuZGxlT3JpZ2luQ2hhbmdlcyA9IChzb3VyY2UsIGNvbXBhcmVTb3VyY2UsIGhhbmRsZXJzID0ge30sIGFjY3VtdWxhdGVkSGFuZGxlcnMgPSBbXSkgPT4ge1xuICAgIGlmICghaGFuZGxlcnMpXG4gICAgICAgIHJldHVybjtcbiAgICBsZXQgY2hhbmdlZCA9IHRydWU7XG4gICAgd2hpbGUgKGNoYW5nZWQpIHtcbiAgICAgICAgY2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+XG4gICAgICAgICAgICBjaGFuZ2VkID0gaGFuZGxlT3JpZ2luQ2hhbmdlc0tleShzb3VyY2UsIGNvbXBhcmVTb3VyY2UsIGtleSwgaGFuZGxlcnMsIGFjY3VtdWxhdGVkSGFuZGxlcnMpIHx8IGNoYW5nZWQpO1xuICAgICAgICBPYmplY3Qua2V5cyhjb21wYXJlU291cmNlKS5mb3JFYWNoKGtleSA9PlxuICAgICAgICAgICAgY2hhbmdlZCA9ICFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBoYW5kbGVPcmlnaW5DaGFuZ2VzS2V5KHNvdXJjZSwgY29tcGFyZVNvdXJjZSwga2V5LCBoYW5kbGVycywgYWNjdW11bGF0ZWRIYW5kbGVycykgfHwgY2hhbmdlZCk7XG4gICAgfVxufTtcblxubGV0IHNldERlZmF1bHRTb3VyY2UgPSBzb3VyY2UgPT4ge1xuICAgIHNvdXJjZS5fbnVtYmVyc18gPSBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgZ2V0OiAoXywgcHJvcCkgPT4gcGFyc2VJbnQocHJvcCksXG4gICAgICAgIHNldDogKCkgPT4gZmFsc2VcbiAgICB9KTtcbiAgICBzb3VyY2Uubm90ID0gYSA9PiAhYTtcbiAgICBzb3VyY2VbJyEnXSA9IHNvdXJjZS5ub3Q7XG4gICAgc291cmNlLmVxID0gKGEsIGIpID0+IGEgPT09IGI7XG4gICAgc291cmNlLmVxdWFsID0gc291cmNlLmVxO1xuICAgIHNvdXJjZVsnPSddID0gc291cmNlLmVxO1xuICAgIHNvdXJjZS5uRXEgPSAoYSwgYikgPT4gYSAhPT0gYjtcbiAgICBzb3VyY2Uubm90RXF1YWwgPSBzb3VyY2UubkVxO1xuICAgIHNvdXJjZVsnIT0nXSA9IHNvdXJjZS5uRXE7XG4gICAgc291cmNlLmdyZWF0ZXIgPSAoYSwgYikgPT4gYSA+IGI7XG4gICAgc291cmNlWyc+J10gPSBzb3VyY2UuZ3JlYXRlcjtcbiAgICBzb3VyY2UubGVzcyA9IChhLCBiKSA9PiBhIDwgYjtcbiAgICBzb3VyY2VbJzwnXSA9IHNvdXJjZS5sZXNzO1xuICAgIHNvdXJjZS5ncmVhdGVyRXEgPSAoYSwgYikgPT4gYSA+PSBiO1xuICAgIHNvdXJjZVsnPj0nXSA9IHNvdXJjZS5ncmVhdGVyRXE7XG4gICAgc291cmNlLmxlc3NFcSA9IChhLCBiKSA9PiBhIDw9IGI7XG4gICAgc291cmNlWyc8PSddID0gc291cmNlLmxlc3NFcTtcbiAgICBzb3VyY2Uub3IgPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcbiAgICBzb3VyY2VbJ3wnXSA9IHNvdXJjZS5vcjtcbiAgICBzb3VyY2VbJ3x8J10gPSBzb3VyY2Uub3I7XG4gICAgc291cmNlLmFuZCA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcbiAgICBzb3VyY2VbJyYnXSA9IHNvdXJjZS5hbmQ7XG4gICAgc291cmNlWycmJiddID0gc291cmNlLmFuZDtcbiAgICBzb3VyY2UuZ2V0RWxlbSA9IGVsZW0gPT4ge1xuICAgICAgICBzb3VyY2UuX2ludm9rZUFsbEhhbmRsZXJzXygpO1xuICAgICAgICByZXR1cm4gZWxlbSAmJiBnZXRWYWx1ZShzb3VyY2UsIFtlbGVtXSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7Y3JlYXRlU291cmNlfTtcbiIsImxldCBzcGxpdEJ5V29yZCA9IChzdHJpbmcsIHdvcmQpID0+XG4gICAgc3RyaW5nLnNwbGl0KG5ldyBSZWdFeHAoYFxcXFxzKyR7d29yZH1cXFxccytgKSk7XG5cbmxldCBzcGxpdEJ5Q29tbWEgPSBzdHJpbmcgPT5cbiAgICBzdHJpbmcuc3BsaXQoL1xccyosXFxzKi8pO1xuXG5sZXQgc3BsaXRCeVNwYWNlID0gc3RyaW5nID0+XG4gICAgc3RyaW5nLnNwbGl0KC9cXHMrLyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX07XG4iXX0=
