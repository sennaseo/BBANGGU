# Python 3.9 이미지를 기반으로 시작
FROM python:3.9-slim

# 작업 디렉터리 설정
WORKDIR /app

# 프로젝트 파일 복사
COPY . /app

# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# Flask 애플리케이션 실행
CMD ["python", "app.py"]
