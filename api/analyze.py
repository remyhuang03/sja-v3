from analyze_import.analyze import analyze
from analyze_import.report_img.generate import json_svg
from analyze_import.report_img.upload import commit_to_github
from shutil import move, copy, rmtree
from pathlib import Path
import sys
from analyze_import.AnalyzeError import AnalyzeError
import zipfile
import shutil
from time import time
from pathlib import Path
from os.path import getsize

"""
brief:
    分析Scratch文件组成成分，生成报告
input:
    file_path:
        待分析的.sb3或.json文件
output:
    cmd_out:
        svg压缩程序过程性输出，无用
    status:
        正常则为ok，否则为err
    url/err:
        分析报告对应URL（如果status为ok），否则为错误信息
"""
try:
    
    file_path = sys.argv[1]
    
    file_extension = file_path.split(".")[-1]
    file_size = getsize(file_path) 
    temp_path = "" 
    
    if file_extension == "sb3":
        # 先解压提取json文件
        temp_path = Path(__file__).parent / ("temp_analyze_" + str(time()).replace(".", "_"))
        with zipfile.ZipFile(file_path, "r") as zip_ref:
            zip_ref.extractall(temp_path)
        file_path = Path(temp_path) / "project.json"
    report = analyze(file_path,file_size)
    if temp_path:
        shutil.rmtree(temp_path)
    
    file_name = json_svg(report)
    copy(
        (Path(__file__).parent / "analyze_import" / "report_img" / "temp" / file_name),
        (Path(__file__).parent / "analyze_import" / "report_img" / "sja-reports" / file_name),
    )
    commit_to_github()
    print("ok")
    print(f"https://cdn.jsdelivr.net/gh/h8p0/sja-reports/{file_name}")

except Exception as e:
    # 分析出错
    print("err")
    print(e.with_traceback())
