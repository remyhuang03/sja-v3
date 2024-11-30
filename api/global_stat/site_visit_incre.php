<?php
try {
    $is_ok = true;
    //验证uid
    require_once $_SERVER["DOCUMENT_ROOT"] . "/includes/verify_login.php";
    $uid = verify_login($_COOKIE["login"]);
    if ((!$uid && $uid !== 0) ||
        !isset($_GET["site_id"])
    ) {
        $is_ok = false;
    }
    //验证site_id
    $site_id = filter_var($_GET["site_id"], FILTER_VALIDATE_INT);
    if (!$site_id && $site_id !== 0) {
        $is_ok = false;
    }

    $db = connect_db('sja');
    //验证是否超过访问频率（50次，防止乱刷）
    $sql = "SELECT `record_cnt` FROM `nav_uid_record` 
            WHERE uid = $uid AND record_date = CURRENT_DATE();";
    $result = $db->query($sql)->fetch_array();
    if (!$result || $result[0] > 50) {
        $is_ok = false;
    } else {
        $sql = "INSERT INTO `nav_uid_record` (`uid`, `record_date`, `record_cnt`) 
        VALUES ($uid, CURRENT_DATE(), 1) 
        ON DUPLICATE KEY UPDATE record_cnt = record_cnt + 1;
        ";
        $db->query($sql);
    }

    if ($is_ok) {
        require_once $_SERVER["DOCUMENT_ROOT"] . "/includes/connect_db.php";
        $sql = "INSERT INTO nav_stat (site_id, visit_month, visit_cnt) 
                VALUES ($site_id, DATE_FORMAT(NOW(), '%m'), 1) 
                ON DUPLICATE KEY UPDATE visit_cnt = visit_cnt + 1;";

        $db->query($sql);
    }
    $db->close();
    echo "ok";
} catch (Exception $e) {
    echo "error";
}
