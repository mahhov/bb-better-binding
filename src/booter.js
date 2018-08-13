const HtmlBinder = require('./htmlBinder');

class Booter {

    constructor() {
        this.blocks = {};
    }

    declareBlock(blockName, block) {
        this.blocks[blockName] = block;
    }

    boot(root, debug, manual) {
        let artifacts = new HtmlBinder(root, this.blocks).getArtifacts();
        debug && Object.assign(debug, artifacts);
        if (!manual)
            this.loop();
        return this.source = artifacts.source;
    }

    tick() {
        this.source._invokeAllHandlers_();
    }

    loop(interval = 1) {
        setInterval(() => this.source._invokeAllHandlers_(), interval);
    }
}

module.exports = Booter;
