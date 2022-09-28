var { promises: fs } = require("fs")
var path = require("path")
var exec = require('child_process').exec;
var templates = require("./templates");


const start = (data) => {
    copyProject(data);
}

const createFile = async (path, name, data) => {
    await fs.mkdir(path, { recursive: true });
    await fs.writeFile(path + "/" + name, data);
}

const magic = async (data) => {
    let basePath = process.cwd() + "/" + data.project + "/src";
    let ext = data.type+"x";
    
    let writeData =  templates.mainPage(data.layout.header, data.layout.footer);
    await createFile(basePath, "App."+ext, writeData);

    if(data.layout.header) {
        writeData = templates.samplePage("Header", false, false);
        await createFile(basePath+"/components/layout", "Header."+ext, writeData);
    }

    if(data.layout.footer) {
        writeData = templates.samplePage("Footer", false, false);
        await createFile(basePath+"/components/layout", "Footer."+ext, writeData);
    }

}

async function copyBase(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyBase(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}

const copyProject = async (data) => {
    // let path = __dirname + "/base/project-"+data.type;
    // let dest = process.cwd() + "/" + data.project;
    // await copyBase(path, dest);
    // exec(`cd ${data.project} && npm install`, (err, stdout, stderr) => {
    //     magic(data);
    // });

    magic(data);
}

module.exports = {
    copyProject,
    start
}