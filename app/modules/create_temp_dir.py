from time import time
from random import randint
import os
from pathlib import Path

def create_temp_dir() -> str:
    # generate a random number (6 digits)
    randn = randint(int(1e6), int(1e7 - 1))
    dir_name = f"{str(time()).replace(".","_")}{randn}"
    temp_path = (
        Path(os.getenv("PROJECT_ROOT_PATH")) / "data" / "var" / "temp" / dir_name
    )
    os.mkdir(temp_path)
    return temp_path

if __name__ == '__main__':
    create_temp_dir()