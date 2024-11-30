<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/includes/verify_login.php';
if (isset($_POST['token'])) {
    //校验登录状态
    $ret = verify_login($_POST['token']);
    echo $ret !== null ? $ret : 'null';
}
