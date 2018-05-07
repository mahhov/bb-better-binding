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
