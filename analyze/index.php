<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SJA Plus 分析器</title>
    <link rel="icon" href="../img/logo.svg">
    <link rel="shortcut icon" href="../img/logo.svg" type="image/x-icon">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="style.css">

</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/header.php"; ?>

    <main>
        <div class="report">
            <?php
            if ($_SERVER["REQUEST_METHOD"] == "GET") {
                echo "<p>暂无报告，上传文件试试吧！</p>";
            } else if ($_SERVER["REQUEST_METHOD"] == "POST") {
                // POST方法下
                // 创建uploads文件夹（如无）
                $target_dir = $_SERVER['DOCUMENT_ROOT'] . "/uploads";
                if (!file_exists($target_dir)) {
                    mkdir($target_dir, 0755);
                }
                // 创建本次上传所需的随机文件夹
                $target_dir = $target_dir . '/analyze_'
                    . str_replace('.', '_', (string)microtime(true) . (string)mt_rand(1, 9999));
                if (!file_exists($target_dir)) {
                    mkdir($target_dir, 0755);
                }
                // 保存文件路径
                $target_file = $target_dir . '/' . basename($_FILES["file"]["name"]);
                //扩展名
                $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
                //是否允许上传
                $upload_ok = true;
                if (isset($_POST["submit"])) {
                    $check = getimagesize($_FILES["file"]["tmp_name"]);
                    if (!$check) {
                        $upload_ok = false;
                    }
                }
                // 文件不得大于20MB
                if ($_FILES["file"]["size"] > 20 * 1024 * 1024) {
                    echo "抱歉，SJA分析器目前仅支持20MB以下大小的文件。";
                    $upload_ok = false;
                }
                //文件格式错误（sb3, json）
                if ($file_type != "sb3" && $file_type != "json") {
                    echo "抱歉，SJA分析器目前仅支持sb3和json格式的文件。";
                    $upload_ok = false;
                }

                if ($upload_ok) {
                    // 临时文件保存到指定路径
                    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
                    $script_path = $_SERVER['DOCUMENT_ROOT'] . "/api/analyze.py";
                    //执行python分析程序获得结果
                    $result = shell_exec("python $script_path $target_file");


                    // 找到两个问号的位置
                    $first_pos = strpos($result, '?');
                    $second_pos = strpos($result, '?', $first_pos + 1);

                    // 提取第一个问号后面到第二个问号之间的子字符串
                    $status = substr($result, $first_pos + 1, $second_pos - $first_pos - 1);
                    // 提取第二个问号后面到字符串末尾的子字符串
                    $url = substr($result, $second_pos + 1);

                    if($status=="ok")
                    {
                        echo "<img src=$url>";
                    }
                    else
                    {
                        echo "抱歉，分析过程中遇到了错误。";
                        echo $url;
                    }
                }
            }
            ?>

        </div>

        <!-- 右侧栏 -->
        <div class="menu">
            <form method="post" enctype="multipart/form-data" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>">
                <!-- 选择文件按钮 -->
                <!-- width: auto; -->
                <?php
                $pwd_path = $_SERVER['DOCUMENT_ROOT'] . "/build/alpha_pwd.txt";
                $pwd_file = fopen($pwd_path, "r");
                $pwd = fread($pwd_file, filesize($pwd_path));
                fclose($pwd_file);
                ?>
                <label style="font-size: 20px; height: 100px;" class="btn" id="unloaded" for="input-upload">
                    选择文件
                    <input type="file" accept=".sb3,.json" id="input-upload" name="file">
                </label>

                <!-- 开始分析按钮 -->
                <?php
                if ((array_key_exists('pwd', $_GET) && $_GET['pwd'] == $pwd) ||
                    ($_SERVER["REQUEST_METHOD"] == "POST")
                ) {
                    echo '
                <button type="submit" style="font: 20px bold;" class="icon-btn">
                    <img src="img/start_ico.svg" alt="">
                    <span>开始分析</span>
                </button>';
                } ?>
            </form>

            <ul id="result-menu" <?php if ($_SERVER["REQUEST_METHOD"] == "GET") {
                                        echo 'style="display:none;"';
                                    }
                                    ?>>
                <li>
                    <button id="copy-md-btn" class="icon-btn">
                        <img src="img/md_ico.svg" alt="">
                        <span>复制Markdown</span>
                    </button>
                </li>
                <li>
                    <button id="save-report-btn" class="icon-btn">
                        <img src="img/download_ico.svg" alt="">
                        <span>下载报告图</span>
                    </button>
                </li>
            </ul>
        </div>
    </main>

    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/footer.php"; ?>
    <script src="script.js"></script>
</body>

</html>