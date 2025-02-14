# 베이스 이미지로 Python 사용
FROM python:3.9

# 작업 디렉토리 설정
WORKDIR /app

# 필수 패키지 설치 (libGL 추가)
RUN apt-get update && apt-get install -y libgl1-mesa-glx

# 의존성 설치
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# FastAPI 애플리케이션 소스 복사
COPY . /app/

# FastAPI 애플리케이션 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

