const fs = require('fs');

module.exports = path => fs.readFileSync(require.resolve(path), 'utf8');
