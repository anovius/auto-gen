var fs = require('fs');

const checkFormat = (path) => {
    let extension = path.split('.').pop();
    if (extension !== 'json') {
        console.log('Invalid file format. Please provide a JSON file.');
        return false;
    }
    return true;
}











module.exports = {
    checkFormat
}