let prj_manage_row_index = 0;
let is_editing = false;
const manage_tbody = document.querySelector('#manage-project tbody');

/**
    等待登录完成后自动加载网页
*/
function main() {
    //服务器已返回登录校验数据
    if (is_login_checked) {
        //用户已登录，加载页面和统计
        if (is_login) {
            show_stat();
            init_page();
        }
        //用户未登录，跳转到登录界面
        else {
            window.location.href = '/login/index.html'
        }
    } else {
        setTimeout(main, 50);
    }
}

function init_page() {
    // 作品管理界面的打开与关闭
    const manage_mask = document.getElementById('manage-mask');
    const manage_project_board = document.getElementById('manage-project');
    const close_btn = document.getElementById('close-btn');
    const manage_project_btn = document.getElementById('manage-project-btn');
    const manage_add_btn = document.getElementById('manage-add');

    close_btn.onclick = function () {
        manage_project_board.style.display = 'none';
        manage_mask.style.display = 'none';
    };

    manage_project_btn.onclick = function () {
        manage_project_board.style.display = 'block';
        manage_mask.style.display = 'block';
    }

    manage_add_btn.onclick = function () {
        if (!is_editing) {
            let index = create_row("", "");
            edit_row(index);
        }
    }
}

function edit_row(row_index) {
    is_editing = true;

    const row_tr = document.querySelector(`tr[index="${row_index}"]`)

    let project_name =
        row_tr.querySelector(`td[class="project_name"]`).innerHTML;
    let file_name =
        row_tr.querySelector(`td[class="file_name"]`).innerHTML;

    row_tr.innerHTML = `
        <td>
            <input old="${project_name}" value="${project_name}" class="manage-ipt" id="project_name_ipt" index="${row_index}" placeholder="自定义作品名称">
        </td>
        <td>
            <input old="${file_name}" value="${file_name}" class="manage-ipt" id="file_name_ipt" index="${row_index}" placeholder="作品报告 Markdown 代码">
        </td>
        <td>
            <img src="img/save.svg" alt="保存" id="save-btn" index="${row_index}">
        </td>`;

    let save_btn = document.getElementById("save-btn");
    save_btn.onclick = function () { save_edit(); }
}



function save_edit() {
    let save_btn = document.getElementById("save-btn");
    let index = save_btn.getAttribute("index");
    let row_tr = save_btn.parentNode.parentNode;

    if (save_btn) {
        let project_name_ipt = document.getElementById("project_name_ipt");
        let file_name_ipt = document.getElementById("file_name_ipt");

        let new_project_name = project_name_ipt.value;
        let new_file_name = file_name_ipt.value;

        let old_project_name = project_name_ipt.getAttribute("old");
        let old_file_name = file_name_ipt.getAttribute("old");

        let success = true;

        // 有一者空，取消修改
        if ((!new_file_name) || (!new_project_name)) {
            success = false;
        }
        // 有填写意图，校验填写内容
        else {
            // 校验作品名称
            if (new_project_name.length > 30) {
                success = false;
                alert("错误：作品名称长度不能超过 30 个字符");
            }

            //校验报告文件
            match = new_file_name.match(/[0-9]+_[0-9]+\.svg/g)

            //报告不合法
            if (!match) {
                success = false;
                alert("错误：报告文件填写不正确，请粘贴报告文件 Markdown 代码");
            }
            //报告名合法
            else {
                new_file_name = match[0];
                //报告重复
                if (is_report_exist(new_file_name)) {
                    success = false;
                    alert("错误：已有相同报告文件存在，不能重复添加");
                }
            }
        }

        //通过校验，提交修改
        if (success) {
            setNormalRow(index, new_project_name, new_file_name);
            if (old_file_name)
                delete_from_db(old_file_name);
            update_to_db(old_file_name, new_project_name, new_file_name,);
        }
        else {
            if (old_file_name)
                setNormalRow(index, old_project_name, old_file_name);
            else
                delete_row(index);
        }
    }
    is_editing = false;
}

function setNormalRow(index, name, report) {
    const rowTr = document.querySelector(`tr[index="${index}"]`);
    rowTr.innerHTML = `
        <td class='project_name'>${name}</td>
        <td class='file_name'>${report}</td>
        <td>
            <img src="img/edit.svg" alt="编辑" onclick="on_edit_btn_click(${index})">
            <img src="img/delete.svg" alt="删除" onclick="on_delete_btn_click(${index})">
        </td>
    `
}

