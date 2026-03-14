# 빵을 구하자, 빵구

<!--프로젝트 대문 이미지-->

<img src="https://github.com/user-attachments/assets/eec5168f-77e5-4084-9134-71f99f357b3a" alt="BBANGGU_Title"/>
<br>

<!--목차-->

# 목차

- [[1] 프로젝트 개요](#1️⃣-프로젝트-개요)
  - [서비스 개요](#-서비스-개요)
  - [기획 의도](#-기획-의도)
  - [주요 특징](#-주요-특징)
  - [서비스 가치](#-서비스-가치)
  - [프로젝트 기간](#1-2-프로젝트-기간)
  - [기술 스택](#1-3-기술-스택)
  - [팀원 소개](#-팀원-소개)
- [[2] 프로젝트 구조](#2️⃣-프로젝트-구조)
  - [ERD](#a-erd)
  - [아키텍처 구성도](#b-아키텍처-구성도)
- [[3] 주요 기능](#3️⃣-주요-기능)
  - [판매자](#1-판매자)
    - [빵꾸러미 생성](#1-빵꾸러미-생성)
    - [AI 분석 리포트 제공](#2-ai-분석-리포트-제공)
  - [구매자](#2-구매자)
    - [빵꾸러미 예약 (결제)](#1-빵꾸러미-예약-결제)
    - [절약한 자원 확인](#2-절약한-자원-확인)
    - [지도 (Kakao Map API)](#3-지도-kakao-map-api)
  - [공통](#3-공통)
    - [PWA (Progressive Web App)](#1-pwa-progressive-web-app)
    - [Kakao 로그인 (OAuth2)](#2-kakao-로그인-oauth2)
  
  <br>
  <br>

# 1️⃣ 프로젝트 개요

# 🥨 빵구 (BBANGGU) - 베이커리 마감 할인 서비스

## 🌱 서비스 개요

**빵구**는 베이커리의 마감 임박 제품을 할인된 가격에 구매할 수 있는 플랫폼입니다.

### 🎯 기획 의도

- **음식물 쓰레기 감소**: 매일 폐기되는 베이커리 제품을 줄여 환경 보호에 기여
- **소비자 혜택**: 신선한 베이커리 제품을 합리적인 가격에 제공
- **점주 매출 증대**: 폐기 예정 제품의 판매를 통한 손실 최소화

### 💡 주요 특징

- **AI 기반 빵 인식**: YOLO와 EfficientNet B2 모델을 활용한 자동 빵 인식 시스템
- **빵꾸러미 시스템**: 점주가 마감 임박 제품을 패키지로 구성하여 할인 판매
- **실시간 재고 관리**: 베이커리의 재고 현황을 실시간으로 확인 및 관리
- **간편한 결제 시스템**: 소비자가 쉽게 구매할 수 있는 직관적인 결제 프로세스

### 🎁 서비스 가치

- **환경적 가치**: 음식물 쓰레기 감소를 통한 환경 보호

- **경제적 가치**: 소비자는 할인된 가격으로, 점주는 폐기 손실 감소

- **사회적 가치**: 지속 가능한 소비 문화 조성에 기여
  
  <br>

### 1-2. 프로젝트 기간

- 2025-01-13 ~ 2025-02-21 (총 6주)
  
  <br>

### 1-3. 기술 스택

<div align="center">
  <h1>
    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png" alt="Books" width="25" height="25" /> STACKS
  </h1>
</div>

<div align="center">
  <!-- Frontend -->
  <h3>Frontend</h3>
  <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/react-61DAFB?style=flat-square&logo=react&logoColor=black">
    <img src="https://img.shields.io/badge/javascript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
    <img src="https://img.shields.io/badge/html5-E34F26?style=flat-square&logo=html5&logoColor=white">
    <img src="https://img.shields.io/badge/Kakao_Map_API-FFCD00?style=flat-square&logo=kakao&logoColor=black">
  </div>
  </div>

<!-- Backend -->

<div align="center">
<h3>Backend</h3>
  <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/java-007396?style=flat-square&logo=java&logoColor=white">
    <img src="https://img.shields.io/badge/springboot-6DB33F?style=flat-square&logo=springboot&logoColor=white">
    <img src="https://img.shields.io/badge/JPA-59666C?style=flat-square&logo=hibernate&logoColor=white">
    <img src="https://img.shields.io/badge/fastapi-009688?style=flat-square&logo=fastapi&logoColor=white">
  </div>
</div>
<!-- Database -->

<div align="center">
<h3>Database</h3>
  <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/mysql-4479A1?style=flat-square&logo=mysql&logoColor=white">
  </div>
  </div>

<!-- AI -->

<div align="center">
<h3>AI</h3>
  <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/pytorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white">
    <img src="https://img.shields.io/badge/YOLOv8-00FFFF?style=flat-square&logo=yolo&logoColor=black">
    <img src="https://img.shields.io/badge/EfficientNet-FF6F00?style=flat-square&logo=tensorflow&logoColor=white">
  </div>
</div>

<!-- Infrastructure -->

<div align="center">
<h3>Infrastructure</h3>
  <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/aws-232F3E?style=flat-square&logo=amazonaws&logoColor=white">
    <img src="https://img.shields.io/badge/docker-2496ED?style=flat-square&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white">
  </div>
  </div>

<!-- Version Control & Collaboration -->

<div align="center">
<h3>Version Control & Collaboration</h3>
  <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/gitlab-FC6D26?style=flat-square&logo=gitlab&logoColor=white">
    <img src="https://img.shields.io/badge/jira-0052CC?style=flat-square&logo=jira&logoColor=white">
    <img src="https://img.shields.io/badge/notion-000000?style=flat-square&logo=notion&logoColor=white">
  </div>
  </div>

<!-- CI/CD -->

<div align="center">
<h3>CI/CD</h3>
  <div style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap;">
    <img src="https://img.shields.io/badge/jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white">
    <img src="https://img.shields.io/badge/docker-2496ED?style=flat-square&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/dockerhub-2496ED?style=flat-square&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/gitlab-FC6D26?style=flat-square&logo=gitlab&logoColor=white">
    </div>
  </div>
  </div>

<br>

## 🙇 팀원 소개
<img src="https://github.com/user-attachments/assets/80ec33de-d3c5-48b3-80f8-b7359780d0ad" width=500>

| [👑김유진](https://github.com/zladb)                                                         | [김휘동](https://github.com/HwiDong6831)                                                       | [정나금](https://github.com/gomie1)                                                           | [신은찬](https://github.com/eunchan0324)                                                       | [권가영](https://github.com/gayeong718)                                                       | [서유민](https://github.com/sennaseo)                                                        |
|:-----------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------:|
| ![Yujin](https://github.com/user-attachments/assets/69a74b1e-e8a1-44dd-b2c1-be8f43ea4293) | ![Hwidong](https://github.com/user-attachments/assets/75bf9404-cfe2-46a9-b55a-3545047b1ed4) | ![Nageum](https://github.com/user-attachments/assets/1d47995d-8cb9-4232-953e-c740dcc0ccfa) | ![Eunchan](https://github.com/user-attachments/assets/b8e01d40-2361-4291-a554-ad186f19300c) | ![Garong](https://github.com/user-attachments/assets/db9eb4c6-1d41-4a06-917d-0a25f3989b3d) | ![Yumin](https://github.com/user-attachments/assets/24943c97-8cb5-4e86-bb35-d4d5e6498c21) |
| `BE`, `Infra`                                                                             | `BE`, `AI`                                                                                  | `BE`                                                                                       | `FE`                                                                                        | `FE`                                                                                       | `FE`                                                                                      |
<br>
<br>

# 2️⃣ 프로젝트 구조

## a. ERD

<img src="https://github.com/user-attachments/assets/58651c5f-f68b-4fa7-9eeb-76df388cbf54" alt="ERD" width=50% height=50%/>
<br>

## b. 아키텍처 구성도

<img src="https://github.com/user-attachments/assets/9c890c9b-292e-4d23-99fa-827153d37585" alt="Architecture" width=65% height=65%/>
<br>
<br>

# 3️⃣ 주요 기능

## [1] 판매자
| YOLOv8s 카메라 인식 | AI 빵꾸러미 조합 추천 | AI 분석 리포트 제공 |
|---|---|---|
|<img src="https://github.com/user-attachments/assets/d11c13e8-1f81-437e-a4eb-fe1c3a27b70b" alt="YOLOv8s 카메라 인식" width="200"/> | <img src="https://github.com/user-attachments/assets/c6977939-ec05-4548-a88f-cc45e427eac6" alt="AI 빵꾸러미 조합 추천" width="200"/> | <img src="https://github.com/user-attachments/assets/cc3243c3-9a75-4b77-8f1d-0a71e4029854" alt="AI 분석 리포트 제공" width="200"/> |

<br>
<br>

## [2] 구매자
| 결제(토스 페이먼츠) | 절약한 자원 확인 | 지도(카카오 맵) |
|---|---|---|
| <img src="https://github.com/user-attachments/assets/455826e2-f407-438f-b8a4-ca05b4c44391" alt="2-1-1" width="200"/> | <img src="https://github.com/user-attachments/assets/2bc62c4f-2ab6-4ad2-9ad1-bddbdfba3504" alt="2-2" width="200"/> | <img src="https://github.com/user-attachments/assets/ac489deb-b4b3-4ce2-9c31-4756587b00f7" alt="2-3" width="200"/> |

<br>
<br>

## [3] 공통
| PWA (Progressive Web App) | Kakao 로그인 (OAuth2) |
|---|---|
| <img src="https://github.com/user-attachments/assets/b339f29b-ed81-42c0-972a-d829a97e3e86" alt="3-1" width="200"/> | <img src="https://github.com/user-attachments/assets/a7c81ac1-d471-4686-9695-274e427c09a2" alt="3-2" width="200"/> |
