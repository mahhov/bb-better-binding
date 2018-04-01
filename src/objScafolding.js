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

let clone = original => {
    let cloned = Object.assign({}, original);
    return cloned;
};

let modify = (original, key, value) => {
    let modified = Object.assign({}, original);
    modified[key] = value;
    return modified
};

let translate = (name, links) => {
    let occured = [];
    while (name in links) {
        occured.push(name);
        name = links[name];
        if (occured.includes(name))
            return name;
    }
    return name;
};

let getFields = paths =>
    paths
        .map(path => path.split('.'))
        .reduce((aggregate, item) => aggregate.concat(item));

let indexToDot = field => field && field.replace(/\[(\w+)\]/g, (_, match) => `.${match}`);

let notUndefined = (value, undefinedValue = null) =>
    value !== undefined ? value : undefinedValue;

let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`, 'g'));

let splitBySpace = string =>
    string.split(new RegExp(/\s+/, 'g'));

module.exports = {getProperty, getValue, createProperty, setProperty, safeInit, safeInitPath, clone, modify, translate, getFields, indexToDot, notUndefined, splitByWord, splitBySpace};
