from pathlib import Path
from datetime import datetime
from time import time
import sys
from lxml import etree
import csv
from subprocess import run
import os
import math


def generate_pie_chart(values, colors):
    """
    返回饼图的svg字符串
    """
    ret = ""
    total = sum(values)
    start_angle = 0
    cx, cy = 495, 130  # 圆心坐标
    radius = 30  # 半径
    index = 0
    for value in values:
        percentage = value / total if total>0 else 0
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
with open("doc/category_report_format.csv", encoding="utf-8") as f:
    list_csv = list(csv.reader(f))
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
    "other",
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


def json_svg(json: dict):
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
    json['file_size'] = f"{json['file_size']/(1024*1024):.2f}"
    for key in ROW_1:
        change_elem(key, str(json[key]))
    # 2. 饼图
    categories = json["category_count"]
    # 各类型积木总数
    total_count = sum(categories.values())
    include_count = 0
    # 统计四大类型
    data = {
        "values": [0, 0, 0, 0],
        "labels": ["logic", "art", "interact", "display"],
        "colors": ["#4472c4", "#da0000", "#ffc000", "#548235"],
    }
    for cate in categories:
        if cate in cate_fmt:
            data["values"][data["labels"].index(cate_fmt[cate][2])] += categories[cate]
    chart = generate_pie_chart(data["values"], data["colors"])
    # 嵌入饼图到矢量图
    change_elem("pie_chart_row1", chart)
    # 3. 第二栏
    include_count = 0

    codes = """
index = ROW_2.index(key) + 1
main_color = cate_fmt[key][1]
pct = count / total_count if total_count>0 else 0
lighter_color = lighter(main_color)
if index<=6:
    percent_x = 140 + 155 * pct
else:
    percent_x = 425 + 155 * pct
change_elem(f"cate_count{index}", str(count), main_color)
change_elem(f"percent{index}", f"{pct:.1%}", main_color, x=percent_x)
change_elem(f"cate_name{index}", cate_fmt[key][0])
change_elem(f"cate_rect{index}", color=main_color)
change_elem(f"bar{index}", color=lighter_color, width=48 + 155 * pct)
"""
    for key in ROW_2:
        # 余项后面再处理
        if key == "other":
            continue
        count = categories.get(key, 0)
        include_count += count
        exec(codes)

    if "other" in ROW_2:
        key = "other"
        count = total_count - include_count
        exec(codes)

    date_str = datetime.utcfromtimestamp(json["datetime"]).strftime("%Y年%m月%d日")
    ver = json["core_version"]
    change_elem("footer_left", f"对比时间：{date_str}    内核版本号：{ver} ")

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
    # 压缩图像保存到
    scour_command = f"scour -i {Path(__file__).parent /'temp'/(file_name+'_t.svg')} -o {Path(__file__).parent /'temp'/(file_name+'.svg')} --enable-viewboxing --enable-id-stripping --enable-comment-stripping --shorten-ids --indent=none"
    run(scour_command, shell=True)
    os.remove(Path(__file__).parent / "temp" / (file_name + "_t.svg"))
    return file_name + ".svg"


if __name__ == "__main__":
    pass