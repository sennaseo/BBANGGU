# pip install python-multipart
import os
import uuid
from collections import defaultdict
from typing import List

from fastapi import FastAPI, UploadFile

from ai import yolo, efficientnet

app = FastAPI()


@app.post("/detect")
async def detect_breads(images: List[UploadFile]):
    result_list = defaultdict(int)
    for image in images:
        image_bytes = await image.read()
        result = yolo.detect(image_bytes)
        for class_name, count in result.items():
            result_list[class_name] += count
    return result_list


@app.post("/detectcrop")
async def detect_breads(images: List[UploadFile]):
    # 크롭된 이미지 저장할 폴더 생성(요청마다 다른 폴더 생성함)
    unique_id = str(uuid.uuid4())
    cropped_image_dir = os.path.join("cropped_objects", unique_id)

    # yolo로 객체 탐지 후 이미지 크롭
    for image in images:
        image_bytes = await image.read()
        yolo.detect_and_crop(image_bytes, cropped_image_dir)

    # efficientNet으로 분류
    classified_breads = efficientnet.classify(cropped_image_dir)

    return classified_breads
