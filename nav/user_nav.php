<?php
header('Content-Type: application/json; charset=utf-8');
$res = array();

require $_SERVER['DOCUMENT_ROOT'] . '/includes/verify_login.php';
$id = verify_login($_COOKIE['login']);

if ($id) {
    try {
        $db = connect_db('sja');
        $sql = "SELECT `site_id`,`decision` FROM `user_nav` WHERE `uid` = $id";
        $result = $db->query($sql);
        $db->close();
        while ($row = $result->fetch_assoc()) {
            $res['data'] = array();
            $res['data'] += array($row['site_id'] => $row['decision']);
        }
        $res['status'] = 'success';
    } catch (Exception $e) {
        $res['status'] = 'error';
        $res['msg'] = '数据库连接失败';
    }
} else {
    $res['status'] = 'error';
    $res['msg'] = '用户尚未登录';
}

echo json_encode($res);
