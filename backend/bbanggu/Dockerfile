# ---- 빌드 스테이지: 컨테이너 안에서 gradle 빌드 (호스트에 JDK 불필요, ARM/x86 모두 동작) ----
# corretto는 미니멀 이미지라 gradlew가 쓰는 xargs(findutils)가 없음 → 우분투 기반 temurin 사용
FROM eclipse-temurin:17-jdk AS build
WORKDIR /build

# gradle 래퍼·설정 먼저 복사해 의존성 레이어 캐시
COPY gradlew build.gradle settings.gradle naver-checkstyle-rules.xml ./
COPY gradle ./gradle
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew

COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon -q

# ---- 실행 스테이지 ----
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /build/build/libs/bbanggu-0.0.1-SNAPSHOT.jar app.jar

ENV JAVA_OPTS=""
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
