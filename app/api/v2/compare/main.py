# DEV: local machine python path: /usr/bin/python

##################################################
# usage: main.py [-h] original [compared ...]
# output: JSON string
#   status("error" | "ok"):
#   message:
#   (for error)(string): error message
#   (for ok)(list[obj]): compared result of the projects
#       obj:
#          status("error" | "ok"): error when analyzing this file
#          message:
#          (for error)(string): error message
#          (for ok)(obj): result for the file
##################################################

import argparse
import json
from src.compare import compare
from src.json2tree import json2tree


def print_error(msg: str | None) -> None:
    print(json.dumps({"status": "error", "message": msg}))


def read_json(path: str):
    with open(compared_path, encoding="utf-8") as f:
        file = json.loads(f.read())
        
    
    return ret


args = None
try:
    # Initialize the parser
    parser = argparse.ArgumentParser(
        description="Compare original Scrarch work with other suspiciously plagiarized works.",
        exit_on_error=False,
    )

    # Add arguments
    parser.add_argument("original", type=str, help="Original Scratch file.")
    parser.add_argument(
        "compared", type=str, nargs="*", help="Suspicious Scratch files to be compared."
    )
    args = parser.parse_args()

    if not args.compared:
        print_error("Invalid arguments")
        exit()
except:
    print_error("Invalid arguments")
    exit()

try:
    results = []

    original_tree = json2tree(read_json(args.original))

    for compared_path in args.compared:
        compared_tree = json2tree(read_json(compared_path))
        results.append(compare(original_tree, compared_tree))

    print(json.dumps({"status": "ok", "message": results}))
except Exception as e:
    print_error(str(e))
    exit()
