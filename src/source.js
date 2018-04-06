const {notUndefined} = require('./objScafolding');

let createSource = () => {
    let handlers = {};
    let source = createProxy({}, handlers);
    return {source, handlers};
};

let createProxy = (obj, handlers) => new Proxy(obj, {
    get: (target, prop) => {
        let got = Reflect.get(target, prop);
        return typeof got === 'object' && got !== null ? createProxy(got, handlers && handlers[prop]) : got;
    },
    set: (target, prop, value) => {
        if (Reflect.get(target, prop) !== value) {
            Reflect.set(target, prop, value);

            handlers && propogateHandlerDown(handlers[prop], value);
        }
        return true;
    }
});

let propogateHandlerDown = (handlers, value) => {
    if (!handlers)
        return;

    if (typeof handlers._func_ === 'function')
        handlers._func_(value);

    for (key in handlers)
        if (key !== '_func_')
            propogateHandlerDown(handlers[key], notUndefined(value && value[key]));
};

module.exports = {createSource};
