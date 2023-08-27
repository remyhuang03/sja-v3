// import Cookies from 'js-cookie'
// 查询登录状态
let is_login = false;
let is_login_checked = false;
let token = Cookies.get('login');
// 存在 login Cookie，校验登录状态
if (token != undefined) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = xhr.responseText;
            if (result != 'null') {
                Cookies.set('id', result);
                is_login = true;
                console.log(is_login);
            }
            else {
                Cookies.remove('login');
            }
            login_checked();
        }
    }
    xhr.open('POST', '/api/verify_login.php', true);
    let data = new FormData();
    data.append('token', token);
    xhr.send(data);
}
// 未登录，直接继续
else {
    login_checked();
}

function login_checked() {
    is_login_checked = true;
    const account_img = document.getElementById('account');
    const account_drop_box = document.getElementById('account-drop-box');
    const id_tag = document.getElementById('id-tag');

    // 根据登录状态设置
    if (is_login) {
        account_img.src = '/img/account-in.svg';
        id_tag.innerHTML = 'ID: ' + Cookies.get('id');
        account_drop_box.setAttribute('login', true);
    } else {
        account_img.src = '/img/account.svg';
        account_drop_box.setAttribute('login', false);
    }

    account_img.onclick = function () {
        if (!is_login) {
            window.location.href = '/login/index.html';
        }
    };

    const account_exit = document.getElementById('account-exit');
    account_exit.onclick = function () {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                Cookies.remove('login');
                Cookies.remove('id');
                location.reload();
            }
        }
        xhr.open('POST', '/api/log_out.php', true);
        let data = new FormData();
        data.append('token', Cookies.get('login'));
        xhr.send(data);
    };
};



