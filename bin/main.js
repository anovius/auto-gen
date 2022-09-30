#!/usr/bin/env node
var lib = require('../lib/index.js');
let args = process.argv.slice(2);
if (!args[0]) {
    console.log('Please provide a path to your JSON file.');
    return;
}
lib.main(args[0]);