import subprocess
import os
import logging
import json
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
    for root, _, files in os.walk(ext_folder_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if file_name.endswith(".js") and is_extention_file(file_path):
                ext_files.append(file_path)

    return ext_files


def parse_ext(ext_path):
    # call node script to parse extension
    # get parsed json in text form
    ext_json_txt = subprocess.run(
        ["node", "./ext-parser.js", ext_path], capture_output=True, text=True
    ).stdout
    
    # DEV
    logging.debug(ext_json_txt)
    
    # converst text to json object
    ext = json.loads(ext_json_txt)
    
    ret={}
    
    
    return ret


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG,filename='parse.log', filemode='w')
    # DEV:
    # cd ./dev/extension-parse; python main.py
    # DEV: single extension folder for test /dannydev or /DollyPro or /QuakeStudio
    ext_folder_path = "./ccw_extensions/custom-extension/extensions/QuakeStudio"
    ext_repo_path = "./ccw_extensions/custom-extension"

    update_repo(ext_repo_path)

    ext_files = get_ext_files(ext_folder_path)
    logging.debug(ext_files)

    for ext_file in ext_files:
        parsed_ext = parse_ext(ext_file)

