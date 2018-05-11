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

}).call(this,"/example")

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2NvbnRyb2xsZXIuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJzcmMvZmlsZVJlYWRlci5qcyIsInNyYy9odG1sQmluZGVyLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL29ialNjYWZvbGRpbmcuanMiLCJzcmMvcGFyYW1TcGxpdHRlci5qcyIsInNyYy9yZWdleC5qcyIsInNyYy9zb3VyY2UuanMiLCJzcmMvc3RyaW5nU3BsaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3RkE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHNvdXJjZSA9IHJlcXVpcmUoJ2JiLWJldHRlci1iaW5kaW5nJykoX19kaXJuYW1lLCBkb2N1bWVudCwgd2luZG93KTtcblxuLy8gZ3JlZXRpbmdcbnNvdXJjZS5sYXJnZUZvbnQgPSA2MDtcbnNvdXJjZS5mYXZvcml0ZUNvbG9yID0gJ0RFRVBwaW5rJztcbnNvdXJjZS5ncmVldGluZyA9ICdJIGhhdGUgeW91JztcbnNvdXJjZS5uYW1lID0gJ1dvcmxkJztcbnNvdXJjZS5leGNsYW1hdGlvbiA9ICco4pWvwrDilqHCsO+8ieKVr++4tSDilLvilIHilLsnO1xuc291cmNlLmNoYW5nZUNvbG9yID0gaW5wdXQgPT4ge1xuICAgIHNvdXJjZS5mYXZvcml0ZUNvbG9yID0gaW5wdXQudmFsdWU7XG59O1xuXG4vLyBhbmltYXRpb25cbmxldCBhbmltYXRpb25zID0gW1xuICAgICdodHRwOi8vd3d3LnFxcHIuY29tL2FzY2lpL2ltZy9hc2NpaS0xMDQzLmdpZicsXG4gICAgJ2h0dHBzOi8vbWVkaWEwLmdpcGh5LmNvbS9tZWRpYS8xMkVrSkNicGEzaEdLYy9naXBoeS5naWYnLFxuICAgICdodHRwOi8vd3d3LnFxcHIuY29tL2FzY2lpL2ltZy9hc2NpaS0xMDA2LmdpZiddO1xubGV0IGFuaW1hdGlvbkluZGV4ID0gLTE7XG5zb3VyY2UuY2hhbmdlQW5pbWF0aW9uID0gKCkgPT4ge1xuICAgIGFuaW1hdGlvbkluZGV4ID0gKGFuaW1hdGlvbkluZGV4ICsgMSkgJSBhbmltYXRpb25zLmxlbmd0aDtcbiAgICBzb3VyY2UuYW5pbWF0aW9uID0gYW5pbWF0aW9uc1thbmltYXRpb25JbmRleF07XG59O1xuc291cmNlLmNoYW5nZUFuaW1hdGlvbigpO1xuXG4vLyBqb2tlc1xuc291cmNlLnNldEpva2VWaXNpYmlsaXR5ID0gY2hlY2tib3ggPT4ge1xuICAgIHNvdXJjZS5qb2tlVmlzaWJpbGl0eSA9IGNoZWNrYm94LmNoZWNrZWQ7XG59O1xuc291cmNlLmpva2VzID0gW1xuICAgIHtcbiAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJMZWZ0IGluc2lkZSBtYWluIHRpcmUgYWxtb3N0IG5lZWRzIHJlcGxhY2VtZW50LlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJBbG1vc3QgcmVwbGFjZWQgbGVmdCBpbnNpZGUgbWFpbiB0aXJlLlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIlRlc3QgZmxpZ2h0IE9LLCBleGNlcHQgYXV0b2xhbmQgdmVyeSByb3VnaC5cIicsXG4gICAgICAgICAgICAnU29sdXRpb246IFwiQXV0b2xhbmQgbm90IGluc3RhbGxlZCBvbiB0aGlzIGFpcmNyYWZ0LlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW0gIzE6ICBcIiMyIFByb3BlbGxlciBzZWVwaW5nIHByb3AgZmx1aWQuXCInLFxuICAgICAgICAgICAgJ1NvbHV0aW9uICMxOiBcIiMyIFByb3BlbGxlciBzZWVwYWdlIG5vcm1hbC5cIicsXG4gICAgICAgICAgICAnUHJvYmxlbSAjMjogIFwiIzEsICMzLCBhbmQgIzQgcHJvcGVsbGVycyBsYWNrIG5vcm1hbCBzZWVwYWdlLlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICAgIFwiVGhlIGF1dG9waWxvdCBkb2VzblxcJ3QuXCInLFxuICAgICAgICAgICAgJ1NpZ25lZCBvZmY6IFwiSVQgRE9FUyBOT1cuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiU29tZXRoaW5nIGxvb3NlIGluIGNvY2twaXQuXCInLFxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIlNvbWV0aGluZyB0aWdodGVuZWQgaW4gY29ja3BpdC5cIidcbiAgICAgICAgXVxuICAgIH0sIHtcbiAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJFdmlkZW5jZSBvZiBoeWRyYXVsaWMgbGVhayBvbiByaWdodCBtYWluIGxhbmRpbmcgZ2Vhci5cIicsXG4gICAgICAgICAgICAnU29sdXRpb246IFwiRXZpZGVuY2UgcmVtb3ZlZC5cIidcbiAgICAgICAgXVxuICAgIH0sIHtcbiAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJETUUgdm9sdW1lIHVuYmVsaWV2YWJseSBsb3VkLlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJWb2x1bWUgc2V0IHRvIG1vcmUgYmVsaWV2YWJsZSBsZXZlbC5cIidcbiAgICAgICAgXVxuICAgIH0sIHtcbiAgICAgICAgbGluZXM6IFtcbiAgICAgICAgICAgICdQcm9ibGVtOiAgXCJEZWFkIGJ1Z3Mgb24gd2luZHNoaWVsZC5cIicsXG4gICAgICAgICAgICAnU29sdXRpb246IFwiTGl2ZSBidWdzIG9uIG9yZGVyLlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkF1dG9waWxvdCBpbiBhbHRpdHVkZSBob2xkIG1vZGUgcHJvZHVjZXMgYSAyMDAgZnBtIGRlc2NlbnQuXCInLFxuICAgICAgICAgICAgJ1NvbHV0aW9uOiBcIkNhbm5vdCByZXByb2R1Y2UgcHJvYmxlbSBvbiBncm91bmQuXCInXG4gICAgICAgIF1cbiAgICB9LCB7XG4gICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAnUHJvYmxlbTogIFwiSUZGIGlub3BlcmF0aXZlLlwiJyxcbiAgICAgICAgICAgICdTb2x1dGlvbjogXCJJRkYgYWx3YXlzIGlub3BlcmF0aXZlIGluIE9GRiBtb2RlLlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIkZyaWN0aW9uIGxvY2tzIGNhdXNlIHRocm90dGxlIGxldmVycyB0byBzdGljay5cIicsXG4gICAgICAgICAgICAnU29sdXRpb246IFwiVGhhdFxcJ3Mgd2hhdCB0aGV5XFwncmUgdGhlcmUgZm9yLlwiJ1xuICAgICAgICBdXG4gICAgfSwge1xuICAgICAgICBsaW5lczogW1xuICAgICAgICAgICAgJ1Byb2JsZW06ICBcIk51bWJlciB0aHJlZSBlbmdpbmUgbWlzc2luZy5cIicsXG4gICAgICAgICAgICAnU29sdXRpb246IFwiRW5naW5lIGZvdW5kIG9uIHJpZ2h0IHdpbmcgYWZ0ZXIgYnJpZWYgc2VhcmNoLlwiJ1xuICAgICAgICBdXG4gICAgfSxcbl07XG5zb3VyY2Uuam9rZXNTb3VyY2UgPSAnaHR0cHM6Ly93d3cubmV0ZnVubnkuY29tL3JoZi9qb2tlcy85Ny9KdW4vdXNhZi5odG1sJztcbiIsIiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGRpciwgcmVhZFBhdGgpID0+IHtcbiAgICBsZXQgZnVsbFBhdGggPSBwYXRoLnJlc29sdmUoZGlyLCByZWFkUGF0aCk7XG4gICAgbGV0IHJlYWREaXIgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpO1xuICAgIGxldCByZWFkID0gZnMucmVhZEZpbGVTeW5jKGZ1bGxQYXRoLCAndXRmOCcpO1xuICAgIHJldHVybiB7cmVhZERpciwgcmVhZH07XG59O1xuIiwiY29uc3Qge2dldFZhbHVlLCBzZXRQcm9wZXJ0eSwgY2xvbmUsIHRyYW5zbGF0ZSwgaW5kZXhUb0RvdCwgbm90VW5kZWZpbmVkfSA9IHJlcXVpcmUoJy4vb2JqU2NhZm9sZGluZycpO1xuY29uc3Qge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX0gPSByZXF1aXJlKCcuL3N0cmluZ1NwbGl0dGVyJyk7XG5jb25zdCBzcGxpdEJ5UGFyYW1zID0gcmVxdWlyZSgnLi9wYXJhbVNwbGl0dGVyJyk7XG5jb25zdCB7Y3JlYXRlU291cmNlfSA9IHJlcXVpcmUoJy4vc291cmNlJyk7XG5jb25zdCBmaWxlUmVhZGVyID0gcmVxdWlyZSgnLi9maWxlUmVhZGVyJyk7XG5jb25zdCB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9ID0gcmVxdWlyZSgnLi9yZWdleCcpO1xuXG5jbGFzcyBIdG1sQmluZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGRpciwgcm9vdCkge1xuICAgICAgICB0aGlzLmJpbmRzID0ge307XG4gICAgICAgIGxldCB7b3JpZ2luLCBzb3VyY2UsIGhhbmRsZXJzfSA9IGNyZWF0ZVNvdXJjZSgpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IGhhbmRsZXJzO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7fTtcbiAgICAgICAgdGhpcy5yb290ID0gcm9vdC5jaGlsZHJlblswXTtcbiAgICAgICAgSHRtbEJpbmRlci5yZXBsYWNlSW5saW5lQmluZGluZ3ModGhpcy5yb290KTtcbiAgICAgICAgdGhpcy5iaW5kRWxlbShyb290LCB7fSwgZGlyKTtcbiAgICAgICAgcmV0dXJuIHtvcmlnaW4sIHNvdXJjZSwgYmluZHM6IHRoaXMuYmluZHMsIGhhbmRsZXJzLCBjb21wb25lbnRzOiB0aGlzLmNvbXBvbmVudHN9O1xuICAgIH1cblxuICAgIGJpbmRFbGVtKGVsZW0sIHNvdXJjZUxpbmtzLCBsaW5rQmFzZURpcikge1xuICAgICAgICBsZXQgc2tpcCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBlbGVtLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQge25hbWU6IGF0dHJpYnV0ZU5hbWUsIHZhbHVlfSA9IGF0dHJpYnV0ZXNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubWF0Y2goYmluZFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICBsZXQge3BhcmFtc30gPSBhdHRyaWJ1dGVCaW5kO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5tYXRjaChmdW5jdGlvblJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHRoaXMuYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB7ZnVuY3Rpb25OYW1lLCBwYXJhbXN9ID0gYXR0cmlidXRlQmluZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGdW5jdGlvbkF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmluZEVsZW0gPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZWxlbScpO1xuICAgICAgICAgICAgbGV0IGJpbmRDb21wb25lbnRMaW5rID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWNvbXBvbmVudC1saW5rJyk7XG4gICAgICAgICAgICBsZXQgYmluZENvbXBvbmVudCA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1jb21wb25lbnQnKTtcbiAgICAgICAgICAgIGxldCBiaW5kVXNlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLXVzZScpO1xuICAgICAgICAgICAgbGV0IGJpbmRBcyA9IEh0bWxCaW5kZXIuZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCAnYmluZC1hcycpO1xuICAgICAgICAgICAgbGV0IGJpbmRGb3IgPSBIdG1sQmluZGVyLmdldEJpbmRBdHRyaWJ1dGUoZWxlbSwgJ2JpbmQtZm9yJyk7XG4gICAgICAgICAgICBsZXQgYmluZElmID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kLWlmJyk7XG4gICAgICAgICAgICBsZXQgYmluZFZhbHVlID0gSHRtbEJpbmRlci5nZXRCaW5kQXR0cmlidXRlKGVsZW0sICdiaW5kJyk7XG5cbiAgICAgICAgICAgIGlmIChiaW5kRWxlbSkge1xuICAgICAgICAgICAgICAgIHNldFByb3BlcnR5KHRoaXMuc291cmNlLCBbYmluZEVsZW1dLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5fX2JpbmRJZ25vcmVfXyA9IHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fIHx8IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLl9fYmluZElnbm9yZV9fLnB1c2goYmluZEVsZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYmluZENvbXBvbmVudExpbmspIHtcbiAgICAgICAgICAgICAgICBsZXQge3JlYWREaXIsIHJlYWR9ID0gZmlsZVJlYWRlcihsaW5rQmFzZURpciwgYmluZENvbXBvbmVudExpbmspO1xuICAgICAgICAgICAgICAgIGxldCBsb2FkZWRIdG1sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbG9hZGVkSHRtbC5pbm5lckhUTUwgPSByZWFkO1xuICAgICAgICAgICAgICAgIEh0bWxCaW5kZXIucmVwbGFjZUlubGluZUJpbmRpbmdzKGxvYWRlZEh0bWwpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVwbGFjZVdpdGgobG9hZGVkSHRtbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRWxlbShsb2FkZWRIdG1sLCBzb3VyY2VMaW5rcywgcmVhZERpcik7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBbY29tcG9uZW50TmFtZSwgcGFyYW1zR3JvdXBdID0gc3BsaXRCeVdvcmQoYmluZENvbXBvbmVudCwgJ3dpdGgnKTtcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVNwYWNlKHBhcmFtc0dyb3VwKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdiaW5kLWNvbXBvbmVudCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHtvdXRlckVsZW06IGVsZW0sIHBhcmFtc307XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluZEZvcikge1xuICAgICAgICAgICAgICAgIHNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBbc291cmNlVG8sIGJpbmROYW1lXSA9IHNwbGl0QnlXb3JkKGJpbmRGb3IsICdpbicpO1xuICAgICAgICAgICAgICAgIGJpbmROYW1lID0gdHJhbnNsYXRlKGJpbmROYW1lLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvci1wYXJlbnQnKTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlcGxhY2VXaXRoKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2JpbmQtZm9yJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCaW5kKGJpbmROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXS5mb3JzLnB1c2goe2NvbnRhaW5lciwgb3V0ZXJFbGVtOiBlbGVtLCBzb3VyY2VUbywgc291cmNlRnJvbTogYmluZE5hbWUsIHNvdXJjZUxpbmtzfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUJpbmRGb3IoY29udGFpbmVyLCBlbGVtLCBzb3VyY2VUbywgYmluZE5hbWUsIHNvdXJjZUxpbmtzLCBsaW5rQmFzZURpcik7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRVc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtjb21wb25lbnROYW1lLCBwYXJhbXNHcm91cF0gPSBzcGxpdEJ5V29yZChiaW5kVXNlLCAnd2l0aCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1zSW5wdXQgPSBzcGxpdEJ5U3BhY2UocGFyYW1zR3JvdXApO1xuICAgICAgICAgICAgICAgICAgICBsZXQge291dGVyRWxlbSwgcGFyYW1zfSA9IHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBvbmVudEVsZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKG91dGVyRWxlbSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoY29tcG9uZW50RWxlbSk7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMuZm9yRWFjaCgodG8sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VMaW5rc1t0b10gPSB0cmFuc2xhdGUocGFyYW1zSW5wdXRbaW5kZXhdLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaW5kQXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3MgPSBjbG9uZShzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHNwbGl0QnlDb21tYShiaW5kQXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGFzID0+IHNwbGl0QnlXb3JkKGFzLCAnYXMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChbZnJvbSwgdG9dKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlTGlua3NbdG9dID0gdHJhbnNsYXRlKGZyb20sIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaW5kSWYpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kSWYsICdpZnMnLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiaW5kVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHtleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0gPSB0aGlzLmV4dHJhY3RFeHByZXNzaW9uQmluZChlbGVtLCBiaW5kVmFsdWUsICd2YWx1ZXMnLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2tpcClcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBlbGVtLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgIHRoaXMuYmluZEVsZW0oZWxlbS5jaGlsZHJlbltpXSwgc291cmNlTGlua3MsIGxpbmtCYXNlRGlyKTtcbiAgICB9XG5cbiAgICBjcmVhdGVCaW5kKGJpbmROYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmJpbmRzW2JpbmROYW1lXSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsZXQgYmluZCA9IHtpZnM6IFtdLCBmb3JzOiBbXSwgdmFsdWVzOiBbXSwgYXR0cmlidXRlczogW119O1xuICAgICAgICB0aGlzLmJpbmRzW2JpbmROYW1lXSA9IGJpbmQ7XG5cbiAgICAgICAgc2V0UHJvcGVydHkodGhpcy5oYW5kbGVycywgW2JpbmROYW1lLCAnX2Z1bmNfJ10sICgpID0+IHtcbiAgICAgICAgICAgIGJpbmQuYXR0cmlidXRlcyA9IGJpbmQuYXR0cmlidXRlcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcbiAgICAgICAgICAgIGJpbmQuZm9ycyA9IGJpbmQuZm9ycy5maWx0ZXIoKHtjb250YWluZXJ9KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoY29udGFpbmVyKSk7XG4gICAgICAgICAgICBiaW5kLmlmcyA9IGJpbmQuaWZzLmZpbHRlcigoe2VsZW19KSA9PiB0aGlzLnJvb3QuY29udGFpbnMoZWxlbSkpO1xuICAgICAgICAgICAgYmluZC52YWx1ZXMgPSBiaW5kLnZhbHVlcy5maWx0ZXIoKHtlbGVtfSkgPT4gdGhpcy5yb290LmNvbnRhaW5zKGVsZW0pKTtcblxuICAgICAgICAgICAgYmluZC5hdHRyaWJ1dGVzLmZvckVhY2goKHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBmdW5jdGlvbk5hbWUsIHBhcmFtc30pID0+IHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUgPyB0aGlzLmFwcGx5QmluZEZ1bmN0aW9uQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zKSA6IHRoaXMuYXBwbHlCaW5kQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC5mb3JzLmZvckVhY2goKHtjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzLCBsaW5rQmFzZURpcn0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzLCBsaW5rQmFzZURpcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmluZC5pZnMuZm9yRWFjaCgoe2VsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpbmQudmFsdWVzLmZvckVhY2goKHtlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZX0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5QmluZFZhbHVlKGVsZW0sIGV4cHJlc3Npb25OYW1lLCBwYXJhbXMsIGJpbmROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBleHRyYWN0RXhwcmVzc2lvbkJpbmQoZWxlbSwgZXhwcmVzc2lvblN0ciwgdHlwZSwgc291cmNlTGlua3MpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnIFxuICAgICAgICBsZXQgZXhwcmVzc2lvbk1hdGNoID0gZXhwcmVzc2lvblN0ci5tYXRjaChleHByZXNzaW9uUmVnZXgpO1xuICAgICAgICBpZiAoZXhwcmVzc2lvbk1hdGNoKSB7XG4gICAgICAgICAgICBsZXQgWywgLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zU3RyXSA9IGV4cHJlc3Npb25NYXRjaDtcbiAgICAgICAgICAgIGV4cHJlc3Npb25OYW1lID0gdHJhbnNsYXRlKGV4cHJlc3Npb25OYW1lLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gc3BsaXRCeVBhcmFtcyhwYXJhbXNTdHIpO1xuICAgICAgICAgICAgbGV0IGJpbmRQYXJhbXMgPSBwYXJhbXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHBhcmFtID0+IHBhcmFtWzBdICE9PSAnXycpXG4gICAgICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXNcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHBhcmFtWzBdID09PSAnXycgPyBwYXJhbS5zdWJzdHIoMSkgOiBwYXJhbSlcbiAgICAgICAgICAgICAgICAubWFwKHBhcmFtID0+IHRyYW5zbGF0ZShwYXJhbSwgc291cmNlTGlua3MpKTtcbiAgICAgICAgICAgIGxldCBleHByZXNzaW9uVmFsdWUgPSB7ZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtc307XG4gICAgICAgICAgICB0aGlzLmFkZEV4cHJlc3Npb25CaW5kKGV4cHJlc3Npb25OYW1lLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAgICAgYmluZFBhcmFtc1xuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uQmluZChwYXJhbSwgZWxlbSwgdHlwZSwgZXhwcmVzc2lvblZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uVmFsdWU7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBiaW5kTmFtZSA9IHRyYW5zbGF0ZShleHByZXNzaW9uU3RyLCBzb3VyY2VMaW5rcyk7XG4gICAgICAgICAgICBsZXQgZXhwcmVzc2lvblZhbHVlID0ge2VsZW0sIGJpbmROYW1lfTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbkJpbmQoYmluZE5hbWUsIGVsZW0sIHR5cGUsIGV4cHJlc3Npb25WYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvblZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlQmluZChlbGVtLCBhdHRyaWJ1dGVOYW1lLCB2YWx1ZSwgc291cmNlTGlua3MpIHtcbiAgICAgICAgbGV0IHBhcmFtcyA9IHZhbHVlLnNwbGl0KGJpbmRSZWdleFVuY2FwdHVyaW5nKVxuICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoTGlzdCA9IHBhcmFtLm1hdGNoKGJpbmRSZWdleCk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaExpc3QpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RyaW5nVmFsdWU6IHBhcmFtfTtcbiAgICAgICAgICAgICAgICBsZXQgW2FsbCwgcHJlZml4U2xhc2gsIG1hdGNoXSA9IG1hdGNoTGlzdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4U2xhc2ggPyB7c3RyaW5nVmFsdWU6IGFsbC5zdWJzdHIoMSl9IDoge3NvdXJjZVZhbHVlOiB0cmFuc2xhdGUobWF0Y2gsIHNvdXJjZUxpbmtzKX07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYXR0cmlidXRlQmluZCA9IHtlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXN9O1xuXG4gICAgICAgIHBhcmFtc1xuICAgICAgICAgICAgLmZpbHRlcihwYXJhbSA9PiBwYXJhbS5zb3VyY2VWYWx1ZSlcbiAgICAgICAgICAgIC5mb3JFYWNoKCh7c291cmNlVmFsdWU6IGJpbmROYW1lfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQmluZChiaW5kTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kc1tiaW5kTmFtZV0uYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZUJpbmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZUJpbmQ7XG4gICAgfVxuXG4gICAgYWRkQXR0cmlidXRlRnVuY3Rpb25CaW5kKGVsZW0sIGF0dHJpYnV0ZU5hbWUsIHZhbHVlLCBzb3VyY2VMaW5rcykge1xuICAgICAgICBsZXQgW2FsbCwgcHJlZml4U2xhc2gsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zU3RyXSA9IHZhbHVlLm1hdGNoKGZ1bmN0aW9uUmVnZXgpOyAvLyB0b2RvIHByZWZpeFNsYXNoXG4gICAgICAgIGZ1bmN0aW9uTmFtZSA9IHRyYW5zbGF0ZShmdW5jdGlvbk5hbWUsIHNvdXJjZUxpbmtzKTtcbiAgICAgICAgbGV0IHBhcmFtcyA9IHNwbGl0QnlQYXJhbXMocGFyYW1zU3RyKVxuICAgICAgICAgICAgLm1hcChwYXJhbSA9PiB0cmFuc2xhdGUocGFyYW0sIHNvdXJjZUxpbmtzKSk7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVCaW5kID0ge2VsZW0sIGF0dHJpYnV0ZU5hbWUsIGZ1bmN0aW9uTmFtZSwgcGFyYW1zfTtcblxuICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoZnVuY3Rpb25OYW1lKTtcbiAgICAgICAgdGhpcy5iaW5kc1tmdW5jdGlvbk5hbWVdLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVCaW5kKTtcblxuICAgICAgICBwYXJhbXNcbiAgICAgICAgICAgIC5mb3JFYWNoKGJpbmROYW1lID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZHNbYmluZE5hbWVdLmF0dHJpYnV0ZXMucHVzaChhdHRyaWJ1dGVCaW5kKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVCaW5kO1xuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xuICAgIH1cblxuICAgIGFkZEV4cHJlc3Npb25CaW5kKGJpbmROYW1lLCBlbGVtLCB0eXBlLCBleHByZXNzaW9uVmFsdWUpIHsgLy8gdHlwZSA9ICdpZnMnIG9yICd2YWx1ZXMnIFxuICAgICAgICB0aGlzLmNyZWF0ZUJpbmQoYmluZE5hbWUpO1xuICAgICAgICBsZXQgYmluZGVkID0gdGhpcy5iaW5kc1tiaW5kTmFtZV1bdHlwZV0uc29tZShvdGhlckJpbmQgPT5cbiAgICAgICAgICAgIG90aGVyQmluZC5lbGVtID09PSBlbGVtXG4gICAgICAgICk7XG4gICAgICAgICFiaW5kZWQgJiYgdGhpcy5iaW5kc1tiaW5kTmFtZV1bdHlwZV0ucHVzaChleHByZXNzaW9uVmFsdWUpO1xuICAgICAgICAvLyB0b2RvIHByZXZlbnQgYmluZGluZyBub24gc291cmNlIHZhbHVlc1xuICAgIH1cblxuICAgIGFwcGx5QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVOYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgbGV0IG1vZGlmaWVkVmFsdWUgPSBwYXJhbXNcbiAgICAgICAgICAgIC5tYXAocGFyYW0gPT4gcGFyYW0uc291cmNlVmFsdWUgPyBub3RVbmRlZmluZWQoZ2V0VmFsdWUodGhpcy5zb3VyY2UsIFtwYXJhbS5zb3VyY2VWYWx1ZV0pLCAnJykgOiBwYXJhbS5zdHJpbmdWYWx1ZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgbW9kaWZpZWRWYWx1ZSk7XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kRnVuY3Rpb25BdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlTmFtZSwgZnVuY3Rpb25OYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2Z1bmN0aW9uTmFtZV0pO1xuICAgICAgICBlbGVtW2F0dHJpYnV0ZU5hbWVdID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHBhcmFtVmFsdWVzID0gdGhpcy5nZXRQYXJhbVZhbHVlcyhwYXJhbXMsIGVsZW0sIGV2ZW50KTtcbiAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkoZWxlbSwgcGFyYW1WYWx1ZXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFwcGx5QmluZEZvcihjb250YWluZXIsIG91dGVyRWxlbSwgc291cmNlVG8sIHNvdXJjZUZyb20sIHNvdXJjZUxpbmtzLCBsaW5rQmFzZURpcikge1xuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW3NvdXJjZUZyb21dKTtcbiAgICAgICAgaWYgKHZhbHVlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICB3aGlsZSAoY29udGFpbmVyLmNoaWxkRWxlbWVudENvdW50ID4gdmFsdWUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIubGFzdEVsZW1lbnRDaGlsZCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRFbGVtID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShvdXRlckVsZW0sIHRydWUpO1xuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzID0gY2xvbmUoc291cmNlTGlua3MpO1xuICAgICAgICAgICAgICAgIHNvdXJjZUxpbmtzW3NvdXJjZVRvXSA9IGAke3NvdXJjZUZyb219LiR7aW5kZXh9YDtcbiAgICAgICAgICAgICAgICBzb3VyY2VMaW5rcy5pbmRleCA9IGBfbnVtYmVyc18uJHtpbmRleH1gO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZEVsZW0oY2hpbGRFbGVtLCBzb3VyY2VMaW5rcywgbGlua0Jhc2VEaXIpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZEVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlCaW5kSWYoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5vYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpO1xuICAgICAgICBlbGVtLmhpZGRlbiA9ICF2YWx1ZTtcbiAgICB9XG5cbiAgICBhcHBseUJpbmRWYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLm9idGFpbkV4cHJlc3Npb25WYWx1ZShlbGVtLCBleHByZXNzaW9uTmFtZSwgcGFyYW1zLCBiaW5kTmFtZSk7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gbm90VW5kZWZpbmVkKHZhbHVlKTtcbiAgICB9XG5cbiAgICBvYnRhaW5FeHByZXNzaW9uVmFsdWUoZWxlbSwgZXhwcmVzc2lvbk5hbWUsIHBhcmFtcywgYmluZE5hbWUpIHtcbiAgICAgICAgaWYgKCFleHByZXNzaW9uTmFtZSlcbiAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2JpbmROYW1lXSk7XG5cbiAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBnZXRWYWx1ZSh0aGlzLnNvdXJjZSwgW2V4cHJlc3Npb25OYW1lXSk7XG4gICAgICAgIGxldCBwYXJhbVZhbHVlcyA9IHRoaXMuZ2V0UGFyYW1WYWx1ZXMocGFyYW1zLCBlbGVtKTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBleHByZXNzaW9uID09PSAnZnVuY3Rpb24nICYmIGV4cHJlc3Npb24oLi4ucGFyYW1WYWx1ZXMpO1xuICAgIH1cblxuICAgIGdldFBhcmFtVmFsdWVzKHBhcmFtcywgdGhpc3MsIGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBwYXJhbXMubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgIGxldCBwYXJhbVBhdGggPSBwYXJhbS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYgKHBhcmFtUGF0aFswXSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1QYXRoLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKHRoaXNzLCBwYXJhbVBhdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJhbVBhdGhbMF0gPT09ICdldmVudCcpIHtcbiAgICAgICAgICAgICAgICBwYXJhbVBhdGguc2hpZnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUoZXZlbnQsIHBhcmFtUGF0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VWYWx1ZSA9IGdldFZhbHVlKHRoaXMuc291cmNlLCBbcGFyYW1dKTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VWYWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VWYWx1ZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShwYXJhbS5yZXBsYWNlKC8nL2csICdcIicpKTtcblxuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlcGxhY2VJbmxpbmVCaW5kaW5ncyhlbGVtKSB7XG4gICAgICAgIGVsZW0uaW5uZXJIVE1MID0gZWxlbS5pbm5lckhUTUwucmVwbGFjZShhbGxTcGFuUmVnZXgsIChhbGwsIHByZWZpeFNsYXNoLCBtYXRjaCkgPT4gcHJlZml4U2xhc2ggPyBhbGwuc3Vic3RyKDEpIDogYDxzcGFuIGJpbmQ9XCIke21hdGNofVwiPjwvc3Bhbj5gKTtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSBlbGVtLmlubmVySFRNTC5yZXBsYWNlKGFsbFNwYW5FeHByZXNzaW9uUmVnZXgsIChhbGwsIHByZWZpeFNsYXNoLCBtYXRjaCkgPT4gcHJlZml4U2xhc2ggPyBhbGwuc3Vic3RyKDEpIDogYDxzcGFuIGJpbmQ9XCIke21hdGNofVwiPjwvc3Bhbj5gKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QmluZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4VG9Eb3QoZWxlbS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSk7XG4gICAgfVxufVxuXG4vLyBiaW5kcyA9IHtcbi8vICAgICAnYS5iLmMnOiB7XG4vLyAgICAgICAgIGZvcnM6IFt7Y29udGFpbmVyLCBvdXRlckVsZW0sIHNvdXJjZVRvLCBzb3VyY2VGcm9tLCBzb3VyY2VMaW5rc31dLFxuLy8gICAgICAgICBpZnM6IFtleHByZXNzaW9uQmluZDEsIGV4cHJlc3Npb25CaW5kM10sXG4vLyAgICAgICAgIHZhbHVlczogW2V4cHJlc3Npb25CaW5kMSwgZXhwcmVzc2lvbkJpbmQyXSxcbi8vICAgICAgICAgYXR0cmlidXRlczogW2F0dHJpYnV0ZUJpbmQxLCBhdHRyaWJ1dGVCaW5kMl1cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIHNvdXJjZSA9IHtcbi8vICAgICBhOiB7XG4vLyAgICAgICAgIGI6IHtcbi8vICAgICAgICAgICAgIGM6IHt9XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGhhbmRsZXJzID0ge1xuLy8gICAgIGE6IHtcbi8vICAgICAgICAgX2Z1bmNfOiAnZnVuYycsXG4vLyAgICAgICAgIGI6IHtcbi8vICAgICAgICAgICAgIGM6IHtcbi8vICAgICAgICAgICAgICAgICBfZnVuY186ICdmdW5jJ1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gfTtcbi8vXG4vLyBjb21wb25lbnRzID0ge1xuLy8gICAgIGE6IHtcbi8vICAgICAgICAgb3V0ZXJFbGVtOiBvdXRlckVsZW0sXG4vLyAgICAgICAgIHBhcmFtczogW11cbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGF0dHJpYnV0ZUJpbmQgPSB7XG4vLyAgICAgZWxlbTogZWxlbTEsXG4vLyAgICAgYXR0cmlidXRlTmFtZSxcbi8vICAgICBmdW5jdGlvbk5hbWUsIC8vIGNhbiBiZSBudWxsXG4vLyAgICAgcGFyYW1zOiBbe3N0cmluZ1ZhbHVlIHwgc291cmNlVmFsdWU6IHN0cmluZ31dLCAvLyBmb3IgbnVsbCBmdW5jdGlvbk5hbWVcbi8vICAgICBwYXJhbXM6IFtdIC8vIGZvciBub3QgbnVsbCBmdW5jdGlvbk5hbWVcbi8vIH07XG4vL1xuLy8gZXhwcmVzc2lvbkJpbmQgPSB7XG4vLyAgICAgZWxlbTogZWxlbTEsXG4vLyAgICAgZXhwcmVzc2lvbk5hbWUsIC8vIGNhbiBiZSBudWxsXG4vLyAgICAgcGFyYW1zOiBbXSxcbi8vICAgICBiaW5kTmFtZSAvLyBjYW4gYmUgbnVsbFxuLy8gfTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZGlyLCBkb2N1bWVudCwgZGVidWcpID0+IHtcbiAgICBsZXQgYXJ0aWZhY3RzID0gbmV3IEh0bWxCaW5kZXIoZGlyLCBkb2N1bWVudCk7XG4gICAgaWYgKGRlYnVnKVxuICAgICAgICBPYmplY3QuYXNzaWduKGRlYnVnLCBhcnRpZmFjdHMpO1xuICAgIHJldHVybiBhcnRpZmFjdHMuc291cmNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9odG1sQmluZGVyJyk7XG5cbi8vIHRvZG9cbi8vIGFsbG93IGFycmF5IGJpbmRpbmcgaW4gaHRtbDogYDxkaXYgYmluZD1cInhbeV1cIj48L2Rpdj5gXG4vLyBjbGVhbiB1cCBwYWNrYWdlLmpzb25cbi8vICRze3h9IHN5bnRheCB0byBvbmx5IGFmZmVjdCBpbm5lciB0ZXh0IGFuZCBub3QgYXR0cmlidXRlc1xuLy8gYWxsb3cgZGVmaW5pbmcgYW5kIHVzaW5nIGNvbXBvbmVudHMgaW4gYW55IG9yZGVyXG4vLyBhbGxvdyB1c2luZyBleHByZXNzaW9ucyBmb3IgbW9yZSBiaW5kcyB0aGFuIGp1c3QgaWZzIGFuZCB2YWx1ZXMgKGUuZy4gYXR0cmlidXRlcywgZm9ycywgYXMsIHVzZSlcbi8vIHN1cHBvcnQgJGUgbmVzdGVkIGluc2lkZSAkc1xuLy8gaW52ZXN0aWdhdGUgd2h5IHNvdXJjZS5hID0gc291cmNlLmIgZG9lc24ndCBwcm9wb2dhdGUgY2hhbmdlc1xuLy8gaW52ZXN0aWdhdGUgd2h5IGJpbmQtZm9yIGluZGV4VmFycyBkb24ndCBwcm9wb2dhdGUgY2hhbmdlc1xuLy8gaW52ZXN0aWdhdGUgaG93IHRvIHNldCBzZXR0ZXJzIG9uIG5vbi1zb3VyY2Ugb2JqZWN0IGFzc2lnbm1lbnRzXG4vLyByb3V0aW5nIG9yIHN3YXBwaW5nIHN0YXRlc1xuIiwibGV0IGdldFByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gfHwge30pO1xuICAgIHJldHVybiBbb2JqLCBsYXN0RmllbGRdO1xufTtcblxubGV0IGdldFZhbHVlID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgcHJvcGVydHkgPSBnZXRQcm9wZXJ0eShvYmosIHBhdGhzKTtcbiAgICByZXR1cm4gcHJvcGVydHlbMV0gPT09IHVuZGVmaW5lZCA/IHByb3BlcnR5WzBdIDogcHJvcGVydHlbMF1bcHJvcGVydHlbMV1dO1xufTtcblxubGV0IGNyZWF0ZVByb3BlcnR5ID0gKG9iaiwgcGF0aHMpID0+IHtcbiAgICBsZXQgZmllbGRzID0gZ2V0RmllbGRzKHBhdGhzKTtcbiAgICBsZXQgbGFzdEZpZWxkID0gZmllbGRzLnBvcCgpO1xuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IG9iaiA9IG9ialtmaWVsZF0gPSBvYmpbZmllbGRdIHx8IHt9KTtcbiAgICByZXR1cm4gW29iaiwgbGFzdEZpZWxkXTtcbn07XG5cbmxldCBzZXRQcm9wZXJ0eSA9IChvYmosIHBhdGhzLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBwcm9wZXJ0eSA9IGNyZWF0ZVByb3BlcnR5KG9iaiwgcGF0aHMpO1xuICAgIHByb3BlcnR5WzBdW3Byb3BlcnR5WzFdXSA9IHZhbHVlO1xufTtcblxubGV0IGNsb25lID0gb3JpZ2luYWwgPT4ge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbCk7XG59O1xuXG5sZXQgdHJhbnNsYXRlID0gKG5hbWUsIGxpbmtzKSA9PiB7XG4gICAgbGV0IG9jY3VycmVkID0gW107XG4gICAgbGV0IGZpZWxkcyA9IGdldEZpZWxkcyhbbmFtZV0pO1xuICAgIHdoaWxlIChmaWVsZHNbMF0gaW4gbGlua3MpIHtcbiAgICAgICAgb2NjdXJyZWQucHVzaChmaWVsZHNbMF0pO1xuICAgICAgICBmaWVsZHNbMF0gPSBsaW5rc1tmaWVsZHNbMF1dO1xuICAgICAgICBpZiAob2NjdXJyZWQuaW5jbHVkZXMoZmllbGRzWzBdKSlcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBmaWVsZHMgPSBnZXRGaWVsZHMoZmllbGRzKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcy5yZWR1Y2UoKGEsIGIpID0+IGAke2F9LiR7Yn1gKTtcbn07XG5cbmxldCBnZXRGaWVsZHMgPSBwYXRocyA9PlxuICAgIHBhdGhzXG4gICAgICAgIC5tYXAocGF0aCA9PiBwYXRoLnNwbGl0KCcuJykpXG4gICAgICAgIC5yZWR1Y2UoKGFnZ3JlZ2F0ZSwgaXRlbSkgPT4gYWdncmVnYXRlLmNvbmNhdChpdGVtKSwgW10pO1xuXG5sZXQgaW5kZXhUb0RvdCA9IGZpZWxkID0+IGZpZWxkICYmIGZpZWxkLnJlcGxhY2UoL1xcWyhcXHcrKVxcXS9nLCAoXywgbWF0Y2gpID0+IGAuJHttYXRjaH1gKTtcblxubGV0IG5vdFVuZGVmaW5lZCA9ICh2YWx1ZSwgdW5kZWZpbmVkVmFsdWUgPSBudWxsKSA9PlxuICAgIHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHVuZGVmaW5lZFZhbHVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtnZXRWYWx1ZSwgc2V0UHJvcGVydHksIGNsb25lLCB0cmFuc2xhdGUsIGluZGV4VG9Eb3QsIG5vdFVuZGVmaW5lZH07XG4iLCJjbGFzcyBQYXJhbVNwbGl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBbXTtcbiAgICB9XG5cbiAgICBzcGxpdEJ5UGFyYW1zKCkge1xuICAgICAgICBsZXQgZGVwdGggPSAwO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHRJbmRleCgpICYmICghdGhpcy5hdFF1b3RlKCkgfHwgdGhpcy5za2lwUXVvdGUoKSkpIHtcbiAgICAgICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgICAgICBpZiAoY2hhciA9PT0gJ1snKVxuICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSAnXScpXG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICcsJyAmJiAhZGVwdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5pbmRleCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZFBhcmFtKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtcztcbiAgICB9XG5cbiAgICBmaW5kSW5kZXgocmVnZXgsIHN0YXJ0KSB7IC8vIHJldHVybnMgLTEgb3IgaW5kZXggb2YgbWF0Y2hcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zdHJpbmcuc3Vic3RyaW5nKHN0YXJ0KS5zZWFyY2gocmVnZXgpO1xuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCA/IGluZGV4ICsgc3RhcnQgOiAtMTtcbiAgICB9O1xuXG4gICAgbmV4dEluZGV4KCkge1xuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5maW5kSW5kZXgoL1ssJ1wiW1xcXV0vLCB0aGlzLmluZGV4ICsgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAtMTtcbiAgICB9XG5cbiAgICBhdFF1b3RlKCkge1xuICAgICAgICBsZXQgY2hhciA9IHRoaXMuc3RyaW5nW3RoaXMuaW5kZXhdO1xuICAgICAgICByZXR1cm4gY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIjtcbiAgICB9XG5cbiAgICBza2lwUXVvdGUoKSB7XG4gICAgICAgIGxldCBjaGFyID0gdGhpcy5zdHJpbmdbdGhpcy5pbmRleF07XG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmZpbmRJbmRleChjaGFyID09PSAnXCInID8gL1teXFxcXF1cIi8gOiAvW15cXFxcXScvLCB0aGlzLmluZGV4ICsgMSkgKyAxO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG5cbiAgICBhZGRQYXJhbSgpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMucHVzaCh0aGlzLnN0cmluZy5zdWJzdHJpbmcodGhpcy5zdGFydEluZGV4LCB0aGlzLmluZGV4ID4gMCA/IHRoaXMuaW5kZXggOiB0aGlzLnN0cmluZy5sZW5ndGgpLnRyaW0oKSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiBuZXcgUGFyYW1TcGxpdHRlcihzdHJpbmcpLnNwbGl0QnlQYXJhbXMoKTtcbiIsIi8vIChbXFx3LltcXF1dKylcblxubGV0IHNwYW5SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdXSspfS87XG5sZXQgYWxsU3BhblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuUmVnZXgsICdnJyk7XG5sZXQgc3BhbkV4cHJlc3Npb25SZWdleCA9IC8oXFxcXCk/XFwkc3soW1xcdy5bXFxdIT0+PHwmXStcXCguKlxcKSl9LztcbmxldCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4ID0gbmV3IFJlZ0V4cChzcGFuRXhwcmVzc2lvblJlZ2V4LCAnZycpO1xuXG5sZXQgYmluZFJlZ2V4ID0gLyhcXFxcKT9cXCR7KFtcXHcuW1xcXV0rKX0vO1xubGV0IGJpbmRSZWdleFVuY2FwdHVyaW5nID0gLygoPzpcXFxcKT9cXCR7KD86W1xcdy5bXFxdXSspfSkvO1xuXG5sZXQgZnVuY3Rpb25SZWdleCA9IC8oXFxcXCk/XFwkeyhbXFx3LltcXF1dKylcXCgoLiopXFwpfS87XG5cbmxldCBleHByZXNzaW9uUmVnZXggPSAvKFxcXFwpPyhbXFx3LltcXF0hPT48fCZdKylcXCgoLiopXFwpLztcblxubW9kdWxlLmV4cG9ydHMgPSB7YWxsU3BhblJlZ2V4LCBhbGxTcGFuRXhwcmVzc2lvblJlZ2V4LCBiaW5kUmVnZXgsIGJpbmRSZWdleFVuY2FwdHVyaW5nLCBmdW5jdGlvblJlZ2V4LCBleHByZXNzaW9uUmVnZXh9O1xuIiwibGV0IGNyZWF0ZVNvdXJjZSA9ICgpID0+IHtcbiAgICBsZXQgaGFuZGxlcnMgPSB7fTtcbiAgICBsZXQgb3JpZ2luID0ge307XG4gICAgbGV0IHNvdXJjZSA9IGNyZWF0ZVByb3h5KG9yaWdpbiwgaGFuZGxlcnMpO1xuICAgIHNldERlZmF1bHRTb3VyY2Uob3JpZ2luKTtcbiAgICByZXR1cm4ge29yaWdpbiwgc291cmNlLCBoYW5kbGVyc307XG59O1xuXG5sZXQgaWdub3JlID0gW107XG5cbmxldCBpc0JpbmRJZ25vcmVkID0gKG9iaiwgcHJvcCkgPT4gb2JqLl9fYmluZElnbm9yZV9fICYmIG9iai5fX2JpbmRJZ25vcmVfXy5pbmNsdWRlcyhwcm9wKTtcblxuLy8gdG9kbyBtYWtlIF9fYmluZEF2b2lkQ3ljbGVzX18gaW5oZXJpdGVkIGFuZCBtYXliZSBhdm9pZCBwZXIgYmluZGluZyBpbnN0ZWFkIHBlciBjaGFuZ2VcbmxldCBpc0lnbm9yZWQgPSAob2JqLCBwcm9wKSA9PiBpc0JpbmRJZ25vcmVkKG9iaiwgcHJvcCkgfHwgKG9iai5fX2JpbmRBdm9pZEN5Y2xlc19fICYmIGlnbm9yZS5zb21lKGlnbm9yZSA9PiBpZ25vcmUub2JqID09PSBvYmogJiYgaWdub3JlLnByb3AgPT09IHByb3ApKTtcblxubGV0IGhhbmRsZVNldCA9IChvYmosIHByb3AsIGhhbmRsZXJzLCBhY2N1bXVsYXRlZEhhbmRsZXJzKSA9PiB7XG4gICAgaWdub3JlLnB1c2goe29iaiwgcHJvcH0pO1xuICAgIGFjY3VtdWxhdGVkSGFuZGxlcnMuZm9yRWFjaChkb0hhbmRsZXIpO1xuICAgIGhhbmRsZXJzICYmIHByb3BvZ2F0ZUhhbmRsZXJEb3duKGhhbmRsZXJzKTtcbiAgICBpZ25vcmUucG9wKCk7XG59O1xuXG5sZXQgY3JlYXRlUHJveHkgPSAob2JqLCBoYW5kbGVycyA9IHt9LCBhY2N1bXVsYXRlZEhhbmRsZXJzID0gW10pID0+IG5ldyBQcm94eShvYmosIHtcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3ApID0+IHtcbiAgICAgICAgbGV0IGdvdCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZ290ID09PSAnb2JqZWN0JyAmJiBnb3QgJiYgIWlzQmluZElnbm9yZWQob2JqLCBwcm9wKSA/IGNyZWF0ZVByb3h5KGdvdCwgaGFuZGxlcnNbcHJvcF0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSkgOiBnb3Q7XG4gICAgfSxcbiAgICBzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiB7XG4gICAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpO1xuICAgICAgICAhaXNJZ25vcmVkKG9iaiwgcHJvcCkgJiYgaGFuZGxlU2V0KG9iaiwgcHJvcCwgaGFuZGxlcnNbcHJvcF0sIGFjY3VtdWxhdGVkSGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKSk7IC8vIHRvZG8gd3JhcCBoYW5kbGVycyBhbmQgYWNjdW11bGF0ZWRIYW5kbGVycyBpbiBjbGFzcyB3aXRoIHBvcFByb3AgbWV0aG9kXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pO1xuXG5sZXQgcHJvcG9nYXRlSGFuZGxlckRvd24gPSBoYW5kbGVycyA9PiB7XG4gICAgZG9IYW5kbGVyKGhhbmRsZXJzKTtcbiAgICBPYmplY3QuZW50cmllcyhoYW5kbGVycylcbiAgICAgICAgLmZpbHRlcigoW2tleV0pID0+IGtleSAhPT0gJ19mdW5jXycpXG4gICAgICAgIC5mb3JFYWNoKChbLCBoYW5kbGVyXSkgPT4gcHJvcG9nYXRlSGFuZGxlckRvd24oaGFuZGxlcikpO1xufTtcblxubGV0IGRvSGFuZGxlciA9IGhhbmRsZXIgPT4gdHlwZW9mIGhhbmRsZXIuX2Z1bmNfID09PSAnZnVuY3Rpb24nICYmIGhhbmRsZXIuX2Z1bmNfKCk7XG5cbmxldCBzZXREZWZhdWx0U291cmNlID0gc291cmNlID0+IHtcbiAgICBzb3VyY2UuX251bWJlcnNfID0gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgIGdldDogKF8sIHByb3ApID0+IHBhcnNlSW50KHByb3ApLFxuICAgICAgICBzZXQ6ICgpID0+IGZhbHNlXG4gICAgfSk7XG4gICAgc291cmNlLm5vdCA9IGEgPT4gIWE7XG4gICAgc291cmNlWychJ10gPSBhID0+ICFhO1xuICAgIHNvdXJjZS5lcSA9IChhLCBiKSA9PiBhID09PSBiO1xuICAgIHNvdXJjZS5lcXVhbCA9IChhLCBiKSA9PiBhID09PSBiO1xuICAgIHNvdXJjZVsnPSddID0gKGEsIGIpID0+IGEgPT09IGI7XG4gICAgc291cmNlLm5FcSA9IChhLCBiKSA9PiBhICE9PSBiO1xuICAgIHNvdXJjZS5ub3RFcXVhbCA9IChhLCBiKSA9PiBhICE9PSBiO1xuICAgIHNvdXJjZVsnIT0nXSA9IChhLCBiKSA9PiBhICE9PSBiO1xuICAgIHNvdXJjZS5ncmVhdGVyID0gKGEsIGIpID0+IGEgPiBiO1xuICAgIHNvdXJjZVsnPiddID0gKGEsIGIpID0+IGEgPiBiO1xuICAgIHNvdXJjZS5sZXNzID0gKGEsIGIpID0+IGEgPCBiO1xuICAgIHNvdXJjZVsnPCddID0gKGEsIGIpID0+IGEgPCBiO1xuICAgIHNvdXJjZS5ncmVhdGVyRXEgPSAoYSwgYikgPT4gYSA+PSBiO1xuICAgIHNvdXJjZVsnPj0nXSA9IChhLCBiKSA9PiBhID49IGI7XG4gICAgc291cmNlLmxlc3NFcSA9IChhLCBiKSA9PiBhIDw9IGI7XG4gICAgc291cmNlWyc8PSddID0gKGEsIGIpID0+IGEgPD0gYjtcbiAgICBzb3VyY2Uub3IgPSAoLi4uYXMpID0+IGFzLnNvbWUoYSA9PiBhKTtcbiAgICBzb3VyY2VbJ3wnXSA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xuICAgIHNvdXJjZVsnfHwnXSA9ICguLi5hcykgPT4gYXMuc29tZShhID0+IGEpO1xuICAgIHNvdXJjZS5hbmQgPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XG4gICAgc291cmNlWycmJ10gPSAoLi4uYXMpID0+IGFzLmV2ZXJ5KGEgPT4gYSk7XG4gICAgc291cmNlWycmJiddID0gKC4uLmFzKSA9PiBhcy5ldmVyeShhID0+IGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7Y3JlYXRlU291cmNlfTtcbiIsImxldCBzcGxpdEJ5V29yZCA9IChzdHJpbmcsIHdvcmQpID0+XG4gICAgc3RyaW5nLnNwbGl0KG5ldyBSZWdFeHAoYFxcXFxzKyR7d29yZH1cXFxccytgKSk7XG5cbmxldCBzcGxpdEJ5Q29tbWEgPSBzdHJpbmcgPT5cbiAgICBzdHJpbmcuc3BsaXQoL1xccyosXFxzKi8pO1xuXG5sZXQgc3BsaXRCeVNwYWNlID0gc3RyaW5nID0+XG4gICAgc3RyaW5nLnNwbGl0KC9cXHMrLyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3NwbGl0QnlXb3JkLCBzcGxpdEJ5Q29tbWEsIHNwbGl0QnlTcGFjZX07XG4iXX0=
