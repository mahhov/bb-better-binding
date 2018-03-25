let getProperty = (obj, path) => {
    let fields = path.split('.');
    let lastField = fields.pop();
    fields.forEach(field => {
        obj = obj[field] = obj[field] || {};
    });
    return [obj, lastField];
};

let getValue = (obj, path) => {
    let property = getProperty(obj, path);
    return property[0][property[1]];
};

let setProperty = (obj, path, value) => {
    let property = getProperty(obj, path);
    property[0][property[1]] = value;
};

let safeInit = (obj, field, init) => {
    obj[field] = obj[field] || init;
};

module.exports = {getProperty, getValue, setProperty, safeInit};
