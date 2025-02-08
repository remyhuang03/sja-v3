import os
from PIL import Image

def resize_and_convert(input_folder, output_folder, size):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif')):
            img_path = os.path.join(input_folder, filename)
            img = Image.open(img_path)
            img = img.resize(size, Image.LANCZOS)
            output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.png')
            img.save(output_path, 'PNG')
            print(f"Processed {filename} -> {output_path}")

def main():
    avatar_input_folder = './avatar'
    avatar_output_folder = './avatar_resized'
    poster_input_folder = './poster'
    poster_output_folder = './poster_resized'

    resize_and_convert(avatar_input_folder, avatar_output_folder, (256, 256))
    resize_and_convert(poster_input_folder, poster_output_folder, (720, 540))

if __name__ == "__main__":
    main()