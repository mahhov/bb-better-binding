const bb = require('bb-better-binding')();

bb.declareBlock('navigation', require('./navigation/navigation'));
bb.declareBlock('helloWorld', require('./helloWorld/helloWorld'));
bb.declareBlock('bindFor', require('./bindFor/bindFor'));

let source = bb.boot(document.firstElementChild, window);

source.navigationPages = ['Hello World', 'For Binding'];
source.setPageIndex = pageIndex => source.pageIndex = pageIndex;
source.pageIndex = 0;
source.navigationBlock.navigationRadio0.checked = true;
