let createHalfChannel = (channel, otherChannel) => {
    channel.send = (event, ...arguments) => {
        let handlerName = `on${event}`;
        return typeof otherChannel[handlerName] === 'function' ? otherChannel[handlerName](...arguments) : undefined;
    };
};

let createChannel = () => {
    let left = {};
    let right = {};

    createHalfChannel(left, right);
    createHalfChannel(right, left);

    return {left, right};
};

module.exports = createChannel();