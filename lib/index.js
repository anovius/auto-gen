var fs = require('fs');
var validations = require('./validations');
var bash = require('./bash');

const main = async (path) => {
    welcomeScreen();
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

    try{
        await bash.start(data);
    }
    catch(err) {
        errorHandler(err);
    }

}

const welcomeScreen = () => {
    let art = `
░█▀█░█░█░▀█▀░█▀█░░░░░█▀▀░█▀▀░█▀█
░█▀█░█░█░░█░░█░█░▄▄▄░█░█░█▀▀░█░█
░▀░▀░▀▀▀░░▀░░▀▀▀░░░░░▀▀▀░▀▀▀░▀░▀
`
    console.log('\x1b[32m%s\x1b[0m', art);

    console.log('Welcome to AUTO-GEN\nA CLI tool that will create a react project with routing for you.\n\nYour project generation started ...');

    console.log('\x1b[36m%s\x1b[0m', `https://www.usmandev.com\n\n`);
    const P = ['\\', '|', '/', '-'];
    let x = 0;
    global.loader = setInterval(() => {
    process.stdout.write(`\r${P[x++]}`);
    x %= P.length;
    }, 100);
}

exports.main = main;