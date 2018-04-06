// ([\w.[\]]+)

let spanRegex = /(\\)?\$s{([\w.[\]]+)}/;

let bindRegex = /(\\)?\${([\w.[\]]+)}/;

let functionRegex = /(\\)?\$f{([\w.[\]]+)\((.*)\)}/;

let allSpanRegex = new RegExp(spanRegex, 'g');

let allBindRegex = new RegExp(bindRegex, 'g');

let allFunctionRegex = new RegExp(functionRegex, 'g');

module.exports = {spanRegex, allSpanRegex, bindRegex, allBindRegex, functionRegex, allFunctionRegex};
