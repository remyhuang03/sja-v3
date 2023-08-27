let prj_manage_row_index = 0;

function wait_till_login_checked() {
    if (is_login_checked) {
        load_stat();
    } else {
        setTimeout(wait_till_login_checked, 100);
    }
}

function load_stat() {
    if (is_login) {
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


                    projects.forEach(prj => {
                        create_row(prj_manage_row_index, prj["name"], prj["report"]);
                        prj_manage_row_index += 1;
                    });
                    init_page();
                }
                else if (date['status'] == 'error') {
                    alert("抱歉，服务器出现了错误，请联系开发者。");
                }
            }
            )

    }
    else {
        window.location.href = '/login/index.html'
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
        submit_prj_update(true);
    };

    manage_project_btn.onclick = function () {
        manage_project_board.style.display = 'block';
        manage_mask.style.display = 'block';
    }

    manage_add_btn.onclick = function () {
        create_row(prj_manage_row_index, "", "");
        edit_row(prj_manage_row_index);
        prj_manage_row_index += 1;
    }
}

function edit_row(row_index) {
    //提交其它正处于编辑状态的填空（如有）
    submit_prj_update();

    let row_tr = document.querySelector(`tr[index="${row_index}"]`)

    let project_name =
        row_tr.querySelector(`td[class="project_name"]`).innerHTML;
    let file_name =
        row_tr.querySelector(`td[class="file_name"]`).innerHTML;

    row_tr.innerHTML = `
    <tr index="${row_index}">
        <td>
            <input old="${project_name}" value="${project_name}" class="manage-ipt" id="project_name_ipt" index="${row_index}">
        </td>
        <td>
            <input old="${file_name}" value="${file_name}" class="manage-ipt" id="file_name_ipt" index="${row_index}">
        </td>
        <td>
            <img src="img/save.svg" alt="保存" id="save-btn" index="${row_index}">
        </td>
    </tr>`;

    let save_btn = document.getElementById("save-btn");
    save_btn.onclick = function () { submit_prj_update(); }
}

function submit_prj_update(no_alert = false) {
    console.log(no_alert);
    let save_btn = document.getElementById("save-btn");


    if (save_btn) {
        let row_tr = save_btn.parentNode.parentNode;
        let project_name_ipt = document.getElementById("project_name_ipt");
        let file_name_ipt = document.getElementById("file_name_ipt");

        let new_project_name = project_name_ipt.value;
        let new_file_name = file_name_ipt.value;

        let old_project_name = project_name_ipt.getAttribute("old");
        let old_file_name = file_name_ipt.getAttribute("old");

        let index = row_tr.getAttribute("index");

        function rollback_row() {
            //编辑模式，恢复原来状态
            if (old_project_name) {
                save_row(index, old_project_name, old_file_name);
            }
            //新建模式，取消新建
            else {
                delete_row(index);
            }
        }

        // 有一者空，取消修改
        if ((!new_file_name) || (!new_project_name)) {
            rollback_row();
            return;
        }

        // 有填写意图，校验填写内容 
        else {
            // 校验作品名称
            if (new_project_name.length > 30) {
                new_project_name = ''
                if (!no_alert)
                    alert("错误：作品名称长度不能超过 30 个字符");
            }

            //校验报告文件
            match = new_file_name.match(/[0-9]+_[0-9]+\.svg/g)
            if (match) {
                new_file_name = match[0];
            }
            else {
                if (!no_alert)
                    alert("错误：报告文件填写不正确，请粘贴报告文件 Markdown 代码");
                new_file_name = ""
            }

            //通过校验，提交修改
            let form = new FormData();
            form.append("report", new_file_name);
            form.append("name", new_project_name)

            let result;
            if (new_project_name && new_file_name) {
                console.log(new_project_name);
                fetch("/api/update_project.php", {
                    method: "POST",
                    body: form
                })
                    .then(response => response.text())
                    .then(data => { result = data; })
            }

            if (result = "ok") {
                save_row(index, new_project_name, new_file_name)
            }
            else {
                if (!no_alert)
                    alert("错误：发生未知错误");
                rollback_row();
                return;
            }
            //恢复该行状态
            if ((!new_file_name) || (!new_project_name) && no_alert) {
                rollback_row();
            }
        }
    }
}

function delete_row(index) {
    let row = document.querySelector(`tr[index="${index}"]`)
    row.remove();
}

function save_row(index, project_name, file_name) {
    delete_row(index);
    create_row(index, project_name, file_name);
}

function create_row(index, project_name = "", file_name = "") {
    const manage_table = document.querySelector('#manage-project tbody');

    manage_table.innerHTML += `
        <tr index=${index}>
            <td class='project_name'>${project_name}</td>
            <td class='file_name'>${file_name}</td>
            <td>
                <img src="img/edit.svg" alt="编辑" index=${index}>
                <img src="img/delete.svg" alt="删除" index=${index}>
            </td>
        </tr>`;

    delete_btn = document.querySelector(`img[alt="删除"][index="${index}"]`);
    delete_btn.onclick = function () {
        let project_name =
            document.querySelector(`tr[index="${index}"] 
                                            td[class="project_name"]`).innerHTML;
        let file_name =
            document.querySelector(`tr[index="${index}"] 
                                            td[class="file_name"]`).innerHTML;

        let confirm_delete = confirm('确定删除作品 ' + project_name + ' 吗？');

        if (confirm_delete) {
            fetch('/api/delete_project.php?report=' + file_name,)
                .then(response => response.text())
                .then(text => {
                    if (text == 'ok') {
                        delete_row(index);
                    }
                    else {
                        alert("删除失败");
                    }
                });
        }
    }

    edit_btn = document.querySelector(`img[alt="编辑"][index="${index}"]`);
    edit_btn.onclick = function () {
        edit_row(index);
    }
};





//main:
wait_till_login_checked();