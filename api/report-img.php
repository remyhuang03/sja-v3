<?php
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'None');
session_start();
# 没有stamp参数，返回400
if (!isset($_GET['stamp'])) {
    header('HTTP/1.1 400 Bad Request');
} else {
    $stamp =  filter_var(
        $_GET['stamp'],
        FILTER_VALIDATE_REGEXP,
        array("options" => array("regexp" => "/^[0-9]+_[0-9]+\.svg$/"))
    );
    # 检查本地是否有文件
    $local_report_path = $_SERVER['DOCUMENT_ROOT'] . "/api/analyze_import/report_img/sja-reports/$stamp";
    if (file_exists($local_report_path)) {
        $svgContent = file_get_contents($local_report_path);
        # 返回本地svg文件
        header('Content-Type: image/svg+xml');
        header('Content-Length: ' . strlen($svgContent));
        echo $svgContent;
    } else {
        $svgURL = "https://cdn.jsdelivr.net/gh/h8p0/sja-reports/$stamp";
        header('Location: ' . $svgURL);
    }

    /* 此操作有引起图片访问变慢的风险，予以下架
    # 获取来源网址
    $referer = $_SERVER['HTTP_REFERER'];
    # 换算来源平台
    function is_referer_of($referer, $domain)
    {
        $host = parse_url($referer)['host'];
        $domain_ref = preg_replace('/^www\./', '', $host);
        if ($domain_ref == $domain)
            return true;
        return false;
    }

    $platform = '';
    if (
        is_referer_of($referer, 'gitblock.cn') ||
        is_referer_of($referer, 'aerfaying.com')
    ) {
        $platform = 'a';
    } elseif (is_referer_of($referer, 'codingclip.com')) {
        $platform = 'cc';
    } elseif (is_referer_of($referer, 'ccw.site')) {
        $platform = 'ccw';
    } elseif (is_referer_of($referer, 'sjaplus.top')) {
        $platform = 'sja';
    } elseif (is_referer_of($referer, 'localhost:3000')) {
        $platform = 'local';
    } elseif (is_referer_of($referer, '40code.com')) {
        $platform = 'fz';
    } elseif (is_referer_of($referer, 'bcdou.cn')) {
        $platform = 'bcd';
    } else {
        $platform = $referer;
    }

    $is_record_to_db = true;
    // 没有来源或者来自SJA平台的不记录
    if ($platform == 'sja' || strlen($platform) == 0 || $platform == 'local') {
        $is_record_to_db = false;
    }
    // 5分钟内同一会话的重复访问不记录
    if (isset($_SESSION[$stamp]) && time() - $_SESSION[$stamp] < 5 * 60) {
        $is_record_to_db = false;
    }
    try {
        #链接数据库并记录访问
        if ($is_record_to_db) {
            $_SESSION[$stamp] = time();
            include $_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php";
            $conn = connect_db('sja');
            $date = date('Y-m-d');
            if (!$conn->connect_error) {
                $sql = "INSERT INTO `project_stat`(`file`, `visit_date`, `origin`, `visit_cnt`) 
                        VALUES ('$stamp','$date', '$platform',1)
                        ON DUPLICATE KEY UPDATE `visit_cnt`=`visit_cnt`+1";
                $conn->query($sql);
                $conn->close();
            }
        }
    } catch (Exception $e) {
        // do nothing
    }*/
    exit;
}
