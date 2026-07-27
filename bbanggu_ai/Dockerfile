# 베이스 이미지로 Python 사용 (slim: 풀 이미지 대비 수백MB 절약)
FROM python:3.9-slim

WORKDIR /app

# opencv/ultralytics 런타임에 필요한 시스템 라이브러리
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 의존성 설치 — torch는 아키텍처별로 받는 곳이 다르다:
#   x86_64: PyPI 기본 휠은 CUDA 포함(2GB+)이라 파이토치 CPU 인덱스를 명시
#   aarch64(ARM, 오라클 A1): 파이토치 CPU 인덱스에 ARM 휠이 없음 → PyPI 기본이 이미 CPU 전용
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip \
    && ARCH="$(uname -m)" \
    && if [ "$ARCH" = "x86_64" ]; then \
         pip install --no-cache-dir torch==2.6.0 torchvision==0.21.0 \
           --index-url https://download.pytorch.org/whl/cpu ; \
       else \
         pip install --no-cache-dir torch==2.6.0 torchvision==0.21.0 ; \
       fi \
    && pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스와 실제 사용하는 모델 가중치만 복사
COPY main.py /app/
COPY ai/ /app/ai/
COPY models/yolo_bbanggu.pt models/efficientnet_b7.pth /app/models/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
