<?php
// 禁止 PHP 报错泄露安全信息
try {
    $is_login_success = true;
    $id = $_POST['id'];
    $pwd = $_POST['pwd'];
    //过滤规则：仅包含字母和数字
    $filter_rule = array("options" => array("regexp" => "/^[a-zA-Z0-9]+$/"));
    if (
        filter_var($id, FILTER_VALIDATE_REGEXP, $filter_rule)
        && filter_var($pwd, FILTER_VALIDATE_REGEXP, $filter_rule)
    ) {
        // 验证加盐密码
        $salt = file_get_contents($_SERVER['DOCUMENT_ROOT'] . "/build/login_salt.txt");
        $id_with_salt = $id . $salt;
        $correct_hash = sha1($id_with_salt);
        if ($correct_hash != $pwd) {
            $is_login_success = false;
        }
    } else {
        $is_login_success = false;
    }

    //登录成功
    if ($is_login_success) {
        include($_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php");
        $db = connect_db('sja');

        $sql = "SELECT * FROM account WHERE associated_id = '$id'";
        $result = $db->query($sql);
        // 存在该账号
        if ($result->num_rows > 0) {
            $sja_id = $result->fetch_assoc()['id'];
        }
        // 不存在该账号
        else {
            // 获取最大的id+1得到新账号ID
            $sql = "SELECT MAX(id) FROM account";
            $sja_id = $db->query($sql)->fetch_array()[0] + 1;
            // 向数据库中增加账号
            $sql = "INSERT INTO account VALUES($sja_id,'$id')";
            $db->query($sql);
        }

        // 生成登录token
        $token = md5(uniqid());
        // 登录日期
        $date = date("Y-m-d");
        // 设置 cookie
        setcookie("login", $token, time() + 3600 * 24 * 30, "/");
        // 数据库记录token
        $sql = "INSERT INTO account_login (id, token, `date`) 
            VALUES ($sja_id, '$token', '$date') 
            ON DUPLICATE KEY UPDATE token = '$token', `date` = '$date'";
        $db->query($sql);
        $db->close();

        //登录完毕，跳转到主页
        header("Location: /index.php");
    }
    //登录失败
    else {
        header("Location: /login/index.html?error=1");
    }
} catch (Exception $e) {
    header("Location: /errors/500.html");
    // echo $e->getMessage();
}
