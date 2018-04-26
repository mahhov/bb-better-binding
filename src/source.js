let createSource = () => {
    let handlers = {};
    let source = createProxy({}, handlers);
    return {source, handlers};
};

let ignore = [];

let createProxy = (obj, handlers, accumulatedHandlers = []) => new Proxy(obj, {
    get: (target, prop) => {
        let got = Reflect.get(target, prop);
        return typeof got === 'object' && got !== null ? createProxy(got, handlers && handlers[prop], accumulatedHandlers.concat(handlers)) : got;
    },
    set: (target, prop, value) => {
        Reflect.set(target, prop, value);

        if (obj.__bindIgnore__ && obj.__bindIgnore__.includes(prop))
            return true;

        if (obj.__bindAvoidCycles__ && ignore.some(ignore => ignore.target === target && ignore.prop === prop))
            return true;

        ignore.push({target, prop, value});
        accumulatedHandlers.forEach(doHandler);
        doHandler(handlers);
        handlers && propogateHandlerDown(handlers[prop]);
        ignore.pop();

        return true;
    }
});

let propogateHandlerDown = handlers => {
    doHandler(handlers);
    for (key in handlers)
        if (key !== '_func_')
            propogateHandlerDown(handlers[key]);
};

let doHandler = handler => {
    if (handler && typeof handler._func_ === 'function')
        handler._func_();
};

module.exports = {createSource};
