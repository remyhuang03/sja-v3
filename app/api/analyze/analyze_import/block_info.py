import csv
from pathlib import Path

# if os.name == "nt":
#     csv_path = (
#         r"doc\blocks_release.csv"
#     )
# elif os.name == "posix":
#     csv_path = "/www/wwwroot/www.sjaplus.top/doc/blocks_release.csv"

# 加载积木信息表
csv_path = Path(__file__).parent.parent.parent / "doc" / "blocks_release.csv"
csv_file = csv.reader(open(csv_path, "r", encoding="utf-8"))
csv_file = list(csv_file)
block_info = {i[0]: i[1:] for i in csv_file}

# 加载Sc括展信息表
csv_path = Path(__file__).parent.parent.parent / "doc" / "category_report_format.csv"
csv_file = csv.reader(open(csv_path, "r", encoding="utf-8"))
extensions = {row[0] for row in list(csv_file)}

def extend_extensions(lst):
    extensions.update(lst)


def opcode_type(opcode):
    if opcode not in block_info:
        return "unknown"
    opcode_type = block_info[opcode][1]
    return opcode_type


def is_valid_top_block(opcode):
    if "top" in opcode_type(opcode):
        return True
    return False


def is_entity(opcode):
    type = opcode_type(opcode)
    if type in ["menu", "special-menu", "prototype"]:
        return False
    return True


def get_category(opcode: str):
    """
    获取积木所属拓展分类
    仅对实体积木返回正确结果
    """
    # 特判：自制积木
    if ("argument_reporter" in opcode) or (opcode == "ccw_hat_parameter"):
        return "procedures"

    # 检查是否为已收录的类型
    def search_prefix(op):
        for perfix in extensions:
            if op.startswith(perfix):
                return perfix
        return -1

    ret = search_prefix(opcode)
    if ret != -1:
        return ret
    # 如果没有收录，则推测
    else:
        if "_" in opcode:
            return opcode[0 : opcode.index("_")]
        elif opcode.count(".") >= 2:
            first_dot = opcode.index(".")
            second_dot = opcode.index(".", first_dot + 1)
            return opcode[0:second_dot]
        else:
            return opcode
