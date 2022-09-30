#!/usr/bin/env node
var lib = require('../lib/index.js');
let args = process.argv.slice(2);
if (!args[0]) {
    console.log('Please provide a path to your JSON file.');
    return;
}
lib.main(args[0]);

global.errorHandler = (err) => {
    clearInterval(global.loader);
    console.log('\x1b[31m%s\x1b[0m', '\bSomething went wrong. Please check your JSON file format.');
}

process.on('unhandledRejection', (reason, p) => {
    errorHandler(reason);
})

process.on('uncaughtException', (err) => {
    errorHandler(err);
})