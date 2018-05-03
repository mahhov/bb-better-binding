let splitByWord = (string, word) =>
    string.split(new RegExp(`\\s+${word}\\s+`));

let splitBySpace = string =>
    string.split(new RegExp(/\s+/));

module.exports = {splitByWord, splitBySpace};
