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

let safeInit = (obj, field, init) => { // todo remove unused
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
    let fields = getFields([name]);
    while (fields[0] in links) {
        occured.push(fields[0]);
        fields[0] = links[fields[0]];
        if (occured.includes(fields[0])) // todo uncomment circal check
            return fields;
        fields = getFields(fields);
    }
    return fields.reduce((a, b) => `${a}.${b}`); // todo maybe return array fields instead
};

let getFields = paths =>
    paths
        .map(path => path.split('.'))
        .reduce((aggregate, item) => aggregate.concat(item));

let indexToDot = field => field && field.replace(/\[(\w+)\]/g, (_, match) => `.${match}`);

let notUndefined = (value, undefinedValue = null) =>
    value !== undefined ? value : undefinedValue;

let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`, 'g')); // todo 'g' flag not necessary for .split

let splitBySpace = string =>
    string.split(new RegExp(/\s+/, 'g'));

module.exports = {getProperty, getValue, createProperty, setProperty, safeInit, safeInitPath, clone, modify, translate, getFields, indexToDot, notUndefined, splitByWord, splitBySpace};
