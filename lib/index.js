var fs = require('fs');
var validations = require('./validations');
var bash = require('./bash');

const main = async (path) => {
    let exists = await fs.existsSync(path);
    if (!exists) {
        console.log('No such file found at: ' + path);
        return;
    }

    if(!validations.checkFormat(path)) {
        return;
    }

    let format = await validations.checkJSON(path);
    if (!format) {
        console.log('Invalid JSON format.');
        return;
    }

    let raw = await fs.readFileSync(path);
    let data = JSON.parse(raw);

    bash.start(data);

}

exports.main = main;