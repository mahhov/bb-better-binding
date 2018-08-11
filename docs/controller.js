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
        let {source, handlers} = createSource();
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
// todo wrap these functions in a class
let createSource = () => {
    let handlers = {};
    let source = {};
    setDefaultSource(source);
    let compareSource = {};
    source.invokeAllHandlers = () => handleOriginChanges(source, compareSource, handlers);
    return {source, handlers};
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
        handleOriginChanges(value, compareValue, handlers[key], accumulatedHandlers.concat(handlers)); // todo use push for efficiency
    else if (value !== compareValue) {
        compareSource[key] = copy(value);
        handleSet(source, key, handlers[key], accumulatedHandlers.concat(handlers)); // todo wrap handlers and accumulatedHandlers in class with popProp method
    }
};

// source and compareSource must not be null or undefined
let handleOriginChanges = (source, compareSource, handlers = {}, accumulatedHandlers = []) => {
    if (!handlers)
        return;
    Object.keys(source).forEach(key => handleOriginChangesKey(source, compareSource, key, handlers, accumulatedHandlers));
    Object.keys(compareSource).forEach(key => !source.hasOwnProperty(key) && handleOriginChangesKey(source, compareSource, key, handlers, accumulatedHandlers));
};

// todo move these funcitons to obj scafollding util module
let isObject = obj => typeof obj === 'object' && obj;

