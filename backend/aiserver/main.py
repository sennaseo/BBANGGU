# pip install python-multipart
from fastapi import FastAPI, File, UploadFile
from typing import List
from ai.detect import detect_breads_from_image
from collections import defaultdict

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/detect")
async def detect_breads(images: List[UploadFile]):
    result_list = defaultdict(int)
    for image in images:
        image_bytes = await image.read()
        result = detect_breads_from_image(image_bytes)
        for class_name, count in result.items():
            result_list[class_name] += count
    return result_list
