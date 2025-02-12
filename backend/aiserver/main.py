# pip install python-multipart
from fastapi import FastAPI, UploadFile
from typing import List
from pathlib import Path
from ai.detect import detect_breads_from_image
from ai import auto_labeling
from collections import defaultdict
import shutil
import os

app = FastAPI()

@app.post("/detect")
async def detect_breads(images: List[UploadFile]):
    result_list = defaultdict(int)
    for image in images:
        image_bytes = await image.read()
        result = detect_breads_from_image(image_bytes)
        for class_name, count in result.items():
            result_list[class_name] += count
    return result_list

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/train")
async def train(images: List[UploadFile], bakery_id: int, name: str, price: int):
    store_dir = Path(UPLOAD_DIR) / str(bakery_id)
    store_dir.mkdir(parents=True, exist_ok=True)

    image_paths = []
    for image in images:
        image_path = store_dir / image.filename
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_paths.append(image_path)

    # 기존 모델을 사용한 자동 라벨링 실행
    labeled_dir = auto_labeling.auto_label_images(str(bakery_id), store_dir, name)

    return {"message": f"Auto-labeling completed for {name}", "labeled_dir": str(labeled_dir)}
