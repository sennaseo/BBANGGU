# pip install python-multipart
import os
import shutil
from collections import defaultdict
from pathlib import Path
from typing import List

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form

from ai import detect, detect_crop, auto_labeling

app = FastAPI()


@app.post("/detect")
async def detect_breads(images: List[UploadFile]):
    result_list = defaultdict(int)
    for image in images:
        image_bytes = await image.read()
        result = detect.detect_breads_from_image(image_bytes)
        for class_name, count in result.items():
            result_list[class_name] += count
    return result_list


def load_model(model_path, num_classes):
    model = models.efficientnet_b2(weights=True)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model


@app.post("/detectcrop")
async def detect_breads(images: List[UploadFile]):
    for image in images:
        image_bytes = await image.read()
        detect_crop.detect_and_crop(image_bytes)
    model_path = './models/efficientnet_b2.pth'  # 학습된 모델 경로
    cropped_image_dir = 'cropped_objects'  # YOLO로 크롭된 이미지 폴더

    class_names = [
        'bagel', 'baguette', 'bun', 'cake', 'croissant', 'croquette',
        'financier', 'pizza', 'pretzel', 'red_bean', 'scone', 'soboro', 'tart', 'white_bread'
    ]
    model = load_model(model_path, num_classes=len(class_names))
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    for img_name in os.listdir(cropped_image_dir):
        img_path = os.path.join(cropped_image_dir, img_name)
        image = Image.open(img_path).convert('RGB')
        image = transform(image).unsqueeze(0)  # 배치 차원 추가

        with torch.no_grad():
            output = model(image)
            predicted_class = torch.argmax(output, dim=1).item()
            print(f"{img_name}: Predicted as {class_names[predicted_class]}")


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/train")
async def train(
        images: List[UploadFile] = File(...),
        bakery_id: int = Form(...),
        name: str = Form(...),
        price: int = Form(...)
):
    store_dir = Path(UPLOAD_DIR) / str(bakery_id)
    store_dir.mkdir(parents=True, exist_ok=True)
    print("store_dir: " + store_dir)

    image_paths = []
    for image in images:
        image_path = store_dir / image.filename
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_paths.append(image_path)

    # 기존 모델을 사용한 자동 라벨링 실행
    labeled_dir = auto_labeling.auto_label_images(str(bakery_id), store_dir, name)

    return {"message": f"Auto-labeling completed for {name}", "labeled_dir": str(labeled_dir)}
