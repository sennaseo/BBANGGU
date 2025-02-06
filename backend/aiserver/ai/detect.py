# pip install ultralytics
from collections import Counter
from ultralytics import YOLO
import numpy as np
import cv2
from io import BytesIO
from PIL import Image

model = YOLO("./models/best.pt")
class_names = model.names


def detect_breads_from_image(image_bytes):
    image = read_imagefile(image_bytes)
    results = model(image, conf=0.2)
    detections = results[0].boxes.cls.tolist()
    counts = Counter(detections)
    result = []
    output_json = {class_names[int(class_id)]: count for class_id, count in counts.items()}
    return output_json


def read_imagefile(image_bytes) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")  # PIL 이미지 변환
    image = np.array(image)  # numpy 배열로 변환
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # OpenCV 포맷으로 변환
    return image
