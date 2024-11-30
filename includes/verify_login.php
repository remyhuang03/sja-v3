<?php
// 接收get请求+token参数，校验登录状态

/**
 * 校验登录状态（自带token过滤）
 * @param string $token 用户Cookie["login"]
 * @return null|int 登录成功则返回用户id，否则返回null
 */
function verify_login($token)
{
    //过滤 token 参数
    $token = strtolower($token);
    $token = filter_var(
        $token,
        FILTER_VALIDATE_REGEXP,
        array("options" => array("regexp" => "/^[a-z0-9]{32}$/"))
    );
    
    //链接数据库查询token
    require_once($_SERVER['DOCUMENT_ROOT'] . '/includes/connect_db.php');
    $db = connect_db('sja');
    $sql = "SELECT * FROM `account_login` 
            WHERE `token` = '$token' 
            AND `date` > DATE_SUB(NOW(), INTERVAL 30 DAY)";
    $result = $db->query($sql);
    $db->close();
    return $result->num_rows===1 ? $result->fetch_assoc()['id'] : null;
}

