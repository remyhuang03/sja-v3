<?php
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit;
} else {
    if (!key_exists('stamp', $_GET)) {
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
    }
}
exit;
