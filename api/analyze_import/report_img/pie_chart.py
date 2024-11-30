import matplotlib.pyplot as plt
from pathlib import Path

this_path = Path(__file__).parent


def draw_pie_chart(arg):
    plt.figure(figsize=(6, 6))
    plt.pie(
        arg["values"],
        labels=arg["labels"],
        colors=arg["colors"],
        autopct="%1.1f%%",
        startangle=140,
    )
    plt.axis("equal")  # 让饼图为正圆形
    print("save pie chart")
    # 保存图形到PNG文件
    plt.savefig(this_path / "temp" / arg["file_name"])
