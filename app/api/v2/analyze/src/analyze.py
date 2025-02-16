import json
import csv
from .AnalyzeError import AnalyzeError
from .AnalyzeReport import AnalyzeReport
from .block_info import *

# 内核版本号
CORE_VERSION = "analyze-7.3.2"
# 分析报告
report = AnalyzeReport(CORE_VERSION)


def search_paragraph(id, isValidPara, blocks):
    # print(id)
    def get_block_attr(attr):
        if attr in blocks[id]:
            return blocks[id][attr]
        else:
            if attr == "next":
                # CCW例外，可能存在无 next 的情况
                return None
            elif attr == "shadow":
                # TW例外，可能存在无 shadow 的情况，此时返回 False（未验证正确性）
                return False
            else:
                raise AnalyzeError(f"找不到{attr}")

    def category_one_more_block(category):
        """报告中category分类下的积木数量+1"""
        report["category_count"][category] = (
            report["category_count"].get(category, 0) + 1
        )

    # 获取上一积木的相关属性
    opcode = get_block_attr("opcode")
    next = get_block_attr("next")
    inputs = get_block_attr("inputs")
    shadow = get_block_attr("shadow")

    category = get_category(opcode)

    # 是实体积木
    if not shadow:
        # 处理积木本身
        report["total_block_count"] += 1
        # 处于有效段落中
        if isValidPara:
            report["valid_block_count"] += 1

        # 积木类型统计
        category_one_more_block(category)

    # 记录该积木的后续积木
    next_blocks_id = set()
    # 记录next（如有）
    if next:
        next_blocks_id.add(next)
    # 处理input(例外：definition不做input处理)
    for input in list(inputs.values()):
        if opcode == "procedures_definition":
            break
        # input参数的类型标识符
        item_id = input[0]
        # 是变量（12）/列表（13）
        if item_id in [12, 13]:
            category_one_more_block("data")
            report["total_block_count"] += 1
            if isValidPara:
                report["valid_block_count"] += 1

        # no shadow (2) / shadow obsecured(3) 并且包含的不是形参
        elif (item_id in [2, 3]) and (
            category != "top-arg" or blocks[item_id]["opcode"] != "ccw_hat_parameter"
        ):
            # 嵌入的是正常积木
            if isinstance(input[1], str):
                next_blocks_id.add(input[1])
            # TW编辑器特异位置
            elif input[1] == None:
                pass
            # 嵌入的是变量/列表
            elif input[1][0] in [12, 13]:
                category_one_more_block("data")
                report["total_block_count"] += 1
                if isValidPara:
                    report["valid_block_count"] += 1
    del blocks[id]

    # 递归处理被记录的后续积木
    for id in next_blocks_id:
        search_paragraph(id, isValidPara, blocks)


def analyze(file_path: str, file_size: float = 0) -> dict:
    """
    SJA分析器主程序

    Para:
        file_path: str
            json文件路径
        file_size = 0: float
            原文件大小，单位为MB，精确到小数点后一位

    Return:
        dict
    """
    # load file
    with open(file_path, "r", encoding="utf-8") as f:
        try:
            # convert json file to json object
            json_project = json.loads(f.read())
        except:
            # file is not valid json
            raise AnalyzeError("不是合法的json文件")
    report["file_size"] = file_size
    # 加载自身extension列表
    extend_extensions(json_project["extensions"])
    # get targets
    if "targets" in json_project:
        json_targets = json_project["targets"]
    else:
        raise AnalyzeError("找不到targets")
    # count sprite
    for json_sprite in json_targets:
        # count costume
        report["costume_count"] += (
            len(json_sprite["costumes"]) if "costumes" in json_sprite else 0
        )
        # count sound
        report["sound_count"] += (
            len(json_sprite["sounds"]) if "sounds" in json_sprite else 0
        )

        if not json_sprite["isStage"]:
            report["sprite_count"] += 1

        if "blocks" in json_sprite:
            json_blocks = json_sprite["blocks"]
        else:
            continue

        # 能找到新段落
        found_flag = True
        while found_flag:
            found_flag = False
            for id in json_blocks:
                block = json_blocks[id]
                # 是一个变量积木（长度大于3为针对TW的特判）
                if isinstance(block, list) and len(block) > 3:
                    report["category_count"]["data"] = (
                        report["category_count"].get("data", 0) + 1
                    )
                    report["total_block_count"] += 1
                # 是新段落
                elif (
                    isinstance(block, dict)
                    and block["topLevel"]
                    # 针对TW的特判
                    and (("shadow" not in block) or (not block["shadow"]))
                ):
                    found_flag = True
                    isValidPara = is_valid_top_block(block["opcode"])
                    if isValidPara:
                        report["valid_paragraph_count"] += 1
                    report["total_paragraph_count"] += 1
                    search_paragraph(id, isValidPara, json_blocks)
                    # 该段落寻找结束
                    break
    return report.report
