let createSource = () => {
    let handlers = {};
    let source = createProxy({}, handlers);
    return {source, handlers};
};

let ignore = [];

let isBindIgnored = (obj, prop) => obj.__bindIgnore__ && obj.__bindIgnore__.includes(prop);

let createProxy = (obj, handlers, accumulatedHandlers = []) => new Proxy(obj, {
    get: (target, prop) => {
        let got = Reflect.get(target, prop);
        return typeof got === 'object' && got !== null && !isBindIgnored(obj, prop) ? createProxy(got, handlers && handlers[prop], accumulatedHandlers.concat(handlers)) : got;
    },
    set: (target, prop, value) => {
        Reflect.set(target, prop, value);

        if (isBindIgnored(obj, prop))
            return true;

        // todo make __bindAvoidCycles__ inherited and maybe avoid per binding instead per change
        if (obj.__bindAvoidCycles__ && ignore.some(ignore => ignore.obj === obj && ignore.prop === prop))
            return true;

        ignore.push({prop, obj});
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
