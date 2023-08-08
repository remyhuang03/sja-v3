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
    <?php include "/includes/header.php";?>

    <main>
        <div class="report">
            <?php
            if ($_SERVER["REQUEST_METHOD"] == "GET") {
                echo "<p>暂无报告，上传文件试试吧！</p>";
            } else if ($_SERVER["REQUEST_METHOD"] == "POST") {

                $script_path = $_SERVER['DOCUMENT_ROOT']."/api/analyze.py";
                $result = shell_exec("python $script_path $file_path");
                echo $result
            }
            ?>

        </div>

        <!-- 右侧栏 -->
        <div class="menu">
            <form method="post" enctype="multipart/form-data" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>">
                <!-- 选择文件按钮 -->
                <!-- width: auto; -->
                <label style="font-size: 20px; height: 100px;" class="btn" id="unloaded" for="input-upload">
                    选择文件
                    <input type="file" accept=".sb3,.json" id="input-upload" name="file">
                </label>

                <!-- 开始分析按钮 -->
                <button type="submit" style="font: 20px bold;" class="icon-btn">
                    <img src="img/start_ico.svg" alt="">
                    <span>开始分析</span>
                </button>
            </form>

            <ul id="result-menu">
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

    <?php include "/includes/footer.php";?>
    <script src="script.js"></script>
</body>

</html>