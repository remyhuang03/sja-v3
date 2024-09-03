// 加载网站json信息
const sites = {
    "0": ["共创社区", "https://ccw.site", "https://m.ccw.site/community/images/logo-ccw.png",],
    "1": ["稽木世界", "https://gitblock.cn", "https://gitblock.cn/Content/gitblock.ico"],
    "2": ["别针社区", "https://codingclip.com", "https://codingclip.com/favicon.ico"],
    "3": ["SJA分析器", "https://sjaplus.top", "https://sjaplus.top/favicon.ico"],
    "4": ["Snap编辑器", "https://snap.berkeley.edu/snap/snap.html", "https://snap.berkeley.edu/snap/src/favicon.ico"],
    "5": ["TurboWarp", "https://turbowarp.org/editor", "https://turbowarp.org/favicon.ico"],
    "6": ["小码王", "https://world.xiaomawang.com/w/index", "https://world.xiaomawang.com/favicon.ico"],
    "7": ["Github", "https://github.com/", "https://github.githubassets.com/favicons/favicon-dark.png"],
    "8": ["阿儿法营", "https://aerfaying.com/", "https://aerfaying.com/Content/logo.ico"],
    "9": ["Scratch吧", "https://tieba.baidu.com/f?kw=scratch&ie=utf-8", "https://gimg0.baidu.com/gimg/src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fpic%2Fitem%2F5bafa40f4bfbfbedfccd934a74f0f736afc31f6a.jpg&app=0&size=b150,150&n=0&g=0n&q=a80"],
    "10": ["40code", "https://www.40code.com/", "https://40code-cdn.zq990.com/static/internalapi/asset/360c5efe921dce64e13613251ccdbcd5.png"],
    "11": ["有道小图灵", "https://icodeshequ.youdao.com/", "https://ydschool-video.nosdn.127.net/1564472204313logo.ico"],
    "12": ["TW打包工具", "https://packager.turbowarp.org/", "https://turbowarp.org/favicon.ico"],
    "13": ["Scratch中社", "https://www.scratch-cn.cn/", "https://www.scratch-cn.cn/img/favicon.ico"],
    "14": ["编程猫", "https://shequ.codemao.cn/", "https://static.codemao.cn/whitef/favicon.ico"],
    "15": ["爱给网", "https://www.aigei.com/", "https://cdn-sqn.aigei.com/assets/site/img/icon/favicon.ico"],
}

let cates = {
    "🏠 编程社区": {
        "sites": [0, 1, 2, 6, 8, 10, 13, 14],
        "show": [0, 1, 2, 6, 8, 10, 13, 14]
    },
    "🔧 实用工具": {
        "sites": [3, 4, 5, 12],
        "show": [3, 4, 5, 12]
    },
    "💻 开发者网站": {
        "sites": [7],
        "show": [7]
    },
    "🧩 素材资源": {
        "sites": [15],
        "show": [15]
    },
    "📦 其它": {
        "sites": [9, 11],
        "show": [9, 11]
    }
}
/**
 * return HTML li str for the site with corresponding id
 * @param {int} id 
 * @returns {str}
 */

function createSiteBlock(id) {
    return `
    <li><a href="${sites[id][1]}" site_id="${id}" target="_blank"><img src="${sites[id][2]}"><span>${sites[id][0]}</span></a></li>
    `
}

function createSection(cate) {
    let sites = cates[cate]["show"];
    if (sites.length == 0)
        return '';

    let ret = `
        <section class="cate-section">
            <h2 class="site-cate">${cate}</h2>
            <ul class='site-list'>`;

    sites.forEach(site => {
        ret += createSiteBlock(site);
    });
    ret += `</ul></section>`;
    return ret;

}

function createMain() {
    const main = document.querySelector('main');
    for (let cate in cates) {
        main.innerHTML += createSection(cate);
    }
}

createMain();




