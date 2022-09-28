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
    
    export const ${name} = () => {
        return (
            ${header ? `<Header />` : ''}
            ${content}
            ${footer ? `<Footer />` : ''}
        )
    }
    `
    data = data.replace(/^\s*\n/gm, '');
    return data;
}







module.exports = {
    samplePage
}