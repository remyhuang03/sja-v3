<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SJA分析器</title>
    <meta name="description" content="SJA分析器为您快速分析Scratch作品文件、提供抄袭比对、数据看板等多样化功能。">
    <link rel="icon" href="img/logo.svg">
    <link rel="shortcut icon" href="img/logo.svg" type="image/x-icon">
    <link rel="stylesheet" href="css/homepage.css">
    <meta property="og:image" content="./img/seo-meta.png">

</head>

<body>

    <?php include "./includes/header.php"; ?>

    <main>

        <div class="left-column">
            <!-- <ul id='news'>
                <li>
                    欢迎使用 SJA Plus 版！这是 SJA 继 Scratch 版本以来的一次重大更新。SJA Plus 版帮助你更准确、更快捷、更多样化地分析 Scratch 作品。

                    SJA 原名为 Scratch Json Analyzer，意为“分析 Scratch 项目中 json 文件的分析器”，原文实为中式英语的表达法，虽不妥当，但当时分析器已被广泛使用，为此分析器制作不久后就更名为了 SJA 分析器。
                </li>
            </ul> -->
            <h2>SJA分析器 Plus版</h2>
            <p>
                欢迎使用 SJA Plus 版！这是 SJA 继 Scratch 版本以来的一次重大更新。SJA Plus 版帮助你更准确、更快捷、更多样化地分析 Scratch 作品。
            </p>
            <p>
                SJA 原名为 Scratch Json Analyzer，意为“分析 Scratch 项目中 json
                文件的分析器”，原文实为中式英语的表达法，虽不妥当，但当时分析器已被广泛使用，为此分析器制作不久后就更名为了 SJA 分析器。
            </p>
            <p>
                SJA 分析器先后经 Scratch 版、旧 Python 版开发，积累了很多问题，也受到了大家的诸多反馈，为此我决定重新制作 SJA 分析器，修复目前已知的问题，提供更好的分析体验。SJA
                分析器的制作初衷是为了反对作品抄袭现象而提供作品对比功能，作品分析功能仅为推广方便而制作。某平台关闭后，抄袭现象明显减少，但是作品分析的需求却增多了，SJA 分析器的重心也将转移到作品分析上。
            </p>
            <img src="/img/home-bg.svg" alt="">
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