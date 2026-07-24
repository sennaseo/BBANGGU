# pip install python-multipart
# pip install ultralytics
import os
import shutil
import uuid
from collections import defaultdict
from typing import List

import httpx
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai import yolo, efficientnet
from ai.classes import CLASS_NAMES
from ai.pacakge_maker import distribute_breads

# 백엔드(Spring) 주소 — 로컬은 기본값, 도커에서는 compose가 컨테이너 주소를 주입
SPRING_SERVER_URL = os.getenv("SPRING_SERVER_URL", "http://localhost:8081")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # "*" 오리진과 credentials는 CORS 스펙상 양립 불가 — 쿠키를 쓰지 않으므로 False
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/detect_old")
async def detect_breads(images: List[UploadFile]):
    result_list = defaultdict(int)
    for image in images:
        image_bytes = await image.read()
        result = yolo.detect(image_bytes)
        for class_name, count in result.items():
            result_list[class_name] += count
    return result_list


@app.post("/detect")
async def detect_and_classify(images: List[UploadFile] = File(...), bakeryId: int = Form(...)):
    # 크롭된 이미지 저장할 폴더 생성(요청마다 다른 폴더 생성함)
    unique_id = str(uuid.uuid4())
    cropped_image_dir = os.path.join("cropped_objects", unique_id)

    try:
        # yolo로 객체 탐지 후 이미지 크롭
        for image in images:
            image_bytes = await image.read()
            yolo.detect_and_crop(image_bytes, cropped_image_dir)

        # 가게에 등록된 빵 정보 불러오기
        class_filter = []
        category_infos = {}
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{SPRING_SERVER_URL}/bread/bakery/{bakeryId}")
            bakery_breads = response.json()
            for bread in bakery_breads:
                category_id = bread['breadCategoryId']
                category_name = CLASS_NAMES[int(category_id) - 1]  # id가 1부터 시작해서 1 뺌
                class_filter.append(category_name)
                category_infos[category_name] = bread['price']

        # efficientNet으로 분류
        classified_breads = efficientnet.classify(cropped_image_dir, class_filter)
    finally:
        # 크롭 이미지는 분류가 끝나면 필요 없음 — 안 지우면 요청마다 디스크에 쌓임
        shutil.rmtree(cropped_image_dir, ignore_errors=True)

    # breadCategoryId와 name을 매핑하는 딕셔너리 생성
    bread_info = {}
    for bread in bakery_breads:
        bread_info[bread['breadCategoryId']] = {
            'name': bread['name'],
            'price': bread['price'],
            'breadId': bread['breadId'],
            'breadCategoryId': bread['breadCategoryId']
        }

    detected_breads = {}
    for bread in classified_breads:
        detected_breads.setdefault(CLASS_NAMES.index(bread) + 1, classified_breads.get(bread))

    named_detected_breads = []
    for category_id, count in detected_breads.items():
        named_detected_breads.append({
            'name': bread_info[int(category_id)]['name'],
            'price': bread_info[int(category_id)]['price'],
            'count': count,
            'breadId': bread_info[int(category_id)]['breadId'],
            'breadCategoryId': bread_info[int(category_id)]['breadCategoryId']
        })

    return named_detected_breads


class BreadDTO(BaseModel):
    name: str
    price: int
    count: int
    breadId: int


@app.post("/generate-package")
async def generate_package(breads: List[BreadDTO]):
    print(breads)
    # 빵 조합 생성
    return distribute_breads(breads)
