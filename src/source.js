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
