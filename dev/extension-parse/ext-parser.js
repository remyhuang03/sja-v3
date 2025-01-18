//// DOM elements //// 
const resultEl = document.getElementById('result');
const extFileEl = document.getElementById("ext-file");

results=[];

function parse(){
    
}

// load and parse each extension file
window.ext_files.forEach(ext => {
    extFileEl.src = ext;
    extFileEl.onload = parse;
});


