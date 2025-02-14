import os
import cv2

# YOLO 라벨 데이터가 저장된 폴더 경로
image_folder = "./input"  # 이미지 폴더
output_folder = "cropped_images"  # 크롭된 이미지 저장 폴더

# 크롭된 이미지 저장 폴더 생성
os.makedirs(output_folder, exist_ok=True)

# 이미지와 라벨 파일 목록 가져오기
image_files = [f for f in os.listdir(image_folder) if f.endswith(('.jpg', '.png', '.jpeg'))]

for image_file in image_files:
    image_path = os.path.join(image_folder, image_file)
    label_path = os.path.join(image_folder, os.path.splitext(image_file)[0] + ".txt")

    # 이미지 로드
    image = cv2.imread(image_path)
    if image is None:
        print(f"이미지 로드 실패: {image_path}")
        continue

    h, w, _ = image.shape  # 원본 이미지 크기

    # YOLO 라벨 파일 읽기
    if not os.path.exists(label_path):
        print(f"라벨 파일 없음: {label_path}")
        continue

    with open(label_path, "r") as file:
        lines = file.readlines()

    for idx, line in enumerate(lines):
        values = line.strip().split()
        class_id = values[0]  # 클래스 ID
        x_center, y_center, width, height = map(float, values[1:])

        # YOLO 정규화 좌표 → 픽셀 단위 좌표 변환
        x1 = int((x_center - width / 2) * w)
        y1 = int((y_center - height / 2) * h)
        x2 = int((x_center + width / 2) * w)
        y2 = int((y_center + height / 2) * h)

        # 경계값 보정
        x1, y1, x2, y2 = max(0, x1), max(0, y1), min(w, x2), min(h, y2)

        # 이미지 크롭
        cropped_image = image[y1:y2, x1:x2]

        # 크롭된 이미지 저장
        cropped_filename = f"{os.path.splitext(image_file)[0]}_obj{idx}.jpg"
        cropped_path = os.path.join(output_folder, cropped_filename)
        cv2.imwrite(cropped_path, cropped_image)

        print(f"저장 완료: {cropped_path}")

print("모든 이미지 크롭 완료!")