let copy = obj => {
    if (!isObject(obj))
        return obj;
    let copyObj = {};
    Object.entries(obj).forEach(([key, value]) => copyObj[key] = copy(value));
    return copyObj;
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaXZlRXhhbXBsZS9iaW5kRm9yL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZEZvci9jb250cm9sbGVyLmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvaW5wdXQuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvY29udHJvbGxlci5qcyIsImxpdmVFeGFtcGxlL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9oZWxsb1dvcmxkL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvbmF2aWdhdGlvbi9pbnB1dC5qcyIsInNyYy9ib290ZXIuanMiLCJzcmMvaHRtbEJpbmRlci5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9vYmpTY2Fmb2xkaW5nLmpzIiwic3JjL3BhcmFtU3BsaXR0ZXIuanMiLCJzcmMvcmVnZXguanMiLCJzcmMvc291cmNlLmpzIiwic3JjL3N0cmluZ1NwbGl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQXlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLHVEQUFvRCxDQUFDO0FBQ3BFLElBQUksZ0JBQWdCLEdBQUcsdUZBQXFELENBQUM7QUFDN0UsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0FDTDFEO0FBQ0E7QUFDQTtBQUNBOztBQ0h5QjtBQUN6QixJQUFJLFFBQVEsR0FBRyx1d0JBQW1ELENBQUM7QUFDbkUsSUFBSSxnQkFBZ0IsR0FBRyx3S0FBcUQsQ0FBQztBQUM3RSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXpDLE1BQU0sQ0FBQyxPQUFP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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9aQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmxldCB0ZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2JpbmRGb3IuaHRtbGAsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlclN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2NvbnRyb2xsZXIuanNgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJTdHJpbmd9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBzb3VyY2UgPT4ge1xuICAgIHNvdXJjZS5saXN0ID0gWydlbGVwaGFudCcsICdsaW9uJywgJ3JhYmJpdCddO1xufTtcbiIsImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmxldCB0ZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2JpbmRJZi5odG1sYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vY29udHJvbGxlci5qc2AsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgY29udHJvbGxlclN0cmluZ307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNvdXJjZSA9PiB7XG4gICAgc291cmNlLnRydXRoeSA9IHRydWU7XG5cbiAgICBzb3VyY2UuZmFsc3kgPSBmYWxzZTtcblxuICAgIHNvdXJjZS5pc0dyZWF0ZXJUaGFuMTAgPSBhID0+IGEgPiAxMDtcblxuICAgIHNvdXJjZS5teVZhcmlhYmxlID0gMTU7XG59O1xuIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xubGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vYmluZFZhbHVlLmh0bWxgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXJTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9jb250cm9sbGVyLmpzYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBjb250cm9sbGVyU3RyaW5nfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gc291cmNlID0+IHtcbiAgICBzb3VyY2UubXlNZXNzYWdlID0gJ3doZW5ldmVyIGBzb3VyY2UubXlNZXNzYWdlYCBpcyBtb2RpZmllZCwgbXkgdGV4dCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIGNoYW5nZSc7XG5cbiAgICBzb3VyY2UubXlGdW5jdGlvbiA9ICh2YXJpYWJsZSwgc3RyaW5nLCBpbnRlZ2VyLCBbc3RyaW5nMiwgaW50ZWdlcjJdKSA9PlxuICAgICAgICBgd2hlbmV2ZXIgXFxgc291cmNlLm15RnVuY3Rpb25cXGAgb3IgXFxgc291cmNlLm15VmFyaWFibGVcXGAgYXJlIG1vZGlmaWVkLCBteSB0ZXh0IGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgY2hhbmdlOyAke3ZhcmlhYmxlfSAke3N0cmluZ30gJHtpbnRlZ2VyfSAke3N0cmluZzJ9ICR7aW50ZWdlcjJ9YDtcblxuICAgIHNvdXJjZS5teVZhcmlhYmxlID0gJy1teSB2YXJpYWJsZSBpcyBhd2Vzb21lLSc7XG5cbiAgICBzb3VyY2UubXlTcGFuTWVzc2FnZSA9ICckc3t4fSBpcyBzaG9ydGhhbmQgZm9yICZsdDtzcGFuIGJpbmQ9XCJ4XCImZ3Q7ICZsdDsvc3BhbiZndDsnO1xufTtcbiIsImNvbnN0IGJiID0gcmVxdWlyZSgnYmItYmV0dGVyLWJpbmRpbmcnKSgpO1xuXG5TdHJpbmcucHJvdG90eXBlLmNsZWFuID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59O1xuXG4vLyBibG9jayBkZWNsYXJhdGlvbnNcblxuYmIuZGVjbGFyZUJsb2NrKCduYXZpZ2F0aW9uJywgcmVxdWlyZSgnLi9uYXZpZ2F0aW9uL25hdmlnYXRpb24nKSk7XG5cbmxldCB2YWx1ZUJsb2NrRGF0YSA9IHJlcXVpcmUoJy4vYmluZFZhbHVlL2JpbmRWYWx1ZScpO1xuYmIuZGVjbGFyZUJsb2NrKCdiaW5kVmFsdWUnLCB2YWx1ZUJsb2NrRGF0YSk7XG5cbmxldCBpZkJsb2NrRGF0YSA9IHJlcXVpcmUoJy4vYmluZElmL2JpbmRJZicpO1xuYmIuZGVjbGFyZUJsb2NrKCdiaW5kSWYnLCBpZkJsb2NrRGF0YSk7XG5cbmxldCBmb3JCbG9ja0RhdGEgPSByZXF1aXJlKCcuL2JpbmRGb3IvYmluZEZvcicpO1xuYmIuZGVjbGFyZUJsb2NrKCdiaW5kRm9yJywgZm9yQmxvY2tEYXRhKTtcblxuYmIuZGVjbGFyZUJsb2NrKCdoZWxsb1dvcmxkJywgcmVxdWlyZSgnLi9oZWxsb1dvcmxkL2hlbGxvV29ybGQnKSk7XG5cbi8vIGJvb3RpbmdcblxubGV0IHNvdXJjZSA9IGJiLmJvb3QoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHdpbmRvdyk7XG5cbi8vIGFwcCBjb250cm9sbGVyXG5cblxubGV0IHNuaXBwZXRzID0gW3ZhbHVlQmxvY2tEYXRhLCBpZkJsb2NrRGF0YSwgZm9yQmxvY2tEYXRhXTtcbmxldCBsaW5rTmFtZXMgPSBbJ2JpbmRWYWx1ZScsICdiaW5kSWYnLCAnYmluZEZvcicsICdoZWxsb1dvcmxkJ107XG5zb3VyY2UubmF2aWdhdGlvblBhZ2VzID0gWydWYWx1ZSBCaW5kaW5nJywgJ0lmIEJpbmRpbmcnLCAnRm9yIEJpbmRpbmcnLCAnSGVsbG8gV29ybGQnXTtcblxuc291cmNlLnNldFBhZ2VJbmRleCA9IHBhZ2VJbmRleCA9PiB7XG4gICAgc291cmNlLnBhZ2VJbmRleCA9IHBhZ2VJbmRleDtcbiAgICBzb3VyY2Uuc25pcHBldCA9IHNuaXBwZXRzW3BhZ2VJbmRleF0gJiYge1xuICAgICAgICB0ZW1wbGF0ZTogc25pcHBldHNbcGFnZUluZGV4XS50ZW1wbGF0ZS5jbGVhbigpLFxuICAgICAgICBjb250cm9sbGVyOiBzbmlwcGV0c1twYWdlSW5kZXhdLmNvbnRyb2xsZXJTdHJpbmcuY2xlYW4oKVxuICAgIH07XG5cbiAgICBsZXQgbGlua05hbWUgPSBsaW5rTmFtZXNbcGFnZUluZGV4XTtcbiAgICBsZXQgbGlua0V4cGFuZGVkID0gYGh0dHBzOi8vZ2l0aHViLmNvbS9tYWhob3YvYmItYmV0dGVyLWJpbmRpbmcvYmxvYi9IRUFEL2xpdmVFeGFtcGxlLyR7bGlua05hbWV9LyR7bGlua05hbWV9YDtcbiAgICBzb3VyY2UubGlua3MgPSBbYCR7bGlua0V4cGFuZGVkfS5odG1sYCwgYCR7bGlua0V4cGFuZGVkfS5qc2BdO1xufTtcblxuc291cmNlLnNldFBhZ2VJbmRleCgwKTtcbnNvdXJjZS5uYXZpZ2F0aW9uQmxvY2submF2aWdhdGlvblJhZGlvMC5jaGVja2VkID0gdHJ1ZTtcbiIsImxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vaGVsbG9Xb3JsZC5odG1sYCwgJ3V0ZjgnKTtcblxubGV0IGNvbnRyb2xsZXIgPSBzb3VyY2UgPT4ge1xuXG4gICAgLy8gZ3JlZXRpbmdcbiAgICBzb3VyY2UubGFyZ2VGb250ID0gNjA7XG4gICAgc291cmNlLmZhdm9yaXRlQ29sb3IgPSAnREVFUHBpbmsnO1xuICAgIHNvdXJjZS5ncmVldGluZyA9ICdJIGhhdGUgeW91JztcbiAgICBzb3VyY2UubmFtZSA9ICdXb3JsZCc7XG4gICAgc291cmNlLmV4Y2xhbWF0aW9uID0gJyjila/CsOKWocKw77yJ4pWv77i1IOKUu+KUgeKUuyc7XG4gICAgc291cmNlLmNoYW5nZUNvbG9yID0gaW5wdXQgPT4ge1xuICAgICAgICBzb3VyY2UuZmF2b3JpdGVDb2xvciA9IGlucHV0LnZhbHVlO1xuICAgIH07XG5cbiAgICAvLyBhbmltYXRpb25cbiAgICBsZXQgYW5pbWF0aW9ucyA9IFtcbiAgICAgICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwNDMuZ2lmJyxcbiAgICAgICAgJ2h0dHBzOi8vbWVkaWEwLmdpcGh5LmNvbS9tZWRpYS8xMkVrSkNicGEzaEdLYy9naXBoeS5naWYnLFxuICAgICAgICAnaHR0cDovL3d3dy5xcXByLmNvbS9hc2NpaS9pbWcvYXNjaWktMTAwNi5naWYnXTtcbiAgICBsZXQgYW5pbWF0aW9uSW5kZXggPSAtMTtcbiAgICBzb3VyY2UuY2hhbmdlQW5pbWF0aW9uID0gKCkgPT4ge1xuICAgICAgICBhbmltYXRpb25JbmRleCA9IChhbmltYXRpb25JbmRleCArIDEpICUgYW5pbWF0aW9ucy5sZW5ndGg7XG4gICAgICAgIHNvdXJjZS5hbmltYXRpb24gPSBhbmltYXRpb25zW2FuaW1hdGlvbkluZGV4XTtcbiAgICB9O1xuICAgIHNvdXJjZS5jaGFuZ2VBbmltYXRpb24oKTtcblxuICAgIC8vIGpva2VzXG4gICAgc291cmNlLnNldEpva2VWaXNpYmlsaXR5ID0gY2hlY2tib3ggPT4ge1xuICAgICAgICBzb3VyY2Uuam9rZVZpc2liaWxpdHkgPSBjaGVja2JveC5jaGVja2VkO1xuICAgIH07XG4gICAgc291cmNlLmpva2VzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJMZWZ0IGluc2lkZSBtYWluIHRpcmUgYWxtb3N0IG5lZWRzIHJlcGxhY2VtZW50LlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiQWxtb3N0IHJlcGxhY2VkIGxlZnQgaW5zaWRlIG1haW4gdGlyZS5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiVGVzdCBmbGlnaHQgT0ssIGV4Y2VwdCBhdXRvbGFuZCB2ZXJ5IHJvdWdoLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiQXV0b2xhbmQgbm90IGluc3RhbGxlZCBvbiB0aGlzIGFpcmNyYWZ0LlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtICMxOiAgXCIjMiBQcm9wZWxsZXIgc2VlcGluZyBwcm9wIGZsdWlkLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb24gIzE6IFwiIzIgUHJvcGVsbGVyIHNlZXBhZ2Ugbm9ybWFsLlwiJyxcbiAgICAgICAgICAgICAgICAnUHJvYmxlbSAjMjogIFwiIzEsICMzLCBhbmQgIzQgcHJvcGVsbGVycyBsYWNrIG5vcm1hbCBzZWVwYWdlLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgICBcIlRoZSBhdXRvcGlsb3QgZG9lc25cXCd0LlwiJyxcbiAgICAgICAgICAgICAgICAnU2lnbmVkIG9mZjogXCJJVCBET0VTIE5PVy5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiU29tZXRoaW5nIGxvb3NlIGluIGNvY2twaXQuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJTb21ldGhpbmcgdGlnaHRlbmVkIGluIGNvY2twaXQuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkV2aWRlbmNlIG9mIGh5ZHJhdWxpYyBsZWFrIG9uIHJpZ2h0IG1haW4gbGFuZGluZyBnZWFyLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiRXZpZGVuY2UgcmVtb3ZlZC5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiRE1FIHZvbHVtZSB1bmJlbGlldmFibHkgbG91ZC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlZvbHVtZSBzZXQgdG8gbW9yZSBiZWxpZXZhYmxlIGxldmVsLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJEZWFkIGJ1Z3Mgb24gd2luZHNoaWVsZC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkxpdmUgYnVncyBvbiBvcmRlci5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiQXV0b3BpbG90IGluIGFsdGl0dWRlIGhvbGQgbW9kZSBwcm9kdWNlcyBhIDIwMCBmcG0gZGVzY2VudC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkNhbm5vdCByZXByb2R1Y2UgcHJvYmxlbSBvbiBncm91bmQuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIklGRiBpbm9wZXJhdGl2ZS5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIklGRiBhbHdheXMgaW5vcGVyYXRpdmUgaW4gT0ZGIG1vZGUuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkZyaWN0aW9uIGxvY2tzIGNhdXNlIHRocm90dGxlIGxldmVycyB0byBzdGljay5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlRoYXRcXCdzIHdoYXQgdGhleVxcJ3JlIHRoZXJlIGZvci5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiTnVtYmVyIHRocmVlIGVuZ2luZSBtaXNzaW5nLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiRW5naW5lIGZvdW5kIG9uIHJpZ2h0IHdpbmcgYWZ0ZXIgYnJpZWYgc2VhcmNoLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF07XG4gICAgc291cmNlLmpva2VzU291cmNlID0gJ2h0dHBzOi8vd3d3Lm5ldGZ1bm55LmNvbS9yaGYvam9rZXMvOTcvSnVuL3VzYWYuaHRtbCc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlcn07XG4iLCJsZXQgdGVtcGxhdGUgPSByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L25hdmlnYXRpb24uaHRtbGAsICd1dGY4Jyk7XG5cbmxldCBjb250cm9sbGVyID0gc291cmNlID0+IHtcbn07XG5cbmxldCBwYXJhbWV0ZXJzID0gWydwYWdlcycsICdzZXRQYWdlSGFuZGxlciddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgcGFyYW1ldGVyc307IiwiY29uc3QgSHRtbEJpbmRlciA9IHJlcXVpcmUoJy4vaHRtbEJpbmRlcicpO1xuXG5jbGFzcyBCb290ZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYmxvY2tzID0ge307XG4gICAgfVxuXG4gICAgZGVjbGFyZUJsb2NrKGJsb2NrTmFtZSwgYmxvY2spIHtcbiAgICAgICAgdGhpcy5ibG9ja3NbYmxvY2tOYW1lXSA9IGJsb2NrO1xuICAgIH1cblxuICAgIGJvb3Qocm9vdCwgZGVidWcpIHtcbiAgICAgICAgbGV0IGFydGlmYWN0cyA9IG5ldyBIdG1sQmluZGVyKHJvb3QsIHRoaXMuYmxvY2tzKS5nZXRBcnRpZmFjdHMoKTtcbiAgICAgICAgZGVidWcgJiYgT2JqZWN0LmFzc2lnbihkZWJ1ZywgYXJ0aWZhY3RzKTtcbiAgICAgICAgcmV0dXJuIGFydGlmYWN0cy5zb3VyY2U7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3RlcjtcbiIsImNvbnN0IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIGNsb25lLCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZH0gPSByZXF1aXJlKCcuL29ialNjYWZvbGRpbmcnKTtcbmNvbnN0IHtzcGxpdEJ5V29yZCwgc3BsaXRCeUNvbW1hLCBzcGxpdEJ5U3BhY2V9ID0gcmVxdWlyZSgnLi9zdHJpbmdTcGxpdHRlcicpO1xuY29uc3Qgc3BsaXRCeVBhcmFtcyA9IHJlcXVpcmUoJy4vcGFyYW1TcGxpdHRlcicpO1xuY29uc3Qge2NyZWF0ZVNvdXJjZX0gPSByZXF1aXJlKCcuL3NvdXJjZScpO1xuY29uc3Qge2FsbFNwYW5SZWdleCwgYWxsU3BhbkV4cHJlc3Npb25SZWdleCwgYmluZFJlZ2V4LCBiaW5kUmVnZXhVbmNhcHR1cmluZywgZnVuY3Rpb25SZWdleCwgZXhwcmVzc2lvblJlZ2V4fSA9IHJlcXVpcmUoJy4vcmVnZXgnKTtcblxuY2xhc3MgSHRtbEJpbmRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihyb290LCBibG9ja3MpIHtcbiAgICAgICAgbGV0IHtzb3VyY2UsIGhhbmRsZXJzfSA9IGNyZWF0ZVNvdXJjZSgpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xuICAgICAgICB0aGlzLmJpbmRzID0ge307XG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcblxuICAgICAgICBIdG1sQmluZGVyLnJlcGxhY2VJbmxpbmVCaW5kaW5ncyhyb290KTtcbiAgICAgICAgdGhpcy5iaW5kRWxlbShyb290LCB7fSk7XG4gICAgfVxuXG4gICAgYmluZEVsZW0oZWxlbSwgc291cmNlTGlua3MpIHtcbiAgICAgICAgbGV0IHNraXAgPSBmYWxzZTtcblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gZWxlbS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHtuYW1lOiBhdHRyaWJ1dGVOYW1lLCB2YWx1ZX0gPSBhdHRyaWJ1dGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLm1hdGNoKGJpbmRSZWdleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB0aGlzLmFkZEF0dHJpYnV0ZUJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtwYXJhbXN9ID0gYXR0cmlidXRlQmluZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgcGFyYW1zKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB0aGlzLmFkZEF0dHJpYnV0ZUZ1bmN0aW9uQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICBsZXQge2Z1bmN0aW9uTmFtZSwgcGFyYW1zfSA9IGF0dHJpYnV0ZUJpbmQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGJpbmRFbGVtID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWVsZW0nKTtcbiAgICAgICAgICAgIGxldCBiaW5kQ29tcG9uZW50ID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWNvbXBvbmVudCcpO1xuICAgICAgICAgICAgbGV0IGJpbmRVc2UgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtdXNlJyk7XG4gICAgICAgICAgICBsZXQgYmluZEFzID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWFzJyk7XG4gICAgICAgICAgICBsZXQgYmluZEZvciA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1mb3InKTtcbiAgICAgICAgICAgIGxldCBiaW5kSWYgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtaWYnKTtcbiAgICAgICAgICAgIGxldCBiaW5kQmxvY2sgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtYmxvY2snKTtcbiAgICAgICAgICAgIGxldCBiaW5kVmFsdWUgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQnKTtcblxuICAgICAgICAgICAgaWYgKGJpbmRFbGVtKSB7XG4gICAgICAgICAgICAgICAgc2V0UHJvcGVydHkodGhpcy5zb3VyY2UsIFtiaW5kRWxlbV0sIGVsZW0pO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fID0gdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18gfHwgW107XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18ucHVzaChiaW5kRWxlbSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBbY29tcG9uZW50TmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmluZENvbXBvbmVudCwgJ3dpdGgnKTtcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWNvbXBvbmVudCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHtvdXRlckVsZW06IGVsZW0sIHBhcmFtc307XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZEZvcikge1xuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBbc291cmNlVG8sIGJpbmROYW1lXSA9IHNwbGl0QnlXb3JkKGJpbmRGb3IsICdpbicpO1xuICAgICAgICAgICAgICAgIGJpbmROYW1lID0gdHJhbnNsYXRlKGJpbmROYW1lLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvci1wYXJlbnQnKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlcGxhY2VXaXRoKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtZm9yJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5mb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgIG91dGVyRWxlbTogZWxlbSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlVG8sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUZyb206IGJpbmROYW1lLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgZWxlbSwgc291cmNlVG8sIGJpbmROYW1lLCBzb3VyY2VMaW5rcyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRBcykge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRCeUNvbW1hKGJpbmRBcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYXMgPT4gc3BsaXRCeVdvcmQoYXMsICdhcycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKFtmcm9tLCB0b10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUoZnJvbSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRJZikge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2V4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSA9IHRoaXMuZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGJpbmRJZiwgJ2lmcycsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gdG9kbyBhbGxvdyBub24tc291cmNlIHBhcmFtZXRlcnMgZm9yIGJpbmRVc2VcbiAgICAgICAgICAgICAgICBpZiAoYmluZFVzZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRVc2UsICd3aXRoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNJbnB1dCA9IHNwbGl0QnlTcGFjZShwYXJhbXNHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7b3V0ZXJFbGVtLCBwYXJhbXN9ID0gdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50RWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjb21wb25lbnRFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3RvXSA9IHRyYW5zbGF0ZShwYXJhbXNJbnB1dFtpbmRleF0sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtibG9jaywgYmxvY2tUb10gPSBzcGxpdEJ5V29yZChiaW5kQmxvY2ssICdhcycpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgW2Jsb2NrTmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmxvY2ssICd3aXRoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNJbnB1dCA9IHBhcmFtc0dyb3VwID8gc3BsaXRCeVBhcmFtcyhwYXJhbXNHcm91cCkgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXNJbnB1dCwgZWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIHBhcmFtZXRlcnN9ID0gdGhpcy5ibG9ja3NbYmxvY2tOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtYmxvY2snKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrU291cmNlID0gbmV3IEh0bWxCaW5kZXIoZWxlbSwgdGhpcy5ibG9ja3MpLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcihibG9ja1NvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnMgJiYgcGFyYW1ldGVycy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcm9tID0gdHJhbnNsYXRlKHBhcmFtc0lucHV0W2luZGV4XSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRQYWlyQmluZChmcm9tLCBibG9ja1NvdXJjZSwgdG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVBhaXJCaW5kKGZyb20sIGJsb2NrU291cmNlLCB0byk7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja1NvdXJjZVt0b10gPSBwYXJhbVZhbHVlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9ja1RvKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VbYmxvY2tUb10gPSBibG9ja1NvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyBkZWJ1Z2dlciBmb3IgYmxvY2sgYmluZGluZ3NcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmluZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9ID0gdGhpcy5leHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgYmluZFZhbHVlLCAndmFsdWVzJywgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZFZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNraXApXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gZWxlbS5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGVsZW0uY2hpbGRyZW5baV0sIHNvdXJjZUxpbmtzKTtcbiAgICB9XG5cbiAgICBjcmVhdGVCaW5kKGJpbmROYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmJpbmRzW2JpbmROYW1lXSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsZXQgYmluZCA9IHthdHRyaWJ1dGVzOiBbXSwgZm9yczogW10sIGlmczogW10sIHBhaXJzOiBbXSwgdmFsdWVzOiBbXX07XG4gICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdID0gYmluZDtcblxuICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLmhhbmRsZXJzLCBbYmluZE5hbWUsICdfZnVuY18nXSwgKCkgPT4ge1xuICAgICAgICAgICAgYmluZC5hdHRyaWJ1dGVzID0gYmluZC5hdHRyaWJ1dGVzLmZpbHRlcigoe2VsZW19KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoZWxlbSkpO1xuICAgICAgICAgICAgYmluZC5mb3JzID0gYmluZC5mb3JzLmZpbHRlcigoe2NvbnRhaW5lcn0pID0+IHRoaXMucm9vdC5jb250YWlucyhjb250YWluZXIpKTtcbiAgICAgICAgICAgIGJpbmQuaWZzID0gYmluZC5pZnMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XG4gICAgICAgICAgICBiaW5kLnZhbHVlcyA9IGJpbmQudmFsdWVzLmZpbHRlcigoe2VsZW19KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoZWxlbSkpO1xuXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoe2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfSkgPT4ge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSA/IHRoaXMuYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpIDogdGhpcy5hcHBseUJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBiaW5kLmZvcnMuZm9yRWFjaCgoe2NvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3N9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGb3IoY29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC5pZnMuZm9yRWFjaCgoe2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpbmQucGFpcnMuZm9yRWFjaCgoe2Zyb20sIHRvT2JqLCB0b0tleX0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UGFpckJpbmQoZnJvbSwgdG9PYmosIHRvS2V5KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBiaW5kLnZhbHVlcy5mb3JFYWNoKCh7ZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGV4cHJlc3Npb25TdHIsIHR5cGUsIHNvdXJjZUxpbmtzKSB7IC8vIHR5cGUgPSAnaWZzJyBvciAndmFsdWVzJ1xuICAgICAgICBsZXQgZXhwcmVzc2lvbk1hdGNoID0gZXhwcmVzc2lvblN0ci5tYXRjaChleHByZXNzaW9uUmVnZXgpO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbk1hdGNoKSB7XG4gICAgICAgICAgICBsZXQgWywgLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zU3RyXSA9IGV4cHJlc3Npb25NYXRjaDtcbiAgICAgICAgICAgIGV4cHJlc3Npb25OYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25OYW1lLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpO1xuICAgICAgICAgICAgbGV0IGJpbmRQYXJhbXMgPSBwYXJhbXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHBhcmFtID0+IHBhcmFtWzBdICE9PSAnXycpXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXNcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHBhcmFtWzBdID09PSAnXycgPyBwYXJhbS5zdWJzdHIoMSkgOiBwYXJhbSlcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uVmFsdWUgPSB7ZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtc307XG4gICAgICAgICAgICB0aGlzLmFkZEV4cHJlc3Npb25CaW5kKGV4cHJlc3Npb25OYW1lLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAgICAgYmluZFBhcmFtc1xuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChwYXJhbSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBiaW5kTmFtZSA9IHRyYW5zbGF0ZShleHByZXNzaW9uU3RyLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICBsZXQgZXhwcmVzc2lvblZhbHVlID0ge2VsZW0sIGJpbmROYW1lfTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvblZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpIHtcbiAgICAgICAgbGV0IHBhcmFtcyA9IHZhbHVlLnNwbGl0KGJpbmRSZWdleFVuY2FwdHVyaW5nKVxuICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoTGlzdCA9IHBhcmFtLm1hdGNoKGJpbmRSZWdleCk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaExpc3QpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RyaW5nVmFsdWU6IHBhcmFtfTtcbiAgICAgICAgICAgICAgICBsZXQgW2FsbCwgcHJlZml4U2xhc2gsIG1hdGNoXSA9IG1hdGNoTGlzdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4U2xhc2ggPyB7c3RyaW5nVmFsdWU6IGFsbC5zdWJzdHIoMSl9IDoge3NvdXJjZVZhbHVlOiB0cmFuc2xhdGUobWF0Y2gsIHNvdXJjZUxpbmtzKX07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXN9O1xuXG4gICAgICAgIHBhcmFtc1xuICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbS5zb3VyY2VWYWx1ZSlcbiAgICAgICAgICAgIC5mb3JFYWNoKCh7c291cmNlVmFsdWU6IGJpbmROYW1lfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xuICAgICAgICBsZXQgW2FsbCwgcHJlZml4U2xhc2gsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zU3RyXSA9IHZhbHVlLm1hdGNoKGZ1bmN0aW9uUmVnZXgpOyAvLyB0b2RvIHByZWZpeFNsYXNoXG4gICAgICAgIGZ1bmN0aW9uTmFtZSA9IHRyYW5zbGF0ZShmdW5jdGlvbk5hbWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlQYXJhbXMocGFyYW1zU3RyKVxuICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0ge2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfTtcblxuICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoZnVuY3Rpb25OYW1lKTtcbiAgICAgICAgdGhpcy5iaW5kc1tmdW5jdGlvbk5hbWVdLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVCaW5kKTtcblxuICAgICAgICBwYXJhbXNcbiAgICAgICAgICAgIC5mb3JFYWNoKGJpbmROYW1lID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVCaW5kKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVCaW5kO1xuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xuICAgIH1cblxuICAgIGFkZEV4cHJlc3Npb25CaW5kKGJpbmROYW1lLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgIGxldCBiaW5kZWQgPSB0aGlzLmJpbmRzW2JpbmROYW1lXVt0eXBlXS5zb21lKG90aGVyQmluZCA9PlxuICAgICAgICAgICAgb3RoZXJCaW5kLmVsZW0gPT09IGVsZW1cbiAgICAgICAgKTtcbiAgICAgICAgIWJpbmRlZCAmJiB0aGlzLmJpbmRzW2JpbmROYW1lXVt0eXBlXS5wdXNoKGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgIC8vIHRvZG8gcHJldmVudCBiaW5kaW5nIG5vbiBzb3VyY2UgdmFsdWVzXG4gICAgfVxuXG4gICAgYWRkUGFpckJpbmQoZnJvbSwgdG9PYmosIHRvS2V5KSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmcm9tKTtcbiAgICAgICAgdGhpcy5iaW5kc1tmcm9tXS5wYWlycy5wdXNoKHtmcm9tLCB0b09iaiwgdG9LZXl9KTtcbiAgICB9XG5cbiAgICBhcHBseUJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGxldCBtb2RpZmllZFZhbHVlID0gcGFyYW1zXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlID8gbm90VW5kZWZpbmVkKGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW0uc291cmNlVmFsdWVdKSwgJycpIDogcGFyYW0uc3RyaW5nVmFsdWUpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIG1vZGlmaWVkVmFsdWUpO1xuICAgIH1cblxuICAgIGFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIGxldCBoYW5kbGVyID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtmdW5jdGlvbk5hbWVdKTtcbiAgICAgICAgZWxlbVthdHRyaWJ1dGVOYW1lXSA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBwYXJhbVZhbHVlcyA9IHRoaXMuZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCBlbGVtLCBldmVudCk7XG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KGVsZW0sIHBhcmFtVmFsdWVzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhcHBseUJpbmRGb3IoY29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rcykge1xuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3NvdXJjZUZyb21dKTtcbiAgICAgICAgaWYgKHZhbHVlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICB3aGlsZSAoY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50ID4gdmFsdWUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRFbGVtID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShvdXRlckVsZW0sIHRydWUpO1xuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3NvdXJjZVRvXSA9IGAke3NvdXJjZUZyb219LiR7aW5kZXh9YDtcbiAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcy5pbmRleCA9IGBfbnVtYmVyc18uJHtpbmRleH1gO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZEVsZW0oY2hpbGRFbGVtLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkRWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgIGVsZW0uaGlkZGVuID0gIXZhbHVlO1xuICAgIH1cblxuICAgIGFwcGx5UGFpckJpbmQoZnJvbSwgdG9PYmosIHRvS2V5KSB7XG4gICAgICAgIHRvT2JqW3RvS2V5XSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbZnJvbV0pO1xuICAgIH1cblxuICAgIGFwcGx5QmluZFZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMub2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBub3RVbmRlZmluZWQodmFsdWUpO1xuICAgIH1cblxuICAgIG9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xuICAgICAgICBpZiAoIWV4cHJlc3Npb25OYW1lKVxuICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXMuc291cmNlLCBbYmluZE5hbWVdKTtcblxuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbZXhwcmVzc2lvbk5hbWVdKTtcbiAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXMsIGVsZW0pO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicgJiYgZXhwcmVzc2lvbiguLi5wYXJhbVZhbHVlcyk7XG4gICAgfVxuXG4gICAgLy8gdG9kbyB1c2UgUGFyYW1TcGxpdHRlciBpbiBvcmRlciB0byBzdXBwb3J0IGFycmF5IGFuZCBvYmplY3QgcGFyYW10ZXJzXG4gICAgZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCB0aGlzcywgZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5tYXAocGFyYW0gPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtUGF0aCA9IHBhcmFtLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZiAocGFyYW1QYXRoWzBdID09PSAndGhpcycpIHtcbiAgICAgICAgICAgICAgICBwYXJhbVBhdGguc2hpZnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUodGhpc3MsIHBhcmFtUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ2V2ZW50Jykge1xuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZShldmVudCwgcGFyYW1QYXRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNvdXJjZVZhbHVlID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtwYXJhbV0pO1xuICAgICAgICAgICAgaWYgKHNvdXJjZVZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVZhbHVlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHBhcmFtLnJlcGxhY2UoLycvZywgJ1wiJykpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRBcnRpZmFjdHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICAgICAgaGFuZGxlcnM6IHRoaXMuaGFuZGxlcnMsXG4gICAgICAgICAgICBiaW5kczogdGhpcy5iaW5kcyxcbiAgICAgICAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IHRoaXMuY29tcG9uZW50cyxcbiAgICAgICAgICAgIGJsb2NrczogdGhpcy5ibG9ja3NcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVwbGFjZUlubGluZUJpbmRpbmdzKGVsZW0pIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBlbGVtLmlubmVySFRNTC5yZXBsYWNlKGFsbFNwYW5SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xuICAgICAgICBlbGVtLmlubmVySFRNTCA9IGVsZW0uaW5uZXJIVE1MLnJlcGxhY2UoYWxsU3BhbkV4cHJlc3Npb25SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xuICAgIH1cblxuICAgIC8vIHRvZG8gdXNlIGluZGV4VG9Eb3QgZm9yIGF0dHJpYnV0ZSBiaW5kcyBhcyB3ZWxsLCBlLmcuIDxkaXYgc3R5bGU9XCIke2NvbG9yWzBdfVwiPiBhYmMgPC9kaXY+XG4gICAgc3RhdGljIGdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHJldHVybiBpbmRleFRvRG90KGVsZW0uZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkpO1xuICAgIH1cbn1cblxuLy8gYmluZHMgPSB7XG4vLyAgICAgJ2EuYi5jJzoge1xuLy8gICAgICAgICBhdHRyaWJ1dGVzOiBbYXR0cmlidXRlQmluZDEsIGF0dHJpYnV0ZUJpbmQyXSxcbi8vICAgICAgICAgZm9yczogW3tjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzfV0sXG4vLyAgICAgICAgIGlmczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQzXSxcbi8vICAgICAgICAgcGFpcnM6IFt7ZnJvbSwgdG9PYmosIHRvS2V5fV0sXG4vLyAgICAgICAgIHZhbHVlczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQyXVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gc291cmNlID0ge1xuLy8gICAgIGE6IHtcbi8vICAgICAgICAgYjoge1xuLy8gICAgICAgICAgICAgYzoge31cbi8vICAgICAgICAgfVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gaGFuZGxlcnMgPSB7XG4vLyAgICAgYToge1xuLy8gICAgICAgICBfZnVuY186ICdmdW5jJyxcbi8vICAgICAgICAgYjoge1xuLy8gICAgICAgICAgICAgYzoge1xuLy8gICAgICAgICAgICAgICAgIF9mdW5jXzogJ2Z1bmMnXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGNvbXBvbmVudHMgPSB7XG4vLyAgICAgYToge1xuLy8gICAgICAgICBvdXRlckVsZW06IG91dGVyRWxlbSxcbi8vICAgICAgICAgcGFyYW1zOiBbXVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gYXR0cmlidXRlQmluZCA9IHtcbi8vICAgICBlbGVtOiBlbGVtMSxcbi8vICAgICBhdHRyaWJ1dGVOYW1lLFxuLy8gICAgIGZ1bmN0aW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcbi8vICAgICBwYXJhbXM6IFt7c3RyaW5nVmFsdWUgfCBzb3VyY2VWYWx1ZTogc3RyaW5nfV0sIC8vIGZvciBudWxsIGZ1bmN0aW9uTmFtZVxuLy8gICAgIHBhcmFtczogW10gLy8gZm9yIG5vdCBudWxsIGZ1bmN0aW9uTmFtZVxuLy8gfTtcbi8vXG4vLyBleHByZXNzaW9uQmluZCA9IHtcbi8vICAgICBlbGVtOiBlbGVtMSxcbi8vICAgICBleHByZXNzaW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcbi8vICAgICBwYXJhbXM6IFtdLFxuLy8gICAgIGJpbmROYW1lIC8vIGNhbiBiZSBudWxsXG4vLyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0bWxCaW5kZXI7XG4iLCJjb25zdCBCb290ZXIgPSByZXF1aXJlKCcuL2Jvb3RlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICgpID0+IG5ldyBCb290ZXIoKTtcblxuLy8gdG9kb1xuLy8gYWxsb3cgYXJyYXkgYmluZGluZyBpbiBodG1sOiBgPGRpdiBiaW5kPVwieFt5XVwiPjwvZGl2PmBcbi8vIGNsZWFuIHVwIHBhY2thZ2UuanNvblxuLy8gJHN7eH0gc3ludGF4IHRvIG9ubHkgYWZmZWN0IGlubmVyIHRleHQgYW5kIG5vdCBhdHRyaWJ1dGVzXG4vLyBhbGxvdyBkZWZpbmluZyBhbmQgdXNpbmcgY29tcG9uZW50cyBpbiBhbnkgb3JkZXJcbi8vIGFsbG93IHVzaW5nIGV4cHJlc3Npb25zIGZvciBtb3JlIGJpbmRzIHRoYW4ganVzdCBpZnMgYW5kIHZhbHVlcyAoZS5nLiBhdHRyaWJ1dGVzLCBmb3JzLCBhcywgdXNlKVxuLy8gc3VwcG9ydCAkZSBuZXN0ZWQgaW5zaWRlICRzXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgc291cmNlLmEgPSBzb3VyY2UuYiBkb2Vzbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgYmluZC1mb3IgaW5kZXhWYXJzIGRvbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXG4vLyByb3V0aW5nIG9yIHN3YXBwaW5nIHN0YXRlc1xuIiwibGV0IGdldFByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gfHwge30pO1xuICAgIHJldHVybiBbb2JqLCBsYXN0RmllbGRdO1xufTtcblxubGV0IGdldFZhbHVlID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgcHJvcGVydHkgPSBnZXRQcm9wZXJ0eShvYmosIHBhdGhzKTtcbiAgICByZXR1cm4gcHJvcGVydHlbMV0gPT09IHVuZGVmaW5lZCA/IHByb3BlcnR5WzBdIDogcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dO1xufTtcblxubGV0IGNyZWF0ZVByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gPSBvYmpbZmllbGRdIHx8IHt9KTtcbiAgICByZXR1cm4gW29iaiwgbGFzdEZpZWxkXTtcbn07XG5cbmxldCBzZXRQcm9wZXJ0eSA9IChvYmosIHBhdGhzLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBwcm9wZXJ0eSA9IGNyZWF0ZVByb3BlcnR5KG9iaiwgcGF0aHMpO1xuICAgIHByb3BlcnR5WzBdW3Byb3BlcnR5WzFdXSA9IHZhbHVlO1xufTtcblxubGV0IGNsb25lID0gb3JpZ2luYWwgPT4ge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbCk7XG59O1xuXG5sZXQgdHJhbnNsYXRlID0gKG5hbWUsIGxpbmtzKSA9PiB7XG4gICAgbGV0IG9jY3VycmVkID0gW107XG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhbbmFtZV0pO1xuICAgIHdoaWxlIChmaWVsZHNbMF0gaW4gbGlua3MpIHtcbiAgICAgICAgb2NjdXJyZWQucHVzaChmaWVsZHNbMF0pO1xuICAgICAgICBmaWVsZHNbMF0gPSBsaW5rc1tmaWVsZHNbMF1dO1xuICAgICAgICBpZiAob2NjdXJyZWQuaW5jbHVkZXMoZmllbGRzWzBdKSlcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBmaWVsZHMgPSBnZXRGaWVsZHMoZmllbGRzKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoKGEsIGIpID0+IGAke2F9LiR7Yn1gKTtcbn07XG5cbmxldCBnZXRGaWVsZHMgPSBwYXRocyA9PlxuICAgIHBhdGhzXG4gICAgICAgIC5tYXAocGF0aCA9PiBwYXRoLnNwbGl0KCcuJykpXG4gICAgICAgIC5yZWR1Y2UoKGFnZ3JlZ2F0ZSwgaXRlbSkgPT4gYWdncmVnYXRlLmNvbmNhdChpdGVtKSwgW10pO1xuXG5sZXQgaW5kZXhUb0RvdCA9IGZpZWxkID0+IGZpZWxkICYmIGZpZWxkLnJlcGxhY2UoL1xcWyhcXHcrKVxcXS9nLCAoXywgbWF0Y2gpID0+IGAuJHttYXRjaH1gKTtcblxubGV0IG5vdFVuZGVmaW5lZCA9ICh2YWx1ZSwgdW5kZWZpbmVkVmFsdWUgPSBudWxsKSA9PlxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHVuZGVmaW5lZFZhbHVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIGNsb25lLCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZH07XG4iLCJjbGFzcyBQYXJhbVNwbGl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB9XG5cbiAgICBzcGxpdEJ5UGFyYW1zKCkge1xuICAgICAgICBsZXQgZGVwdGggPSAwO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHRJbmRleCgpICYmICghdGhpcy5hdFF1b3RlKCkgfHwgdGhpcy5za2lwUXVvdGUoKSkpIHtcbiAgICAgICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgICAgICBpZiAoY2hhciA9PT0gJ1snKVxuICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnXScpXG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICcsJyAmJiAhZGVwdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5pbmRleCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtcztcbiAgICB9XG5cbiAgICBmaW5kSW5kZXgocmVnZXgsIHN0YXJ0KSB7IC8vIHJldHVybnMgLTEgb3IgaW5kZXggb2YgbWF0Y2hcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zdHJpbmcuc3Vic3RyaW5nKHN0YXJ0KS5zZWFyY2gocmVnZXgpO1xuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCA/IGluZGV4ICsgc3RhcnQgOiAtMTtcbiAgICB9O1xuXG4gICAgbmV4dEluZGV4KCkge1xuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5maW5kSW5kZXgoL1ssJ1wiW1xcXV0vLCB0aGlzLmluZGV4ICsgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAtMTtcbiAgICB9XG5cbiAgICBhdFF1b3RlKCkge1xuICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xuICAgICAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIjtcbiAgICB9XG5cbiAgICBza2lwUXVvdGUoKSB7XG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleChjaGFyID09PSAnXCInID8gL1teXFxcXF1cIi8gOiAvW15cXFxcXScvLCB0aGlzLmluZGV4ICsgMSkgKyAxO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG5cbiAgICBhZGRQYXJhbSgpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMucHVzaCh0aGlzLnN0cmluZy5zdWJzdHJpbmcodGhpcy5zdGFydEluZGV4LCB0aGlzLmluZGV4ID4gMCA/IHRoaXMuaW5kZXggOiB0aGlzLnN0cmluZy5sZW5ndGgpLnRyaW0oKSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiBuZXcgUGFyYW1TcGxpdHRlcihzdHJpbmcpLnNwbGl0QnlQYXJhbXMoKTtcbiIsIi8vIChbXFx3LltcXF1dKylcblxubGV0IHNwYW5SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdXSspfS87XG5sZXQgYWxsU3BhblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuUmVnZXgsICdnJyk7XG5sZXQgc3BhbkV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdIT0+PHwmXStcXCguKlxcKSl9LztcbmxldCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuRXhwcmVzc2lvblJlZ2V4LCAnZycpO1xuXG5sZXQgYmluZFJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKX0vO1xubGV0IGJpbmRSZWdleFVuY2FwdHVyaW5nID0gLygoPzpcXFxcKT9cXCR7KD86W1xcdy5bXFxdXSspfSkvO1xuXG5sZXQgZnVuY3Rpb25SZWdleCA9IC8oXFxcXCk/XFwkeyhbXFx3LltcXF1dKylcXCgoLiopXFwpfS87XG5cbmxldCBleHByZXNzaW9uUmVnZXggPSAvKFxcXFwpPyhbXFx3LltcXF0hPT48fCZdKylcXCgoLiopXFwpLztcblxubW9kdWxlLmV4cG9ydHMgPSB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9O1xuIiwiLy8gdG9kbyB3cmFwIHRoZXNlIGZ1bmN0aW9ucyBpbiBhIGNsYXNzXG5sZXQgY3JlYXRlU291cmNlID0gKCkgPT4ge1xuICAgIGxldCBoYW5kbGVycyA9IHt9O1xuICAgIGxldCBzb3VyY2UgPSB7fTtcbiAgICBzZXREZWZhdWx0U291cmNlKHNvdXJjZSk7XG4gICAgbGV0IGNvbXBhcmVTb3VyY2UgPSB7fTtcbiAgICBzb3VyY2UuaW52b2tlQWxsSGFuZGxlcnMgPSAoKSA9PiBoYW5kbGVPcmlnaW5DaGFuZ2VzKHNvdXJjZSwgY29tcGFyZVNvdXJjZSwgaGFuZGxlcnMpO1xuICAgIHJldHVybiB7c291cmNlLCBoYW5kbGVyc307XG59O1xuXG5sZXQgaWdub3JlID0gW107XG5cbmxldCBpc0JpbmRJZ25vcmVkID0gKG9iaiwgcHJvcCkgPT4gb2JqLl9fYmluZElnbm9yZV9fICYmIG9iai5fX2JpbmRJZ25vcmVfXy5pbmNsdWRlcyhwcm9wKTtcblxuLy8gdG9kbyBtYWtlIF9fYmluZEF2b2lkQ3ljbGVzX18gaW5oZXJpdGVkIGFuZCBtYXliZSBhdm9pZCBwZXIgYmluZGluZyBpbnN0ZWFkIHBlciBjaGFuZ2VcbmxldCBpc0lnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBpc0JpbmRJZ25vcmVkKG9iaiwgcHJvcCkgfHwgKG9iai5fX2JpbmRBdm9pZEN5Y2xlc19fICYmIGlnbm9yZS5zb21lKGlnbm9yZSA9PiBpZ25vcmUub2JqID09PSBvYmogJiYgaWdub3JlLnByb3AgPT09IHByb3ApKTtcblxubGV0IGhhbmRsZVNldCA9IChvYmosIHByb3AsIGhhbmRsZXJzLCBhY2N1bXVsYXRlZEhhbmRsZXJzKSA9PiB7XG4gICAgaWdub3JlLnB1c2goe29iaiwgcHJvcH0pO1xuICAgIGFjY3VtdWxhdGVkSGFuZGxlcnMuZm9yRWFjaChkb0hhbmRsZXIpO1xuICAgIGhhbmRsZXJzICYmIHByb3BvZ2F0ZUhhbmRsZXJEb3duKGhhbmRsZXJzKTtcbiAgICBpZ25vcmUucG9wKCk7XG59O1xuXG5sZXQgcHJvcG9nYXRlSGFuZGxlckRvd24gPSBoYW5kbGVycyA9PiB7XG4gICAgZG9IYW5kbGVyKGhhbmRsZXJzKTtcbiAgICBPYmplY3QuZW50cmllcyhoYW5kbGVycylcbiAgICAgICAgLmZpbHRlcigoW2tleV0pID0+IGtleSAhPT0gJ19mdW5jXycpXG4gICAgICAgIC5mb3JFYWNoKChbLCBoYW5kbGVyXSkgPT4gcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcikpO1xufTtcblxubGV0IGRvSGFuZGxlciA9IGhhbmRsZXIgPT4gdHlwZW9mIGhhbmRsZXIuX2Z1bmNfID09PSAnZnVuY3Rpb24nICYmIGhhbmRsZXIuX2Z1bmNfKCk7XG5cbmxldCBoYW5kbGVPcmlnaW5DaGFuZ2VzS2V5ID0gKHNvdXJjZSwgY29tcGFyZVNvdXJjZSwga2V5LCBoYW5kbGVycyA9IHt9LCBhY2N1bXVsYXRlZEhhbmRsZXJzID0gW10pID0+IHtcbiAgICBpZiAoaXNCaW5kSWdub3JlZChzb3VyY2UsIGtleSkpXG4gICAgICAgIHJldHVybjtcbiAgICBsZXQgdmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICBsZXQgY29tcGFyZVZhbHVlID0gY29tcGFyZVNvdXJjZVtrZXldO1xuICAgIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgaXNPYmplY3QoY29tcGFyZVZhbHVlKSlcbiAgICAgICAgaGFuZGxlT3JpZ2luQ2hhbmdlcyh2YWx1ZSwgY29tcGFyZVZhbHVlLCBoYW5kbGVyc1trZXldLCBhY2N1bXVsYXRlZEhhbmRsZXJzLmNvbmNhdChoYW5kbGVycykpOyAvLyB0b2RvIHVzZSBwdXNoIGZvciBlZmZpY2llbmN5XG4gICAgZWxzZSBpZiAodmFsdWUgIT09IGNvbXBhcmVWYWx1ZSkge1xuICAgICAgICBjb21wYXJlU291cmNlW2tleV0gPSBjb3B5KHZhbHVlKTtcbiAgICAgICAgaGFuZGxlU2V0KHNvdXJjZSwga2V5LCBoYW5kbGVyc1trZXldLCBhY2N1bXVsYXRlZEhhbmRsZXJzLmNvbmNhdChoYW5kbGVycykpOyAvLyB0b2RvIHdyYXAgaGFuZGxlcnMgYW5kIGFjY3VtdWxhdGVkSGFuZGxlcnMgaW4gY2xhc3Mgd2l0aCBwb3BQcm9wIG1ldGhvZFxuICAgIH1cbn07XG5cbi8vIHNvdXJjZSBhbmQgY29tcGFyZVNvdXJjZSBtdXN0IG5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZFxubGV0IGhhbmRsZU9yaWdpbkNoYW5nZXMgPSAoc291cmNlLCBjb21wYXJlU291cmNlLCBoYW5kbGVycyA9IHt9LCBhY2N1bXVsYXRlZEhhbmRsZXJzID0gW10pID0+IHtcbiAgICBpZiAoIWhhbmRsZXJzKVxuICAgICAgICByZXR1cm47XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGtleSA9PiBoYW5kbGVPcmlnaW5DaGFuZ2VzS2V5KHNvdXJjZSwgY29tcGFyZVNvdXJjZSwga2V5LCBoYW5kbGVycywgYWNjdW11bGF0ZWRIYW5kbGVycykpO1xuICAgIE9iamVjdC5rZXlzKGNvbXBhcmVTb3VyY2UpLmZvckVhY2goa2V5ID0+ICFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBoYW5kbGVPcmlnaW5DaGFuZ2VzS2V5KHNvdXJjZSwgY29tcGFyZVNvdXJjZSwga2V5LCBoYW5kbGVycywgYWNjdW11bGF0ZWRIYW5kbGVycykpO1xufTtcblxuLy8gdG9kbyBtb3ZlIHRoZXNlIGZ1bmNpdG9ucyB0byBvYmogc2NhZm9sbGRpbmcgdXRpbCBtb2R1bGVcbmxldCBpc09iamVjdCA9IG9iaiA9PiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmo7XG5cbmxldCBjb3B5ID0gb2JqID0+IHtcbiAgICBpZiAoIWlzT2JqZWN0KG9iaikpXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgbGV0IGNvcHlPYmogPSB7fTtcbiAgICBPYmplY3QuZW50cmllcyhvYmopLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4gY29weU9ialtrZXldID0gY29weSh2YWx1ZSkpO1xuICAgIHJldHVybiBjb3B5T2JqO1xufTtcblxubGV0IHNldERlZmF1bHRTb3VyY2UgPSBzb3VyY2UgPT4ge1xuICAgIHNvdXJjZS5fbnVtYmVyc18gPSBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgZ2V0OiAoXywgcHJvcCkgPT4gcGFyc2VJbnQocHJvcCksXG4gICAgICAgIHNldDogKCkgPT4gZmFsc2VcbiAgICB9KTtcbiAgICBzb3VyY2Uubm90ID0gYSA9PiAhYTtcbiAgICBzb3VyY2VbJyEnXSA9IGEgPT4gIWE7XG4gICAgc291cmNlLmVxID0gKGEsIGIpID0+IGEgPT09IGI7XG4gICAgc291cmNlLmVxdWFsID0gKGEsIGIpID0+IGEgPT09IGI7XG4gICAgc291cmNlWyc9J10gPSAoYSwgYikgPT4gYSA9PT0gYjtcbiAgICBzb3VyY2UubkVxID0gKGEsIGIpID0+IGEgIT09IGI7XG4gICAgc291cmNlLm5vdEVxdWFsID0gKGEsIGIpID0+IGEgIT09IGI7XG4gICAgc291cmNlWychPSddID0gKGEsIGIpID0+IGEgIT09IGI7XG4gICAgc291cmNlLmdyZWF0ZXIgPSAoYSwgYikgPT4gYSA+IGI7XG4gICAgc291cmNlWyc+J10gPSAoYSwgYikgPT4gYSA+IGI7XG4gICAgc291cmNlLmxlc3MgPSAoYSwgYikgPT4gYSA8IGI7XG4gICAgc291cmNlWyc8J10gPSAoYSwgYikgPT4gYSA8IGI7XG4gICAgc291cmNlLmdyZWF0ZXJFcSA9IChhLCBiKSA9PiBhID49IGI7XG4gICAgc291cmNlWyc+PSddID0gKGEsIGIpID0+IGEgPj0gYjtcbiAgICBzb3VyY2UubGVzc0VxID0gKGEsIGIpID0+IGEgPD0gYjtcbiAgICBzb3VyY2VbJzw9J10gPSAoYSwgYikgPT4gYSA8PSBiO1xuICAgIHNvdXJjZS5vciA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xuICAgIHNvdXJjZVsnfCddID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XG4gICAgc291cmNlWyd8fCddID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XG4gICAgc291cmNlLmFuZCA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcbiAgICBzb3VyY2VbJyYnXSA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcbiAgICBzb3VyY2VbJyYmJ10gPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGVTb3VyY2V9O1xuIiwibGV0IHNwbGl0QnlXb3JkID0gKHN0cmluZywgd29yZCkgPT5cbiAgICBzdHJpbmcuc3BsaXQobmV3IFJlZ0V4cChgXFxcXHMrJHt3b3JkfVxcXFxzK2ApKTtcblxubGV0IHNwbGl0QnlDb21tYSA9IHN0cmluZyA9PlxuICAgIHN0cmluZy5zcGxpdCgvXFxzKixcXHMqLyk7XG5cbmxldCBzcGxpdEJ5U3BhY2UgPSBzdHJpbmcgPT5cbiAgICBzdHJpbmcuc3BsaXQoL1xccysvKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfTtcbiJdfQ==
