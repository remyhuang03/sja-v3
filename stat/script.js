// 设置trend颜色及文字
let trend_div = document.getElementById('trend')
const TREND_INFO = {
    "unknown": ['#555', '未知']
}
trend_name = trend_div.getAttribute('trend')
trend_lst = TREND_INFO[trend_name]
trend_div.setAttribute('style', 'color:' + trend_lst[0])
trend_div.innerHTML = trend_lst[1]
