// command line: node ext-parser.js /path/to/extension.js
// return: parsing result of the extension
let acorn = require("acorn");
const fs = require("fs");

const ext_path = process.argv.slice(2)[0];

fs.readFile(ext_path, 'utf8', (err, data) => {
    const ret = parse(data);
    console.log(ret);
});

function parse(extJsText) {
    // DEV: check JS text
    //console.log(extJsText);
    return JSON.stringify(acorn.parse(extJsText, { ecmaVersion: 2020 }), null);
}