function on_edit_btn_click(index) {
    edit_row(index);
}

function on_delete_btn_click(index) {
    let project_name =
        document.querySelector(`tr[index="${index}"] 
                                    td[class="project_name"]`).innerHTML;
    let file_name =
        document.querySelector(`tr[index="${index}"] 
                                    td[class="file_name"]`).innerHTML;

    let confirm_delete = confirm('确定删除作品 ' + project_name + ' 吗？');

    if (confirm_delete) {
        delete_row(index);
        delete_from_db(file_name);
    }
}


function create_row(name, report) {
    manage_tbody.innerHTML += `<tr index=${prj_manage_row_index}></tr>`;
    setNormalRow(prj_manage_row_index, name, report);
    prj_manage_row_index += 1;
    return prj_manage_row_index - 1;
};

function delete_row(row_index) {
    const row_tr = document.querySelector(`tr[index="${row_index}"]`);
    row_tr.remove();
}

async function delete_from_db(file_name) {
    try {
        const res = await fetch('/api/delete_project.php?report=' + file_name);
        const text = await res.text();
        return text == 'ok' ? true : false;
    }
    catch (e) {
        return false;
    }
}

async function add_to_db(name, report) {
    let form = new FormData();
    form.append("report", report);
    form.append("name", name);
    try {
        const res = await fetch("/api/update_project.php", {
            method: "POST",
            body: form
        });
        const text = await res.text();
        return text == 'ok' ? true : false;
    }
    catch (e) {
        return false;
    }
}


function update_to_db(oldReport, newName, newReport) {
    if (oldReport) {
        delete_from_db(oldReport).then(res => {
            if (res) {
                add_to_db(newName, newReport);
            }
        });
    }
    else {
        add_to_db(newName, newReport);
    }
}

function is_report_exist(report_name) {
    // 检查是否已存在 report_name 的报告
    files_td = document.querySelectorAll('.file_name');
    files_td.forEach(file_td => {
        if (file_td.innerHTML == report_name)
            return true;
    });
    return false;
}

function show_stat() {
    fetch('/api/user_project_stat.php')
        .then(response => response.json())
        .then(data => {
            if (data['status'] == 'ok') {
                // projects: [(report, name)] 作品名称和报告文件名
                let projects = data['projects'];
                // stat: [(file_name, visit_time, origin_website)] 
                // 报告文件名，访问时间戳，来源平台
                let stat = data['stat'];

                let yesterday_cnt = data['yesterday_cnt'];
                let yesterday_cnt_div = document.getElementById('yesterday-cnt');
                yesterday_cnt_div.innerHTML = yesterday_cnt;

                let total_cnt = data['total_cnt'];
                let total_cnt_div = document.getElementById('total-cnt');
                total_cnt_div.innerHTML = total_cnt;

                let last_3d = data['last_3d'];
                let last_but_one_3d = data['last_but_one_3d'];
                let ratio = 0;
                if (last_but_one_3d === 0) {
                    ratio = 10.0;
                }
                else {
                    ratio = last_3d / last_but_one_3d;
                }


                function set_trend(color, desc) {
                    // 设置trend颜色及文字
                    let trend_div = document.getElementById('trend');
                    trend_div.setAttribute('style', 'color:' + color);
                    trend_div.innerHTML = desc;
                }

                if (ratio > 1.5) {
                    set_trend('#cdad71', '↑ 飞速上升');
                }
                else if (ratio > 1.2) {
                    set_trend('#0fbd8c', '↗ 有所上升');
                }
                else if (ratio > 0.8) {
                    set_trend('#66ccff', '→ 稳定');
                }
                else if (ratio < 0.75) {
                    set_trend('#e96848', '↘ 有所下降');
                }
                else {
                    set_trend('#ce485a', '↓ 飞速下降');
                }

                const prj_trs = document.querySelectorAll('#manage-project tr + tr');
                prj_trs.forEach(tr => {
                    tr.remove();
                });
                projects.forEach(prj => {
                    create_row(prj["name"], prj["report"]);
                });

            }
            else if (data['status'] == 'error') {
                alert("抱歉，服务器出现了错误，请联系开发者。");
            }
        })
}

//main:
main();