const samplePage = (name, header, footer, outlet) => {

let imp = outlet ? `import { Outlet } from 'react-router-dom';` : ''
let content = outlet ? `<Outlet />` : `<h1>${name}</h1>`
let headerImp = header ? `import Header from './Header';` : ''
let footerImp = footer ? `import Footer from './Footer';` : ''

    let data = `
import React from 'react';
${imp}
${headerImp}
${footerImp}

function ${name}() {
    return (
        <>
            ${header ? `<Header />` : ''}
            ${content}
            ${footer ? `<Footer />` : ''}
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
import Routes from './Routes';
${headerImp}
${footerImp}

function App() {
    return (
        <>
            ${header ? `<Header />` : ''}
            <Routes />
            ${footer ? `<Footer />` : ''}
        </>
    )
}

export default App;
    `
data = data.replace(/^\s*\n/gm, '');
    return data;
    }

module.exports = {
    samplePage,
    mainPage
}