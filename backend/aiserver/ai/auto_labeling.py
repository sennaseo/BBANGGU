from ultralytics import YOLO
import cv2
import os
from pathlib import Path

EXISTING_MODEL_PATH = "models/best.pt"  # 기존 YOLO 모델 경로
LABELED_DATA_DIR = "labeled_data"  # 자동 라벨링된 이미지 저장 경로
os.makedirs(LABELED_DATA_DIR, exist_ok=True)

def auto_label_images(store_id: str, images_path: Path, bread_name: str):
    """기존 모델을 사용하여 객체 탐지 후 잘라서 라벨링"""
    model = YOLO(EXISTING_MODEL_PATH)  # 기존 모델 로드
    store_dir = Path(LABELED_DATA_DIR) / store_id / bread_name
    store_dir.mkdir(parents=True, exist_ok=True)

    for image_path in images_path.iterdir():
        if image_path.suffix.lower() not in [".jpg", ".jpeg", ".png"]:
            continue

        image = cv2.imread(str(image_path))
        results = model(image)  # 객체 탐지 수행

        for i, result in enumerate(results):
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])  # 바운딩 박스 좌표
                cropped_img = image[y1:y2, x1:x2]  # 객체 잘라내기

                # 라벨링된 이미지 저장
                cropped_img_path = store_dir / f"{image_path.stem}_{i}.jpg"
                cv2.imwrite(str(cropped_img_path), cropped_img)

    return store_dir