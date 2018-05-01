let createSource = () => {
    let handlers = {};
    let source = createProxy({}, handlers);
    return {source, handlers};
};

let ignore = [];

let isBindIgnored = (obj, prop) => obj.__bindIgnore__ && obj.__bindIgnore__.includes(prop);

let proxyGet = (target, prop, obj, handlers, accumulatedHandlers) => {
    let got = Reflect.get(target, prop);
    return typeof got === 'object' && got !== null && !isBindIgnored(obj, prop) ? createProxy(got, handlers && handlers[prop], accumulatedHandlers.concat(handlers)) : got;
};

let proxySet = (target, prop, value, obj, handlers, accumulatedHandlers) => {
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
};

let createProxy = (obj, handlers, accumulatedHandlers = []) => new Proxy(obj, {
    get: (target, prop) => {
        return proxyGet(target, prop, obj, handlers, accumulatedHandlers);
    },
    set: (target, prop, value) => {
        if (value && typeof value === 'object' && handlers && handlers[prop])
            Object.entries(handlers[prop]).forEach(([key, handlerValue]) => {
                if (key !== '_func_') {
                    let watchKey = `_${key}_`;
                    value[watchKey] = value[key];
                    watch(value, key, () => {
                        proxyGet(target, prop, obj, handlers, accumulatedHandlers);
                        return value[watchKey];
                    }, newValue => {
                        value[watchKey] = newValue;
                        proxySet(target, prop, value, obj, handlers, accumulatedHandlers)
                    });
                }
            });

        Reflect.set(target, prop, value); // move this?
        proxySet(target, prop, value, obj, handlers, accumulatedHandlers);
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

let watchAll = () => {
    // todo bring logic from set to here
};

let watch = (obj, key, getHandler, setHandler) => {
    Object.defineProperty(obj, key, {
        get: () => getHandler(),
        set: newValue => setHandler(newValue),
        configurable: true
    });
};

module.exports = {createSource};
