# bb-better-binding

1 way binding from js controllers to html templates

## Setup

run: `npm i -save bb-beter-binding`

## Hello World

[controller.js](example/controller.js)

[index.html](example/index.html)

[live demo](https://mahhov.github.io/bb-better-binding/)

## Simple Example

### your `.html` template

```html
<div bind-if="showNumbers"> </div>
    <div bind-for="num in numbers">
        <div bind="num"> </div>
    </div>
</div>

<input onchange="${changeHandler()}"> </input>
```

### your `.js` controller

```js
const source = require('bb-better-binding')().boot(document.firstElementChild);

source.showNumbers = true;
source.numbers = [10, 12, 16, 13];

source.changeHandler = () => {
    console.log('stop changing things!!')
};
```

## Components Example

### your `.html` template

```html
<div bind-for="overdueBook in overdueBooks">
    <div bind-use="libraryDue with overdueBook.dueDate overdueBook.title overdueBook.titleColor"> </div>
</div>

<div bind-component="libraryDue with date book titleColor">
    <div style="color:${titleColor}; font-size:${fontSize}px" bind="book"> </div>
    <div>due on $s{date}</div>
</div>
```

### your `.js` controller

```js
const source = require('bb-better-binding')().boot(document.firstElementChild);

source.overdueBooks = [{
    dueDate: '15-17-32025-02',
    title: 'why humans were taller 8 billion years ago',
    titleColor: 'red'
}];

source.fontSize = '30';
```

## Syntax

### value binding

`<span bind="x"> </span>`

replaces the innerHtml of the element with `source.x`

`$s{x}` is a shorthand for `<span bind="x"> </span>`

### for binding

`<span bind-for="item in list"> # $s{index} : $s{item} </span>`

repeats the element for each element in `source.list` and makes `item` and `index` available to all children elements

### if binding

`<span bind-if="show"> am i visible? </span>`

sets the `hidden` property of the element

### as binding

`<span bind-as="response.data.errorMessages[2].text as text, ugly as pretty> $s{text} </span>`

makes `text` available to all children elements as a shortcut to `source.response.data.errorMessages[2].text`

### component binding 

```
<div bind-component="banner with text header">
    <div style="font-size:50px" bind="header"> </div>
    <div style="font-size:20px" bind="text"> </div>
</div>
``` 

defines a reusable component named `banner` and with paramters `text` and `header`

### use binding

`<div bind-use="banner with bannerData.text bannerData.header"> </div>` 

uses a component named `banner`, passing `source.bannerData.text` and `source.bannerData.header` as parameters

#### Note on component load order

Components are loaded from bottom of the document, upwards. This means, if `component-parent` uses `component-child`, then `component-child` should be loaded first (e.g. defined lower in the html). Similary, all usages of `component-parent` should occur after (e.g. higher in the html) the component than where it is defined. 

### block binding

```html
<!-- parent template -->
<div bind-block="todoList with 'red', name"> </div>
```

```js
// parent controller
const bb = require('bb-better-binding')();
bb.declareBlock('todoList', require('./todoListBlock/todoList'));
const source = bb.boot(document.firstElementChild);
source.name = 'The Elephant\'s Todo List';
```

```html
<!-- todoList.html template -->
<div style="color:${color}">List Name: $s{name}</div>
<div bind-for="item in list" bind="item"> </div>
```

```js
// todoList.js controller
let template = require('fs').readFileSync(`${__dirname}/todoList.html`, 'utf8');
let controller = source => {
    source.list = ['elephant', 'lion', 'rabbit'];
};
let parameters = ['color', 'name'];
module.exports = {template, controller, parameters};
```

Creates externalized and reusable blocks

#### Blocks or Components?

`Components` allow you to resuse parts of your template but remain in the same template file and share the same `source`. `Blocks` go a step further, extracting the reusable part to external files to allow use by multiple pages or blocks, have their own isolated `source`, and help keep your templates and controllers smaller. 

### attribute binding

`<div name="box-number-${i}" style="color: ${favoriteColor}; font-size=${largeFont}"> </div>`

binds `source.i` to the element name and `source.favoriteColor` and `source.largeFont` to the element's style attributes.

### function binding

`<input onclick="${logHello(userName, '!!!')}" onchange="${logWoah(this, event)}"> </input>`

binds `source.userName` and `source.logHello` to the element's `onclick` attribute. If either changes, the `onclick` attribute will be reassigned to `source.logHello(source.userName, '!!!')`.

for example, `source.logHello = (name, punctuation) => { console.log('hi', name, punctuation) }` and `source.userName = 'kangaroo'`.


### expression binding

`<div bind-if="isBetterNumber(value, 3)"> $s{value} </div> `

binds `source.value` and `source.isBetterNumber` to the `bind-if` binding. If either changes, the expression will be reevaluated.

for example, if `source.isBetterNumber = (a, b) => a > b;` and `source.value = 30;`, then the `div` will be visible. 

`$s{x(y)}` is a shorthand for `<span bind="x(y)"> </span>`.

### element binding

```html
<button bind-elem="playButton" onclick="${playAudio()}"> </button>
<audio src="howToStealAWalrus.mp3" type="audio/webm" bind-elem="audioBook"> </audio>
```

```js
source.playButton.innerText = 'click me to begin ur audiobook!';
source.playAudio = () => source.audioBook.play();
```

sets a field on source to the html element.

## utility expressions available by default for `bind-if` and `bind`

`!`, `not`
```html
<div>visibile: $s{not(x)}</div>
<div bind-if="${!(x)}"> visible if x is falsy </div>
```

`=`, `eq`, `equal`
```html
<div>visibile: $s{eq(x, y)}</div>
<div bind-if="${=(x, y)}"> </div>
```

`!=`, `nEq`, `notEqual`
```html
<div>visibile: $s{nEq(x, y)}</div>
<div bind-if="${!=(x, y)}"> visible if x !== y </div>
```

`>`, `greater`
```html
<div>visibile: $s{greater(x, y)}</div>
<div bind-if="${>(x, y)}"> visible if x > y </div>
```

`<`, `less`
```html
<div>visibile: $s{less(x, y)}</div>
<div bind-if="${<(x, y)}"> visible if x < y </div>
```

`>=`, `greaterEq`
```html
<div>visibile: $s{greaterEq(x, y)}</div>
<div bind-if="${>=(x, y)}"> visibile if x >= y </div>
```

`<=`, `lessEq`
```html
<div>visibile: $s{greaterEq(x, y)}</div>
<div bind-if="${<=(x, y)}"> visible if x <= y </div>
```

`|`, `||`, `or`
```html
<div>visibile: $s{or(x, y, z, w)}</div>
<div bind-if="${|(x, y, z, w)}"> visible if any argument is truthy </div>
```

`&`, `&&`, `and`
```html
<div>visibile: $s{and(x, y, z, w)}</div>
<div bind-if="${&(x, y, z, w)}"> visible if all arguments are truthy </div>
```

## avoiding infinite triggers (e.g. `Maximum call stack size exceeded`)

Imagine you have the following in your template `$s{func(obj)}`, and the following controller, 

```js
source.obj = {
    value: 100,
    count: 0
};

source.func = obj => {
    obj.count++;
    return obj.value;
};
```

This results in both `source.func` and `source.obj` binding to the span's value binding. In other words, whenever either changes, the value binding (`source.func(source.obj)`) is invoked. The problem here is that `source.func` will modify `source.obj` when it increments `count`, resulting in an infinite cycle of the binding being invoked because `source.obj` is modified, and `source.obj` being modified because the binding is invoked.

### option 1, `__bindIgnore__`

One solution is to ignore the fields that don't need to trigger bindings: `source.obj.__bindIgnore__ = ['count']`. Any field names in the list `__bindIgnore__`  will not trigger any bindings when modified. So as long as `source.obj.__bindIgnore__` includes `count`, we can modify `count` and no bindings will be triggered. `__bindIgnore__` can be modified as needed in order to ignore certain fields only under certain conditions.

template:

```html
$s{func(obj)}
```

controller:

```js
source.obj = {
    value: 100,
    count: 0,
    __bindIgnore__: ['count']
};

source.func = obj => {
    obj.count++;
    return obj.value;
};
```

### option 2, `__bindAvoidCycles__`

What if our template relies on `count` as well: `$s{obj.count}`? Then we no longer want to ignore updates to `source.obj.count`, and `__bindIgnore__` is not a satisfactory solution in this case. An alternative way to avoid bindings from triggering is setting `source.obj.__bindAvoidCycles__ = true`. This will ensure each time `source.obj` is changed, it will trigger each of it's binding at most once per change. E.g. creating a new field `source.obj.newValue = 200` will trigger `source.func(source.obj)` once for the assignment of `newValue`, and once more for the increment of `obj.count`.

template:

```html
$s{func(obj)}
$s{obj.count}
```

controller:

```js
source.obj = {
    value: 100,
    count: 0,
    bindAvoidCycles: true
};

source.func = obj => {
    obj.count++;
    return obj.value;
};
```

### option 3, `_`

Yet a third option is to specify paramters with a `_` prefix in the template `$s{func(_obj, obj.value)}`. This allows individually configuring each bind with which `source` fields are binded to it. In the above example, `source.func` will only be invoked when `obj.value` is modified, but not when `source.obj` is modified. This allows you to use `$s{obj.count}` elsewhere in you template, because the `_` is applied to each paramter in each binding individually.

template:

```html
$s{func(_obj, obj.value)}
$s{obj.count}
```

controller:

```js
source.obj = {
    value: 100,
    count: 0
};

source.func = obj => {
    obj.count++;
    return obj.value;
};
```

## Triggering bindings

### 1

Bindings are triggered when source is modified, even if indirectly (e.g. `value3` in below example).

```html
$s{obj.value1}
$s{obj.value2}
$s{obj.value3}
```

```js
let obj = {value1: 1, value2: 2, value3: 3};
source.obj = obj;
source.obj.value2 = 22;
obj.value3 = 33;
```

### 2

Bindings are triggered when any property on a bound object changes.

```html
<div bind-if="show(obj)">
    hi there
</div>
```

```js
source.show = obj => obj.flag;
source.obj.flag = true;
```

The example above displays `hi there`. Modifying the field `flag` on object `source.obj` triggers the binding on `obj`, even though there are no direct bindings on `obj.flag`.

### 3

By default bindings are triggered asynchroniously.

This is fine because, except for element bindings, all other bindings are 1 way; modifying `source` updates the `html`, but user modifications to the `html` are projected to source either though event listeners or by element bindings. In order to make sure element bindings can be accessed syncrhoniously in your app, on fetching element bindings, all bindings queued to be triggered will trigger.

```html

```

```js

```

### 4

It is possible to disable automatic binding triggering. This is useful when building an app that already has a "loop."

```html

```

```js

```

## execution order of bindings

0. attribute binding
0. elem binding
0. for binding
0. use binding
0. as binding
0. if binding
0. component binding
0. block binding
0. value binding

## debug mode

Typically, you would initiate the parsing of html, creation of binds, and retrieval of source via:

`const source = require('bb-better-binding')().boot(document.firstElementChild);`

or for apps using blocks:

```js
const bb = require('bb-better-binding')();
bb.declareBlock('blockName', require('./blockPath/blockFile'));
// more block declarations ...
bb.boot(document.firstElementChild);
```

A second optional argument may be passed to the `boot` method in order to put the source, binds, and handlers onto an easily-viewable-during-runtime location such as `window`.

`const source = require('bb-better-binding')().boot(document.firstElementChild, window);`

Which results in creating the fields `window.source`, `window.binds`, `window.handlers`, and `window.components` with the purpose of making debugging easier. Note, this should only be used for debugging, and `binds`, `handlers`, and `components` should not be modified unless you understand the source code.

### binds

`binds` describes which `handlers` should be invoked when which `source` values are changed.

```js
binds = {
    'a.b.c': {
        fors: [{container, outerElem, sourceTo, sourceFrom, sourceLinks}],
        ifs: [expressionBind1, expressionBind3],
        values: [expressionBind1, expressionBind2],
        attributes: [attributeBind1, attributeBind2]
    }
};

attributeBind = {
    elem: elem1,
    attributeName,
    functionName, // can be null
    params: [{stringValue | sourceValue: string}], // for null functionName
    params: [] // for not null functionName
};


expressionBind = {
    elem: elem1,
    expressionName, // can be null
    params: [],
    bindName // can be null
};
```

### handlers

`handlers` is the functions tree that is navigated and invoked appropriately when `bindings` are invoked because `source` values changed

```js
handlers = {
    a: {
        _func_: 'func',
        b: {
            c: {
                _func_: 'func'
            }
        }
    }
};
```

### components

`components` contains all defined components

```js
components = {
    a: {
        outerElem: outerElem,
        params: []
    }
};
