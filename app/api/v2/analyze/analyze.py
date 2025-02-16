from src.analyze import analyze
from src.report_img.generate import json_svg
from shutil import move, copy
from pathlib import Path
import sys
from src.AnalyzeError import AnalyzeError
import zipfile
import shutil
from time import time
from pathlib import Path
from os.path import getsize
import os
from subprocess import run

"""
brief:
    分析Scratch文件组成成分，生成报告
input:
    file_path[1]:
        待分析的.sb3或.json文件
    is_sort[2]:
        是否进行排序(0或1)
    is_high_rank_cate[3]:
        显示最多积木类型还是显示经典类型(0或1)
    dest_dir[4]:
        destination dir for svg report file
output:
    cmd_out:
        svg压缩程序过程性输出，无用
    status:
        正常则为ok，否则为err
    url/err:
        分析报告对应时间戳（如果status为ok），否则为错误信息
"""
is_debug = int(os.getenv("IS_DEBUG", 0))

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
        (Path(__file__).parent / "src" / "report_img" / "temp" / file_name),
        sys.argv[4],
    )

    # commit_to_github()
    print("ok: ", end="")
    print(f"https://sjaplus.top/api/report-img?stamp={file_name}",end="")

except Exception as e:
    # 分析出错
    print("err: ", end="")
    print(e.with_traceback())
