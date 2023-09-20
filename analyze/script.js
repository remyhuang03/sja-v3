// prevent form to be re-submitted
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// copy markdown
copy_md_btn = document.getElementById("copy-md-btn")
if (copy_md_btn) {
    copy_md_btn.addEventListener("click", function () {
        let url = document.getElementById("report").attributes["src"].value;
        let md = "";
        if ($("").prop("checked"))
            md = `[![](${url})](${url})`;
        else
            md = `[![](${url})](https://sjaplus.top)`;

        // copy to clipboard
        navigator.clipboard.writeText(md).then(function () {
            alert("Markdown 代码复制成功，可直接粘贴到作品简介。");
        }, function () {
            alert("Markdown 代码复制失败！");
        })
    })
}

// 文件拖拽上传功能
let load_lbl = document.getElementById("unloaded");
let file_ipt = document.getElementById("input-upload");
let file_name_span = document.getElementById("file-name");
load_lbl.addEventListener("dragenter", function (e) {
    e.preventDefault();
});
load_lbl.addEventListener("dragover", function (e) {
    e.preventDefault();
});
load_lbl.addEventListener("drop", function (e) {
    e.preventDefault();
    file_ipt.files = e.dataTransfer.files;
    handle_select_file();
});
file_ipt.addEventListener("change", function () {
    if (file_ipt.files.length > 0) {
        handle_select_file();
    }
});
function handle_select_file() {
    load_lbl.id = "uploaded";
    file_name_span.innerText = file_ipt.files[0].name;
}
// let input = document.querySelector("#input-upload");


// let upload_btn = document.querySelector("#upload-btn");
// upload_btn.style.display = 'flex';

// input.onchange = function () {
//     let file = this.files[0];
//     if (file) {
//         let file_size_bytes = file.size;
//         let file_extention = file.name.split('.').pop().toLowerCase();
//         if (file_extention === "json") {
//             if (file_size_bytes > 30 * 1024 * 1024) {
//                 alert("抱歉，SJA暂不支持30MB以上大小的文件")
//                 return;
//             }
//             summit_file(file);
//         }
//         else if (file_extention === 'sb3') {
//             unzip_sb3_to_json(file);
//         }
//         else {
//             return;
//         }
//     }
// }


// function unzip_sb3_to_json(sb3File) {
//     const zip = new JSZip();

//     zip.loadAsync(sb3File).then(zipData => {
//         const projectJson = zipData.file('project.json');
//         if (projectJson) {
//             projectJson.async('json').then(jsonData => {
//                 summit_file(jsonData);
//             });
//         }
//         else {
//             alert('项目中找不到 project.json 文件');
//         }
//     }).catch(error => {
//         alert('解压.sb3文件出错' + error.message);
//     });
// }

// function summit_file(file) {
//     alert("文件可以提交！")
// }