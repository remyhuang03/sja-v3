<?php
/*返回JSON数据
    status: 'ok' | 'error' 处理成功或失败
    yesterday_cnt: int 昨日新增
    projects: [(report, name)] 作品名称和报告文件名
    stat: [(file_name, visit_time, origin_website)] 报告文件名，访问时间戳，来源平台
    */
header("Content-Type: application/json");
// 存储需要返回的json数据
$ret = array();
$ret['status'] = 'ok';

try {
    //校验登录状态
    $token = $_COOKIE['login'];
    include_once $_SERVER['DOCUMENT_ROOT'] . "/includes/verify_login.php";
    $user_id = verify_login($token);

    if ($user_id !== null) {
        include_once $_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php";
        $db = connect_db("sja");

        $project_list = "SELECT `report` FROM `user_project`
                        WHERE `id` = $user_id";

        // 获取用户作品清单
        $sql = "SELECT `report`, `name` FROM `user_project` 
                WHERE `id` = $user_id";
        $result = $db->query($sql);
        $ret['projects'] = array();
        while ($row = $result->fetch_assoc()) {
            array_push($ret['projects'], $row);
        }

        // 获取用户作品的统计数据
        $sql = "SELECT * FROM `project_stat` 
                WHERE `file` IN ($project_list)
                ORDER BY `visit_date` DESC";
        $result = $db->query($sql);
        $ret['stat'] = array();
        while ($row = $result->fetch_assoc()) {
            array_push($ret['stat'], $row);
        }

        //昨日新增
        $sql = "SELECT COALESCE(SUM(`visit_cnt`),0) FROM `project_stat` 
                WHERE `file` IN ($project_list)
                AND `visit_date` = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
        $result = $db->query($sql);
        $ret['yesterday_cnt'] = $result->fetch_array()[0];

        //总访问量
        $sql = "SELECT COALESCE(SUM(`visit_cnt`),0) FROM `project_stat` 
                WHERE `file` IN ($project_list)";
        $result = $db->query($sql);
        $ret['total_cnt'] = $result->fetch_array()[0];

        //近3天平均访问量
        $sql = "SELECT COALESCE(AVG(`visit_cnt`),0) FROM `project_stat` 
                WHERE `file` IN ($project_list)
                AND `visit_date` >= DATE_SUB(CURDATE(), INTERVAL 3 DAY)
                AND `visit_date` < CURDATE()";
        $result = $db->query($sql);
        $ret['last_3d'] = $result->fetch_array()[0];

        //最近第4-6天平均访问量
        $sql = "SELECT COALESCE(AVG(`visit_cnt`),0) FROM `project_stat` 
                WHERE `file` IN ($project_list)
                AND `visit_date` >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                AND `visit_date` < DATE_SUB(CURDATE(), INTERVAL 3 DAY)";
        $result = $db->query($sql);
        $ret['last_but_one_3d'] = $result->fetch_array()[0];

        $db->close();
    } else {
        $ret['status'] = 'error';
    }
} catch (Exception $e) {
    $ret['status'] = 'error';
}

// 返回json数据
echo json_encode($ret);
