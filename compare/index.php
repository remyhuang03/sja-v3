<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>SJA 抄袭对比器</title>
    <link rel="icon" href="/assets/img/logo/favicon.ico">
    <link rel="shortcut icon" href="../img/logo.svg" type="image/x-icon">

    <link rel="stylesheet" href="/assets/css/common.css">
    <link rel="stylesheet" href="/assets/css/compare.css">
    
</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/header.php"; ?>

    <h2 id="main-title">
        SJA抄袭对比器
    </h2>
    <main>
        <div class="sja-display report-list" show="img">
            <img src="/assets/img/common/loading.svg" class="" alt="暂无报告">
        </div>


        <!-- 右侧栏 -->
        <div class="sja-display menu">
            <form method="post" enctype="multipart/form-data" action="/api/compare.php">

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


                <!-- 开始分析按钮 -->
                <button type="submit" style="font: 20px bold;" class="icon-btn">
                    <img src="img/start_ico.svg" alt="">
                    <span>开始分析</span>
                </button>
            </form>

        </div>
    </main>

    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/footer.php"; ?>
</body>

</html>