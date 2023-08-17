<?php
# 没有stamp参数，返回400
if (!isset($_GET['stamp'])) {
    header('HTTP/1.1 400 Bad Request');
} else {
    $stamp = htmlspecialchars($_GET['stamp']);
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

    #链接数据库并记录访问
    if ($is_record_to_db) {
        $_SESSION[$stamp] = time();
        include $_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php";
        $conn = connect_db('sja');
        if (!$conn->connect_error) {
            $conn->query("INSERT INTO analyze_report_visit VALUES ('$stamp',DEFAULT, '$platform')");
            $conn->close();
        }
    }
}
exit;
