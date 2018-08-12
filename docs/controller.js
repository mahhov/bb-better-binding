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
// source.navigationBlock.navigationRadio0.checked = true;

},{"./bindFor/bindFor":1,"./bindIf/bindIf":3,"./bindValue/bindValue":5,"./helloWorld/helloWorld":8,"./navigation/navigation":9,"bb-better-binding":12}],8:[function(require,module,exports){
let template = "<a href=\"https://github.com/mahhov/bb-better-binding/blob/HEAD/liveExample/helloWorld/helloWorld.html\">template source</a>\n<br/>\n<a href=\"https://github.com/mahhov/bb-better-binding/blob/HEAD/liveExample/helloWorld/helloWorld.js\">controller source</a>\n\n<div>\n    <div style=\"font-size:${largeFont}; color:${favoriteColor}\">\n        $s{greeting}, $s{name} $s{exclamation}\n    </div>\n    wuts ur favorite color?\n    <input value=\"${favoriteColor}\" onkeyup=\"${changeColor(this)}\">\n</div>\n\n<div style=\"margin-top:100px\">\n    <button onclick=\"${changeAnimation()}\">click me!</button>\n    <br/>\n    <!--<img src=\"${animation}\">-->\n</div>\n\n<div style=\"margin-top:100px\">\n    <p>i have jokes:</p>\n    <input id=\"check\" type=\"checkbox\" onchange=\"${setJokeVisibility(this)}\"/><label for=\"check\">show jokes?</label>\n    <div bind-if=\"jokeVisibility\">\n        <div bind-for=\"joke in jokes\">\n            <h3 bind=\"index\"></h3>\n            <p bind-for=\"line in joke.lines\" bind=\"line\"></p>\n        </div>\n        <h3>Source: $s{jokesSource}</h3>\n    </div>\n</div>\n";

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
        setInterval(() => source.invokeAllHandlers(), 1);
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
                this.source._bindIgnore_ = this.source._bindIgnore_ || [];
                this.source._bindIgnore_.push(bindElem);

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
                    let {source: blockSource, handlers: blockHandlers} = new HtmlBinder(elem, this.blocks);
                    controller(blockSource);
                    parameters && parameters.forEach((to, index) => {
                        let from = translate(paramsInput[index], sourceLinks);
                        this.addPairBind(from, blockSource, to);
                        this.applyPairBind(from, blockSource, to);
                        blockSource[to] = paramValues[index];
                    });

                    if (blockTo) { // todo make blockTo required
                        this.source[blockTo] = blockSource;
                        this.handlers[blockTo] = blockHandlers;
                    }
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

// todo
// on get elem, synch
// send block source handlers to parent source
// allow manual triggering of handler checks

},{}],17:[function(require,module,exports){
let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`));

let splitByComma = string =>
    string.split(/\s*,\s*/);

let splitBySpace = string =>
    string.split(/\s+/);

module.exports = {splitByWord, splitByComma, splitBySpace};

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaXZlRXhhbXBsZS9iaW5kRm9yL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZEZvci9jb250cm9sbGVyLmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvYmluZElmL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvaW5wdXQuanMiLCJsaXZlRXhhbXBsZS9iaW5kVmFsdWUvY29udHJvbGxlci5qcyIsImxpdmVFeGFtcGxlL2NvbnRyb2xsZXIuanMiLCJsaXZlRXhhbXBsZS9oZWxsb1dvcmxkL2lucHV0LmpzIiwibGl2ZUV4YW1wbGUvbmF2aWdhdGlvbi9pbnB1dC5qcyIsInNyYy9ib290ZXIuanMiLCJzcmMvaHRtbEJpbmRlci5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9vYmpTY2Fmb2xkaW5nLmpzIiwic3JjL3BhcmFtU3BsaXR0ZXIuanMiLCJzcmMvcmVnZXguanMiLCJzcmMvc291cmNlLmpzIiwic3JjL3N0cmluZ1NwbGl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQXlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLHVEQUFvRCxDQUFDO0FBQ3BFLElBQUksZ0JBQWdCLEdBQUcsdUZBQXFELENBQUM7QUFDN0UsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0FDTDFEO0FBQ0E7QUFDQTtBQUNBOztBQ0h5QjtBQUN6QixJQUFJLFFBQVEsR0FBRyx1d0JBQW1ELENBQUM7QUFDbkUsSUFBSSxnQkFBZ0IsR0FBRyx3S0FBcUQsQ0FBQztBQUM3RSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7Ozs7QUNMMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVHlCO0FBQ3pCLElBQUksUUFBUSxHQUFHLG9JQUFzRCxDQUFDO0FBQ3RFLElBQUksZ0JBQWdCLEdBQUcsNmlCQUFxRCxDQUFDO0FBQzdFLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFekMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7OztBQ0wxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBLElBQUksUUFBUSxHQUFHLDZsQ0FBa0UsQ0FBQzs7QUFFbEYsSUFBSSxVQUFVLEdBQUcsTUFBTSxJQUFJOzs7SUFHdkIsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsTUFBTSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7SUFDbEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7SUFDL0IsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFDdEIsTUFBTSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7SUFDcEMsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLElBQUk7UUFDMUIsTUFBTSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ3RDLENBQUM7OztJQUdGLElBQUksVUFBVSxHQUFHO1FBQ2IsOENBQThDO1FBQzlDLHlEQUF5RDtRQUN6RCw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ3BELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLE1BQU0sQ0FBQyxlQUFlLEdBQUcsTUFBTTtRQUMzQixjQUFjLEdBQUcsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDMUQsTUFBTSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakQsQ0FBQztJQUNGLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7O0lBR3pCLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLElBQUk7UUFDbkMsTUFBTSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQzVDLENBQUM7SUFDRixNQUFNLENBQUMsS0FBSyxHQUFHO1FBQ1g7WUFDSSxLQUFLLEVBQUU7Z0JBQ0gsNkRBQTZEO2dCQUM3RCxvREFBb0Q7YUFDdkQ7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILHlEQUF5RDtnQkFDekQsc0RBQXNEO2FBQ3pEO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCxpREFBaUQ7Z0JBQ2pELDZDQUE2QztnQkFDN0MsK0RBQStEO2FBQ2xFO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCx1Q0FBdUM7Z0JBQ3ZDLDRCQUE0QjthQUMvQjtTQUNKLEVBQUU7WUFDQyxLQUFLLEVBQUU7Z0JBQ0gseUNBQXlDO2dCQUN6Qyw2Q0FBNkM7YUFDaEQ7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILG9FQUFvRTtnQkFDcEUsK0JBQStCO2FBQ2xDO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCwyQ0FBMkM7Z0JBQzNDLGtEQUFrRDthQUNyRDtTQUNKLEVBQUU7WUFDQyxLQUFLLEVBQUU7Z0JBQ0gsc0NBQXNDO2dCQUN0QyxpQ0FBaUM7YUFDcEM7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILHlFQUF5RTtnQkFDekUsaURBQWlEO2FBQ3BEO1NBQ0osRUFBRTtZQUNDLEtBQUssRUFBRTtnQkFDSCw4QkFBOEI7Z0JBQzlCLGlEQUFpRDthQUNwRDtTQUNKLEVBQUU7WUFDQyxLQUFLLEVBQUU7Z0JBQ0gsNERBQTREO2dCQUM1RCw4Q0FBOEM7YUFDakQ7U0FDSixFQUFFO1lBQ0MsS0FBSyxFQUFFO2dCQUNILDBDQUEwQztnQkFDMUMsNERBQTREO2FBQy9EO1NBQ0o7S0FDSixDQUFDO0lBQ0YsTUFBTSxDQUFDLFdBQVcsR0FBRyxxREFBcUQsQ0FBQztDQUM5RSxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7Ozs7QUNqR3hDLElBQUksUUFBUSxHQUFHLGtVQUFrRSxDQUFDOztBQUVsRixJQUFJLFVBQVUsR0FBRyxNQUFNLElBQUk7Q0FDMUIsQ0FBQzs7QUFFRixJQUFJLFVBQVUsR0FBRyxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU3QyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQzs7OztBQ1BwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmxldCB0ZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2JpbmRGb3IuaHRtbGAsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlclN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2NvbnRyb2xsZXIuanNgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGUsIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXJTdHJpbmd9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBzb3VyY2UgPT4ge1xuICAgIHNvdXJjZS5saXN0ID0gWydlbGVwaGFudCcsICdsaW9uJywgJ3JhYmJpdCddO1xufTtcbiIsImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmxldCB0ZW1wbGF0ZSA9IGZzLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L2JpbmRJZi5odG1sYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vY29udHJvbGxlci5qc2AsICd1dGY4Jyk7XG5sZXQgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgY29udHJvbGxlclN0cmluZ307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHNvdXJjZSA9PiB7XG4gICAgc291cmNlLnRydXRoeSA9IHRydWU7XG5cbiAgICBzb3VyY2UuZmFsc3kgPSBmYWxzZTtcblxuICAgIHNvdXJjZS5pc0dyZWF0ZXJUaGFuMTAgPSBhID0+IGEgPiAxMDtcblxuICAgIHNvdXJjZS5teVZhcmlhYmxlID0gMTU7XG59O1xuIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xubGV0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vYmluZFZhbHVlLmh0bWxgLCAndXRmOCcpO1xubGV0IGNvbnRyb2xsZXJTdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9jb250cm9sbGVyLmpzYCwgJ3V0ZjgnKTtcbmxldCBjb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sbGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlLCBjb250cm9sbGVyLCBjb250cm9sbGVyU3RyaW5nfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gc291cmNlID0+IHtcbiAgICBzb3VyY2UubXlNZXNzYWdlID0gJ3doZW5ldmVyIGBzb3VyY2UubXlNZXNzYWdlYCBpcyBtb2RpZmllZCwgbXkgdGV4dCBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIGNoYW5nZSc7XG5cbiAgICBzb3VyY2UubXlGdW5jdGlvbiA9ICh2YXJpYWJsZSwgc3RyaW5nLCBpbnRlZ2VyLCBbc3RyaW5nMiwgaW50ZWdlcjJdKSA9PlxuICAgICAgICBgd2hlbmV2ZXIgXFxgc291cmNlLm15RnVuY3Rpb25cXGAgb3IgXFxgc291cmNlLm15VmFyaWFibGVcXGAgYXJlIG1vZGlmaWVkLCBteSB0ZXh0IGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgY2hhbmdlOyAke3ZhcmlhYmxlfSAke3N0cmluZ30gJHtpbnRlZ2VyfSAke3N0cmluZzJ9ICR7aW50ZWdlcjJ9YDtcblxuICAgIHNvdXJjZS5teVZhcmlhYmxlID0gJy1teSB2YXJpYWJsZSBpcyBhd2Vzb21lLSc7XG5cbiAgICBzb3VyY2UubXlTcGFuTWVzc2FnZSA9ICckc3t4fSBpcyBzaG9ydGhhbmQgZm9yICZsdDtzcGFuIGJpbmQ9XCJ4XCImZ3Q7ICZsdDsvc3BhbiZndDsnO1xufTtcbiIsImNvbnN0IGJiID0gcmVxdWlyZSgnYmItYmV0dGVyLWJpbmRpbmcnKSgpO1xuXG5TdHJpbmcucHJvdG90eXBlLmNsZWFuID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59O1xuXG4vLyBibG9jayBkZWNsYXJhdGlvbnNcblxuYmIuZGVjbGFyZUJsb2NrKCduYXZpZ2F0aW9uJywgcmVxdWlyZSgnLi9uYXZpZ2F0aW9uL25hdmlnYXRpb24nKSk7XG5cbmxldCB2YWx1ZUJsb2NrRGF0YSA9IHJlcXVpcmUoJy4vYmluZFZhbHVlL2JpbmRWYWx1ZScpO1xuYmIuZGVjbGFyZUJsb2NrKCdiaW5kVmFsdWUnLCB2YWx1ZUJsb2NrRGF0YSk7XG5cbmxldCBpZkJsb2NrRGF0YSA9IHJlcXVpcmUoJy4vYmluZElmL2JpbmRJZicpO1xuYmIuZGVjbGFyZUJsb2NrKCdiaW5kSWYnLCBpZkJsb2NrRGF0YSk7XG5cbmxldCBmb3JCbG9ja0RhdGEgPSByZXF1aXJlKCcuL2JpbmRGb3IvYmluZEZvcicpO1xuYmIuZGVjbGFyZUJsb2NrKCdiaW5kRm9yJywgZm9yQmxvY2tEYXRhKTtcblxuYmIuZGVjbGFyZUJsb2NrKCdoZWxsb1dvcmxkJywgcmVxdWlyZSgnLi9oZWxsb1dvcmxkL2hlbGxvV29ybGQnKSk7XG5cbi8vIGJvb3RpbmdcblxubGV0IHNvdXJjZSA9IGJiLmJvb3QoZG9jdW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHdpbmRvdyk7XG5cbi8vIGFwcCBjb250cm9sbGVyXG5cblxubGV0IHNuaXBwZXRzID0gW3ZhbHVlQmxvY2tEYXRhLCBpZkJsb2NrRGF0YSwgZm9yQmxvY2tEYXRhXTtcbmxldCBsaW5rTmFtZXMgPSBbJ2JpbmRWYWx1ZScsICdiaW5kSWYnLCAnYmluZEZvcicsICdoZWxsb1dvcmxkJ107XG5zb3VyY2UubmF2aWdhdGlvblBhZ2VzID0gWydWYWx1ZSBCaW5kaW5nJywgJ0lmIEJpbmRpbmcnLCAnRm9yIEJpbmRpbmcnLCAnSGVsbG8gV29ybGQnXTtcblxuc291cmNlLnNldFBhZ2VJbmRleCA9IHBhZ2VJbmRleCA9PiB7XG4gICAgc291cmNlLnBhZ2VJbmRleCA9IHBhZ2VJbmRleDtcbiAgICBzb3VyY2Uuc25pcHBldCA9IHNuaXBwZXRzW3BhZ2VJbmRleF0gJiYge1xuICAgICAgICB0ZW1wbGF0ZTogc25pcHBldHNbcGFnZUluZGV4XS50ZW1wbGF0ZS5jbGVhbigpLFxuICAgICAgICBjb250cm9sbGVyOiBzbmlwcGV0c1twYWdlSW5kZXhdLmNvbnRyb2xsZXJTdHJpbmcuY2xlYW4oKVxuICAgIH07XG5cbiAgICBsZXQgbGlua05hbWUgPSBsaW5rTmFtZXNbcGFnZUluZGV4XTtcbiAgICBsZXQgbGlua0V4cGFuZGVkID0gYGh0dHBzOi8vZ2l0aHViLmNvbS9tYWhob3YvYmItYmV0dGVyLWJpbmRpbmcvYmxvYi9IRUFEL2xpdmVFeGFtcGxlLyR7bGlua05hbWV9LyR7bGlua05hbWV9YDtcbiAgICBzb3VyY2UubGlua3MgPSBbYCR7bGlua0V4cGFuZGVkfS5odG1sYCwgYCR7bGlua0V4cGFuZGVkfS5qc2BdO1xufTtcblxuc291cmNlLnNldFBhZ2VJbmRleCgwKTtcbi8vIHNvdXJjZS5uYXZpZ2F0aW9uQmxvY2submF2aWdhdGlvblJhZGlvMC5jaGVja2VkID0gdHJ1ZTtcbiIsImxldCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vaGVsbG9Xb3JsZC5odG1sYCwgJ3V0ZjgnKTtcblxubGV0IGNvbnRyb2xsZXIgPSBzb3VyY2UgPT4ge1xuXG4gICAgLy8gZ3JlZXRpbmdcbiAgICBzb3VyY2UubGFyZ2VGb250ID0gNjA7XG4gICAgc291cmNlLmZhdm9yaXRlQ29sb3IgPSAnREVFUHBpbmsnO1xuICAgIHNvdXJjZS5ncmVldGluZyA9ICdJIGhhdGUgeW91JztcbiAgICBzb3VyY2UubmFtZSA9ICdXb3JsZCc7XG4gICAgc291cmNlLmV4Y2xhbWF0aW9uID0gJyjila/CsOKWocKw77yJ4pWv77i1IOKUu+KUgeKUuyc7XG4gICAgc291cmNlLmNoYW5nZUNvbG9yID0gaW5wdXQgPT4ge1xuICAgICAgICBzb3VyY2UuZmF2b3JpdGVDb2xvciA9IGlucHV0LnZhbHVlO1xuICAgIH07XG5cbiAgICAvLyBhbmltYXRpb25cbiAgICBsZXQgYW5pbWF0aW9ucyA9IFtcbiAgICAgICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwNDMuZ2lmJyxcbiAgICAgICAgJ2h0dHBzOi8vbWVkaWEwLmdpcGh5LmNvbS9tZWRpYS8xMkVrSkNicGEzaEdLYy9naXBoeS5naWYnLFxuICAgICAgICAnaHR0cDovL3d3dy5xcXByLmNvbS9hc2NpaS9pbWcvYXNjaWktMTAwNi5naWYnXTtcbiAgICBsZXQgYW5pbWF0aW9uSW5kZXggPSAtMTtcbiAgICBzb3VyY2UuY2hhbmdlQW5pbWF0aW9uID0gKCkgPT4ge1xuICAgICAgICBhbmltYXRpb25JbmRleCA9IChhbmltYXRpb25JbmRleCArIDEpICUgYW5pbWF0aW9ucy5sZW5ndGg7XG4gICAgICAgIHNvdXJjZS5hbmltYXRpb24gPSBhbmltYXRpb25zW2FuaW1hdGlvbkluZGV4XTtcbiAgICB9O1xuICAgIHNvdXJjZS5jaGFuZ2VBbmltYXRpb24oKTtcblxuICAgIC8vIGpva2VzXG4gICAgc291cmNlLnNldEpva2VWaXNpYmlsaXR5ID0gY2hlY2tib3ggPT4ge1xuICAgICAgICBzb3VyY2Uuam9rZVZpc2liaWxpdHkgPSBjaGVja2JveC5jaGVja2VkO1xuICAgIH07XG4gICAgc291cmNlLmpva2VzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJMZWZ0IGluc2lkZSBtYWluIHRpcmUgYWxtb3N0IG5lZWRzIHJlcGxhY2VtZW50LlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiQWxtb3N0IHJlcGxhY2VkIGxlZnQgaW5zaWRlIG1haW4gdGlyZS5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiVGVzdCBmbGlnaHQgT0ssIGV4Y2VwdCBhdXRvbGFuZCB2ZXJ5IHJvdWdoLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiQXV0b2xhbmQgbm90IGluc3RhbGxlZCBvbiB0aGlzIGFpcmNyYWZ0LlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtICMxOiAgXCIjMiBQcm9wZWxsZXIgc2VlcGluZyBwcm9wIGZsdWlkLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb24gIzE6IFwiIzIgUHJvcGVsbGVyIHNlZXBhZ2Ugbm9ybWFsLlwiJyxcbiAgICAgICAgICAgICAgICAnUHJvYmxlbSAjMjogIFwiIzEsICMzLCBhbmQgIzQgcHJvcGVsbGVycyBsYWNrIG5vcm1hbCBzZWVwYWdlLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgICBcIlRoZSBhdXRvcGlsb3QgZG9lc25cXCd0LlwiJyxcbiAgICAgICAgICAgICAgICAnU2lnbmVkIG9mZjogXCJJVCBET0VTIE5PVy5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiU29tZXRoaW5nIGxvb3NlIGluIGNvY2twaXQuXCInLFxuICAgICAgICAgICAgICAgICdTb2x1dGlvbjogXCJTb21ldGhpbmcgdGlnaHRlbmVkIGluIGNvY2twaXQuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkV2aWRlbmNlIG9mIGh5ZHJhdWxpYyBsZWFrIG9uIHJpZ2h0IG1haW4gbGFuZGluZyBnZWFyLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiRXZpZGVuY2UgcmVtb3ZlZC5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiRE1FIHZvbHVtZSB1bmJlbGlldmFibHkgbG91ZC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlZvbHVtZSBzZXQgdG8gbW9yZSBiZWxpZXZhYmxlIGxldmVsLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgICAgICdQcm9ibGVtOiAgXCJEZWFkIGJ1Z3Mgb24gd2luZHNoaWVsZC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkxpdmUgYnVncyBvbiBvcmRlci5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiQXV0b3BpbG90IGluIGFsdGl0dWRlIGhvbGQgbW9kZSBwcm9kdWNlcyBhIDIwMCBmcG0gZGVzY2VudC5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkNhbm5vdCByZXByb2R1Y2UgcHJvYmxlbSBvbiBncm91bmQuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIklGRiBpbm9wZXJhdGl2ZS5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIklGRiBhbHdheXMgaW5vcGVyYXRpdmUgaW4gT0ZGIG1vZGUuXCInXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkZyaWN0aW9uIGxvY2tzIGNhdXNlIHRocm90dGxlIGxldmVycyB0byBzdGljay5cIicsXG4gICAgICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlRoYXRcXCdzIHdoYXQgdGhleVxcJ3JlIHRoZXJlIGZvci5cIidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICAgICAnUHJvYmxlbTogIFwiTnVtYmVyIHRocmVlIGVuZ2luZSBtaXNzaW5nLlwiJyxcbiAgICAgICAgICAgICAgICAnU29sdXRpb246IFwiRW5naW5lIGZvdW5kIG9uIHJpZ2h0IHdpbmcgYWZ0ZXIgYnJpZWYgc2VhcmNoLlwiJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF07XG4gICAgc291cmNlLmpva2VzU291cmNlID0gJ2h0dHBzOi8vd3d3Lm5ldGZ1bm55LmNvbS9yaGYvam9rZXMvOTcvSnVuL3VzYWYuaHRtbCc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlcn07XG4iLCJsZXQgdGVtcGxhdGUgPSByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhgJHtfX2Rpcm5hbWV9L25hdmlnYXRpb24uaHRtbGAsICd1dGY4Jyk7XG5cbmxldCBjb250cm9sbGVyID0gc291cmNlID0+IHtcbn07XG5cbmxldCBwYXJhbWV0ZXJzID0gWydwYWdlcycsICdzZXRQYWdlSGFuZGxlciddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt0ZW1wbGF0ZSwgY29udHJvbGxlciwgcGFyYW1ldGVyc307XG4iLCJjb25zdCBIdG1sQmluZGVyID0gcmVxdWlyZSgnLi9odG1sQmluZGVyJyk7XG5cbmNsYXNzIEJvb3RlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSB7fTtcbiAgICB9XG5cbiAgICBkZWNsYXJlQmxvY2soYmxvY2tOYW1lLCBibG9jaykge1xuICAgICAgICB0aGlzLmJsb2Nrc1tibG9ja05hbWVdID0gYmxvY2s7XG4gICAgfVxuXG4gICAgYm9vdChyb290LCBkZWJ1Zykge1xuICAgICAgICBsZXQgYXJ0aWZhY3RzID0gbmV3IEh0bWxCaW5kZXIocm9vdCwgdGhpcy5ibG9ja3MpLmdldEFydGlmYWN0cygpO1xuICAgICAgICBkZWJ1ZyAmJiBPYmplY3QuYXNzaWduKGRlYnVnLCBhcnRpZmFjdHMpO1xuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiBzb3VyY2UuaW52b2tlQWxsSGFuZGxlcnMoKSwgMSk7XG4gICAgICAgIHJldHVybiBhcnRpZmFjdHMuc291cmNlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb290ZXI7XG4iLCJjb25zdCB7Z2V0VmFsdWUsIHNldFByb3BlcnR5LCBjbG9uZSwgdHJhbnNsYXRlLCBpbmRleFRvRG90LCBub3RVbmRlZmluZWR9ID0gcmVxdWlyZSgnLi9vYmpTY2Fmb2xkaW5nJyk7XG5jb25zdCB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfSA9IHJlcXVpcmUoJy4vc3RyaW5nU3BsaXR0ZXInKTtcbmNvbnN0IHNwbGl0QnlQYXJhbXMgPSByZXF1aXJlKCcuL3BhcmFtU3BsaXR0ZXInKTtcbmNvbnN0IHtjcmVhdGVTb3VyY2V9ID0gcmVxdWlyZSgnLi9zb3VyY2UnKTtcbmNvbnN0IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH0gPSByZXF1aXJlKCcuL3JlZ2V4Jyk7XG5cbmNsYXNzIEh0bWxCaW5kZXIge1xuXG4gICAgY29uc3RydWN0b3Iocm9vdCwgYmxvY2tzKSB7XG4gICAgICAgIGxldCB7c291cmNlLCBoYW5kbGVyc30gPSBjcmVhdGVTb3VyY2UoKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICAgICAgdGhpcy5iaW5kcyA9IHt9O1xuICAgICAgICB0aGlzLnJvb3QgPSByb290O1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7fTtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG5cbiAgICAgICAgSHRtbEJpbmRlci5yZXBsYWNlSW5saW5lQmluZGluZ3Mocm9vdCk7XG4gICAgICAgIHRoaXMuYmluZEVsZW0ocm9vdCwge30pO1xuICAgIH1cblxuICAgIGJpbmRFbGVtKGVsZW0sIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCBza2lwID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGVsZW0uYXR0cmlidXRlcztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB7bmFtZTogYXR0cmlidXRlTmFtZSwgdmFsdWV9ID0gYXR0cmlidXRlc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5tYXRjaChiaW5kUmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7cGFyYW1zfSA9IGF0dHJpYnV0ZUJpbmQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLm1hdGNoKGZ1bmN0aW9uUmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVGdW5jdGlvbkJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtmdW5jdGlvbk5hbWUsIHBhcmFtc30gPSBhdHRyaWJ1dGVCaW5kO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBiaW5kRWxlbSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1lbGVtJyk7XG4gICAgICAgICAgICBsZXQgYmluZENvbXBvbmVudCA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1jb21wb25lbnQnKTtcbiAgICAgICAgICAgIGxldCBiaW5kVXNlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLXVzZScpO1xuICAgICAgICAgICAgbGV0IGJpbmRBcyA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1hcycpO1xuICAgICAgICAgICAgbGV0IGJpbmRGb3IgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZm9yJyk7XG4gICAgICAgICAgICBsZXQgYmluZElmID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWlmJyk7XG4gICAgICAgICAgICBsZXQgYmluZEJsb2NrID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWJsb2NrJyk7XG4gICAgICAgICAgICBsZXQgYmluZFZhbHVlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kJyk7XG5cbiAgICAgICAgICAgIGlmIChiaW5kRWxlbSkge1xuICAgICAgICAgICAgICAgIHNldFByb3BlcnR5KHRoaXMuc291cmNlLCBbYmluZEVsZW1dLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXyA9IHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fIHx8IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fLnB1c2goYmluZEVsZW0pO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJpbmRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRDb21wb25lbnQsICd3aXRoJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlTcGFjZShwYXJhbXNHcm91cCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1jb21wb25lbnQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0gPSB7b3V0ZXJFbGVtOiBlbGVtLCBwYXJhbXN9O1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJpbmRGb3IpIHtcbiAgICAgICAgICAgICAgICBza2lwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgW3NvdXJjZVRvLCBiaW5kTmFtZV0gPSBzcGxpdEJ5V29yZChiaW5kRm9yLCAnaW4nKTtcbiAgICAgICAgICAgICAgICBiaW5kTmFtZSA9IHRyYW5zbGF0ZShiaW5kTmFtZSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3ItcGFyZW50Jyk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZXBsYWNlV2l0aChjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWZvcicpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uZm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICBvdXRlckVsZW06IGVsZW0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVRvLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VGcm9tOiBiaW5kTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZvcihjb250YWluZXIsIGVsZW0sIHNvdXJjZVRvLCBiaW5kTmFtZSwgc291cmNlTGlua3MpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChiaW5kQXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHNwbGl0QnlDb21tYShiaW5kQXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGFzID0+IHNwbGl0QnlXb3JkKGFzLCAnYXMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChbZnJvbSwgdG9dKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NbdG9dID0gdHJhbnNsYXRlKGZyb20sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaW5kSWYpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kSWYsICdpZnMnLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHRvZG8gYWxsb3cgbm9uLXNvdXJjZSBwYXJhbWV0ZXJzIGZvciBiaW5kVXNlXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRVc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtjb21wb25lbnROYW1lLCBwYXJhbXNHcm91cF0gPSBzcGxpdEJ5V29yZChiaW5kVXNlLCAnd2l0aCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1zSW5wdXQgPSBzcGxpdEJ5U3BhY2UocGFyYW1zR3JvdXApO1xuICAgICAgICAgICAgICAgICAgICBsZXQge291dGVyRWxlbSwgcGFyYW1zfSA9IHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY29tcG9uZW50RWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMuZm9yRWFjaCgodG8sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUocGFyYW1zSW5wdXRbaW5kZXhdLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaW5kQmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBbYmxvY2ssIGJsb2NrVG9dID0gc3BsaXRCeVdvcmQoYmluZEJsb2NrLCAnYXMnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtibG9ja05hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJsb2NrLCAnd2l0aCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1zSW5wdXQgPSBwYXJhbXNHcm91cCA/IHNwbGl0QnlQYXJhbXMocGFyYW1zR3JvdXApIDogW107XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbVZhbHVlcyA9IHRoaXMuZ2V0UGFyYW1WYWx1ZXMocGFyYW1zSW5wdXQsIGVsZW0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQge3RlbXBsYXRlLCBjb250cm9sbGVyLCBwYXJhbWV0ZXJzfSA9IHRoaXMuYmxvY2tzW2Jsb2NrTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWJsb2NrJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7c291cmNlOiBibG9ja1NvdXJjZSwgaGFuZGxlcnM6IGJsb2NrSGFuZGxlcnN9ID0gbmV3IEh0bWxCaW5kZXIoZWxlbSwgdGhpcy5ibG9ja3MpO1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyKGJsb2NrU291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVycyAmJiBwYXJhbWV0ZXJzLmZvckVhY2goKHRvLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZyb20gPSB0cmFuc2xhdGUocGFyYW1zSW5wdXRbaW5kZXhdLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFBhaXJCaW5kKGZyb20sIGJsb2NrU291cmNlLCB0byk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UGFpckJpbmQoZnJvbSwgYmxvY2tTb3VyY2UsIHRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrU291cmNlW3RvXSA9IHBhcmFtVmFsdWVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrVG8pIHsgLy8gdG9kbyBtYWtlIGJsb2NrVG8gcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlW2Jsb2NrVG9dID0gYmxvY2tTb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzW2Jsb2NrVG9dID0gYmxvY2tIYW5kbGVycztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIGRlYnVnZ2VyIGZvciBibG9jayBiaW5kaW5nc1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaW5kVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kVmFsdWUsICd2YWx1ZXMnLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2tpcClcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBlbGVtLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgIHRoaXMuYmluZEVsZW0oZWxlbS5jaGlsZHJlbltpXSwgc291cmNlTGlua3MpO1xuICAgIH1cblxuICAgIGNyZWF0ZUJpbmQoYmluZE5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuYmluZHNbYmluZE5hbWVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxldCBiaW5kID0ge2F0dHJpYnV0ZXM6IFtdLCBmb3JzOiBbXSwgaWZzOiBbXSwgcGFpcnM6IFtdLCB2YWx1ZXM6IFtdfTtcbiAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0gPSBiaW5kO1xuXG4gICAgICAgIHNldFByb3BlcnR5KHRoaXMuaGFuZGxlcnMsIFtiaW5kTmFtZSwgJ19mdW5jXyddLCAoKSA9PiB7XG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMgPSBiaW5kLmF0dHJpYnV0ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XG4gICAgICAgICAgICBiaW5kLmZvcnMgPSBiaW5kLmZvcnMuZmlsdGVyKCh7Y29udGFpbmVyfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGNvbnRhaW5lcikpO1xuICAgICAgICAgICAgYmluZC5pZnMgPSBiaW5kLmlmcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcbiAgICAgICAgICAgIGJpbmQudmFsdWVzID0gYmluZC52YWx1ZXMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XG5cbiAgICAgICAgICAgIGJpbmQuYXR0cmlidXRlcy5mb3JFYWNoKCh7ZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXN9KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lID8gdGhpcy5hcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykgOiB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpbmQuZm9ycy5mb3JFYWNoKCh7Y29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rc30pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBiaW5kLmlmcy5mb3JFYWNoKCh7ZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC5wYWlycy5mb3JFYWNoKCh7ZnJvbSwgdG9PYmosIHRvS2V5fSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpbmQudmFsdWVzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZFZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBleHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgZXhwcmVzc2lvblN0ciwgdHlwZSwgc291cmNlTGlua3MpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnXG4gICAgICAgIGxldCBleHByZXNzaW9uTWF0Y2ggPSBleHByZXNzaW9uU3RyLm1hdGNoKGV4cHJlc3Npb25SZWdleCk7XG4gICAgICAgIGlmIChleHByZXNzaW9uTWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBbLCAsIGV4cHJlc3Npb25OYW1lLCBwYXJhbXNTdHJdID0gZXhwcmVzc2lvbk1hdGNoO1xuICAgICAgICAgICAgZXhwcmVzc2lvbk5hbWUgPSB0cmFuc2xhdGUoZXhwcmVzc2lvbk5hbWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5UGFyYW1zKHBhcmFtc1N0cik7XG4gICAgICAgICAgICBsZXQgYmluZFBhcmFtcyA9IHBhcmFtc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIocGFyYW0gPT4gcGFyYW1bMF0gIT09ICdfJylcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtc1xuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW1bMF0gPT09ICdfJyA/IHBhcmFtLnN1YnN0cigxKSA6IHBhcmFtKVxuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gdHJhbnNsYXRlKHBhcmFtLCBzb3VyY2VMaW5rcykpO1xuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zfTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoZXhwcmVzc2lvbk5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgICAgICBiaW5kUGFyYW1zXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEV4cHJlc3Npb25CaW5kKHBhcmFtLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGJpbmROYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25TdHIsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uVmFsdWUgPSB7ZWxlbSwgYmluZE5hbWV9O1xuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xuICAgICAgICBsZXQgcGFyYW1zID0gdmFsdWUuc3BsaXQoYmluZFJlZ2V4VW5jYXB0dXJpbmcpXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hMaXN0ID0gcGFyYW0ubWF0Y2goYmluZFJlZ2V4KTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoTGlzdClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdHJpbmdWYWx1ZTogcGFyYW19O1xuICAgICAgICAgICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgbWF0Y2hdID0gbWF0Y2hMaXN0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXhTbGFzaCA/IHtzdHJpbmdWYWx1ZTogYWxsLnN1YnN0cigxKX0gOiB7c291cmNlVmFsdWU6IHRyYW5zbGF0ZShtYXRjaCwgc291cmNlTGlua3MpfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0ge2VsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtc307XG5cbiAgICAgICAgcGFyYW1zXG4gICAgICAgICAgICAuZmlsdGVyKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlKVxuICAgICAgICAgICAgLmZvckVhY2goKHtzb3VyY2VWYWx1ZTogYmluZE5hbWV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYXR0cmlidXRlQmluZDtcbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVGdW5jdGlvbkJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgZnVuY3Rpb25OYW1lLCBwYXJhbXNTdHJdID0gdmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCk7IC8vIHRvZG8gcHJlZml4U2xhc2hcbiAgICAgICAgZnVuY3Rpb25OYW1lID0gdHJhbnNsYXRlKGZ1bmN0aW9uTmFtZSwgc291cmNlTGlua3MpO1xuICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB7ZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXN9O1xuXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmdW5jdGlvbk5hbWUpO1xuICAgICAgICB0aGlzLmJpbmRzW2Z1bmN0aW9uTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuXG4gICAgICAgIHBhcmFtc1xuICAgICAgICAgICAgLmZvckVhY2goYmluZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XG4gICAgICAgIC8vIHRvZG8gcHJldmVudCBiaW5kaW5nIG5vbiBzb3VyY2UgdmFsdWVzXG4gICAgfVxuXG4gICAgYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSkgeyAvLyB0eXBlID0gJ2lmcycgb3IgJ3ZhbHVlcydcbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgbGV0IGJpbmRlZCA9IHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnNvbWUob3RoZXJCaW5kID0+XG4gICAgICAgICAgICBvdGhlckJpbmQuZWxlbSA9PT0gZWxlbVxuICAgICAgICApO1xuICAgICAgICAhYmluZGVkICYmIHRoaXMuYmluZHNbYmluZE5hbWVdW3R5cGVdLnB1c2goZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgLy8gdG9kbyBwcmV2ZW50IGJpbmRpbmcgbm9uIHNvdXJjZSB2YWx1ZXNcbiAgICB9XG5cbiAgICBhZGRQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGZyb20pO1xuICAgICAgICB0aGlzLmJpbmRzW2Zyb21dLnBhaXJzLnB1c2goe2Zyb20sIHRvT2JqLCB0b0tleX0pO1xuICAgIH1cblxuICAgIGFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkVmFsdWUgPSBwYXJhbXNcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW0uc291cmNlVmFsdWUgPyBub3RVbmRlZmluZWQoZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtwYXJhbS5zb3VyY2VWYWx1ZV0pLCAnJykgOiBwYXJhbS5zdHJpbmdWYWx1ZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgbW9kaWZpZWRWYWx1ZSk7XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2Z1bmN0aW9uTmFtZV0pO1xuICAgICAgICBlbGVtW2F0dHJpYnV0ZU5hbWVdID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXMsIGVsZW0sIGV2ZW50KTtcbiAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkoZWxlbSwgcGFyYW1WYWx1ZXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbc291cmNlRnJvbV0pO1xuICAgICAgICBpZiAodmFsdWUgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHdoaWxlIChjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPiB2YWx1ZS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50OyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgc291cmNlTGlua3Nbc291cmNlVG9dID0gYCR7c291cmNlRnJvbX0uJHtpbmRleH1gO1xuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzLmluZGV4ID0gYF9udW1iZXJzXy4ke2luZGV4fWA7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShjaGlsZEVsZW0sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRFbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5QmluZElmKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMub2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgZWxlbS5oaWRkZW4gPSAhdmFsdWU7XG4gICAgfVxuXG4gICAgYXBwbHlQYWlyQmluZChmcm9tLCB0b09iaiwgdG9LZXkpIHtcbiAgICAgICAgdG9PYmpbdG9LZXldID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtmcm9tXSk7XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5vYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICBlbGVtLmlubmVySFRNTCA9IG5vdFVuZGVmaW5lZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgb2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XG4gICAgICAgIGlmICghZXhwcmVzc2lvbk5hbWUpXG4gICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtiaW5kTmFtZV0pO1xuXG4gICAgICAgIGxldCBleHByZXNzaW9uID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtleHByZXNzaW9uTmFtZV0pO1xuICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ2Z1bmN0aW9uJyAmJiBleHByZXNzaW9uKC4uLnBhcmFtVmFsdWVzKTtcbiAgICB9XG5cbiAgICAvLyB0b2RvIHVzZSBQYXJhbVNwbGl0dGVyIGluIG9yZGVyIHRvIHN1cHBvcnQgYXJyYXkgYW5kIG9iamVjdCBwYXJhbXRlcnNcbiAgICBnZXRQYXJhbVZhbHVlcyhwYXJhbXMsIHRoaXNzLCBldmVudCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLm1hcChwYXJhbSA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyYW1QYXRoID0gcGFyYW0uc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmIChwYXJhbVBhdGhbMF0gPT09ICd0aGlzJykge1xuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzcywgcGFyYW1QYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1QYXRoWzBdID09PSAnZXZlbnQnKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1QYXRoLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKGV2ZW50LCBwYXJhbVBhdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc291cmNlVmFsdWUgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3BhcmFtXSk7XG4gICAgICAgICAgICBpZiAoc291cmNlVmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlVmFsdWU7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocGFyYW0ucmVwbGFjZSgvJy9nLCAnXCInKSk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEFydGlmYWN0cygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgICAgICBoYW5kbGVyczogdGhpcy5oYW5kbGVycyxcbiAgICAgICAgICAgIGJpbmRzOiB0aGlzLmJpbmRzLFxuICAgICAgICAgICAgcm9vdDogdGhpcy5yb290LFxuICAgICAgICAgICAgY29tcG9uZW50czogdGhpcy5jb21wb25lbnRzLFxuICAgICAgICAgICAgYmxvY2tzOiB0aGlzLmJsb2Nrc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyByZXBsYWNlSW5saW5lQmluZGluZ3MoZWxlbSkge1xuICAgICAgICBlbGVtLmlubmVySFRNTCA9IGVsZW0uaW5uZXJIVE1MLnJlcGxhY2UoYWxsU3BhblJlZ2V4LCAoYWxsLCBwcmVmaXhTbGFzaCwgbWF0Y2gpID0+IHByZWZpeFNsYXNoID8gYWxsLnN1YnN0cigxKSA6IGA8c3BhbiBiaW5kPVwiJHttYXRjaH1cIj48L3NwYW4+YCk7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gZWxlbS5pbm5lckhUTUwucmVwbGFjZShhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCAoYWxsLCBwcmVmaXhTbGFzaCwgbWF0Y2gpID0+IHByZWZpeFNsYXNoID8gYWxsLnN1YnN0cigxKSA6IGA8c3BhbiBiaW5kPVwiJHttYXRjaH1cIj48L3NwYW4+YCk7XG4gICAgfVxuXG4gICAgLy8gdG9kbyB1c2UgaW5kZXhUb0RvdCBmb3IgYXR0cmlidXRlIGJpbmRzIGFzIHdlbGwsIGUuZy4gPGRpdiBzdHlsZT1cIiR7Y29sb3JbMF19XCI+IGFiYyA8L2Rpdj5cbiAgICBzdGF0aWMgZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4VG9Eb3QoZWxlbS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSk7XG4gICAgfVxufVxuXG4vLyBiaW5kcyA9IHtcbi8vICAgICAnYS5iLmMnOiB7XG4vLyAgICAgICAgIGF0dHJpYnV0ZXM6IFthdHRyaWJ1dGVCaW5kMSwgYXR0cmlidXRlQmluZDJdLFxuLy8gICAgICAgICBmb3JzOiBbe2NvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3N9XSxcbi8vICAgICAgICAgaWZzOiBbZXhwcmVzc2lvbkJpbmQxLCBleHByZXNzaW9uQmluZDNdLFxuLy8gICAgICAgICBwYWlyczogW3tmcm9tLCB0b09iaiwgdG9LZXl9XSxcbi8vICAgICAgICAgdmFsdWVzOiBbZXhwcmVzc2lvbkJpbmQxLCBleHByZXNzaW9uQmluZDJdXG4vLyAgICAgfVxuLy8gfTtcbi8vXG4vLyBzb3VyY2UgPSB7XG4vLyAgICAgYToge1xuLy8gICAgICAgICBiOiB7XG4vLyAgICAgICAgICAgICBjOiB7fVxuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gfTtcbi8vXG4vLyBoYW5kbGVycyA9IHtcbi8vICAgICBhOiB7XG4vLyAgICAgICAgIF9mdW5jXzogJ2Z1bmMnLFxuLy8gICAgICAgICBiOiB7XG4vLyAgICAgICAgICAgICBjOiB7XG4vLyAgICAgICAgICAgICAgICAgX2Z1bmNfOiAnZnVuYydcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gY29tcG9uZW50cyA9IHtcbi8vICAgICBhOiB7XG4vLyAgICAgICAgIG91dGVyRWxlbTogb3V0ZXJFbGVtLFxuLy8gICAgICAgICBwYXJhbXM6IFtdXG4vLyAgICAgfVxuLy8gfTtcbi8vXG4vLyBhdHRyaWJ1dGVCaW5kID0ge1xuLy8gICAgIGVsZW06IGVsZW0xLFxuLy8gICAgIGF0dHJpYnV0ZU5hbWUsXG4vLyAgICAgZnVuY3Rpb25OYW1lLCAvLyBjYW4gYmUgbnVsbFxuLy8gICAgIHBhcmFtczogW3tzdHJpbmdWYWx1ZSB8IHNvdXJjZVZhbHVlOiBzdHJpbmd9XSwgLy8gZm9yIG51bGwgZnVuY3Rpb25OYW1lXG4vLyAgICAgcGFyYW1zOiBbXSAvLyBmb3Igbm90IG51bGwgZnVuY3Rpb25OYW1lXG4vLyB9O1xuLy9cbi8vIGV4cHJlc3Npb25CaW5kID0ge1xuLy8gICAgIGVsZW06IGVsZW0xLFxuLy8gICAgIGV4cHJlc3Npb25OYW1lLCAvLyBjYW4gYmUgbnVsbFxuLy8gICAgIHBhcmFtczogW10sXG4vLyAgICAgYmluZE5hbWUgLy8gY2FuIGJlIG51bGxcbi8vIH07XG5cbm1vZHVsZS5leHBvcnRzID0gSHRtbEJpbmRlcjtcbiIsImNvbnN0IEJvb3RlciA9IHJlcXVpcmUoJy4vYm9vdGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4gbmV3IEJvb3RlcigpO1xuXG4vLyB0b2RvXG4vLyBhbGxvdyBhcnJheSBiaW5kaW5nIGluIGh0bWw6IGA8ZGl2IGJpbmQ9XCJ4W3ldXCI+PC9kaXY+YFxuLy8gY2xlYW4gdXAgcGFja2FnZS5qc29uXG4vLyAkc3t4fSBzeW50YXggdG8gb25seSBhZmZlY3QgaW5uZXIgdGV4dCBhbmQgbm90IGF0dHJpYnV0ZXNcbi8vIGFsbG93IGRlZmluaW5nIGFuZCB1c2luZyBjb21wb25lbnRzIGluIGFueSBvcmRlclxuLy8gYWxsb3cgdXNpbmcgZXhwcmVzc2lvbnMgZm9yIG1vcmUgYmluZHMgdGhhbiBqdXN0IGlmcyBhbmQgdmFsdWVzIChlLmcuIGF0dHJpYnV0ZXMsIGZvcnMsIGFzLCB1c2UpXG4vLyBzdXBwb3J0ICRlIG5lc3RlZCBpbnNpZGUgJHNcbi8vIGludmVzdGlnYXRlIHdoeSBzb3VyY2UuYSA9IHNvdXJjZS5iIGRvZXNuJ3QgcHJvcG9nYXRlIGNoYW5nZXNcbi8vIGludmVzdGlnYXRlIHdoeSBiaW5kLWZvciBpbmRleFZhcnMgZG9uJ3QgcHJvcG9nYXRlIGNoYW5nZXNcbi8vIHJvdXRpbmcgb3Igc3dhcHBpbmcgc3RhdGVzXG4iLCJsZXQgZ2V0UHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xuICAgIGxldCBmaWVsZHMgPSBnZXRGaWVsZHMocGF0aHMpO1xuICAgIGxldCBsYXN0RmllbGQgPSBmaWVsZHMucG9wKCk7XG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSB8fCB7fSk7XG4gICAgcmV0dXJuIFtvYmosIGxhc3RGaWVsZF07XG59O1xuXG5sZXQgZ2V0VmFsdWUgPSAob2JqLCBwYXRocykgPT4ge1xuICAgIGxldCBwcm9wZXJ0eSA9IGdldFByb3BlcnR5KG9iaiwgcGF0aHMpO1xuICAgIHJldHVybiBwcm9wZXJ0eVsxXSA9PT0gdW5kZWZpbmVkID8gcHJvcGVydHlbMF0gOiBwcm9wZXJ0eVswXVtwcm9wZXJ0eVsxXV07XG59O1xuXG5sZXQgY3JlYXRlUHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xuICAgIGxldCBmaWVsZHMgPSBnZXRGaWVsZHMocGF0aHMpO1xuICAgIGxldCBsYXN0RmllbGQgPSBmaWVsZHMucG9wKCk7XG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSA9IG9ialtmaWVsZF0gfHwge30pO1xuICAgIHJldHVybiBbb2JqLCBsYXN0RmllbGRdO1xufTtcblxubGV0IHNldFByb3BlcnR5ID0gKG9iaiwgcGF0aHMsIHZhbHVlKSA9PiB7XG4gICAgbGV0IHByb3BlcnR5ID0gY3JlYXRlUHJvcGVydHkob2JqLCBwYXRocyk7XG4gICAgcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dID0gdmFsdWU7XG59O1xuXG5sZXQgY2xvbmUgPSBvcmlnaW5hbCA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsKTtcbn07XG5cbmxldCB0cmFuc2xhdGUgPSAobmFtZSwgbGlua3MpID0+IHtcbiAgICBsZXQgb2NjdXJyZWQgPSBbXTtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKFtuYW1lXSk7XG4gICAgd2hpbGUgKGZpZWxkc1swXSBpbiBsaW5rcykge1xuICAgICAgICBvY2N1cnJlZC5wdXNoKGZpZWxkc1swXSk7XG4gICAgICAgIGZpZWxkc1swXSA9IGxpbmtzW2ZpZWxkc1swXV07XG4gICAgICAgIGlmIChvY2N1cnJlZC5pbmNsdWRlcyhmaWVsZHNbMF0pKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGZpZWxkcyA9IGdldEZpZWxkcyhmaWVsZHMpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzLnJlZHVjZSgoYSwgYikgPT4gYCR7YX0uJHtifWApO1xufTtcblxubGV0IGdldEZpZWxkcyA9IHBhdGhzID0+XG4gICAgcGF0aHNcbiAgICAgICAgLm1hcChwYXRoID0+IHBhdGguc3BsaXQoJy4nKSlcbiAgICAgICAgLnJlZHVjZSgoYWdncmVnYXRlLCBpdGVtKSA9PiBhZ2dyZWdhdGUuY29uY2F0KGl0ZW0pLCBbXSk7XG5cbmxldCBpbmRleFRvRG90ID0gZmllbGQgPT4gZmllbGQgJiYgZmllbGQucmVwbGFjZSgvXFxbKFxcdyspXFxdL2csIChfLCBtYXRjaCkgPT4gYC4ke21hdGNofWApO1xuXG5sZXQgbm90VW5kZWZpbmVkID0gKHZhbHVlLCB1bmRlZmluZWRWYWx1ZSA9IG51bGwpID0+XG4gICAgdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogdW5kZWZpbmVkVmFsdWU7XG5cbm1vZHVsZS5leHBvcnRzID0ge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfTtcbiIsImNsYXNzIFBhcmFtU3BsaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHN0cmluZykge1xuICAgICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICAgICAgdGhpcy5pbmRleCA9IC0xO1xuICAgICAgICB0aGlzLnN0YXJ0SW5kZXggPSAwO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IFtdO1xuICAgIH1cblxuICAgIHNwbGl0QnlQYXJhbXMoKSB7XG4gICAgICAgIGxldCBkZXB0aCA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dEluZGV4KCkgJiYgKCF0aGlzLmF0UXVvdGUoKSB8fCB0aGlzLnNraXBRdW90ZSgpKSkge1xuICAgICAgICAgICAgbGV0IGNoYXIgPSB0aGlzLnN0cmluZ1t0aGlzLmluZGV4XTtcbiAgICAgICAgICAgIGlmIChjaGFyID09PSAnWycpXG4gICAgICAgICAgICAgICAgZGVwdGgrKztcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICddJylcbiAgICAgICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJywnICYmICFkZXB0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGFyYW0oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0SW5kZXggPSB0aGlzLmluZGV4ICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkUGFyYW0oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zO1xuICAgIH1cblxuICAgIGZpbmRJbmRleChyZWdleCwgc3RhcnQpIHsgLy8gcmV0dXJucyAtMSBvciBpbmRleCBvZiBtYXRjaFxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnN0cmluZy5zdWJzdHJpbmcoc3RhcnQpLnNlYXJjaChyZWdleCk7XG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwID8gaW5kZXggKyBzdGFydCA6IC0xO1xuICAgIH07XG5cbiAgICBuZXh0SW5kZXgoKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleCgvWywnXCJbXFxdXS8sIHRoaXMuaW5kZXggKyAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggIT09IC0xO1xuICAgIH1cblxuICAgIGF0UXVvdGUoKSB7XG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgIHJldHVybiBjaGFyID09PSAnXCInIHx8IGNoYXIgPT09IFwiJ1wiO1xuICAgIH1cblxuICAgIHNraXBRdW90ZSgpIHtcbiAgICAgICAgbGV0IGNoYXIgPSB0aGlzLnN0cmluZ1t0aGlzLmluZGV4XTtcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZmluZEluZGV4KGNoYXIgPT09ICdcIicgPyAvW15cXFxcXVwiLyA6IC9bXlxcXFxdJy8sIHRoaXMuaW5kZXggKyAxKSArIDE7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4O1xuICAgIH1cblxuICAgIGFkZFBhcmFtKCkge1xuICAgICAgICB0aGlzLnBhcmFtcy5wdXNoKHRoaXMuc3RyaW5nLnN1YnN0cmluZyh0aGlzLnN0YXJ0SW5kZXgsIHRoaXMuaW5kZXggPiAwID8gdGhpcy5pbmRleCA6IHRoaXMuc3RyaW5nLmxlbmd0aCkudHJpbSgpKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nID0+IG5ldyBQYXJhbVNwbGl0dGVyKHN0cmluZykuc3BsaXRCeVBhcmFtcygpO1xuIiwiLy8gKFtcXHcuW1xcXV0rKVxuXG5sZXQgc3BhblJlZ2V4ID0gLyhcXFxcKT9cXCRzeyhbXFx3LltcXF1dKyl9LztcbmxldCBhbGxTcGFuUmVnZXggPSBuZXcgUmVnRXhwKHNwYW5SZWdleCwgJ2cnKTtcbmxldCBzcGFuRXhwcmVzc2lvblJlZ2V4ID0gLyhcXFxcKT9cXCRzeyhbXFx3LltcXF0hPT48fCZdK1xcKC4qXFwpKX0vO1xubGV0IGFsbFNwYW5FeHByZXNzaW9uUmVnZXggPSBuZXcgUmVnRXhwKHNwYW5FeHByZXNzaW9uUmVnZXgsICdnJyk7XG5cbmxldCBiaW5kUmVnZXggPSAvKFxcXFwpP1xcJHsoW1xcdy5bXFxdXSspfS87XG5sZXQgYmluZFJlZ2V4VW5jYXB0dXJpbmcgPSAvKCg/OlxcXFwpP1xcJHsoPzpbXFx3LltcXF1dKyl9KS87XG5cbmxldCBmdW5jdGlvblJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKVxcKCguKilcXCl9LztcblxubGV0IGV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/KFtcXHcuW1xcXSE9Pjx8Jl0rKVxcKCguKilcXCkvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH07XG4iLCIvLyB0b2RvIHdyYXAgdGhlc2UgZnVuY3Rpb25zIGluIGEgY2xhc3NcbmxldCBjcmVhdGVTb3VyY2UgPSAoKSA9PiB7XG4gICAgbGV0IGhhbmRsZXJzID0ge307XG4gICAgbGV0IHNvdXJjZSA9IHt9O1xuICAgIHNldERlZmF1bHRTb3VyY2Uoc291cmNlKTtcbiAgICBsZXQgY29tcGFyZVNvdXJjZSA9IHt9O1xuICAgIHNvdXJjZS5pbnZva2VBbGxIYW5kbGVycyA9ICgpID0+IGhhbmRsZU9yaWdpbkNoYW5nZXMoc291cmNlLCBjb21wYXJlU291cmNlLCBoYW5kbGVycyk7XG4gICAgcmV0dXJuIHtzb3VyY2UsIGhhbmRsZXJzfTtcbn07XG5cbmxldCBpZ25vcmUgPSBbXTtcblxubGV0IGlzQmluZElnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBvYmouX19iaW5kSWdub3JlX18gJiYgb2JqLl9fYmluZElnbm9yZV9fLmluY2x1ZGVzKHByb3ApO1xuXG4vLyB0b2RvIG1ha2UgX19iaW5kQXZvaWRDeWNsZXNfXyBpbmhlcml0ZWQgYW5kIG1heWJlIGF2b2lkIHBlciBiaW5kaW5nIGluc3RlYWQgcGVyIGNoYW5nZVxubGV0IGlzSWdub3JlZCA9IChvYmosIHByb3ApID0+IGlzQmluZElnbm9yZWQob2JqLCBwcm9wKSB8fCAob2JqLl9fYmluZEF2b2lkQ3ljbGVzX18gJiYgaWdub3JlLnNvbWUoaWdub3JlID0+IGlnbm9yZS5vYmogPT09IG9iaiAmJiBpZ25vcmUucHJvcCA9PT0gcHJvcCkpO1xuXG5sZXQgaGFuZGxlU2V0ID0gKG9iaiwgcHJvcCwgaGFuZGxlcnMsIGFjY3VtdWxhdGVkSGFuZGxlcnMpID0+IHtcbiAgICBpZ25vcmUucHVzaCh7b2JqLCBwcm9wfSk7XG4gICAgYWNjdW11bGF0ZWRIYW5kbGVycy5mb3JFYWNoKGRvSGFuZGxlcik7XG4gICAgaGFuZGxlcnMgJiYgcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcnMpO1xuICAgIGlnbm9yZS5wb3AoKTtcbn07XG5cbmxldCBwcm9wb2dhdGVIYW5kbGVyRG93biA9IGhhbmRsZXJzID0+IHtcbiAgICBkb0hhbmRsZXIoaGFuZGxlcnMpO1xuICAgIE9iamVjdC5lbnRyaWVzKGhhbmRsZXJzKVxuICAgICAgICAuZmlsdGVyKChba2V5XSkgPT4ga2V5ICE9PSAnX2Z1bmNfJylcbiAgICAgICAgLmZvckVhY2goKFssIGhhbmRsZXJdKSA9PiBwcm9wb2dhdGVIYW5kbGVyRG93bihoYW5kbGVyKSk7XG59O1xuXG5sZXQgZG9IYW5kbGVyID0gaGFuZGxlciA9PiB0eXBlb2YgaGFuZGxlci5fZnVuY18gPT09ICdmdW5jdGlvbicgJiYgaGFuZGxlci5fZnVuY18oKTtcblxubGV0IGhhbmRsZU9yaWdpbkNoYW5nZXNLZXkgPSAoc291cmNlLCBjb21wYXJlU291cmNlLCBrZXksIGhhbmRsZXJzID0ge30sIGFjY3VtdWxhdGVkSGFuZGxlcnMgPSBbXSkgPT4ge1xuICAgIGlmIChpc0JpbmRJZ25vcmVkKHNvdXJjZSwga2V5KSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGxldCB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIGxldCBjb21wYXJlVmFsdWUgPSBjb21wYXJlU291cmNlW2tleV07XG4gICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBpc09iamVjdChjb21wYXJlVmFsdWUpKVxuICAgICAgICBoYW5kbGVPcmlnaW5DaGFuZ2VzKHZhbHVlLCBjb21wYXJlVmFsdWUsIGhhbmRsZXJzW2tleV0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSk7IC8vIHRvZG8gdXNlIHB1c2ggZm9yIGVmZmljaWVuY3lcbiAgICBlbHNlIGlmICh2YWx1ZSAhPT0gY29tcGFyZVZhbHVlKSB7XG4gICAgICAgIGNvbXBhcmVTb3VyY2Vba2V5XSA9IGNvcHkodmFsdWUpO1xuICAgICAgICBoYW5kbGVTZXQoc291cmNlLCBrZXksIGhhbmRsZXJzW2tleV0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSk7IC8vIHRvZG8gd3JhcCBoYW5kbGVycyBhbmQgYWNjdW11bGF0ZWRIYW5kbGVycyBpbiBjbGFzcyB3aXRoIHBvcFByb3AgbWV0aG9kXG4gICAgfVxufTtcblxuLy8gc291cmNlIGFuZCBjb21wYXJlU291cmNlIG11c3Qgbm90IGJlIG51bGwgb3IgdW5kZWZpbmVkXG5sZXQgaGFuZGxlT3JpZ2luQ2hhbmdlcyA9IChzb3VyY2UsIGNvbXBhcmVTb3VyY2UsIGhhbmRsZXJzID0ge30sIGFjY3VtdWxhdGVkSGFuZGxlcnMgPSBbXSkgPT4ge1xuICAgIGlmICghaGFuZGxlcnMpXG4gICAgICAgIHJldHVybjtcbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goa2V5ID0+IGhhbmRsZU9yaWdpbkNoYW5nZXNLZXkoc291cmNlLCBjb21wYXJlU291cmNlLCBrZXksIGhhbmRsZXJzLCBhY2N1bXVsYXRlZEhhbmRsZXJzKSk7XG4gICAgT2JqZWN0LmtleXMoY29tcGFyZVNvdXJjZSkuZm9yRWFjaChrZXkgPT4gIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGhhbmRsZU9yaWdpbkNoYW5nZXNLZXkoc291cmNlLCBjb21wYXJlU291cmNlLCBrZXksIGhhbmRsZXJzLCBhY2N1bXVsYXRlZEhhbmRsZXJzKSk7XG59O1xuXG4vLyB0b2RvIG1vdmUgdGhlc2UgZnVuY2l0b25zIHRvIG9iaiBzY2Fmb2xsZGluZyB1dGlsIG1vZHVsZVxubGV0IGlzT2JqZWN0ID0gb2JqID0+IHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iajtcblxubGV0IGNvcHkgPSBvYmogPT4ge1xuICAgIGlmICghaXNPYmplY3Qob2JqKSlcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICBsZXQgY29weU9iaiA9IHt9O1xuICAgIE9iamVjdC5lbnRyaWVzKG9iaikuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiBjb3B5T2JqW2tleV0gPSBjb3B5KHZhbHVlKSk7XG4gICAgcmV0dXJuIGNvcHlPYmo7XG59O1xuXG5sZXQgc2V0RGVmYXVsdFNvdXJjZSA9IHNvdXJjZSA9PiB7XG4gICAgc291cmNlLl9udW1iZXJzXyA9IG5ldyBQcm94eSh7fSwge1xuICAgICAgICBnZXQ6IChfLCBwcm9wKSA9PiBwYXJzZUludChwcm9wKSxcbiAgICAgICAgc2V0OiAoKSA9PiBmYWxzZVxuICAgIH0pO1xuICAgIHNvdXJjZS5ub3QgPSBhID0+ICFhO1xuICAgIHNvdXJjZVsnISddID0gYSA9PiAhYTtcbiAgICBzb3VyY2UuZXEgPSAoYSwgYikgPT4gYSA9PT0gYjtcbiAgICBzb3VyY2UuZXF1YWwgPSAoYSwgYikgPT4gYSA9PT0gYjtcbiAgICBzb3VyY2VbJz0nXSA9IChhLCBiKSA9PiBhID09PSBiO1xuICAgIHNvdXJjZS5uRXEgPSAoYSwgYikgPT4gYSAhPT0gYjtcbiAgICBzb3VyY2Uubm90RXF1YWwgPSAoYSwgYikgPT4gYSAhPT0gYjtcbiAgICBzb3VyY2VbJyE9J10gPSAoYSwgYikgPT4gYSAhPT0gYjtcbiAgICBzb3VyY2UuZ3JlYXRlciA9IChhLCBiKSA9PiBhID4gYjtcbiAgICBzb3VyY2VbJz4nXSA9IChhLCBiKSA9PiBhID4gYjtcbiAgICBzb3VyY2UubGVzcyA9IChhLCBiKSA9PiBhIDwgYjtcbiAgICBzb3VyY2VbJzwnXSA9IChhLCBiKSA9PiBhIDwgYjtcbiAgICBzb3VyY2UuZ3JlYXRlckVxID0gKGEsIGIpID0+IGEgPj0gYjtcbiAgICBzb3VyY2VbJz49J10gPSAoYSwgYikgPT4gYSA+PSBiO1xuICAgIHNvdXJjZS5sZXNzRXEgPSAoYSwgYikgPT4gYSA8PSBiO1xuICAgIHNvdXJjZVsnPD0nXSA9IChhLCBiKSA9PiBhIDw9IGI7XG4gICAgc291cmNlLm9yID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XG4gICAgc291cmNlWyd8J10gPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcbiAgICBzb3VyY2VbJ3x8J10gPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcbiAgICBzb3VyY2UuYW5kID0gKC4uLmFzKSA9PiBhcy5ldmVyeShhID0+IGEpO1xuICAgIHNvdXJjZVsnJiddID0gKC4uLmFzKSA9PiBhcy5ldmVyeShhID0+IGEpO1xuICAgIHNvdXJjZVsnJiYnXSA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZVNvdXJjZX07XG5cbi8vIHRvZG9cbi8vIG9uIGdldCBlbGVtLCBzeW5jaFxuLy8gc2VuZCBibG9jayBzb3VyY2UgaGFuZGxlcnMgdG8gcGFyZW50IHNvdXJjZVxuLy8gYWxsb3cgbWFudWFsIHRyaWdnZXJpbmcgb2YgaGFuZGxlciBjaGVja3NcbiIsImxldCBzcGxpdEJ5V29yZCA9IChzdHJpbmcsIHdvcmQpID0+XG4gICAgc3RyaW5nLnNwbGl0KG5ldyBSZWdFeHAoYFxcXFxzKyR7d29yZH1cXFxccytgKSk7XG5cbmxldCBzcGxpdEJ5Q29tbWEgPSBzdHJpbmcgPT5cbiAgICBzdHJpbmcuc3BsaXQoL1xccyosXFxzKi8pO1xuXG5sZXQgc3BsaXRCeVNwYWNlID0gc3RyaW5nID0+XG4gICAgc3RyaW5nLnNwbGl0KC9cXHMrLyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX07XG4iXX0=
