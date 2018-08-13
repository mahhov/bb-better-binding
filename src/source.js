const {getValue, isObject, areEqual, cloneDeep} = require('./objScafolding');

// todo wrap these functions in a class
let createSource = parentSource => {
    let handlers = {};
    let source = {};
    setDefaultSource(source);
    let compareSource = {};
    source._invokeAllHandlers_ = parentSource ? parentSource._invokeAllHandlers_ : () => handleOriginChanges(source, compareSource, handlers);
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
        return handleOriginChanges(value, compareValue, handlers[key], accumulatedHandlers.concat(handlers));
    if (!areEqual(value, compareValue)) {
        compareSource[key] = cloneDeep(value);
        handleSet(source, key, handlers[key], accumulatedHandlers.concat(handlers)); // todo wrap handlers and accumulatedHandlers in class with popProp method
        return true;
    }
};

// source and compareSource must not be null or undefined
let handleOriginChanges = (source, compareSource, handlers = {}, accumulatedHandlers = []) => {
    if (!handlers)
        return;
    let changed = true;
    while (changed) {
        changed = false;
        Object.keys(source).forEach(key =>
            changed = handleOriginChangesKey(source, compareSource, key, handlers, accumulatedHandlers) || changed);
        Object.keys(compareSource).forEach(key =>
            changed = !source.hasOwnProperty(key) && handleOriginChangesKey(source, compareSource, key, handlers, accumulatedHandlers) || changed);
    }
};

let setDefaultSource = source => {
    source._numbers_ = new Proxy({}, {
        get: (_, prop) => parseInt(prop),
        set: () => false
    });
    source.not = a => !a;
    source['!'] = source.not;
    source.eq = (a, b) => a === b;
    source.equal = source.eq();
    source['='] = source.eq();
    source.nEq = (a, b) => a !== b;
    source.notEqual = source.nEq();
    source['!='] = source.nEq();
    source.greater = (a, b) => a > b;
    source['>'] = source.greater;
    source.less = (a, b) => a < b;
    source['<'] = source.less();
    source.greaterEq = (a, b) => a >= b;
    source['>='] = source.greaterEq();
    source.lessEq = (a, b) => a <= b;
    source['<='] = source.lessEq();
    source.or = (...as) => as.some(a => a);
    source['|'] = source.or;
    source['||'] = source.or;
    source.and = (...as) => as.every(a => a);
    source['&'] = source.and;
    source['&&'] = source.and;
    source.getElem = elem => {
        source._invokeAllHandlers_();
        return getValue(source, [elem]);
    }
};

module.exports = {createSource};
