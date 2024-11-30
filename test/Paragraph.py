from Block import Block

class Paragraph:
    """
    一个代码段落
    """

    def __init__(self, blocks: list = None) -> None:
        self.blocks = blocks if blocks else []

    def __len__(self):
        '''
        输出代码段总积木数
        '''
        ret = 0
        for block in self.blocks:
            ret += len(block)
        return ret

    def append(self, block: Block) -> None:
        '''
        添加一个积木到段落末尾
        '''
        self.blocks.append(block)

    def is_valid(self):
        '''
        判断是否为有效积木段落
        '''
        pass
    
    
