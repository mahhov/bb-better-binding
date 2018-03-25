let createScope = () => {
    let handlers = {};
    let scope = createProxy({}, handlers);
    return {scope, handlers};
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
            if (handlers && typeof handlers[prop] === 'function')
                handlers[prop](value);
            else if (typeof arrayHandler === 'function')
                arrayHandler(obj);
        }
        return true;
    }
});

module.exports = {createScope};
