# be-better-binding

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

## HTML syntax

### bind value

`<span bind="x"> </span>`

replaces the innerHtml of the element with `source.x`

`$s{x}` is a shorthand for `<span bind="x"> </span>`

### bind for

`<span bind-for="item in list"> $s{item} </span>`

repeats the element for each element in `source.list` and makes `item` available to all children elements

### bind if

`<span bind-if="show"> am i visible? </span>`

sets the `hidden` property of the element

### bind as

`<span bind-as="response.data.errorMessages[2].text as text> $s{text} </span>`

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

`<div bind-if="$e{equals(value, 3)}"> $s{value} </div> `

binds `source.value` and `source.equals` to the `bind-if` binding. If either changes, the expression will be reevaluated.

for example, if `source.equals = (a, b) => a === b;` and `source.value = 3;`, then the `div` will be visible. 

`$s{x(y)}` is a shorthand for `<span bind="$e{x(y)}"> </span>`.

### ignoring source fields

Imagine you have the following in your template template `$s{func(obj)}`, and the following controller, 

```js
source.obj = {
    list: [1, 2, 3],
    count: 0
};

source.func = obj => {
    obj.count++;
    return obj.list;
};
```

This results in both `source.func` and `source.obj` binding to the span's value binding. In other words, whenever either changes, the value binding (`source.func(source.obj)`) is invoked. The problem with this is that `source.func` will modify `source.obj` when it increments `count`, resulting in an infinite cycle of the binding being invoked because `source.obj` is modified, and `source.obj` being modified because the binding is invoked.

The solution is to ignore the fields that don't need to trigger bindings: `source.obj.__bindignore__ = ['count']`. Any field names in the list `__bindignore__` fields will not trigger any bindings when modified. So as long as `source.obj.__bindignore__` includes `count`, we can modify `count` and no bindings will be triggered. You can freely remove and add field names to `__bindignore__` as needed. 
