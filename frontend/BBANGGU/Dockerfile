FROM node:22.13.0-alpine AS build

WORKDIR /app

# 3. 프로젝트 파일 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 빌드 실행
COPY . .

RUN npm run build

# 6. 프로덕션 환경을 위한 Nginx 설정
FROM nginx:alpine

# 7. Nginx 설정 파일 복사 (선택 사항)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 8. 빌드된 프론트엔드 파일을 Nginx의 웹 서버 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 9. Nginx 포트 80을 오픈
EXPOSE 80

# 10. Nginx 시작
CMD ["nginx", "-g", "daemon off;"]



