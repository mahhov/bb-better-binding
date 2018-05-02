let createSource = handlers => {
    let origin = {};
    let source = createProxy(origin, handlers);
    watchAll(origin, handlers, []); // todo move to createProxy? 
    return source;
};

let getHandler = (got, handlers, accumulatedHandlers) => {
    return typeof got === 'object' && got ? createProxy(got, handlers, accumulatedHandlers) : got;
};

let setHandler = (prop, handlers, accumulatedHandlers) => {
    accumulatedHandlers.forEach(doHandler);
    handlers && propogateHandlerDown(handlers); // todo which handler null checks r necessary
};

let createProxy = (obj, handlers, accumulatedHandlers = []) => new Proxy(obj, {
    get: (target, prop) =>
        Reflect.get(target, prop),

    set: (target, prop, value) => {
        if (value && typeof value === 'object' && handlers && handlers[prop])
            watchAll(value, handlers[prop], accumulatedHandlers.concat(handlers));

        Reflect.set(target, prop, value);
        return true;
    }
});

let propogateHandlerDown = handlers => {
    doHandler(handlers);

    Object.entries(handlers)
        .filter(([key]) => key !== '_func_')
        .forEach(([key, handler]) => propogateHandlerDown(handler));
};

let doHandler = handler => {
    if (handler && typeof handler._func_ === 'function')
        handler._func_();
};

let watchAll = (origin, handlers, accumulatedHandlers) => {
    Object.entries(handlers)
        .filter(([key]) => key !== '_func_')
        .forEach(([key, handler]) => {
            let nextAccumulatedHandlers = accumulatedHandlers.concat(handlers);
            let watchKey = `_${key}_`;
            origin[watchKey] = origin[key];
            watch(origin, key,
                () => getHandler(origin[watchKey], handler, nextAccumulatedHandlers),
                newValue => {
                    origin[watchKey] = newValue;
                    setHandler(key, handler, nextAccumulatedHandlers)
                });
        });
};

let watch = (obj, key, getHandler, setHandler) => {
    Object.defineProperty(obj, key, {
        get: () => getHandler(),
        set: newValue => setHandler(newValue),
        configurable: true
    });
};

module.exports = {createSource};
