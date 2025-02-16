import os
import shutil
import random

# 원본 데이터 폴더 경로 (datasets_efficientNet)
source_dir = 'resource'

# 대상 폴더 경로 (train, val)
train_dir = 'resource/train'
val_dir = 'resource/val'

# 이미지 비율
train_ratio = 0.9

# 각 빵 종류에 대해 폴더 분리
for bread in os.listdir(source_dir):
    bread_path = os.path.join(source_dir, bread)

    # bread 폴더가 디렉토리인지 확인
    if os.path.isdir(bread_path):
        # train과 val 폴더 생성
        train_bread_dir = os.path.join(train_dir, bread)
        val_bread_dir = os.path.join(val_dir, bread)

        os.makedirs(train_bread_dir, exist_ok=True)
        os.makedirs(val_bread_dir, exist_ok=True)

        # 이미지 파일 목록 가져오기
        image_files = [f for f in os.listdir(bread_path) if f.endswith(('.jpg', '.jpeg', '.png'))]

        # 이미지 파일을 랜덤하게 섞기
        random.shuffle(image_files)

        # train과 val 이미지 분할
        num_train = int(len(image_files) * train_ratio)
        train_images = image_files[:num_train]
        val_images = image_files[num_train:]

        # train 폴더에 이미지 복사
        for img in train_images:
            src_img_path = os.path.join(bread_path, img)
            dst_img_path = os.path.join(train_bread_dir, img)
            shutil.copy(src_img_path, dst_img_path)

        # val 폴더에 이미지 복사
        for img in val_images:
            src_img_path = os.path.join(bread_path, img)
            dst_img_path = os.path.join(val_bread_dir, img)
            shutil.copy(src_img_path, dst_img_path)

        print(f"Processed {bread}: {len(train_images)} images for training, {len(val_images)} images for validation.")
