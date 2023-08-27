<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据看板</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <!-- debug -->
    <link rel="stylesheet" href="/includes/css/style.css">
</head>

<body>
    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/header.php"; ?>

    <!-- 菜单栏 -->
    <ul id='menu'>
        <li>
            <button type="button" id="manage-project-btn">
                <img src="img/manage.svg" alt="">
                管理作品
            </button>
        </li>
        <li>
            <select>
                <option value="">【本功能尚未启用】</option>
                <option value="all">全部</option>
                <option value="work1">作品1</option>
                <option value="work2">作品2</option>
            </select>
        </li>
        <li>
            <select>
                <option value="">【本功能尚未启用】</option>
                <option value="all">全部</option>
                <option value="7d">7天内</option>
                <option value="1m">1个月内</option>
                <option value="3m">3个月内</option>
            </select>
        </li>

    </ul>

    <!-- 数据总览框 -->
    <div class="board">
        <h2>数据总览</h2>
        <section id='overview-box-wrapper'>

            <div class='overview-box'>
                <h3>昨日新增</h3>
                <div class='figure' id='yesterday-cnt'>
                    -
                </div>
            </div>

            <div class='overview-box'>
                <h3>总访问量</h3>
                <div class='figure' id='total-cnt'>
                    -
                </div>
            </div>

            <div class='overview-box'>
                <h3>最近趋势</h3>
                <!-- trend: -2, -1, 0, 1, 2 (从显著下降到显著上升) -->
                <div class='figure' id='trend'></div>
            </div>
        </section>
    </div>

    <!-- 统计图表框 -->
    <div class="board">
        孤言开学啦！后面的内容就咕咕咕吧，国庆再见啦 [doge]
        <div id="origin-pie-chart" style="width: 500px;height: 500px;">
        </div>
        <div id="view-line-chart" style="width: 800px;height: 400px;">
        </div>
    </div>

    <div id="manage-mask" class="mask"></div>

    <!-- 作品列表管理 -->
    <div id="manage-project">
        <div id="manage-header">
            <h2>作品管理</h2>
            <img src="img/close.svg" alt="关闭" id="close-btn">
        </div>
        <table>
            <tbody>
                <tr>
                    <th>作品名称</th>
                    <th colspan="3">报告标记</th>
                </tr>
            </tbody>
        </table>
        <button id="manage-add">
            <img src="img/add.svg" class="icon">
            <span>添加作品</span>
        </button>
    </div>

    <div id="input-mask" class="mask"></div>

    <?php include $_SERVER['DOCUMENT_ROOT'] . "/includes/footer.php"; ?>
    <script src='script.js'></script>
</body>


</html>