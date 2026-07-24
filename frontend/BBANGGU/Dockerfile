# ---- 빌드 스테이지: Vite 프로덕션 빌드 ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# 카카오맵 JS 키는 빌드 시점에 주입 (compose build args ← 서버 .env)
ARG VITE_KAKAO_MAP_API_KEY
ENV VITE_KAKAO_MAP_API_KEY=$VITE_KAKAO_MAP_API_KEY
RUN npm run build

# ---- 서빙 스테이지: nginx가 정적 파일 + 리버스 프록시 담당 ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# 프록시 설정은 compose가 ./nginx/conf.d/default.conf 를 마운트한다
