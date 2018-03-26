let getProperty = (obj, paths) => {
    let fields = getFields(paths);
    let lastField = fields.pop();
    fields.forEach(field => {
        if (!obj[field])
            return [{}, null];
        obj = obj[field];
    });
    return [obj, lastField];
};

let getValue = (obj, paths) => {
    let property = getProperty(obj, paths);
    return property[0][property[1]];
};

let createProperty = (obj, paths) => {
    let fields = getFields(paths);
    let lastField = fields.pop();
    fields.forEach(field => {
        obj = obj[field] = obj[field] || {};
    });
    return [obj, lastField];
};

let setProperty = (obj, paths, value) => {
    let property = createProperty(obj, paths);
    property[0][property[1]] = value;
};

let safeInit = (obj, field, init) => {
    obj[field] = obj[field] || init;
};

let safeInitPath = (obj, path, init) => {
    let property = creaetProperty(obj, path);
    property[0][property[1]] = property[0][property[1]] || init;
};

let modify = (original, key, value) => {
    let modified = Object.assign({}, original);
    modified[key] = value;
    return modified
};

let getFields = paths =>
    paths.map(path => path.split('.')).reduce((aggregate, item) => aggregate.concat(item));

module.exports = {getProperty, getValue, createProperty, setProperty, safeInit, safeInitPath, modify};
