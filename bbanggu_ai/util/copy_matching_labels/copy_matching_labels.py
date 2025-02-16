import os
import shutil

def copy_matching_text_files(image_folder, text_folder):
    # 이미지 폴더와 텍스트 폴더의 파일 목록 가져오기
    image_files = {os.path.splitext(f)[0] for f in os.listdir(image_folder) if os.path.isfile(os.path.join(image_folder, f))}
    text_files = {f for f in os.listdir(text_folder) if f.endswith('.txt')}

    for text_file in text_files:
        text_name, _ = os.path.splitext(text_file)
        if text_name in image_files:
            src_path = os.path.join(text_folder, text_file)
            dest_path = os.path.join(image_folder, text_file)
            shutil.copy(src_path, dest_path)
            print(f'Copied: {text_file} -> {image_folder}')

# 사용 예시
image_folder = "./A"  # 이미지 폴더 경로
text_folder = "./B"    # 텍스트 파일 폴더 경로

copy_matching_text_files(image_folder, text_folder)
