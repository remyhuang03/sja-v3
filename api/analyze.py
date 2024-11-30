from analyze_import.analyze import analyze
from analyze_import.report_img.generate import json_svg
from shutil import move, copy
from pathlib import Path
import sys
from analyze_import.AnalyzeError import AnalyzeError
import zipfile
import shutil
from time import time
from pathlib import Path
from os.path import getsize
from subprocess import run

"""
brief:
    分析Scratch文件组成成分，生成报告
input:
    file_path:
        待分析的.sb3或.json文件
    is_sort:
        是否进行排序(0或1)
    is_high_rank_cate:
        显示最多积木类型还是显示经典类型(0或1)
output:
    cmd_out:
        svg压缩程序过程性输出，无用
    status:
        正常则为ok，否则为err
    url/err:
        分析报告对应时间戳（如果status为ok），否则为错误信息
"""
is_debug = 0
with open(Path(__file__).parent.parent / "build" / "is_debug.txt") as f:
    if f.read() == "1":
        is_debug = 1

try:
    file_path = sys.argv[1]
    file_extension = file_path.split(".")[-1]
    file_size = getsize(file_path)
    temp_path = ""

    if file_extension in ["sb3", "cc3"]:
        # 先解压提取json文件
        temp_path = Path(__file__).parent / (
            "temp_analyze_" + str(time()).replace(".", "_")
        )
        with zipfile.ZipFile(file_path, "r") as zip_ref:
            zip_ref.extractall(temp_path)
        file_path = Path(temp_path) / "project.json"
    report = analyze(file_path, file_size)

    if temp_path and not is_debug:
        run(["rm", "-rf", temp_path], check=True)

    file_name = json_svg(report, int(sys.argv[2]), int(sys.argv[3]))
    copy(
        (Path(__file__).parent / "analyze_import" / "report_img" / "temp" / file_name),
        (
            Path(__file__).parent
            / "analyze_import"
            / "report_img"
            / "sja-reports"
            / file_name
        ),
    )
    # 服务器上 github 访问速度慢死了
    # commit_to_github()
    print("?ok?", end="")
    print(f"https://sjaplus.top/api/report-img.php?stamp={file_name}")

except Exception as e:
    # 分析出错
    print("?err?", end="")
    print(e.with_traceback())
