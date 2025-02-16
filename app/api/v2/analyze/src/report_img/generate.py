from pathlib import Path
from datetime import datetime
from time import time
import sys
from lxml import etree
import csv
from subprocess import run, PIPE
import os
import math
from pprint import pprint


def generate_pie_chart(values, colors):
    """
    返回饼图的svg字符串
    """
    ret = ""
    total = sum(values)
    start_angle = 0
    cx, cy = 506, 130  # 圆心坐标
    radius = 30  # 半径
    index = 0
    for value in values:
        percentage = value / total if total > 0 else 0
        angle = 360 * percentage
        end_angle = start_angle + angle

        start_x = cx + radius * math.cos(math.radians(start_angle))
        start_y = cy + radius * math.sin(math.radians(start_angle))
        end_x = cx + radius * math.cos(math.radians(end_angle))
        end_y = cy + radius * math.sin(math.radians(end_angle))

        # 使用SVG的path元素绘制扇形
        path = f'<path d="M {cx},{cy} L {start_x},{start_y} A {radius},{radius} 0 {int(angle > 180)},1 {end_x},{end_y} Z" '

        # 添加填充颜色
        if colors:
            path += f'fill="{colors[index]}" '
        path += ">\n"
        path += "</path>\n"
        ret += path

        # 更新下一个扇形的起始角度
        start_angle = end_angle
        index += 1
    return ret


# 第二行的分类显示格式
with open(
    Path(__file__).parent.parent.parent.parent.parent.parent.parent
    / "data"
    / "blocks"
    / "category_report_format.csv",
    encoding="utf-8",
) as f:
    list_csv = list(csv.reader(f))
    # cate_fmt = {row[0]: [" ".join(list(row[1]))] + row[2:] for row in list_csv}
    # en_cate: [zn_cate, color, main_cate]
    cate_fmt = {row[0]: row[1:] for row in list_csv}
ROW_1 = [
    "file_size",
    "sprite_count",
    "costume_count",
    "sound_count",
    "valid_paragraph_count",
    "total_paragraph_count",
    "valid_block_count",
    "total_block_count",
]

ROW_2 = [
    "motion",
    "looks",
    "sound",
    "event",
    "control",
    "sensing",
    "operator",
    "data",
    "procedures",
    "pen",
    "canvas",
]


def lighter(color):
    """
    使颜色变浅
    para:
        color: str
            hex值，不带#
    """
    r, g, b = int(color[0:2], 16), int(color[2:4], 16), int(color[4:6], 16)
    COEFFICIENT = 0.6
    new_r = int(r + (255 - r) * COEFFICIENT)
    new_g = int(g + (255 - g) * COEFFICIENT)
    new_b = int(b + (255 - b) * COEFFICIENT)

    ret = "{:02x}{:02x}{:02x}".format(new_r, new_g, new_b)
    return ret


def json_svg(json: dict, is_sort: bool = False, is_high_rank_cate: bool = False):
    def change_elem(id, text=None, color=None, **attrs):
        """
        以id更改对应项

        para:
            id: str
            text: str
            color: str
                hex值，不带#
            width: float

        ret:
            str: 诸如“1607893_1234.svg” 的字符串

        """
        elem = root.find(f".//*[@id='{id}']")
        # print(id)

        if text:
            elem.text = elem.text.replace("?", text)
        if color:
            elem.attrib["fill"] = "#" + color
        for attr in attrs:
            elem.attrib[attr] = str(attrs[attr])

    tree = etree.parse(
        open(Path(__file__).parent / "res" / "report_model.svg", encoding="utf-8")
    )
    root = tree.getroot()
    # 1. 第一栏
    # file_size from bytes to MB
    json["file_size"] = f"{json['file_size']/(1024*1024):.2f}"
    for key in ROW_1:
        change_elem(key, str(json[key]))

    # 2. 饼图
    categories = json["category_count"]
    # 各类型积木总数
    total_count = sum(categories.values())
    include_count = 0
    # 统计五大类型
    data = {
        "values": [0, 0, 0, 0, 0],
        "labels": ["operation", "control", "art", "interact", "display"],
        "colors": ["#4472c4", "#ffc000", "#da0000", "#5332ee", "#548235"],
    }
    for cate in categories:
        if cate in cate_fmt:
            data["values"][data["labels"].index(cate_fmt[cate][2])] += categories[cate]
    chart = generate_pie_chart(data["values"], data["colors"])
    # 嵌入饼图到矢量图
    change_elem("pie_chart_row1", chart)

    # 3. 第二栏
    cate_stat = {}

    # cates stat dict contaning only known cates
    known_cates = {key: categories[key] for key in categories if key in cate_fmt}

    if is_high_rank_cate:
        cate_sorted = [
            a[0] for a in sorted(known_cates.items(), key=lambda x: x[1], reverse=True)
        ][0:11]

        cate_stat = categories
        cates = list(cate_stat.keys()).copy()
        for k in cates:
            if k not in cate_sorted:
                del cate_stat[k]

    else:
        cate_stat = {k: categories.get(k, 0) for k in ROW_2}

    cate_stat["other"] = total_count - sum(cate_stat.values())
    cate_max_cnt = max(cate_stat.values())

    cate_stat_lst = list(cate_stat.items())

    if is_sort:
        cate_stat_lst.sort(key=lambda a: a[1], reverse=True)

    index = 1
    while index <= 12:
        if len(cate_stat_lst) >= index:
            key, count = cate_stat_lst[index - 1]
            if key in cate_fmt:
                main_color = cate_fmt[key][1]
            else:
                main_color = "000000"
            pct = count / total_count if total_count > 0 else 0
            ui_pct = count / cate_max_cnt if cate_max_cnt > 0 else 0

        else:
            main_color = "ffffff"
            pct = 0

        lighter_color = lighter(main_color)
        if index <= 6:
            percent_x = 135 + 120 * ui_pct
        else:
            percent_x = 419 + 120 * ui_pct
        change_elem(f"cate_count{index}", str(count), main_color)
        change_elem(f"percent{index}", f"{pct:.1%}", main_color, x=percent_x)
        change_elem(f"cate_name{index}", cate_fmt[key][0])
        change_elem(f"cate_rect{index}", color=main_color)
        change_elem(f"bar{index}", color=lighter_color, width=46 + 120 * ui_pct)
        index += 1

    date_str = datetime.fromtimestamp(json["datetime"]).strftime("%Y年%m月%d日")
    ver = json["core_version"]
    change_elem("footer_left", f"分析时间：{date_str}    内核版本：{ver} ")

    # 保存处理好的报告图
    file_name = str(time()).replace(".", "_")
    with open(
        Path(__file__).parent / "temp" / (file_name + "_t.svg"), "w", encoding="utf-8"
    ) as f:
        f.write(
            etree.tostring(root, encoding="utf-8")
            .decode("utf-8")
            .replace("&gt;", ">")
            .replace("&lt;", "<")
        )
    # 压缩图像保存
    scour_command = f"scour -i {Path(__file__).parent /'temp'/(file_name+'_t.svg')} -o {Path(__file__).parent /'temp'/(file_name+'.svg')} --enable-viewboxing --enable-id-stripping --enable-comment-stripping --shorten-ids --indent=none"
    run(scour_command, shell=True, stdout=PIPE, stderr=PIPE)
    os.remove(Path(__file__).parent / "temp" / (file_name + "_t.svg"))
    return file_name + ".svg"


if __name__ == "__main__":
    pass
