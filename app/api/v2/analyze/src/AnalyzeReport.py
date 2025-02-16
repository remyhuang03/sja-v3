from json import dumps
from datetime import datetime
from typing import Any
import os
from pathlib import Path

hash_secret = os.getenv("REPORT_CODE_HASH_SECRET")


class AnalyzeReport:
    """
    作品分析报告

    Attributes:
        report: 报告内容
    """

    def __init__(self, version: str) -> None:
        """
        para:
            version: 作品分析器核心版本号
        """
        self.report = {
            "datetime": datetime.now().timestamp(),
            "core_version": version,
            "file_size": 0,  # 用byte为单位的文件大小
            "sprite_count": 0,
            "costume_count": 0,
            "sound_count": 0,
            "valid_paragraph_count": 0,
            "total_paragraph_count": 0,
            "valid_block_count": 0,
            "total_block_count": 0,
            # 'broadcast_count':0,
            # 'variable_count':0,
            "category_count": {},
            "hash": "",  # debug: secret after release
        }

    def __str__(self) -> str:
        return str(self.report)

    def __getitem__(self, key: Any) -> Any:
        return self.report[key]

    def __setitem__(self, index, value):
        self.report[index] = value

    def to_json(self):
        # 生成报告前统一替换hash为秘密值
        self.report["hash"] = hash_secret
        # 计算报告json的hash值
        hash_code = hash(dumps(self.report))
        # 哈希值写入报告
        self.report["hash"] = hash_code
        return dumps(self.report)
