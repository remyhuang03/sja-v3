class Block:
    """
    单个entity积木
    
    Attributes:
        opcode: 操作码 (e.g. motion_movesteps)

        category: 积木类型 (e.g. motion)

        inputs: 内含若干 Paragraph 的 list, 表示该积木的参数
    """

    # 存储积木信息的字典，每一项为 opcode: (platform, structure)
    blocks_infomation_table = {}

    @staticmethod
    def load_blocks_information_table():
        '''
        从文件中加载积木信息表
        '''
        with open(r"doc\blocks_release.csv", "r") as file:
            for line in file:
                row = line.strip().split(",")
                Block.blocks_infomation_table[row[0]] = tuple(row[1:])
    
    @staticmethod
    def check_blocks_information_table(opcode:str)->tuple:
        return Block.blocks_infomation_table.get(opcode, None)
    

    def __init__(self, opcode: str, category: str, inputs: list = None) -> None:
        # 初始化积木基本信息
        self.opcode = opcode
        self.category = category
        self.inputs = inputs if inputs else []

        # 如果是首次初始化，加载积木信息表
        if not Block.blocks_infomation_table:
            Block.load_blocks_information_table()

    def __len__(self):
        """
        返回该积木及其内含积木的总个数
        """
        ret = 1
        for para in self.inputs:
            ret += len(para)

    def append_input(self, para: Paragraph) -> None:
        """
        添加一个段落参数
        """
        self.inputs.append(para)
    
    def get_structure(self):
        '''
        获取该积木的结构
        '''
        info = Block.check_blocks_information_table(self.opcode)
        if info:
            return info[1]
        else:
            return None

