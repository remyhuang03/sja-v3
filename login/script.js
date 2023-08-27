// /login/index.html
// 网页中含有 error=1 时，提示登录失败
let url = window.location.href;
if (url.includes('error=1')) {
    alert("登录失败。请检查 ID 和口令是否正确。");
}

// 防止表单重复提交
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}