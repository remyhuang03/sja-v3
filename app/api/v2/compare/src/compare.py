import zss
import json


def compare(original, compared):
    try:
        # with open original as f:
        #     original_tree = json.load(f)
        # with open compared as f:
        return {"status": "ok", "message": compared}

    except Exception as e:
        return {"status": "error", "message": str(e)}
