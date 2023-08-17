<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据看板</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/header.php"; ?>

    <!-- 菜单栏 -->
    <ul id='menu'>
        <li><button type="button">管理作品</button></li>
        <li>
            <select>
                <option value="7d">7天内</option>
                <option value="1m">1个月内</option>
                <option value="3m">3个月内</option>
                <option value="all">全部</option>
            </select>
        </li>

    </ul>
    <?php
    // 存储所有选中需查询的作品id
    $file_name_arr = array();
    if (isset($_GET['file'])) {
        $file_name = $_GET['file'];
        if (preg_match('/[0-9_]+\.svg/', $file_name)) {
            array_push($file_name_arr, $file_name);
        }
    }
    
    // 数组转sql清单字符串
    $file_name_lst_str = "('" . implode("','", $file_name_arr) . "')";

    //链接数据库，查询(time,origin,COUNT)
    include $_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php";
    $db = connect_db("sja");
    $sql = "SELECT DATE(visit_time), origin_website, COUNT(*)
            FROM analyze_report_visit 
            WHERE file_name IN $file_name_lst_str
            GROUP BY DATE(visit_time), origin_website
            ORDER BY visit_time;";
    $results = $db->query($sql);

    //查询
    //所有file_name_arr作品的昨日新增总数
    $yesterday_visit_cnt = $db->query("SELECT COUNT(*) FROM analyze_report_visit
     WHERE DATE_SUB(CURDATE(), INTERVAL 1 DAY) = DATE(visit_time) AND
     stamp IN $file_name_lst_str
     ")->fetch_field();
    //所有file_name_arr作品的总访问量
    $total_visit_cnt = $db->query("SELECT COUNT(*) FROM analyze_report_visit
     WHERE stamp IN $file_name_lst_str")->fetch_field();
    //最早一条数据的时间戳
    $earliest_timestamp = $db->query("SELECT MIN(visit_time) FROM analyze_report_visit
     WHERE stamp IN $file_name_lst_str")->fetch_field();

    //最早时间不足一周，趋势设为unkwon
    if (time() - $earliest_timestamp < 604800) {
        $trend = "unkwon";
    } else {
        //趋势
        // if ($recent_visit_ratio < 0.5) {
        //     $trend = -2;
        // } elseif ($recent_visit_ratio < 0.8) {
        //     $trend = -1;
        // } elseif ($recent_visit_ratio < 1.2) {
        //     $trend = 0;
        // } elseif ($recent_visit_ratio < 1.5) {
        //     $trend = 1;
        // } else {
        //     $trend = 2;
        // }
    }
    ?>
    <!-- 数据总览框 -->
    <div class="board">
        <h2>数据总览</h2>
        <section id='overview-box-wrapper'>

            <div class='overview-box'>
                <h3>昨日新增</h3>
                <div class='figure'>
                    <?php echo $yesterday_visit_cnt; ?>
                </div>
            </div>

            <div class='overview-box'>
                <h3>总访问量</h3>
                <div class='figure' id='main-figure'>
                    <?php echo $total_visit_cnt; ?>
                </div>
            </div>

            <div class='overview-box'>
                <h3>最近趋势</h3>
                <!-- trend: -2, -1, 0, 1, 2 (从显著下降到显著上升) -->
                <div class='figure' id='trend' trend='<?php echo $trend ?>'></div>
            </div>
        </section>
    </div>
    <!-- 统计图表框 -->

    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/footer.php"; ?>
</body>

</html>