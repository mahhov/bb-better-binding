let getProperty = (obj, path) => {
    let fields = path.split('.');
    let lastField = fields.pop();
    fields.forEach(field => {
        obj = obj[field] = obj[field] || {};
    });
    return [obj, lastField];
};

let setProperty = (obj, path, value) => {
    let property = getProperty(obj, path);
    property[0][property[1]] = value;
};


let addWatcher = (obj, path, handler) => {
    let property = getProperty(obj, path);
    let value = property[0][property[1]];

    Object.defineProperty(property[0], property[1], {
        get: () => value,

        set: (newValue) => {
            if (value !== newValue) {
                handler(newValue);
                value = newValue;
            }
        }
    });
};

module.exports = {getProperty, setProperty, addWatcher};
