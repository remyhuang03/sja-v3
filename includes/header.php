<link rel="stylesheet" href="/includes/css/style.css">
<script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
<header>
    <div id='header-left'>
        <!-- 大标题 -->
        <a href="/index.php">
            <img src='/img/title.svg' alt='SJA Plus'>
        </a>

        <!-- links -->
        <ul>
            <li><a href='/analyze/index.php'>作品分析器</a></li>
            <li><a href='/stat/index.php'><del>数据看板</del>(仅限内测)</a></li>
        </ul>
    </div>

    <div id='header-right'>
        <div id='account-container'>
            <img src='' class='icon' id='account'>
            <!-- 头像附属下拉菜单 -->
            <div id='account-drop-box'>
                <ul>
                    <li id='id-tag'>ID: </li>
                    <li class='account-menu-item' id='account-exit'>退出登录</li>
                </ul>
            </div>
        </div>
    </div>
    <script src="/includes/js/header.js"></script>
</header>