#!/bin/sh

node node_modules/nodemon/bin/nodemon.js --watch liveExample --watch src -e html,js --exec "
    [ -d build ] && rm -r build & cp -r liveExample build & node node_modules/browserify/bin/cmd.js -t brfs --debug liveExample/controller.js -o build/controller.js & cp favicon.ico build
" & node_modules/http-server/bin/http-server ./build -o -a localhost -c-1