const samplePage = (name, header, footer, outlet) => {

let imp = outlet ? `import { Outlet } from 'react-router-dom';` : ''
let content = outlet ? `<Outlet />` : `<h1>${name}</h1>`
let headerImp = header ? `import ${name}Header from './${name}Header';` : ''
let footerImp = footer ? `import ${name}Footer from './${name}Footer';` : ''

    let data = `
import React from 'react';
${imp}
${headerImp}
${footerImp}

function ${name}() {
    return (
        <>
            ${header ? `<${name}Header />` : ''}
            ${content}
            ${footer ? `<${name}Footer />` : ''}
        </>
    )
}

export default ${name};
    `
data = data.replace(/^\s*\n/gm, '');
return data;
}

const mainPage = (header, footer) => {
    let headerImp = header ? `import Header from './components/layout/Header';` : ''
    let footerImp = footer ? `import Footer from './components/layout/Footer';` : ''
    
        let data = `
import React from 'react';
import Router from './Router';
${headerImp}
${footerImp}

function App() {
    return (
        <>
            ${header ? `<Header />` : ''}
            <Router />
            ${footer ? `<Footer />` : ''}
        </>
    )
}

export default App;
    `
data = data.replace(/^\s*\n/gm, '');
    return data;
}


const routesPage = (importsString, routes) => {
    let data = `
import React from 'react';
import { Route, Routes } from 'react-router-dom';
${importsString}

function Router() {
    return (
        <>
            <Routes>
${routes}
            </Routes>
        </>
    );
}

export default Router;
`
data = data.replace(/^\s*\n/gm, '');
    return data;
}

module.exports = {
    samplePage,
    mainPage,
    routesPage
}