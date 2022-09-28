var fs = require('fs');

const checkFormat = (path) => {
    let extension = path.split('.').pop();
    if (extension !== 'json') {
        console.log('Invalid file format. Please provide a JSON file.');
        return false;
    }
    return true;
}

const checkJSON = async (path) => {
    let raw = await fs.readFileSync(path);
    try {
        let data = JSON.parse(raw);
        if(!data.project || !data.layout) return false;
        if(!data.layout.pages) return false;
        if(!data.type || (data.type !== 'js' && data.type !== 'ts')) {
            console.log('Invalid type. Please choose either js or ts.');
            return false;
        }
    }
    catch (e) {
        return false;
    }

    return true;
}

module.exports = {
    checkFormat,
    checkJSON
}