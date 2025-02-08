$target_dir = $_SERVER['DOCUMENT_ROOT']. "/uploads";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0755);
}
// 创建本次上传所需的随机文件夹
$target_dir = $target_dir . '/analyze_'
. str_replace('.', '_', (string)microtime(true) . (string)mt_rand(1, 9999));
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0755);
}
//扩展名
$file_type = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
// 保存文件路径
$target_file = $target_dir . '/tmp.' . $file_type;
//是否允许上传
$upload_ok = true;
if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["file"]["tmp_name"]);
if (!$check) {
    $upload_ok = false;
    }
}
// 文件不得大于48MB
if ($_FILES["file"]["size"] > 48 * 1024 * 1024) {
    echo "抱歉，SJA分析器目前仅支持48MB以下大小的文件。";
$upload_ok = false;
}
//文件格式错误
if (!in_array($file_type, array("sb3", "cc3", "json"))) {
    echo "抱歉，SJA分析器目前仅支持以下格式：sb3 / json / cc3 。";
$upload_ok = false;
}

if ($upload_ok) {
    // 临时文件保存到指定路径
    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
$script_path = $_SERVER['DOCUMENT_ROOT'] . "/api/analyze.py";
$is_sort = filter_var($_POST["is_sort"], FILTER_VALIDATE_INT);
$is_high_rank_cate = filter_var($_POST["is_high_rank_cate"], FILTER_VALIDATE_INT);

    //执行python分析程序获得结果
    $result = shell_exec("python3 $script_path $target_file $is_sort $is_high_rank_cate 2>&1");

// 删除上传的文件及临时文件夹
unlink($target_file);
rmdir($target_dir);