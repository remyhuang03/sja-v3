# —*- encoding:utf-8 -*-
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/analyze", methods=["GET", "POST"])
def analyze():
    if request.method == "GET":
        return render_template("analyze/index.html")
    else:
        print(request.data)
        return "提交成功"


if __name__ == "__main__":
    app.run(host="0.0.0.0")
