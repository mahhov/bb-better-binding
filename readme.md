# bb-better-binding

1 way binding from js controllers to html templates

## Setup

run: `npm i -save bb-beter-binding`

## Simple Example

### your `.html` template

```html
<div bind-if="showNumbers"></div>
    <div bind-for="num in numbers">
        <div bind="num"></div>
    </div>
</div>

<input onchange="${changeHandler()}"> </input>
```

### your `.js` controller

```js
const source = require('bb-better-binding')(__dirname, document);

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
    <div bind-use="libraryDue with overdueBook.dueDate overdueBook.title overdueBook.titleColor"></div>
</div>

<div bind-component="libraryDue with date book titleColor">
    <div style="color:${titleColor}; font-size:${fontSize}px" bind="book"></div>
    <div>due on $s{date}</div>
</div>
```

### your `.js` controller

```js
const source = require('bb-better-binding')(__dirname, document);

source.overdueBooks = [{
    dueDate: '15-17-32025-02',
    title: 'why humans were taller 8 billion years ago',
    titleColor: 'red'
}];

source.fontSize = '30';
```

## Syntax

### bind value

`<span bind="x"> </span>`

replaces the innerHtml of the element with `source.x`

`$s{x}` is a shorthand for `<span bind="x"> </span>`

### bind for

`<span bind-for="item in list"> # $s{index} : $s{item} </span>`

repeats the element for each element in `source.list` and makes `item` and `index` available to all children elements

### bind if

`<span bind-if="show"> am i visible? </span>`

sets the `hidden` property of the element

### bind as

`<span bind-as="response.data.errorMessages[2].text as text, ugly as pretty> $s{text} </span>`

makes `text` available to all children elements as a shortcut to `source.response.data.errorMessages[2].text`

### bind component 

```
<div bind-component="banner with text header">
    <div style="font-size:50px" bind="header"> </div>
    <div style="font-size:20px" bind="text"> </div>
</div>
``` 

defines a reusable component named `banner` and with paramters `text` and `header`

### bind use

`<div bind-use="banner with bannerData.text bannerData.header"> </div>` 

uses a component named `banner`, passing `source.bannerData.text` and `source.bannerData.header` as parameters

### bind component link

`<link bind-component-link="./component-definitions.html"> </link>`

injects the contents of the relative path `./component-definitions.html`

#### Note on component load order

Components are loaded from bottom of the document, upwards. This means, if `component-parent` uses `component-child`, then `component-child` should be loaded first (e.g. defined lower in the html). Similary, all usages of `component-parent` should occur after (e.g. higher in the html) the component than where it is defined. 

### attribute binding

`<div name="box-number-${i}" style="color: ${favoriteColor}; font-size=${largeFont}"> </div>`

binds `source.i` to the element name and `source.favoriteColor` and `source.largeFont` to the element's style attributes.

### function binding

`<input onclick="${logHello(userName, '!!!')}" onchange="${logWoah()}"> </input>`

binds `source.userName` and `source.logHello` to the element's `onclick` attribute. If either changes, the `onclick` attribute will be reassigned to `source.logHello(source.userName, '!!!')`.

for example, `source.logHello = (name, punctuation) => { console.log('hi', name, punctuation) }` and `source.userName = 'kangaroo'`.


### expression binding

`<div bind-if="${equals(value, 3)}"> $s{value} </div> `

binds `source.value` and `source.equals` to the `bind-if` binding. If either changes, the expression will be reevaluated.

for example, if `source.equals = (a, b) => a === b;` and `source.value = 3;`, then the `div` will be visible. 

`$s{x(y)}` is a shorthand for `<span bind="${x(y)}"> </span>`.

### element binding

```html
<button bind-elem="elems.playButton" onclick="${playAudio()}"> </div>
<audio src="howToStealAWalrus.mp3" type="audio/webm" bind-elem="elems.audioBook"> </div>
```

```js
source.elems.playButton.innerText = 'click me to begin ur audiobook!';
source.playAudio = () => {
    source.elems.audioBook.play();
};
```

sets a field on source to the html element.

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

### option 1, `__bindIgnore__`  (not available in version `4.x.x`)

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

### option 2, `__bindAvoidCycles__` (not available in version `4.x.x`)

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

## Triggering bindings changes in version `4.x.x`

### 1

Prior, to version `4.0.0`, bindings were designed to only trigger when `source` was modified. As of `4.0.0`, objects assigned to `source` will be watched for changes to fields that are bound and trigger bindings appropriately.

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

The example above previously displayed `1`, `22`, and `3`. The last assignment `obj.value3 = 33` would not trigger the `obj.value3` binding.

As of `4.0.0`, assignments to both `source` and objects bound to source like `obj` will trigger bindings; the displayed values will be `1`, `22`, and `33`.

### 2

Prior to version `4.0.0`, bindings were triggered when any property on a bound object changed. As of `4.0.0`, only properties directly bound will trigger bindings. The difference is noticeable when working with `for` bindings and growing or shrinking arrays.

```html
<div bind-for="item in list">
    $s{item}
</div>
```

```js
source.list = [10, 20, 30];
source.list.push(40);
```

The example above previously displayed `10`, `20`, `30`, and `40`. The `push` would trigger a bindings on `list`, as both the `length` and `3` properties of `list` are modified.

As of `4.0.0`, only the `0`, `1`, and `2` properties of `list` are observed for changes; the displayed values will be `10`, `20`, and `30`.

### Version `5.x.x+`

Version `5.x.x` reverts the changes to binding triggering which were introduced in versions `4.0.0`. In this way, version `5.0.0` and future versions will behave similalry to versions prior to `4.0.0`. 
