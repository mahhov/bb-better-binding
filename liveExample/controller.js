const bb = require('bb-better-binding')();

// block declarations

bb.declareBlock('navigation', require('./navigation/navigation'));

let valueBlockData = require('./bindFor/bindFor');
bb.declareBlock('bindValue', valueBlockData);

let ifBlockData = require('./bindFor/bindFor');
bb.declareBlock('bindIf', ifBlockData);

let forBlockData = require('./bindFor/bindFor');
bb.declareBlock('bindFor', forBlockData);

bb.declareBlock('helloWorld', require('./helloWorld/helloWorld'));

// booting

let source = bb.boot(document.firstElementChild, window);

// app controller, todo: seperate into block

let snippets = [valueBlockData, ifBlockData, forBlockData];
source.navigationPages = ['Value Binding', 'If Binding', 'For Binding', 'Hello World'];
source.setPageIndex = pageIndex => {
    source.pageIndex = pageIndex;
    source.snippet = snippets[pageIndex] && {
        template: snippets[pageIndex].template.replace('<', '&lt;'),
        controller: snippets[pageIndex].controllerString
    };
};
source.setPageIndex(0);
source.navigationBlock.navigationRadio0.checked = true;
