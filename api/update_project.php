<?php
/*
@request
    $_POST['report']: text
        作品报告文件名
    $_POST['name']: text
        作品名称
@response: text
    'ok' | 'error' 处理成功或失败
*/
header("Content-Type: text/plain");
// 存储需要返回的json数据

try {
    //校验登录状态
    $token = $_COOKIE['login'];
    include_once $_SERVER['DOCUMENT_ROOT'] . "/includes/verify_login.php";
    $user_id = verify_login($token);

    if ($user_id !== null && isset($_POST['name']) && isset($_POST['report'])) {
        include_once $_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php";
        $db = connect_db("sja");

        $report = substr(filter_var(
            $_POST['report'],
            FILTER_VALIDATE_REGEXP,
            array("options" => array("regexp" => "/^[0-9]+_[0-9]+\.svg$/"))
        ), 0, 40);

        $name = mysqli_real_escape_string($db, substr($_POST['name'], 0, 30));

        $sql = "INSERT INTO `user_project`(`id`,`name`,`report`)
                VALUES($user_id,'$name','$report')
                ON DUPLICATE KEY UPDATE `name` = '$name', `report` = '$report'";
        $db->query($sql);
        $db->close();

        echo 'ok';
    } else {
        echo 'error';
    }
} catch (Exception $e) {
    echo 'error';
}
