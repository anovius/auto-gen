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