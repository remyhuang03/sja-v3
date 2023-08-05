from string import ascii_lowercase, digits

AVAILABLE_CHARS = ascii_lowercase + digits + ' ":[]{},.-_'
print(len(AVAILABLE_CHARS))


def ascii_to_zh(text):
    #chinese_chars = [
     #   chr(code) for code in range(0x4E00, 0x9FA5)
    #]  # 使用包含更多中文字符的Unicode字符集

    result = ""
    for i in range(0, len(text), 10):
        weight = 0
        sum = 0
        group = text[i : i + 10]
        for c in group:
            sum += AVAILABLE_CHARS.index(c) * pow(114, weight)
            weight += 1

        result += chr(sum+0x4E00)

    return result


def zh_to_ascii(text):
    chinese_chars = [
        chr(code) for code in range(0x4E00, 0x9FFF)
    ]  # 使用包含更多中文字符的Unicode字符集

    def map_to_ascii(char):
        # 将汉字字符映射到ASCII编码
        chinese_index = chinese_chars.index(char)
        return "{:010x}".format(chinese_index)

    result = ""
    for char in text:
        result += map_to_ascii(char)

    return result


# 示例用法
ascii_text = "48656c6c6f20776f726c640a7b7d"
chinese_text = ascii_to_zh(ascii_text)
print("ASCII to Chinese:", chinese_text)

back_to_ascii_text = zh_to_ascii(chinese_text)
print("Chinese to ASCII:", back_to_ascii_text)
