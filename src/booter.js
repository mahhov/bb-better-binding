const HtmlBinder = require('./htmlBinder');

class Booter {

    constructor() {
        this.blocks = {};
    }

    declareBlock(blockName, block) {
        this.blocks[blockName] = block;
    }

    boot(root, debug) {
        let artifacts = new HtmlBinder(root, this.blocks);
        debug && Object.assign(debug, artifacts);
        return artifacts.source;
    }
}

module.exports = Booter;
