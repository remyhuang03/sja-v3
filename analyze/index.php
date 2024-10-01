<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SJA作品分析器</title>
    <link rel="icon" href="/assets/img/logo/favicon.ico">
    <link rel="shortcut icon" href="../img/logo.svg" type="image/x-icon">
    <link rel="stylesheet" href="/assets/css/analyzer.css">
    <link rel="stylesheet" href="/assets/css/common.css">

</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/header.php"; ?>

    <h2 class="analyzer-title">SJA作品分析器</h2>
    <main>
        <div class="report sja-display">
            <?php
            $status = "";
            $url = "";
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

                    // 找到两个问号的位置
                    $first_pos = strpos($result, '?');
                    $second_pos = strpos($result, '?', $first_pos + 1);

                    // 提取第一个问号后面到第二个问号之间的子字符串（状态码）
                    $status = substr($result, $first_pos + 1, $second_pos - $first_pos - 1);

                    // 提取第二个问号后面到字符串末尾的子字符串
                    $url = substr($result, $second_pos + 1);
                    // 替换为同源链接
                    if (strpos($_SERVER['HTTP_HOST'], 'www') === 0) {
                        $url = str_replace('sjaplus.top', 'www.sjaplus.top', $url);
                    }
                    if ($status == "ok") {
                        echo "<img id='report' src=$url>";
                    } else {
                        echo "很抱歉，分析过程中遇到了错误。请将如下报错信息反馈给我们：<br>";
                        echo $result;
                    }
                }
            }
            ?>
        </div>


        <!-- 右侧栏 -->
        <div class="menu sja-display">
            <form method="post" enctype="multipart/form-data" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>">
                <!-- 自动提交token，防止重复提交表单 -->
                <input type="hidden" name="token">

                <!-- 选择文件框 -->
                <label style="font-size: 20px; height: 100px;" class="btn" id="unloaded" for="input-upload">
                    <span id="file-name" style="font-size:24px;">上传作品（sb3/json/cc3）</span>
                    <input type="file" accept=".sb3,.json,.cc3" id="input-upload" name="file">
                </label>

                <!-- 是否排序单选按钮 -->
                <fieldset>
                    <span>类型排序：</span>
                    <span class='radio-btn'>
                        <input type="radio" name="is_sort" value="1" id='is_sort-1' checked>
                        <label for='is_sort-1'>
                            降序排序
                        </label>
                    </span>
                    <span class='radio-btn'>
                        <input type="radio" name="is_sort" value="0" id='is_sort-0'>
                        <label for='is_sort-0'>
                            默认
                        </label>
                    </span>
                </fieldset>

                <!-- 统计图类型 -->
                <fieldset>
                    <span>显示占比积木：</span>
                    <span class='radio-btn'>
                        <input type="radio" name="is_high_rank_cate" value="1" id='is_high_rank_cate-1' checked>
                        <label for='is_high_rank_cate-1'>
                            排名前12的积木
                        </label>
                    </span>
                    <span class='radio-btn'>
                        <input type="radio" name="is_high_rank_cate" value="0" id='is_high_rank_cate-0'>
                        <label for='is_high_rank_cate-0'>
                            经典类型
                        </label>
                    </span>
                </fieldset>

                <!-- 开始分析按钮 -->
                <button type="submit" style="font: 20px bold;" class="icon-btn">
                    <img src="img/start_ico.svg" alt="">
                    <span>开始分析</span>
                </button>
            </form>


            <!-- 分析结果菜单（复制MD、下载报告图） -->
            <?php
            if ($_SERVER["REQUEST_METHOD"] == "POST" && $status == "ok") {
                echo
                "
                <hr>        
                <div class='notification'>
                    SJA 报告 markdown 加载速度已大幅提升，推荐直接粘贴 markdown 到作品简介！
                </div>
                <div>
                    <input type='checkbox' id='check_magnify'>
                        为报告图片提供点击放大功能（推荐用于CCW的小简介栏显示）
                    </input>
                </div>
                <ul id='result-menu'>
                
                <li>
                    <button id='copy-md-btn' class='icon-btn'>
                        <img src='img/md_ico.svg' alt=''>
                        <span>复制Markdown</span>
                    </button>
                </li>
                <li>
                <a href='$url' download='SJA分析报告.svg'>
                    <button id='save-report-btn' class='icon-btn'>
                        <img src='img/download_ico.svg' alt=''>
                        下载报告图
                    </button>
                </a>
                </li>
            </ul>";
            }
            ?>
        </div>
    </main>

    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/footer.php"; ?>
</body>
<script src='script.js'></script>

</html>