from ultralytics import YOLO
import cv2
import os
from PIL import Image
import numpy as np
from io import BytesIO

def detect_and_crop(image_bytes, output_dir='cropped_objects'):
    # YOLO 모델 로드
    model = YOLO("./models/best_old.pt")

    # 이미지 로드
    image = read_imagefile(image_bytes)
    if image is None:
        print(f"Error: Cannot load image {image}")
        return
    # 객체 탐지
    results = model(image, conf=0.2)
    detections = results[0].boxes
    # 출력 폴더 생성
    os.makedirs(output_dir, exist_ok=True)
    # 탐지된 객체 크롭 및 저장
    for i, (box, cls) in enumerate(zip(detections.xyxy, detections.cls)):
        x1, y1, x2, y2 = map(int, box)  # 바운딩 박스 좌표
        cropped_img = image[y1:y2, x1:x2]  # 이미지 크롭

        class_name = model.names[int(cls)]  # 클래스 이름 가져오기
        save_path = os.path.join(output_dir, f'{class_name}_{i}.jpg')
        cv2.imwrite(save_path, cropped_img)
        print(f"Saved: {save_path}")

def read_imagefile(image_bytes) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")  # PIL 이미지 변환
    image = np.array(image)  # numpy 배열로 변환
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # OpenCV 포맷으로 변환
    return image
