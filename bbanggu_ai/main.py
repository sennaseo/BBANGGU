# pip install python-multipart
import os
import uuid
from collections import defaultdict
from typing import List

import httpx
from fastapi import FastAPI, UploadFile, File, Form

from ai import yolo, efficientnet, pacakge_maker

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
async def detect_breads(images: List[UploadFile] = File(...), bakeryId: int = Form(...)):
    # 크롭된 이미지 저장할 폴더 생성(요청마다 다른 폴더 생성함)
    unique_id = str(uuid.uuid4())
    cropped_image_dir = os.path.join("cropped_objects", unique_id)

    # yolo로 객체 탐지 후 이미지 크롭
    for image in images:
        image_bytes = await image.read()
        yolo.detect_and_crop(image_bytes, cropped_image_dir)

    # 빵 분류 및 조합
    class_names = [
        'bagel', 'baguette', 'bun', 'cake', 'croissant', 'croquette',
        'financier', 'pizza', 'pretzel', 'red_bean', 'scone', 'soboro', 'tart', 'white_bread'
    ]
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
            category_name = class_names[int(category_id) - 1] # id가 1부터 시작해서 1 뺌
            class_filter.append(category_name)
            category_infos[category_name] = bread['price']

    print(category_infos)

    # efficientNet으로 분류
    classified_breads = efficientnet.classify(cropped_image_dir, class_filter)
    # 빵 조합 생성
    result = pacakge_maker.distribute_breads(classified_breads, category_infos, class_names)
    filtered_result = pacakge_maker.select_best_combinations(result)
    return filtered_result, classified_breads
