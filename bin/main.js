#!/usr/bin/env node
var lib = require('../lib/index.js');
let args = process.argv.slice(2);
lib.main(args[0]);