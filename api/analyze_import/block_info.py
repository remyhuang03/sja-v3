import csv
from pathlib import Path

# if os.name == "nt":
#     csv_path = (
#         r"doc\blocks_release.csv"
#     )
# elif os.name == "posix":
#     csv_path = "/www/wwwroot/www.sjaplus.top/doc/blocks_release.csv"

csv_path = Path(__file__).parent.parent.parent / "doc" / "blocks_release.csv"
csv_file = csv.reader(open(csv_path, "r", encoding="utf-8"))
csv_file = list(csv_file)
block_info = {i[0]: i[1:] for i in csv_file}


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


def get_category(opcode):
    """
    仅对实体积木返回正确结果
    """
    ret = opcode.split("_")[0]
    if ("argument_reporter" in opcode) or (opcode == "ccw_hat_parameter"):
        ret = "procedures"
    return ret
