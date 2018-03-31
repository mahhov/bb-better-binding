const fs = require('fs');
const path = require('path');

module.exports = (dir, readPath) => {
    let fullPath = path.resolve(dir, readPath);
    let readDir = path.dirname(fullPath);
    let read = fs.readFileSync(fullPath, 'utf8');
    return {readDir, read};
};
