let getProperty = (obj, paths) => {
    let fields = getFields(paths);
    let lastField = fields.pop();
    fields.forEach(field => obj = obj[field] || {});
    return [obj, lastField];
};

let getValue = (obj, paths) => {
    let property = getProperty(obj, paths);
    return property[1] === undefined ? property[0] : property[0][property[1]];
};

let createProperty = (obj, paths) => {
    let fields = getFields(paths);
    let lastField = fields.pop();
    fields.forEach(field => obj = obj[field] = obj[field] || {});
    return [obj, lastField];
};

let setProperty = (obj, paths, value) => {
    let property = createProperty(obj, paths);
    property[0][property[1]] = value;
};

let setGetProperty = (obj, paths, value, handler) => {
    let property = createProperty(obj, paths);
    let key = property[1] + '_';
    property[0][key] = value;

    Object.defineProperty(property[0], property[1], {
        get: () => {
            handler();
            return property[0][key];
        }
    });
};

let translate = (name, links) => {
    let occurred = [];
    let fields = getFields([name]);
    while (fields[0] in links) {
        occurred.push(fields[0]);
        fields[0] = links[fields[0]];
        if (occurred.includes(fields[0]))
            break;
        fields = getFields(fields);
    }
    return fields.reduce((a, b) => `${a}.${b}`);
};

let getFields = paths =>
    paths
        .map(path => path.split('.'))
        .reduce((aggregate, item) => aggregate.concat(item), []);

let indexToDot = field => field && field.replace(/\[(\w+)\]/g, (_, match) => `.${match}`);

let notUndefined = (value, undefinedValue = null) =>
    value !== undefined ? value : undefinedValue;

let isObject = obj => typeof obj === 'object' && obj;

let areEqual = (a, b) => a === b || Number.isNaN(a) && Number.isNaN(b); // because NaN != NaN and isNan(undefined) == true, but Number.IsNan(undefined) == false

let clone = original => {
    return {...original};
};

let cloneDeep = obj => {
    if (!isObject(obj))
        return obj;
    let cloneObj = {};
    Object.entries(obj).forEach(([key, value]) => cloneObj[key] = cloneDeep(value));
    return cloneObj;
};

module.exports = {getValue, setProperty, setGetProperty, translate, indexToDot, notUndefined, isObject, areEqual, clone, cloneDeep};
