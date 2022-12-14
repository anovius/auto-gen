var { promises: fs } = require("fs")
var path = require("path");
const { clearInterval } = require("timers");
var exec = require('child_process').exec;
var templates = require("./templates");


const start = async (data) => {
    await copyProject(data);
}

const createFile = async (path, name, data) => {
    await fs.mkdir(path, { recursive: true });
    await fs.writeFile(path + "/" + name, data);
}

const numbers = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

let importsString = '';
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
            importsString += `import ${page.name} from '${tempPath}';\n`
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
            importsString += `import ${page.name} from '${tempPath}';\n`;
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
        importsString += `import ${page.name} from '${tempPath}';\n`;
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

    writeData = templates.routesPage(importsString, routes);
    await createFile(basePath, "Router."+ext, writeData);

    exitScreen(data.project);

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
    exec(`cd ${data.project} && npm install`, (err, stdout, stderr) => {
        magic(data);
    });
}

const makeRoutes = async (page, spaces = 16) => {
    let name = page.name;
    if(!isNaN(name.charAt(0))) {
        name = numbers[+name.charAt(0)] + name.slice(1);
    }
    name = name.replace(/\s/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1);

    let indent = " ".repeat(spaces);

    if(page.sub && page.sub.length > 0) {
        routes += `${indent}<Route path="${name.toLowerCase()}" element={<${name} />}>\n`;
        page.sub.map( async (pg) => {
            await makeRoutes(pg, spaces+4);
        })
        routes += `${indent}</Route>\n`;
    }
    else{
        routes += `${indent}<Route path="${name.toLowerCase()}" element={<${name} />} />\n`;
    }
}

const exitScreen = (project) => {
    clearInterval(global.loader);
    console.log("\bProject created successfully!");
    console.log("To run the project, run the following commands:\n");
    console.log('\x1b[32m%s\x1b[0m', `   cd ${project}`);
    console.log('\x1b[34m%s\x1b[0m', `   npm run dev\n\n`);
    console.log("Bye Bye! \u{1F44B} \u{1F44B}");
}

module.exports = {
    copyProject,
    start
}