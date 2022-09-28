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

const handlePages = async (page, basePath, ext, parent = null) => {

    let outlet = page.sub && page.sub.length > 0 ? true : false;
    let writeData = templates.samplePage(page.name, page.header, page.footer, outlet);

    if(parent) {
        await createFile(basePath+"/pages/" + parent, page.name+"."+ ext, writeData);
    }
    else{
        await createFile(basePath+"/pages/" + page.name, "index."+ext, writeData);
    }

    if(page.header){
        writeData = templates.samplePage(page.name+"Header", false, false);
        await createFile(basePath+"/pages/" + page.name , page.name+"Header."+ext, writeData);
    }

    if(page.footer){
        writeData = templates.samplePage(page.name+"Footer", false, false);
        await createFile(basePath+"/pages/" + page.name , page.name+"Footer."+ext, writeData);
    }

    page.sub.map((pg) => {
        if(pg.sub && pg.sub.length > 0) handlePages(pg, basePath, ext, page.name);
    })
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

    data.layout.pages.map(async (page) => {
        await handlePages(page, basePath, ext);
    });

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