
let input = document.querySelector("#input-upload");

let bottom_btns = document.querySelectorAll(".bottom-btn");
bottom_btns.forEach(btn => {
    btn.style.display = 'none';
});

let upload_btn = document.querySelector("#upload-btn");
upload_btn.style.display = 'flex';

input.onchange = function () {
    let file = this.files[0];
    if (file) {
        let file_size_bytes = file.size;
        let file_extention = file.name.split('.').pop().toLowerCase();
        if (file_extention === "json") {
            if (file_size_bytes > 30 * 1024 * 1024) {
                alert("抱歉，SJA暂不支持30MB以上大小的文件")
                return;
            }
            summit_file(file);
        }
        else if (file_extention === 'sb3') {
            unzip_sb3_to_json(file);
        }
        else {
            return;
        }
    }
}


function unzip_sb3_to_json(sb3File) {
    const zip = new JSZip();

    zip.loadAsync(sb3File).then(zipData => {
        const projectJson = zipData.file('project.json');
        if (projectJson) {
            projectJson.async('json').then(jsonData => {
                summit_file(jsonData);
            });
        }
        else {
            alert('项目中找不到 project.json 文件');
        }
    }).catch(error => {
        alert('解压.sb3文件出错' + error.message);
    });
}

function summit_file(file) {
    alert("文件可以提交！")
}