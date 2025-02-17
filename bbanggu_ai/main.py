# pip install python-multipart
# pip install ultralytics
import os
import uuid
from collections import defaultdict
from typing import List

import httpx
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from ai import yolo, efficientnet, pacakge_maker

app = FastAPI()

origins = [
    "*",  # 모든 도메인 허용 (개발 단계에서만 권장)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
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


class_names = [
    'bagel', 'baguette', 'bun', 'cake', 'croissant', 'croquette',
    'financier', 'pizza', 'pretzel', 'red_bean', 'scone', 'soboro', 'tart', 'white_bread'
]


@app.post("/detect")
async def comb(images: List[UploadFile] = File(...), bakeryId: int = Form(...)):
    # 크롭된 이미지 저장할 폴더 생성(요청마다 다른 폴더 생성함)
    unique_id = str(uuid.uuid4())
    cropped_image_dir = os.path.join("cropped_objects", unique_id)

    # yolo로 객체 탐지 후 이미지 크롭
    for image in images:
        image_bytes = await image.read()
        yolo.detect_and_crop(image_bytes, cropped_image_dir)

    # 가게에 등록된 빵 정보 불러오기
    class_filter = []
    category_infos = {}
    # SPRING_SERVER_URL = "http://bbanggu-server:8081/"
    SPRING_SERVER_URL = "https://i12d102.p.ssafy.io/api"
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SPRING_SERVER_URL}/bread/bakery/{bakeryId}")
        bakery_breads = response.json()
        print(bakery_breads)
        for bread in bakery_breads:
            category_id = bread['breadCategoryId']
            category_name = class_names[int(category_id) - 1]  # id가 1부터 시작해서 1 뺌
            class_filter.append(category_name)
            category_infos[category_name] = bread['price']

    # efficientNet으로 분류
    classified_breads = efficientnet.classify(cropped_image_dir, class_filter)

    # breadCategoryId와 name을 매핑하는 딕셔너리 생성
    bread_info = {}
    for bread in bakery_breads:
        bread_info[bread['breadCategoryId']] = {
            'name': bread['name'],
            'price': bread['price'],
            'breadId': bread['breadId']
        }

    detected_breads = {}
    for bread in classified_breads:
        detected_breads.setdefault(class_names.index(bread) + 1, classified_breads.get(bread))

    named_detected_breads = []
    for category_id, count in detected_breads.items():
        named_detected_breads.append({
            'name': bread_info[int(category_id)]['name'],
            'price': bread_info[int(category_id)]['price'],
            'count': count,
            'breadId': bread_info[int(category_id)]['breadId']
        })

    return named_detected_breads

# @app.post("/generate-package")
# async def comb():
#     # 빵 조합 생성
#     result = pacakge_maker.distribute_breads(classified_breads, category_infos, class_names)
#     filtered_result = pacakge_maker.select_best_combinations(result)
#     # filtered_result의 breads 키의 값들을 이름으로 변경
#     updated_filtered_result = []
#     for combination in filtered_result:
#         updated_combination = []
#         for package in combination:
#             if 'breads' in package:
#                 named_breads = {}
#                 for category_id, count in package['breads'].items():
#                     bread_name = bread_info[int(category_id)]['name']
#                     named_breads[bread_name] = count
#                 package['breads'] = named_breads
#             updated_combination.append(package)
#         updated_filtered_result.append(updated_combination)
