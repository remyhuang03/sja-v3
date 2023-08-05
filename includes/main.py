from analyze import analyze
from report_img.generate import json_svg
from report_img.upload import commit_to_github
from shutil import move,copy
from pathlib import Path

this_path = Path(__file__).parent

try:
    report = analyze(r"C:\Users\Robert Huang\Desktop\project.json")
    print(report)
    file_name = json_svg(report)
    copy((this_path / "report_img"/ "temp" / file_name), (this_path/ "report_img"/"sja-reports" / file_name))
    commit_to_github()
    print(f"https://cdn.jsdelivr.net/gh/h8p0/sja-reports/{file_name}")

except Exception as e:
    # 分析出错
    print(e)
