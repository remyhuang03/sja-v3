from Paragraph import Paragraph

class Sprite:
    '''
    一个角色

    Attributes:
        paragraphs: 该角色的代码段落列表
        costumes: 该角色的所有造型
    '''

    def __init__(self,paragraphs:list) -> None:
        '''
        para:
            paragraphs: 该角色的代码段落列表
        '''
        self.paragraphs = paragraphs if paragraphs else []
        self.costumes = []