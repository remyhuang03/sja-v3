<?php
/*
@return: text
    'ok' | 'error' 处理成功或失败
*/
header("Content-Type: text/plain");
// 存储需要返回的json数据

try {
    //校验登录状态
    $token = $_COOKIE['login'];
    include_once $_SERVER['DOCUMENT_ROOT'] . "/includes/verify_login.php";
    $user_id = verify_login($token);

    $report = filter_var(
        $_GET['report'],
        FILTER_VALIDATE_REGEXP,
        array("options" => array("regexp" => "/^[0-9]+_[0-9]+\.svg$/"))
    );


    if ($user_id !== null) {
        include_once $_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php";
        $db = connect_db("sja");

        $sql = "DELETE FROM `user_project` 
                WHERE `id` = $user_id
                AND `report` = '$report'";
        $db->query($sql);
        $db->close();

        echo 'ok';
    } else {
        echo 'error';
    }
} catch (Exception $e) {
    echo 'error';
}
