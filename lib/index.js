var fs = require('fs');
var validations = require('./validations');

const main = async (path) => {
    let exists = await fs.existsSync(path);
    if (!exists) {
        console.log('No such file found at: ' + path);
        return;
    }

    if(!validations.checkFormat(path)) {
        return;
    }
}

exports.main = main;