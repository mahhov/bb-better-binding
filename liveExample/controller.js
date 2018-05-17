const bb = require('bb-better-binding')();

bb.declareBlock('navigation', require('./navigation/navigation'));
bb.declareBlock('helloWorld', require('./helloWorld/helloWorld'));

let forBlockData = require('./bindFor/bindFor');
bb.declareBlock('bindFor', forBlockData);

let snippets = [, forBlockData];

let source = bb.boot(document.firstElementChild, window);

source.navigationPages = ['Hello World', 'For Binding'];
source.setPageIndex = pageIndex => {
    source.pageIndex = pageIndex;
    source.snippet = snippets[pageIndex] && {
        template: snippets[pageIndex].template.replace('<', '&lt;'),
        controller: snippets[pageIndex].controllerString
    };
};
source.pageIndex = 0;
source.navigationBlock.navigationRadio0.checked = true;
