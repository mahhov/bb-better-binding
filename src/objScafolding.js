let getProperty = (obj, path) => {
    let fields = path.split('.');
    let lastField = fields.pop();
    fields.forEach(field => {
        if (!obj[field])
            return [{}, null];
        obj = obj[field];
    });
    return [obj, lastField];
};

let getValue = (obj, path) => {
    let property = getProperty(obj, path);
    return property[0][property[1]];
};

let createProperty = (obj, path) => {
    let fields = path.split('.');
    let lastField = fields.pop();
    fields.forEach(field => {
        obj = obj[field] = obj[field] || {};
    });
    return [obj, lastField];
};

let setProperty = (obj, path, value) => {
    let property = createProperty(obj, path);
    property[0][property[1]] = value;
};

let safeInit = (obj, field, init) => {
    obj[field] = obj[field] || init;
};

let safeInitPath = (obj, path, init) => {
    let property = creaetProperty(obj, path);
    property[0][property[1]] = property[0][property[1]] || init;
};

module.exports = {getProperty, getValue, createProperty, setProperty, safeInit, safeInitPath};
