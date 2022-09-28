const { promises: fs } = require("fs")
const path = require("path")
const exec = require('child_process').exec;

const start = (data) => {
    copyProject(data.project, data.type);
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

const copyProject = async (name, type) => {
    let path = __dirname + "/base/project-"+type;
    let dest = process.cwd() + "/" + name;
    await copyBase(path, dest);
    exec(`cd ${name} && npm install`, (err, stdout, stderr) => {});
}

module.exports = {
    copyProject,
    start
}