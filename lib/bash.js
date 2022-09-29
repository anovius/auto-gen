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

const numbers = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

let importsArray = [];
let routes = ``;

const handlePages = async (page, basePath, ext, parent = null) => {
    
    //checking if first char is number
    let name = page.name;
    if(!isNaN(name.charAt(0))) {
        name = numbers[+name.charAt(0)] + name.slice(1);
    }

    //Removing spaces
    name = name.replace(/\s/g, '');

    //capitalizing first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);

    page.name = name;

    let outlet = page.sub && page.sub.length > 0 ? true : false;
    let writeData = templates.samplePage(page.name, page.header, page.footer, outlet);

    if(parent) {
        if(outlet){
            await createFile(basePath+"/pages/" + parent + "/" + page.name ,"/index."+ ext, writeData);
            let tempPath = "./pages/" + parent + "/" + page.name;
            importsArray.push(`import ${page.name} from '${tempPath}';`);
            if(page.header){
                writeData = templates.samplePage(page.name+"Header", false, false);
                await createFile(basePath+"/pages/" + parent + "/" + page.name , page.name+"Header."+ext, writeData);
            }
        
            if(page.footer){
                writeData = templates.samplePage(page.name+"Footer", false, false);
                await createFile(basePath+"/pages/" + parent + "/" + page.name, page.name+"Footer."+ext, writeData);
            }
        }
        else{
            await createFile(basePath+"/pages/" + parent, page.name+"."+ ext, writeData);
            let tempPath = "./pages/" + parent + "/" + page.name;
            importsArray.push(`import ${page.name} from '${tempPath}';`);
            if(page.header){
                writeData = templates.samplePage(page.name+"Header", false, false);
                await createFile(basePath+"/pages/" + parent, page.name+"Header."+ext, writeData);
            }
        
            if(page.footer){
                writeData = templates.samplePage(page.name+"Footer", false, false);
                await createFile(basePath+"/pages/" + parent, page.name+"Footer."+ext, writeData);
            }
        }
    }
    else{
        await createFile(basePath+"/pages/" + page.name, "index."+ext, writeData);
        let tempPath = "./pages/" + page.name;
        importsArray.push(`import ${page.name} from '${tempPath}';`);
        if(page.header){
            writeData = templates.samplePage(page.name+"Header", false, false);
            await createFile(basePath+"/pages/" + page.name , page.name+"Header."+ext, writeData);
        }
    
        if(page.footer){
            writeData = templates.samplePage(page.name+"Footer", false, false);
            await createFile(basePath+"/pages/" + page.name , page.name+"Footer."+ext, writeData);
        }
    }

    parent = parent ? parent + "/" + page.name : page.name;

    if(page.sub && page.sub.length > 0) {
       await Promise.all(
        page.sub.map( async (pg) => {
            await handlePages(pg, basePath, ext, parent);
        })
       );
    }

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

    await Promise.all(data.layout.pages.map(async (page) => {
        await handlePages(page, basePath, ext);
    }));

    await Promise.all(data.layout.pages.map(async (page) => {
        await makeRoutes(page);
    }));

    console.log(routes);

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
    let path = __dirname + "/base/project-"+data.type;
    let dest = process.cwd() + "/" + data.project;
    await copyBase(path, dest);
    // exec(`cd ${data.project} && npm install`, (err, stdout, stderr) => {
    //     magic(data);
    // });

    magic(data);
}

const makeRoutes = async (page) => {
    let name = page.name;
    if(!isNaN(name.charAt(0))) {
        name = numbers[+name.charAt(0)] + name.slice(1);
    }
    name = name.replace(/\s/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if(page.sub && page.sub.length > 0) {
        routes += `<Route path="${name.toLowerCase()}" component={<${name} />}>\n`;
        
        await Promise.all(
            page.sub.map( async (pg) => {
                await makeRoutes(pg);
            })
        );

        routes += `</Route>\n`;

    }
    else{
        routes += `<Route path="${name.toLowerCase()}" component={<${name} />} />\n`;
    }
}

module.exports = {
    copyProject,
    start
}