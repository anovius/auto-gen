var fs = require('fs');
var validations = require('./validations');
var bash = require('./bash');

const main = async (path) => {
    welcomeScreen();
    // let exists = await fs.existsSync(path);
    // if (!exists) {
    //     console.log('No such file found at: ' + path);
    //     return;
    // }

    // if(!validations.checkFormat(path)) {
    //     return;
    // }

    // let format = await validations.checkJSON(path);
    // if (!format) {
    //     console.log('Invalid JSON format.');
    //     return;
    // }

    // let raw = await fs.readFileSync(path);
    // let data = JSON.parse(raw);

    // bash.start(data);

}

const welcomeScreen = () => {
    let art = `
░█▀█░█░█░▀█▀░█▀█░░░░░█▀▀░█▀▀░█▀█
░█▀█░█░█░░█░░█░█░▄▄▄░█░█░█▀▀░█░█
░▀░▀░▀▀▀░░▀░░▀▀▀░░░░░▀▀▀░▀▀▀░▀░▀
`
    console.log('\x1b[32m%s\x1b[0m', art);

    console.log('Welcome to AUTO-GEN\nA CLI tool that will create a react project with routing for you.\n\nYour project generation started ...\n\n');
}

exports.main = main;