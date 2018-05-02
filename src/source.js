let createSource = () => {
    let handlers = {};
    let origin = {};
    let source = createProxy(origin, handlers);
    watchAll(origin, handlers, []); // todo move to createProxy? 
    return {source, handlers};
};

let createSourceWithHandlers = handlers => {
    let origin = {};
    let source = createProxy(origin, handlers);
    watchAll(origin, handlers, []); // todo move to createProxy? 
    return source;
};

let proxyGet = (got, handlers, accumulatedHandlers) => {
    return typeof got === 'object' && got ? createProxy(got, handlers, accumulatedHandlers) : got;
};

let proxySet = (prop, handlers, accumulatedHandlers) => {
    console.log('>>>> handler set', prop, handlers, accumulatedHandlers);
    accumulatedHandlers.forEach(doHandler);
    handlers && propogateHandlerDown(handlers);
};

let createProxy = (obj, handlers, accumulatedHandlers = []) => new Proxy(obj, {
    get: (target, prop) => {
        return Reflect.get(target, prop);
    },
    set: (target, prop, value) => {
        if (value && typeof value === 'object' && handlers && handlers[prop]) {
            let specialHandler = handlers[prop];
            let specialAccumulatedHandlers = accumulatedHandlers.concat(handlers);
            watchAll(value, specialHandler, specialAccumulatedHandlers);
        }

        Reflect.set(target, prop, value);
        return true;
    }
});

let propogateHandlerDown = handlers => {
    doHandler(handlers);

    // Object.entries(handlers);
    //     .filter(([key]) => key !== '_func_')
    //     .forEach(([key, handlerValue]) => {
    //     });
    // todo is this better than `for in`?

    for (key in handlers)
        if (key !== '_func_')
            propogateHandlerDown(handlers[key]);
};

let doHandler = handler => {
    if (handler && typeof handler._func_ === 'function')
        handler._func_();
};

let watchAll = (origin, handlers, accumulatedHandlers) => {
    Object.entries(handlers)
        .filter(([key]) => key !== '_func_')
        .forEach(([key, handlerValue]) => {
            let nextHandler = handlers[key];
            let nextAccumulatedHandlers = accumulatedHandlers.concat(handlers);
            let watchKey = `_${key}_`;
            origin[watchKey] = origin[key];
            watch(origin, key, () => {
                let got = origin[watchKey];
                return proxyGet(got, nextHandler, nextAccumulatedHandlers);
            }, newValue => {
                origin[watchKey] = newValue;
                proxySet(key, nextHandler, nextAccumulatedHandlers)
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

module.exports = {createSource, createSourceWithHandlers};

// todo remove clogs, 1 line lambdas, move out watchAll
