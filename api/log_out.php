<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/includes/verify_login.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/includes/connect_db.php';
if (isset($_POST['token'])) {
    //过滤 token 参数
    $token = strtolower($_POST['token']);

    $token = filter_var(
        $token,
        FILTER_VALIDATE_REGEXP,
        array("options" => array("regexp" => "/^[a-z0-9]{32}$/"))
    );

    //存在登录状态则删除
    if (verify_login($token)!==null) {
        $db = connect_db('sja');
        $sql = "DELETE FROM `account_login` WHERE `token` = '$token'";
        $db->query($sql);
        $db->close();
    }
}
