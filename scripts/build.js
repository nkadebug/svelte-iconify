import { loadCollection, lookupCollections, locate, lookupCollection } from '@iconify/json';
import fs from 'node:fs';
import path from 'node:path';
async function main() {
    let collections = await lookupCollections();
    // let base = '/workspace/svelte-iconify/node_modules/@iconify/json/json';
    // let root = fs.readdirSync(base);
    // console.log(Object.keys(packs));
    fs.rmSync('src/lib/index.js');
    Object.keys(collections).every(async (name) => {
        let collection = await lookupCollection(name);
        console.log(collection.prefix, collection.info.total);
        Object.entries(collection.icons).every(([icon, data]) => {
            let file = capitalize(`icon-${name}-${icon}`);
            console.log(file);
            fs.writeFileSync(`src/lib/icons/${file}.svelte`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${data.body}</svg>`);
            fs.appendFileSync('src/lib/index.js', `\nexport { default as ${file} } from './icons/${file}.svelte';`);
            return true;
        });
        return true;
    });
}

main();

function capitalize(text) {
    return text.replace(/-/g, ' ').split(' ').map(part => {
        return part[0].toUpperCase() + part.slice(1);
    }).join('');

}