import json
import os

def convert_json_to_txt(input_file, output_folder, label_number=0):
    # 출력 파일명 설정
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    output_file = os.path.join(output_folder, os.path.splitext(os.path.basename(input_file))[0] + ".txt")

    # JSON 파일 읽기
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 변환된 데이터 저장
    with open(output_file, "w", encoding="utf-8") as f:
        for item in data:
            x, y = map(float, item["Point(x,y)"].split(","))
            w = float(item["W"])
            h = float(item["H"])
            f.write(f"{label_number} {x} {y} {w} {h}\n")

    print(f"변환 완료: {output_file}")

def convert_all_json_in_folder(input_folder, output_folder, label_number=0):
    if not os.path.exists(input_folder):
        print(f"오류: 입력 폴더가 존재하지 않습니다 -> {input_folder}")
        return

    json_files = [f for f in os.listdir(input_folder) if f.endswith(".json")]

    if not json_files:
        print("경고: 변환할 JSON 파일이 없습니다.")
        return

    for file_name in json_files:
        file_path = os.path.join(input_folder, file_name)
        convert_json_to_txt(file_path, output_folder, label_number)

    print("모든 파일 변환 완료.")

# 예제 실행 (입력 폴더를 'inputs', 출력 폴더를 'outputs'로 변경)
convert_all_json_in_folder("./inputs", "./outputs", label_number=0)
