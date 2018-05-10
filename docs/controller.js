(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__dirname){
const source = require('bb-better-binding')(__dirname, document, window);

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

}).call(this,"/example/helloWorld")

},{"bb-better-binding":7}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
const fs = require('fs');
const path = require('path');

module.exports = (dir, readPath) => {
    let fullPath = path.resolve(dir, readPath);
    let readDir = path.dirname(fullPath);
    let read = fs.readFileSync(fullPath, 'utf8');
    return {readDir, read};
};

},{"fs":2,"path":3}],6:[function(require,module,exports){
const {getValue, setProperty, clone, translate, indexToDot, notUndefined} = require('./objScafolding');
const {splitByWord, splitByComma, splitBySpace} = require('./stringSplitter');
const splitByParams = require('./paramSplitter');
const {createSource} = require('./source');
const fileReader = require('./fileReader');
const {allSpanRegex, allSpanExpressionRegex, bindRegex, bindRegexUncapturing, functionRegex, expressionRegex} = require('./regex');

class HtmlBinder {

    constructor(dir, root) {
        this.binds = {};
        let {origin, source, handlers} = createSource();
        this.source = source;
        this.handlers = handlers;
        this.components = {};
        this.root = root.children[0];
        HtmlBinder.replaceInlineBindings(this.root);
        this.bindElem(root, {}, dir);
        return {origin, source, binds: this.binds, handlers, components: this.components};
    }

    bindElem(elem, sourceLinks, linkBaseDir) {
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
            let bindComponentLink = HtmlBinder.getBindAttribute(elem, 'bind-component-link');
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
                this.components[componentName] = {outerElem: elem, params};

            } else if (bindFor) {
                skip = true;
                let [sourceTo, bindName] = splitByWord(bindFor, 'in');
                bindName = translate(bindName, sourceLinks);
                let container = document.createElement('for-parent');
                elem.replaceWith(container);
                elem.removeAttribute('bind-for');
                this.createBind(bindName);
                this.binds[bindName].fors.push({container, outerElem: elem, sourceTo, sourceFrom: bindName, sourceLinks});
                this.applyBindFor(container, elem, sourceTo, bindName, sourceLinks, linkBaseDir);

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

            bind.fors.forEach(({container, outerElem, sourceTo, sourceFrom, sourceLinks, linkBaseDir}) => {
                this.applyBindFor(container, outerElem, sourceTo, sourceFrom, sourceLinks, linkBaseDir);
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

    applyBindFor(container, outerElem, sourceTo, sourceFrom, sourceLinks, linkBaseDir) {
        let value = getValue(this.source, [sourceFrom]);
        if (value && Array.isArray(value)) {
            while (container.childElementCount > value.length)
                container.removeChild(container.lastElementChild);
            for (let index = container.childElementCount; index < value.length; index++) {
                let childElem = document.importNode(outerElem, true);
                sourceLinks = clone(sourceLinks);
                sourceLinks[sourceTo] = `${sourceFrom}.${index}`;
                sourceLinks.index = `_numbers_.${index}`;
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

module.exports = (dir, document, debug) => {
    let artifacts = new HtmlBinder(dir, document);
    if (debug)
        Object.assign(debug, artifacts);
    return artifacts.source;
};

},{"./fileReader":5,"./objScafolding":8,"./paramSplitter":9,"./regex":10,"./source":11,"./stringSplitter":12}],7:[function(require,module,exports){
module.exports = require('./htmlBinder');

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

},{"./htmlBinder":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`));

let splitByComma = string =>
    string.split(/\s*,\s*/);

let splitBySpace = string =>
    string.split(/\s+/);

module.exports = {splitByWord, splitByComma, splitBySpace};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2hlbGxvV29ybGQvY29udHJvbGxlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsInNyYy9maWxlUmVhZGVyLmpzIiwic3JjL2h0bWxCaW5kZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvb2JqU2NhZm9sZGluZy5qcyIsInNyYy9wYXJhbVNwbGl0dGVyLmpzIiwic3JjL3JlZ2V4LmpzIiwic3JjL3NvdXJjZS5qcyIsInNyYy9zdHJpbmdTcGxpdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFGQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3Qgc291cmNlID0gcmVxdWlyZSgnYmItYmV0dGVyLWJpbmRpbmcnKShfX2Rpcm5hbWUsIGRvY3VtZW50LCB3aW5kb3cpO1xuXG4vLyBncmVldGluZ1xuc291cmNlLmxhcmdlRm9udCA9IDYwO1xuc291cmNlLmZhdm9yaXRlQ29sb3IgPSAnREVFUHBpbmsnO1xuc291cmNlLmdyZWV0aW5nID0gJ0kgaGF0ZSB5b3UnO1xuc291cmNlLm5hbWUgPSAnV29ybGQnO1xuc291cmNlLmV4Y2xhbWF0aW9uID0gJyjila/CsOKWocKw77yJ4pWv77i1IOKUu+KUgeKUuyc7XG5zb3VyY2UuY2hhbmdlQ29sb3IgPSBpbnB1dCA9PiB7XG4gICAgc291cmNlLmZhdm9yaXRlQ29sb3IgPSBpbnB1dC52YWx1ZTtcbn07XG5cbi8vIGFuaW1hdGlvblxubGV0IGFuaW1hdGlvbnMgPSBbXG4gICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwNDMuZ2lmJyxcbiAgICAnaHR0cHM6Ly9tZWRpYTAuZ2lwaHkuY29tL21lZGlhLzEyRWtKQ2JwYTNoR0tjL2dpcGh5LmdpZicsXG4gICAgJ2h0dHA6Ly93d3cucXFwci5jb20vYXNjaWkvaW1nL2FzY2lpLTEwMDYuZ2lmJ107XG5sZXQgYW5pbWF0aW9uSW5kZXggPSAtMTtcbnNvdXJjZS5jaGFuZ2VBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgYW5pbWF0aW9uSW5kZXggPSAoYW5pbWF0aW9uSW5kZXggKyAxKSAlIGFuaW1hdGlvbnMubGVuZ3RoO1xuICAgIHNvdXJjZS5hbmltYXRpb24gPSBhbmltYXRpb25zW2FuaW1hdGlvbkluZGV4XTtcbn07XG5zb3VyY2UuY2hhbmdlQW5pbWF0aW9uKCk7XG5cbi8vIGpva2VzXG5zb3VyY2Uuam9rZXMgPSBbXG4gICAge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkxlZnQgaW5zaWRlIG1haW4gdGlyZSBhbG1vc3QgbmVlZHMgcmVwbGFjZW1lbnQuXCInLFxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkFsbW9zdCByZXBsYWNlZCBsZWZ0IGluc2lkZSBtYWluIHRpcmUuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiVGVzdCBmbGlnaHQgT0ssIGV4Y2VwdCBhdXRvbGFuZCB2ZXJ5IHJvdWdoLlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJBdXRvbGFuZCBub3QgaW5zdGFsbGVkIG9uIHRoaXMgYWlyY3JhZnQuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbSAjMTogIFwiIzIgUHJvcGVsbGVyIHNlZXBpbmcgcHJvcCBmbHVpZC5cIicsXG4gICAgICAgICAgICAnU29sdXRpb24gIzE6IFwiIzIgUHJvcGVsbGVyIHNlZXBhZ2Ugbm9ybWFsLlwiJyxcbiAgICAgICAgICAgICdQcm9ibGVtICMyOiAgXCIjMSwgIzMsIGFuZCAjNCBwcm9wZWxsZXJzIGxhY2sgbm9ybWFsIHNlZXBhZ2UuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbTogICAgXCJUaGUgYXV0b3BpbG90IGRvZXNuXFwndC5cIicsXG4gICAgICAgICAgICAnU2lnbmVkIG9mZjogXCJJVCBET0VTIE5PVy5cIidcbiAgICAgICAgXVxuICAgIH0sIHtcbiAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJTb21ldGhpbmcgbG9vc2UgaW4gY29ja3BpdC5cIicsXG4gICAgICAgICAgICAnU29sdXRpb246IFwiU29tZXRoaW5nIHRpZ2h0ZW5lZCBpbiBjb2NrcGl0LlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkV2aWRlbmNlIG9mIGh5ZHJhdWxpYyBsZWFrIG9uIHJpZ2h0IG1haW4gbGFuZGluZyBnZWFyLlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJFdmlkZW5jZSByZW1vdmVkLlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRNRSB2b2x1bWUgdW5iZWxpZXZhYmx5IGxvdWQuXCInLFxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlZvbHVtZSBzZXQgdG8gbW9yZSBiZWxpZXZhYmxlIGxldmVsLlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkRlYWQgYnVncyBvbiB3aW5kc2hpZWxkLlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJMaXZlIGJ1Z3Mgb24gb3JkZXIuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiQXV0b3BpbG90IGluIGFsdGl0dWRlIGhvbGQgbW9kZSBwcm9kdWNlcyBhIDIwMCBmcG0gZGVzY2VudC5cIicsXG4gICAgICAgICAgICAnU29sdXRpb246IFwiQ2Fubm90IHJlcHJvZHVjZSBwcm9ibGVtIG9uIGdyb3VuZC5cIidcbiAgICAgICAgXVxuICAgIH0sIHtcbiAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJJRkYgaW5vcGVyYXRpdmUuXCInLFxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIklGRiBhbHdheXMgaW5vcGVyYXRpdmUgaW4gT0ZGIG1vZGUuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiRnJpY3Rpb24gbG9ja3MgY2F1c2UgdGhyb3R0bGUgbGV2ZXJzIHRvIHN0aWNrLlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJUaGF0XFwncyB3aGF0IHRoZXlcXCdyZSB0aGVyZSBmb3IuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiTnVtYmVyIHRocmVlIGVuZ2luZSBtaXNzaW5nLlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJFbmdpbmUgZm91bmQgb24gcmlnaHQgd2luZyBhZnRlciBicmllZiBzZWFyY2guXCInXG4gICAgICAgIF1cbiAgICB9LFxuXTtcbnNvdXJjZS5qb2tlc1NvdXJjZSA9ICdodHRwczovL3d3dy5uZXRmdW5ueS5jb20vcmhmL2pva2VzLzk3L0p1bi91c2FmLmh0bWwnO1xuIiwiIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZGlyLCByZWFkUGF0aCkgPT4ge1xuICAgIGxldCBmdWxsUGF0aCA9IHBhdGgucmVzb2x2ZShkaXIsIHJlYWRQYXRoKTtcbiAgICBsZXQgcmVhZERpciA9IHBhdGguZGlybmFtZShmdWxsUGF0aCk7XG4gICAgbGV0IHJlYWQgPSBmcy5yZWFkRmlsZVN5bmMoZnVsbFBhdGgsICd1dGY4Jyk7XG4gICAgcmV0dXJuIHtyZWFkRGlyLCByZWFkfTtcbn07XG4iLCJjb25zdCB7Z2V0VmFsdWUsIHNldFByb3BlcnR5LCBjbG9uZSwgdHJhbnNsYXRlLCBpbmRleFRvRG90LCBub3RVbmRlZmluZWR9ID0gcmVxdWlyZSgnLi9vYmpTY2Fmb2xkaW5nJyk7XG5jb25zdCB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfSA9IHJlcXVpcmUoJy4vc3RyaW5nU3BsaXR0ZXInKTtcbmNvbnN0IHNwbGl0QnlQYXJhbXMgPSByZXF1aXJlKCcuL3BhcmFtU3BsaXR0ZXInKTtcbmNvbnN0IHtjcmVhdGVTb3VyY2V9ID0gcmVxdWlyZSgnLi9zb3VyY2UnKTtcbmNvbnN0IGZpbGVSZWFkZXIgPSByZXF1aXJlKCcuL2ZpbGVSZWFkZXInKTtcbmNvbnN0IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH0gPSByZXF1aXJlKCcuL3JlZ2V4Jyk7XG5cbmNsYXNzIEh0bWxCaW5kZXIge1xuXG4gICAgY29uc3RydWN0b3IoZGlyLCByb290KSB7XG4gICAgICAgIHRoaXMuYmluZHMgPSB7fTtcbiAgICAgICAgbGV0IHtvcmlnaW4sIHNvdXJjZSwgaGFuZGxlcnN9ID0gY3JlYXRlU291cmNlKCk7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0gaGFuZGxlcnM7XG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xuICAgICAgICB0aGlzLnJvb3QgPSByb290LmNoaWxkcmVuWzBdO1xuICAgICAgICBIdG1sQmluZGVyLnJlcGxhY2VJbmxpbmVCaW5kaW5ncyh0aGlzLnJvb3QpO1xuICAgICAgICB0aGlzLmJpbmRFbGVtKHJvb3QsIHt9LCBkaXIpO1xuICAgICAgICByZXR1cm4ge29yaWdpbiwgc291cmNlLCBiaW5kczogdGhpcy5iaW5kcywgaGFuZGxlcnMsIGNvbXBvbmVudHM6IHRoaXMuY29tcG9uZW50c307XG4gICAgfVxuXG4gICAgYmluZEVsZW0oZWxlbSwgc291cmNlTGlua3MsIGxpbmtCYXNlRGlyKSB7XG4gICAgICAgIGxldCBza2lwID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKSB7XG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGVsZW0uYXR0cmlidXRlcztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB7bmFtZTogYXR0cmlidXRlTmFtZSwgdmFsdWV9ID0gYXR0cmlidXRlc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5tYXRjaChiaW5kUmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7cGFyYW1zfSA9IGF0dHJpYnV0ZUJpbmQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLm1hdGNoKGZ1bmN0aW9uUmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0gdGhpcy5hZGRBdHRyaWJ1dGVGdW5jdGlvbkJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtmdW5jdGlvbk5hbWUsIHBhcmFtc30gPSBhdHRyaWJ1dGVCaW5kO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBiaW5kRWxlbSA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1lbGVtJyk7XG4gICAgICAgICAgICBsZXQgYmluZENvbXBvbmVudExpbmsgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtY29tcG9uZW50LWxpbmsnKTtcbiAgICAgICAgICAgIGxldCBiaW5kQ29tcG9uZW50ID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWNvbXBvbmVudCcpO1xuICAgICAgICAgICAgbGV0IGJpbmRVc2UgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtdXNlJyk7XG4gICAgICAgICAgICBsZXQgYmluZEFzID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWFzJyk7XG4gICAgICAgICAgICBsZXQgYmluZEZvciA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1mb3InKTtcbiAgICAgICAgICAgIGxldCBiaW5kSWYgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtaWYnKTtcbiAgICAgICAgICAgIGxldCBiaW5kVmFsdWUgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQnKTtcblxuICAgICAgICAgICAgaWYgKGJpbmRFbGVtKSB7XG4gICAgICAgICAgICAgICAgc2V0UHJvcGVydHkodGhpcy5zb3VyY2UsIFtiaW5kRWxlbV0sIGVsZW0pO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fID0gdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18gfHwgW107XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UuX19iaW5kSWdub3JlX18ucHVzaChiaW5kRWxlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChiaW5kQ29tcG9uZW50TGluaykge1xuICAgICAgICAgICAgICAgIGxldCB7cmVhZERpciwgcmVhZH0gPSBmaWxlUmVhZGVyKGxpbmtCYXNlRGlyLCBiaW5kQ29tcG9uZW50TGluayk7XG4gICAgICAgICAgICAgICAgbGV0IGxvYWRlZEh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBsb2FkZWRIdG1sLmlubmVySFRNTCA9IHJlYWQ7XG4gICAgICAgICAgICAgICAgSHRtbEJpbmRlci5yZXBsYWNlSW5saW5lQmluZGluZ3MobG9hZGVkSHRtbCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZXBsYWNlV2l0aChsb2FkZWRIdG1sKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFbGVtKGxvYWRlZEh0bWwsIHNvdXJjZUxpbmtzLCByZWFkRGlyKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IFtjb21wb25lbnROYW1lLCBwYXJhbXNHcm91cF0gPSBzcGxpdEJ5V29yZChiaW5kQ29tcG9uZW50LCAnd2l0aCcpO1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5U3BhY2UocGFyYW1zR3JvdXApO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtY29tcG9uZW50Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdID0ge291dGVyRWxlbTogZWxlbSwgcGFyYW1zfTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5kRm9yKSB7XG4gICAgICAgICAgICAgICAgc2tpcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IFtzb3VyY2VUbywgYmluZE5hbWVdID0gc3BsaXRCeVdvcmQoYmluZEZvciwgJ2luJyk7XG4gICAgICAgICAgICAgICAgYmluZE5hbWUgPSB0cmFuc2xhdGUoYmluZE5hbWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9yLXBhcmVudCcpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVwbGFjZVdpdGgoY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnYmluZC1mb3InKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdLmZvcnMucHVzaCh7Y29udGFpbmVyLCBvdXRlckVsZW06IGVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tOiBiaW5kTmFtZSwgc291cmNlTGlua3N9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZvcihjb250YWluZXIsIGVsZW0sIHNvdXJjZVRvLCBiaW5kTmFtZSwgc291cmNlTGlua3MsIGxpbmtCYXNlRGlyKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYmluZFVzZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgW2NvbXBvbmVudE5hbWUsIHBhcmFtc0dyb3VwXSA9IHNwbGl0QnlXb3JkKGJpbmRVc2UsICd3aXRoJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXNJbnB1dCA9IHNwbGl0QnlTcGFjZShwYXJhbXNHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7b3V0ZXJFbGVtLCBwYXJhbXN9ID0gdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50RWxlbSA9IGRvY3VtZW50LmltcG9ydE5vZGUob3V0ZXJFbGVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5hcHBlbmRDaGlsZChjb21wb25lbnRFbGVtKTtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5mb3JFYWNoKCh0bywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3RvXSA9IHRyYW5zbGF0ZShwYXJhbXNJbnB1dFtpbmRleF0sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRBcykge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcyA9IGNsb25lKHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRCeUNvbW1hKGJpbmRBcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYXMgPT4gc3BsaXRCeVdvcmQoYXMsICdhcycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKFtmcm9tLCB0b10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUoZnJvbSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRJZikge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2V4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSA9IHRoaXMuZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGJpbmRJZiwgJ2lmcycsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJpbmRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQge2V4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSA9IHRoaXMuZXh0cmFjdEV4cHJlc3Npb25CaW5kKGVsZW0sIGJpbmRWYWx1ZSwgJ3ZhbHVlcycsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFza2lwKVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGVsZW0uY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShlbGVtLmNoaWxkcmVuW2ldLCBzb3VyY2VMaW5rcywgbGlua0Jhc2VEaXIpO1xuICAgIH1cblxuICAgIGNyZWF0ZUJpbmQoYmluZE5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuYmluZHNbYmluZE5hbWVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxldCBiaW5kID0ge2lmczogW10sIGZvcnM6IFtdLCB2YWx1ZXM6IFtdLCBhdHRyaWJ1dGVzOiBbXX07XG4gICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdID0gYmluZDtcblxuICAgICAgICBzZXRQcm9wZXJ0eSh0aGlzLmhhbmRsZXJzLCBbYmluZE5hbWUsICdfZnVuY18nXSwgKCkgPT4ge1xuICAgICAgICAgICAgYmluZC5hdHRyaWJ1dGVzID0gYmluZC5hdHRyaWJ1dGVzLmZpbHRlcigoe2VsZW19KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoZWxlbSkpO1xuICAgICAgICAgICAgYmluZC5mb3JzID0gYmluZC5mb3JzLmZpbHRlcigoe2NvbnRhaW5lcn0pID0+IHRoaXMucm9vdC5jb250YWlucyhjb250YWluZXIpKTtcbiAgICAgICAgICAgIGJpbmQuaWZzID0gYmluZC5pZnMuZmlsdGVyKCh7ZWxlbX0pID0+IHRoaXMucm9vdC5jb250YWlucyhlbGVtKSk7XG4gICAgICAgICAgICBiaW5kLnZhbHVlcyA9IGJpbmQudmFsdWVzLmZpbHRlcigoe2VsZW19KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoZWxlbSkpO1xuXG4gICAgICAgICAgICBiaW5kLmF0dHJpYnV0ZXMuZm9yRWFjaCgoe2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfSkgPT4ge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSA/IHRoaXMuYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpIDogdGhpcy5hcHBseUJpbmRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBiaW5kLmZvcnMuZm9yRWFjaCgoe2NvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MsIGxpbmtCYXNlRGlyfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MsIGxpbmtCYXNlRGlyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBiaW5kLmlmcy5mb3JFYWNoKCh7ZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC52YWx1ZXMuZm9yRWFjaCgoe2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBleHByZXNzaW9uU3RyLCB0eXBlLCBzb3VyY2VMaW5rcykgeyAvLyB0eXBlID0gJ2lmcycgb3IgJ3ZhbHVlcycgXG4gICAgICAgIGxldCBleHByZXNzaW9uTWF0Y2ggPSBleHByZXNzaW9uU3RyLm1hdGNoKGV4cHJlc3Npb25SZWdleCk7XG4gICAgICAgIGlmIChleHByZXNzaW9uTWF0Y2gpIHtcbiAgICAgICAgICAgIGxldCBbLCAsIGV4cHJlc3Npb25OYW1lLCBwYXJhbXNTdHJdID0gZXhwcmVzc2lvbk1hdGNoO1xuICAgICAgICAgICAgZXhwcmVzc2lvbk5hbWUgPSB0cmFuc2xhdGUoZXhwcmVzc2lvbk5hbWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIGxldCBwYXJhbXMgPSBzcGxpdEJ5UGFyYW1zKHBhcmFtc1N0cik7XG4gICAgICAgICAgICBsZXQgYmluZFBhcmFtcyA9IHBhcmFtc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIocGFyYW0gPT4gcGFyYW1bMF0gIT09ICdfJylcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtc1xuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW1bMF0gPT09ICdfJyA/IHBhcmFtLnN1YnN0cigxKSA6IHBhcmFtKVxuICAgICAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gdHJhbnNsYXRlKHBhcmFtLCBzb3VyY2VMaW5rcykpO1xuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb25WYWx1ZSA9IHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zfTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoZXhwcmVzc2lvbk5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgICAgICBiaW5kUGFyYW1zXG4gICAgICAgICAgICAgICAgLmZvckVhY2gocGFyYW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEV4cHJlc3Npb25CaW5kKHBhcmFtLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGV4cHJlc3Npb25WYWx1ZTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGJpbmROYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25TdHIsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uVmFsdWUgPSB7ZWxlbSwgYmluZE5hbWV9O1xuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChiaW5kTmFtZSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVCaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xuICAgICAgICBsZXQgcGFyYW1zID0gdmFsdWUuc3BsaXQoYmluZFJlZ2V4VW5jYXB0dXJpbmcpXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hMaXN0ID0gcGFyYW0ubWF0Y2goYmluZFJlZ2V4KTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoTGlzdClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdHJpbmdWYWx1ZTogcGFyYW19O1xuICAgICAgICAgICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgbWF0Y2hdID0gbWF0Y2hMaXN0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXhTbGFzaCA/IHtzdHJpbmdWYWx1ZTogYWxsLnN1YnN0cigxKX0gOiB7c291cmNlVmFsdWU6IHRyYW5zbGF0ZShtYXRjaCwgc291cmNlTGlua3MpfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0ge2VsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtc307XG5cbiAgICAgICAgcGFyYW1zXG4gICAgICAgICAgICAuZmlsdGVyKHBhcmFtID0+IHBhcmFtLnNvdXJjZVZhbHVlKVxuICAgICAgICAgICAgLmZvckVhY2goKHtzb3VyY2VWYWx1ZTogYmluZE5hbWV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlQmluZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYXR0cmlidXRlQmluZDtcbiAgICB9XG5cbiAgICBhZGRBdHRyaWJ1dGVGdW5jdGlvbkJpbmQoZWxlbSwgYXR0cmlidXRlTmFtZSwgdmFsdWUsIHNvdXJjZUxpbmtzKSB7XG4gICAgICAgIGxldCBbYWxsLCBwcmVmaXhTbGFzaCwgZnVuY3Rpb25OYW1lLCBwYXJhbXNTdHJdID0gdmFsdWUubWF0Y2goZnVuY3Rpb25SZWdleCk7IC8vIHRvZG8gcHJlZml4U2xhc2hcbiAgICAgICAgZnVuY3Rpb25OYW1lID0gdHJhbnNsYXRlKGZ1bmN0aW9uTmFtZSwgc291cmNlTGlua3MpO1xuICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpXG4gICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZUJpbmQgPSB7ZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXN9O1xuXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChmdW5jdGlvbk5hbWUpO1xuICAgICAgICB0aGlzLmJpbmRzW2Z1bmN0aW9uTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuXG4gICAgICAgIHBhcmFtc1xuICAgICAgICAgICAgLmZvckVhY2goYmluZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XG4gICAgICAgIC8vIHRvZG8gcHJldmVudCBiaW5kaW5nIG5vbiBzb3VyY2UgdmFsdWVzXG4gICAgfVxuXG4gICAgYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSkgeyAvLyB0eXBlID0gJ2lmcycgb3IgJ3ZhbHVlcycgXG4gICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgIGxldCBiaW5kZWQgPSB0aGlzLmJpbmRzW2JpbmROYW1lXVt0eXBlXS5zb21lKG90aGVyQmluZCA9PlxuICAgICAgICAgICAgb3RoZXJCaW5kLmVsZW0gPT09IGVsZW1cbiAgICAgICAgKTtcbiAgICAgICAgIWJpbmRlZCAmJiB0aGlzLmJpbmRzW2JpbmROYW1lXVt0eXBlXS5wdXNoKGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgIC8vIHRvZG8gcHJldmVudCBiaW5kaW5nIG5vbiBzb3VyY2UgdmFsdWVzXG4gICAgfVxuXG4gICAgYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcykge1xuICAgICAgICBsZXQgbW9kaWZpZWRWYWx1ZSA9IHBhcmFtc1xuICAgICAgICAgICAgLm1hcChwYXJhbSA9PiBwYXJhbS5zb3VyY2VWYWx1ZSA/IG5vdFVuZGVmaW5lZChnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3BhcmFtLnNvdXJjZVZhbHVlXSksICcnKSA6IHBhcmFtLnN0cmluZ1ZhbHVlKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBtb2RpZmllZFZhbHVlKTtcbiAgICB9XG5cbiAgICBhcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcykge1xuICAgICAgICBsZXQgaGFuZGxlciA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbZnVuY3Rpb25OYW1lXSk7XG4gICAgICAgIGVsZW1bYXR0cmlidXRlTmFtZV0gPSBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyYW1WYWx1ZXMgPSB0aGlzLmdldFBhcmFtVmFsdWVzKHBhcmFtcywgZWxlbSwgZXZlbnQpO1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseShlbGVtLCBwYXJhbVZhbHVlcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kRm9yKGNvbnRhaW5lciwgb3V0ZXJFbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbSwgc291cmNlTGlua3MsIGxpbmtCYXNlRGlyKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbc291cmNlRnJvbV0pO1xuICAgICAgICBpZiAodmFsdWUgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHdoaWxlIChjb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPiB2YWx1ZS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50OyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgc291cmNlTGlua3Nbc291cmNlVG9dID0gYCR7c291cmNlRnJvbX0uJHtpbmRleH1gO1xuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzLmluZGV4ID0gYF9udW1iZXJzXy4ke2luZGV4fWA7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShjaGlsZEVsZW0sIHNvdXJjZUxpbmtzLCBsaW5rQmFzZURpcik7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkRWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseUJpbmRJZihlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgIGVsZW0uaGlkZGVuID0gIXZhbHVlO1xuICAgIH1cblxuICAgIGFwcGx5QmluZFZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMub2J0YWluRXhwcmVzc2lvblZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBub3RVbmRlZmluZWQodmFsdWUpO1xuICAgIH1cblxuICAgIG9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xuICAgICAgICBpZiAoIWV4cHJlc3Npb25OYW1lKVxuICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXMuc291cmNlLCBbYmluZE5hbWVdKTtcblxuICAgICAgICBsZXQgZXhwcmVzc2lvbiA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbZXhwcmVzc2lvbk5hbWVdKTtcbiAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXMsIGVsZW0pO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicgJiYgZXhwcmVzc2lvbiguLi5wYXJhbVZhbHVlcyk7XG4gICAgfVxuXG4gICAgZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCB0aGlzcywgZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5tYXAocGFyYW0gPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtUGF0aCA9IHBhcmFtLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZiAocGFyYW1QYXRoWzBdID09PSAndGhpcycpIHtcbiAgICAgICAgICAgICAgICBwYXJhbVBhdGguc2hpZnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUodGhpc3MsIHBhcmFtUGF0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ2V2ZW50Jykge1xuICAgICAgICAgICAgICAgIHBhcmFtUGF0aC5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZShldmVudCwgcGFyYW1QYXRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNvdXJjZVZhbHVlID0gZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtwYXJhbV0pO1xuICAgICAgICAgICAgaWYgKHNvdXJjZVZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVZhbHVlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHBhcmFtLnJlcGxhY2UoLycvZywgJ1wiJykpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVwbGFjZUlubGluZUJpbmRpbmdzKGVsZW0pIHtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBlbGVtLmlubmVySFRNTC5yZXBsYWNlKGFsbFNwYW5SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xuICAgICAgICBlbGVtLmlubmVySFRNTCA9IGVsZW0uaW5uZXJIVE1MLnJlcGxhY2UoYWxsU3BhbkV4cHJlc3Npb25SZWdleCwgKGFsbCwgcHJlZml4U2xhc2gsIG1hdGNoKSA9PiBwcmVmaXhTbGFzaCA/IGFsbC5zdWJzdHIoMSkgOiBgPHNwYW4gYmluZD1cIiR7bWF0Y2h9XCI+PC9zcGFuPmApO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZSkge1xuICAgICAgICByZXR1cm4gaW5kZXhUb0RvdChlbGVtLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpKTtcbiAgICB9XG59XG5cbi8vIGJpbmRzID0ge1xuLy8gICAgICdhLmIuYyc6IHtcbi8vICAgICAgICAgZm9yczogW3tjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzfV0sXG4vLyAgICAgICAgIGlmczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQzXSxcbi8vICAgICAgICAgdmFsdWVzOiBbZXhwcmVzc2lvbkJpbmQxLCBleHByZXNzaW9uQmluZDJdLFxuLy8gICAgICAgICBhdHRyaWJ1dGVzOiBbYXR0cmlidXRlQmluZDEsIGF0dHJpYnV0ZUJpbmQyXVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gc291cmNlID0ge1xuLy8gICAgIGE6IHtcbi8vICAgICAgICAgYjoge1xuLy8gICAgICAgICAgICAgYzoge31cbi8vICAgICAgICAgfVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gaGFuZGxlcnMgPSB7XG4vLyAgICAgYToge1xuLy8gICAgICAgICBfZnVuY186ICdmdW5jJyxcbi8vICAgICAgICAgYjoge1xuLy8gICAgICAgICAgICAgYzoge1xuLy8gICAgICAgICAgICAgICAgIF9mdW5jXzogJ2Z1bmMnXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGNvbXBvbmVudHMgPSB7XG4vLyAgICAgYToge1xuLy8gICAgICAgICBvdXRlckVsZW06IG91dGVyRWxlbSxcbi8vICAgICAgICAgcGFyYW1zOiBbXVxuLy8gICAgIH1cbi8vIH07XG4vL1xuLy8gYXR0cmlidXRlQmluZCA9IHtcbi8vICAgICBlbGVtOiBlbGVtMSxcbi8vICAgICBhdHRyaWJ1dGVOYW1lLFxuLy8gICAgIGZ1bmN0aW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcbi8vICAgICBwYXJhbXM6IFt7c3RyaW5nVmFsdWUgfCBzb3VyY2VWYWx1ZTogc3RyaW5nfV0sIC8vIGZvciBudWxsIGZ1bmN0aW9uTmFtZVxuLy8gICAgIHBhcmFtczogW10gLy8gZm9yIG5vdCBudWxsIGZ1bmN0aW9uTmFtZVxuLy8gfTtcbi8vXG4vLyBleHByZXNzaW9uQmluZCA9IHtcbi8vICAgICBlbGVtOiBlbGVtMSxcbi8vICAgICBleHByZXNzaW9uTmFtZSwgLy8gY2FuIGJlIG51bGxcbi8vICAgICBwYXJhbXM6IFtdLFxuLy8gICAgIGJpbmROYW1lIC8vIGNhbiBiZSBudWxsXG4vLyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChkaXIsIGRvY3VtZW50LCBkZWJ1ZykgPT4ge1xuICAgIGxldCBhcnRpZmFjdHMgPSBuZXcgSHRtbEJpbmRlcihkaXIsIGRvY3VtZW50KTtcbiAgICBpZiAoZGVidWcpXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZGVidWcsIGFydGlmYWN0cyk7XG4gICAgcmV0dXJuIGFydGlmYWN0cy5zb3VyY2U7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2h0bWxCaW5kZXInKTtcblxuLy8gdG9kb1xuLy8gYWxsb3cgYXJyYXkgYmluZGluZyBpbiBodG1sOiBgPGRpdiBiaW5kPVwieFt5XVwiPjwvZGl2PmBcbi8vIGNsZWFuIHVwIHBhY2thZ2UuanNvblxuLy8gJHN7eH0gc3ludGF4IHRvIG9ubHkgYWZmZWN0IGlubmVyIHRleHQgYW5kIG5vdCBhdHRyaWJ1dGVzXG4vLyBhbGxvdyBkZWZpbmluZyBhbmQgdXNpbmcgY29tcG9uZW50cyBpbiBhbnkgb3JkZXJcbi8vIGFsbG93IHVzaW5nIGV4cHJlc3Npb25zIGZvciBtb3JlIGJpbmRzIHRoYW4ganVzdCBpZnMgYW5kIHZhbHVlcyAoZS5nLiBhdHRyaWJ1dGVzLCBmb3JzLCBhcywgdXNlKVxuLy8gc3VwcG9ydCAkZSBuZXN0ZWQgaW5zaWRlICRzXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgc291cmNlLmEgPSBzb3VyY2UuYiBkb2Vzbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXG4vLyBpbnZlc3RpZ2F0ZSB3aHkgYmluZC1mb3IgaW5kZXhWYXJzIGRvbid0IHByb3BvZ2F0ZSBjaGFuZ2VzXG4vLyBpbnZlc3RpZ2F0ZSBob3cgdG8gc2V0IHNldHRlcnMgb24gbm9uLXNvdXJjZSBvYmplY3QgYXNzaWdubWVudHNcbi8vIHJvdXRpbmcgb3Igc3dhcHBpbmcgc3RhdGVzXG4iLCJsZXQgZ2V0UHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xuICAgIGxldCBmaWVsZHMgPSBnZXRGaWVsZHMocGF0aHMpO1xuICAgIGxldCBsYXN0RmllbGQgPSBmaWVsZHMucG9wKCk7XG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSB8fCB7fSk7XG4gICAgcmV0dXJuIFtvYmosIGxhc3RGaWVsZF07XG59O1xuXG5sZXQgZ2V0VmFsdWUgPSAob2JqLCBwYXRocykgPT4ge1xuICAgIGxldCBwcm9wZXJ0eSA9IGdldFByb3BlcnR5KG9iaiwgcGF0aHMpO1xuICAgIHJldHVybiBwcm9wZXJ0eVsxXSA9PT0gdW5kZWZpbmVkID8gcHJvcGVydHlbMF0gOiBwcm9wZXJ0eVswXVtwcm9wZXJ0eVsxXV07XG59O1xuXG5sZXQgY3JlYXRlUHJvcGVydHkgPSAob2JqLCBwYXRocykgPT4ge1xuICAgIGxldCBmaWVsZHMgPSBnZXRGaWVsZHMocGF0aHMpO1xuICAgIGxldCBsYXN0RmllbGQgPSBmaWVsZHMucG9wKCk7XG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4gb2JqID0gb2JqW2ZpZWxkXSA9IG9ialtmaWVsZF0gfHwge30pO1xuICAgIHJldHVybiBbb2JqLCBsYXN0RmllbGRdO1xufTtcblxubGV0IHNldFByb3BlcnR5ID0gKG9iaiwgcGF0aHMsIHZhbHVlKSA9PiB7XG4gICAgbGV0IHByb3BlcnR5ID0gY3JlYXRlUHJvcGVydHkob2JqLCBwYXRocyk7XG4gICAgcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dID0gdmFsdWU7XG59O1xuXG5sZXQgY2xvbmUgPSBvcmlnaW5hbCA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsKTtcbn07XG5cbmxldCB0cmFuc2xhdGUgPSAobmFtZSwgbGlua3MpID0+IHtcbiAgICBsZXQgb2NjdXJyZWQgPSBbXTtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKFtuYW1lXSk7XG4gICAgd2hpbGUgKGZpZWxkc1swXSBpbiBsaW5rcykge1xuICAgICAgICBvY2N1cnJlZC5wdXNoKGZpZWxkc1swXSk7XG4gICAgICAgIGZpZWxkc1swXSA9IGxpbmtzW2ZpZWxkc1swXV07XG4gICAgICAgIGlmIChvY2N1cnJlZC5pbmNsdWRlcyhmaWVsZHNbMF0pKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGZpZWxkcyA9IGdldEZpZWxkcyhmaWVsZHMpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzLnJlZHVjZSgoYSwgYikgPT4gYCR7YX0uJHtifWApO1xufTtcblxubGV0IGdldEZpZWxkcyA9IHBhdGhzID0+XG4gICAgcGF0aHNcbiAgICAgICAgLm1hcChwYXRoID0+IHBhdGguc3BsaXQoJy4nKSlcbiAgICAgICAgLnJlZHVjZSgoYWdncmVnYXRlLCBpdGVtKSA9PiBhZ2dyZWdhdGUuY29uY2F0KGl0ZW0pLCBbXSk7XG5cbmxldCBpbmRleFRvRG90ID0gZmllbGQgPT4gZmllbGQgJiYgZmllbGQucmVwbGFjZSgvXFxbKFxcdyspXFxdL2csIChfLCBtYXRjaCkgPT4gYC4ke21hdGNofWApO1xuXG5sZXQgbm90VW5kZWZpbmVkID0gKHZhbHVlLCB1bmRlZmluZWRWYWx1ZSA9IG51bGwpID0+XG4gICAgdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogdW5kZWZpbmVkVmFsdWU7XG5cbm1vZHVsZS5leHBvcnRzID0ge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfTtcbiIsImNsYXNzIFBhcmFtU3BsaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHN0cmluZykge1xuICAgICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICAgICAgdGhpcy5pbmRleCA9IC0xO1xuICAgICAgICB0aGlzLnN0YXJ0SW5kZXggPSAwO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IFtdO1xuICAgIH1cblxuICAgIHNwbGl0QnlQYXJhbXMoKSB7XG4gICAgICAgIGxldCBkZXB0aCA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dEluZGV4KCkgJiYgKCF0aGlzLmF0UXVvdGUoKSB8fCB0aGlzLnNraXBRdW90ZSgpKSkge1xuICAgICAgICAgICAgbGV0IGNoYXIgPSB0aGlzLnN0cmluZ1t0aGlzLmluZGV4XTtcbiAgICAgICAgICAgIGlmIChjaGFyID09PSAnWycpXG4gICAgICAgICAgICAgICAgZGVwdGgrKztcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICddJylcbiAgICAgICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJywnICYmICFkZXB0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGFyYW0oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0SW5kZXggPSB0aGlzLmluZGV4ICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkUGFyYW0oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1zO1xuICAgIH1cblxuICAgIGZpbmRJbmRleChyZWdleCwgc3RhcnQpIHsgLy8gcmV0dXJucyAtMSBvciBpbmRleCBvZiBtYXRjaFxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnN0cmluZy5zdWJzdHJpbmcoc3RhcnQpLnNlYXJjaChyZWdleCk7XG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwID8gaW5kZXggKyBzdGFydCA6IC0xO1xuICAgIH07XG5cbiAgICBuZXh0SW5kZXgoKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleCgvWywnXCJbXFxdXS8sIHRoaXMuaW5kZXggKyAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggIT09IC0xO1xuICAgIH1cblxuICAgIGF0UXVvdGUoKSB7XG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgIHJldHVybiBjaGFyID09PSAnXCInIHx8IGNoYXIgPT09IFwiJ1wiO1xuICAgIH1cblxuICAgIHNraXBRdW90ZSgpIHtcbiAgICAgICAgbGV0IGNoYXIgPSB0aGlzLnN0cmluZ1t0aGlzLmluZGV4XTtcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuZmluZEluZGV4KGNoYXIgPT09ICdcIicgPyAvW15cXFxcXVwiLyA6IC9bXlxcXFxdJy8sIHRoaXMuaW5kZXggKyAxKSArIDE7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4O1xuICAgIH1cblxuICAgIGFkZFBhcmFtKCkge1xuICAgICAgICB0aGlzLnBhcmFtcy5wdXNoKHRoaXMuc3RyaW5nLnN1YnN0cmluZyh0aGlzLnN0YXJ0SW5kZXgsIHRoaXMuaW5kZXggPiAwID8gdGhpcy5pbmRleCA6IHRoaXMuc3RyaW5nLmxlbmd0aCkudHJpbSgpKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nID0+IG5ldyBQYXJhbVNwbGl0dGVyKHN0cmluZykuc3BsaXRCeVBhcmFtcygpO1xuIiwiLy8gKFtcXHcuW1xcXV0rKVxuXG5sZXQgc3BhblJlZ2V4ID0gLyhcXFxcKT9cXCRzeyhbXFx3LltcXF1dKyl9LztcbmxldCBhbGxTcGFuUmVnZXggPSBuZXcgUmVnRXhwKHNwYW5SZWdleCwgJ2cnKTtcbmxldCBzcGFuRXhwcmVzc2lvblJlZ2V4ID0gLyhcXFxcKT9cXCRzeyhbXFx3LltcXF0hPT48fCZdK1xcKC4qXFwpKX0vO1xubGV0IGFsbFNwYW5FeHByZXNzaW9uUmVnZXggPSBuZXcgUmVnRXhwKHNwYW5FeHByZXNzaW9uUmVnZXgsICdnJyk7XG5cbmxldCBiaW5kUmVnZXggPSAvKFxcXFwpP1xcJHsoW1xcdy5bXFxdXSspfS87XG5sZXQgYmluZFJlZ2V4VW5jYXB0dXJpbmcgPSAvKCg/OlxcXFwpP1xcJHsoPzpbXFx3LltcXF1dKyl9KS87XG5cbmxldCBmdW5jdGlvblJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKVxcKCguKilcXCl9LztcblxubGV0IGV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/KFtcXHcuW1xcXSE9Pjx8Jl0rKVxcKCguKilcXCkvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHthbGxTcGFuUmVnZXgsIGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIGJpbmRSZWdleCwgYmluZFJlZ2V4VW5jYXB0dXJpbmcsIGZ1bmN0aW9uUmVnZXgsIGV4cHJlc3Npb25SZWdleH07XG4iLCJsZXQgY3JlYXRlU291cmNlID0gKCkgPT4ge1xuICAgIGxldCBoYW5kbGVycyA9IHt9O1xuICAgIGxldCBvcmlnaW4gPSB7fTtcbiAgICBsZXQgc291cmNlID0gY3JlYXRlUHJveHkob3JpZ2luLCBoYW5kbGVycyk7XG4gICAgc2V0RGVmYXVsdFNvdXJjZShvcmlnaW4pO1xuICAgIHJldHVybiB7b3JpZ2luLCBzb3VyY2UsIGhhbmRsZXJzfTtcbn07XG5cbmxldCBpZ25vcmUgPSBbXTtcblxubGV0IGlzQmluZElnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBvYmouX19iaW5kSWdub3JlX18gJiYgb2JqLl9fYmluZElnbm9yZV9fLmluY2x1ZGVzKHByb3ApO1xuXG4vLyB0b2RvIG1ha2UgX19iaW5kQXZvaWRDeWNsZXNfXyBpbmhlcml0ZWQgYW5kIG1heWJlIGF2b2lkIHBlciBiaW5kaW5nIGluc3RlYWQgcGVyIGNoYW5nZVxubGV0IGlzSWdub3JlZCA9IChvYmosIHByb3ApID0+IGlzQmluZElnbm9yZWQob2JqLCBwcm9wKSB8fCAob2JqLl9fYmluZEF2b2lkQ3ljbGVzX18gJiYgaWdub3JlLnNvbWUoaWdub3JlID0+IGlnbm9yZS5vYmogPT09IG9iaiAmJiBpZ25vcmUucHJvcCA9PT0gcHJvcCkpO1xuXG5sZXQgaGFuZGxlU2V0ID0gKG9iaiwgcHJvcCwgaGFuZGxlcnMsIGFjY3VtdWxhdGVkSGFuZGxlcnMpID0+IHtcbiAgICBpZ25vcmUucHVzaCh7b2JqLCBwcm9wfSk7XG4gICAgYWNjdW11bGF0ZWRIYW5kbGVycy5mb3JFYWNoKGRvSGFuZGxlcik7XG4gICAgaGFuZGxlcnMgJiYgcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcnMpO1xuICAgIGlnbm9yZS5wb3AoKTtcbn07XG5cbmxldCBjcmVhdGVQcm94eSA9IChvYmosIGhhbmRsZXJzID0ge30sIGFjY3VtdWxhdGVkSGFuZGxlcnMgPSBbXSkgPT4gbmV3IFByb3h5KG9iaiwge1xuICAgIGdldDogKHRhcmdldCwgcHJvcCkgPT4ge1xuICAgICAgICBsZXQgZ290ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wKTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBnb3QgPT09ICdvYmplY3QnICYmIGdvdCAmJiAhaXNCaW5kSWdub3JlZChvYmosIHByb3ApID8gY3JlYXRlUHJveHkoZ290LCBoYW5kbGVyc1twcm9wXSwgYWNjdW11bGF0ZWRIYW5kbGVycy5jb25jYXQoaGFuZGxlcnMpKSA6IGdvdDtcbiAgICB9LFxuICAgIHNldDogKHRhcmdldCwgcHJvcCwgdmFsdWUpID0+IHtcbiAgICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSk7XG4gICAgICAgICFpc0lnbm9yZWQob2JqLCBwcm9wKSAmJiBoYW5kbGVTZXQob2JqLCBwcm9wLCBoYW5kbGVyc1twcm9wXSwgYWNjdW11bGF0ZWRIYW5kbGVycy5jb25jYXQoaGFuZGxlcnMpKTsgLy8gdG9kbyB3cmFwIGhhbmRsZXJzIGFuZCBhY2N1bXVsYXRlZEhhbmRsZXJzIGluIGNsYXNzIHdpdGggcG9wUHJvcCBtZXRob2RcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbmxldCBwcm9wb2dhdGVIYW5kbGVyRG93biA9IGhhbmRsZXJzID0+IHtcbiAgICBkb0hhbmRsZXIoaGFuZGxlcnMpO1xuICAgIE9iamVjdC5lbnRyaWVzKGhhbmRsZXJzKVxuICAgICAgICAuZmlsdGVyKChba2V5XSkgPT4ga2V5ICE9PSAnX2Z1bmNfJylcbiAgICAgICAgLmZvckVhY2goKFssIGhhbmRsZXJdKSA9PiBwcm9wb2dhdGVIYW5kbGVyRG93bihoYW5kbGVyKSk7XG59O1xuXG5sZXQgZG9IYW5kbGVyID0gaGFuZGxlciA9PiB0eXBlb2YgaGFuZGxlci5fZnVuY18gPT09ICdmdW5jdGlvbicgJiYgaGFuZGxlci5fZnVuY18oKTtcblxubGV0IHNldERlZmF1bHRTb3VyY2UgPSBzb3VyY2UgPT4ge1xuICAgIHNvdXJjZS5fbnVtYmVyc18gPSBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgZ2V0OiAoXywgcHJvcCkgPT4gcGFyc2VJbnQocHJvcCksXG4gICAgICAgIHNldDogKCkgPT4gZmFsc2VcbiAgICB9KTtcbiAgICBzb3VyY2Uubm90ID0gYSA9PiAhYTtcbiAgICBzb3VyY2VbJyEnXSA9IGEgPT4gIWE7XG4gICAgc291cmNlLmVxID0gKGEsIGIpID0+IGEgPT09IGI7XG4gICAgc291cmNlLmVxdWFsID0gKGEsIGIpID0+IGEgPT09IGI7XG4gICAgc291cmNlWyc9J10gPSAoYSwgYikgPT4gYSA9PT0gYjtcbiAgICBzb3VyY2UubkVxID0gKGEsIGIpID0+IGEgIT09IGI7XG4gICAgc291cmNlLm5vdEVxdWFsID0gKGEsIGIpID0+IGEgIT09IGI7XG4gICAgc291cmNlWychPSddID0gKGEsIGIpID0+IGEgIT09IGI7XG4gICAgc291cmNlLmdyZWF0ZXIgPSAoYSwgYikgPT4gYSA+IGI7XG4gICAgc291cmNlWyc+J10gPSAoYSwgYikgPT4gYSA+IGI7XG4gICAgc291cmNlLmxlc3MgPSAoYSwgYikgPT4gYSA8IGI7XG4gICAgc291cmNlWyc8J10gPSAoYSwgYikgPT4gYSA8IGI7XG4gICAgc291cmNlLmdyZWF0ZXJFcSA9IChhLCBiKSA9PiBhID49IGI7XG4gICAgc291cmNlWyc+PSddID0gKGEsIGIpID0+IGEgPj0gYjtcbiAgICBzb3VyY2UubGVzc0VxID0gKGEsIGIpID0+IGEgPD0gYjtcbiAgICBzb3VyY2VbJzw9J10gPSAoYSwgYikgPT4gYSA8PSBiO1xuICAgIHNvdXJjZS5vciA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xuICAgIHNvdXJjZVsnfCddID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XG4gICAgc291cmNlWyd8fCddID0gKC4uLmFzKSA9PiBhcy5zb21lKGEgPT4gYSk7XG4gICAgc291cmNlLmFuZCA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcbiAgICBzb3VyY2VbJyYnXSA9ICguLi5hcykgPT4gYXMuZXZlcnkoYSA9PiBhKTtcbiAgICBzb3VyY2VbJyYmJ10gPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGVTb3VyY2V9O1xuIiwibGV0IHNwbGl0QnlXb3JkID0gKHN0cmluZywgd29yZCkgPT5cbiAgICBzdHJpbmcuc3BsaXQobmV3IFJlZ0V4cChgXFxcXHMrJHt3b3JkfVxcXFxzK2ApKTtcblxubGV0IHNwbGl0QnlDb21tYSA9IHN0cmluZyA9PlxuICAgIHN0cmluZy5zcGxpdCgvXFxzKixcXHMqLyk7XG5cbmxldCBzcGxpdEJ5U3BhY2UgPSBzdHJpbmcgPT5cbiAgICBzdHJpbmcuc3BsaXQoL1xccysvKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7c3BsaXRCeVdvcmQsIHNwbGl0QnlDb21tYSwgc3BsaXRCeVNwYWNlfTtcbiJdfQ==
