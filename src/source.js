let createSource = () => {
    let handlers = {};
    let source = createProxy({}, handlers);
    return {source, handlers};
};

let createProxy = (obj, handlers, arrayHandler) => new Proxy(obj, {
    get: (target, prop) => {
        let got = Reflect.get(target, prop);
        if (Array.isArray(got))
            return createProxy(got, null, handlers && handlers[prop]);
        else if (typeof got === 'object' && got !== null)
            return createProxy(got, handlers && handlers[prop]);
        else
            return got;
    },
    set: (target, prop, value) => {
        if (Reflect.get(target, prop) !== value) {
            Reflect.set(target, prop, value);

            if (handlers)
                propogateHandlerDown(handlers[prop], value);

            if (typeof arrayHandler === 'function')
                arrayHandler(obj);
        }
        return true;
    }
});

let propogateHandlerDown = (handlers, value) => {
    if (!handlers)
        return;

    if (typeof handlers === 'function')
        handlers(value);
    else
        for (key in handlers)
            propogateHandlerDown(handlers[key], value && value[key] || null);
};

module.exports = {createSource};
