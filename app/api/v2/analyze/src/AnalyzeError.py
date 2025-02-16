class AnalyzeError(Exception):
    '''
    分析异常
    '''
    def __init__(self, message):
        super().__init__(message)
        self.message = message

    def __str__(self):
        return f'Analyze Error: {self.message}'
    
    def __repr__(self):
        return f'Analyze Error: {self.message}'
