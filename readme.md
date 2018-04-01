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
```

### your `.js` controller

```js
const source = require('bb-better-binding')(__dirname, document);
source.showNumbers = true;
source.numbers = [10, 12, 16, 13];
```

## Components Example

### your `.html` template

```html
<div bind-for="overdueBook in overdueBooks">
    <div bind-use="libraryDue with overdueBook.dueDate overdueBook.title"></div>
</div>

<div bind-component="libraryDue with date book">
    <div style="color:${titleColor}; font-size:30px" bind="book"></div>
    <div>due on $s{date}</div>
</div>

<input onchange="$f{changeHandler}"> </input>
```

### your `.js` controller

```js
const source = require('bb-better-binding')(__dirname, document);

source.overdueBooks = [{
    dueDate: '15-17-32025-02',
    title: 'why humans were taller 8 billion years ago'
}];

source.titleColor = "red";

source.changeHandler = () => {
    console.log('stop changing things!!')
};
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

`<input onclick="$f{logHello}" onchange="$f{logWoah}"> </input>`

binds wrapped invocaters of the functions `source.logHello` and `source.logWoah` to the element's `onclick` and `onchange` attribute 

for example, if `source.logHello = () => { console.log('hi') }`

then sets element's onclick to `( () => { console.log('hello') } ) ()` 

this is a convenience syntax for the equally valid `onclick="(${logHello)()"` syntax 
