# input: file path (.sb3/.json)
# output: python object
# may raise error

import json
from pathlib import Path
import os
import zipfile
import shutil

from create_temp_dir import create_temp_dir


def read_scratch(path: str) -> dict:
    temp_dir = create_temp_dir()

    path = Path(path)

    # judge type
    open_mode = ""
    ext = path.suffix
    if ext in [".sb3", ".cc3", ".zip"]:
        open_mode = "rb"
    elif ext == ".json":
        open_mode = "r" 
    else:
        raise RuntimeError(
            f'File type "{ext}" is not supported (.sb3/.cc3/.json/.zip).'
        )

    with open(path) as f:
        file = json.loads(f.read())


if __name__ == "__main__":
    read_scratch(input("file_path: "))
