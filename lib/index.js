var fs = require('fs');
var validations = require('./validations');
var templates = require('./templates');

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

    console.log(templates.samplePage("App", false, false, false));
}

exports.main = main;