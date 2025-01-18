import subprocess
import os
import execjs
from pprint import pprint


def update_repo(path):
    subprocess.run(["git", "pull"], cwd=path)


def get_ext_files(path):
    def is_extention_file(file_path: str) -> bool:
        """
        check if a file is a extension file
        """
        with open(file_path, "r") as file:
            if "window.tempExt" in file.read():
                return True
        return False

    ##### collect ext js files #####
    ext_files = []

    # for files in extention root folder
    for root, dirs, files in os.walk(ext_folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if file_name.endswith(".js") and is_extention_file(file_path):
                ext_files.append(file_path)

    return ext_files


def parse_ext(ext_path):
    pass


if __name__ == "__main__":
    ext_folder_path = "./ccw_extensions/custom-extension/extensions/"
    ext_repo_path = "./ccw_extensions/custom-extension"

    update_repo(ext_repo_path)

    ext_files = get_ext_files(ext_folder_path)

    with open("./temp-ext-list.js", "w") as f:
        f.write(f"const window.ext_files = {str(ext_files)};")
