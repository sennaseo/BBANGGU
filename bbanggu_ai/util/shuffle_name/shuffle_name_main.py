import os
import random
import string

def generate_random_name(length=12):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def shuffle_filenames(folder_path, image_exts={".jpg", ".png", ".jpeg", ".gif"}, text_exts={".txt"}):
    files = os.listdir(folder_path)
    pairs = {}

    # 파일을 확장자 기준으로 그룹화
    for file in files:
        name, ext = os.path.splitext(file)
        if ext in image_exts or ext in text_exts:
            if name not in pairs:
                pairs[name] = []
            pairs[name].append(file)

    # 기존 이름 리스트를 랜덤 문자열로 매핑
    name_map = {old: generate_random_name() for old in pairs.keys()}

    # 파일 이름 변경
    temp_map = {}
    for old_name, new_name in name_map.items():
        for file in pairs[old_name]:
            old_path = os.path.join(folder_path, file)
            new_file = file.replace(old_name, new_name, 1)  # 첫 번째 일치만 변경
            new_path = os.path.join(folder_path, new_file)
            temp_map[old_path] = new_path

    # 실제 파일 이름 변경 (충돌 방지를 위해 임시 이름 사용)
    temp_files = {}
    for old_path, temp_path in temp_map.items():
        temp_files[temp_path + ".tmp"] = temp_path  # 임시 확장자 추가
        os.rename(old_path, temp_path + ".tmp")

    for temp_path, new_path in temp_files.items():
        os.rename(temp_path, new_path)

    print("파일 이름이 랜덤 문자열로 변경되었습니다!")

# 사용 예시
folder_path = "./input"  # 변경할 폴더 경로
shuffle_filenames(folder_path)
