import os

def modify_first_number_in_folder(folder_path, new_value):
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, 'r', encoding='utf-8') as infile:
                lines = infile.readlines()

            with open(file_path, 'w', encoding='utf-8') as outfile:
                for line in lines:
                    parts = line.split()
                    if parts:
                        parts[0] = str(new_value)  # 첫 번째 숫자를 new_value로 변경
                        outfile.write(" ".join(parts) + "\n")

# 사용 예시
folder_path = './text_files'  # 수정할 텍스트 파일들이 있는 폴더 경로
new_value = 0 # 변경할 첫 번째 숫자 값

modify_first_number_in_folder(folder_path, new_value)
