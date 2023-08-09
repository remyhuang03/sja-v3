<?php $a = 5 ?>
<?php $target_dir = 'project_upload_' .
    str_replace('.', '_', (string)microtime(true) . (string)mt_rand(1, 9999));
$target_file = $target_dir . basename($_FILES["file"]["name"]);
$file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
$upload_ok = true;
if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["file"]["tmp_name"]);
    if (!$check) {
        $upload_ok = false;
    }
}
// 文件不得大于20MB
if ($_FILES["file"]["size"] > 20*1024*1024){
    echo "抱歉，SJA分析器目前仅支持20MB以下大小的文件。";
    $upload_ok = false;
}

if($file_type != "sb3" && $file_type != "json") {
    echo "抱歉，SJA分析器目前仅支持sb3和json格式的文件。";
    $upload_ok = false;
}

if($upload_ok)
{
    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
    
}

?>
