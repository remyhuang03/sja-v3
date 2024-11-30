<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SJA分析器</title>
    <meta name="description" content="SJA分析器为您快速分析Scratch作品文件、提供抄袭比对、数据看板等多样化功能。">
    <link rel="icon" href="/assets/img/logo/main-logo.svg">
    <link rel="shortcut icon" href="/assets/img/logo/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/assets/css/homepage.css">
    <meta property="og:image" content="./img/seo-meta.png">

    <script src="/assets/js/news-list.js" defer></script>
</head>

<body>

    <?php include "./includes/header.php"; ?>

    <main>

        <div class="announcement">
            <!-- <div class="banner">
                <a href="">
                    <img src="https://placehold.co/200x200">
                </a>
            </div> -->
            <section class="news-wrapper">
                <ul>
                </ul>

            </section>
        </div>
        <div class="right-column">
            <a href="analyze/index.php" class="tool-btn" id="analyze-btn">
                <div>作品分析器</div>
            </a>
            <a href="nav/index.php" class="tool-btn" id="nav-btn">
                <div>航站楼</div>
            </a>
            <!-- <a href="stat/index.php" class="tool-btn" id="stat-btn">
                <div>数据看板(内测)</div>
            </a> -->
            <a href="cmpr/index.php" class="tool-btn" id="cmpr-btn">
                <div><del>抄袭对比器（开发中）</del></div>
            </a>
            <a href="update-log/index.php" id='update-log-btn' class="tool-btn">
                <div>更新日志</div>
            </a>
            <a href="https://note.youdao.com/s/80ZZTzYW" target="_blank" id='faq-btn' class="tool-btn">
                <div>常见问题</div>
            </a>
        </div>
    </main>

    <?php include "./includes/footer.php"; ?>
</body>

</html>