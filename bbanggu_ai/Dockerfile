# 베이스 이미지로 Python 사용 (slim: 풀 이미지 대비 수백MB 절약)
FROM python:3.9-slim

WORKDIR /app

# opencv/ultralytics 런타임에 필요한 시스템 라이브러리
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 의존성 설치 — torch/torchvision은 CPU 전용 휠 사용 (기본 PyPI는 CUDA 포함 ~2GB+)
# +cpu 로컬 버전은 파이토치 인덱스에만 있고, 부속 의존성은 PyPI에서 받는다
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir torch==2.6.0+cpu torchvision==0.21.0+cpu \
         --index-url https://download.pytorch.org/whl/cpu \
         --extra-index-url https://pypi.org/simple \
    && pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스와 실제 사용하는 모델 가중치만 복사
COPY main.py /app/
COPY ai/ /app/ai/
COPY models/yolo_bbanggu.pt models/efficientnet_b7.pth /app/models/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
