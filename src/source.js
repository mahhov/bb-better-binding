let createSource = () => {
    let handlers = {};
    let source = createProxy({}, handlers);
    return {source, handlers};
};

let createProxy = (obj, handlers, accumulatedHandlers = []) => new Proxy(obj, {
    get: (target, prop) => {
        let got = Reflect.get(target, prop);
        return typeof got === 'object' && got !== null ? createProxy(got, handlers && handlers[prop], accumulatedHandlers.concat(handlers)) : got;
    },
    set: (target, prop, value) => {
        Reflect.set(target, prop, value);
        accumulatedHandlers.forEach(doHandler);
        doHandler(handlers);
        handlers && propogateHandlerDown(handlers[prop]);
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
