from git import Repo
from pathlib import Path

this_path = Path(__file__).parent

repo = Repo(this_path / "sja-reports")  # 创建版本库对象
access_token = open(
    this_path / ".." / ".." / ".." / "build" / "github_personal_access_token.txt",
    encoding="utf-8",
).read()


def commit_to_github():
    repo.git.add("--all")
    repo.git.commit("-m", "add image")
    repo.git.push(
        f"https://oauth2:{access_token}@github.com/h8p0/sja-reports.git", "main"
    )
