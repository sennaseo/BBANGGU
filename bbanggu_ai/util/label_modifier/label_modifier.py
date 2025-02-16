import os

def transform_line(line):
    values = line.strip().split()
    if len(values) != 5:
        return None  # 유효하지 않은 라인은 건너뜀

    c, x, y, w, h = map(float, values)
    new_line = f"{int(c)} {1 - y:.6f} {x:.6f} {h:.6f} {w:.6f}\n"
    return new_line

def process_txt_files(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):  # .txt 파일만 처리
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "r") as file:
                lines = file.readlines()

            transformed_lines = [transform_line(line) for line in lines if transform_line(line) is not None]

            with open(file_path, "w") as file:
                file.writelines(transformed_lines)

# 사용 예시: 'your_folder_path'를 변환할 폴더 경로로 변경하세요.
folder_path = "./input"
process_txt_files(folder_path)
