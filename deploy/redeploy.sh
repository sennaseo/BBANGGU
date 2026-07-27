#!/usr/bin/env bash
# 서버에서 최신 코드 반영 재배포 — git pull 후 재빌드+기동
# 사용법: bash ~/BBANGGU/deploy/redeploy.sh
#   .env 에 DOMAIN=... 이 있으면 nginx conf 의 DOMAIN_PLACEHOLDER 를 자동 치환한다.
set -euo pipefail
cd "$HOME/BBANGGU"

CONF=nginx/conf.d/default.conf

MODEL="bbanggu_ai/models/efficientnet_b7.pth"
MODEL_CACHE="$HOME/.bbanggu-models/efficientnet_b7.pth"

# 실제 모델(대용량)이 있으면 홈에 백업 — git pull 이 LFS 포인터로 덮어도 복원할 수 있게
if [ -f "$MODEL" ] && [ "$(stat -c%s "$MODEL")" -gt 1000000 ]; then
  mkdir -p "$(dirname "$MODEL_CACHE")"
  cp -f "$MODEL" "$MODEL_CACHE"
fi

echo "=== git pull (로컬 conf 치환은 stash 후 되받음) ==="
# conf 는 배포 시 도메인이 치환돼 있어 pull 과 충돌한다 → 치운 뒤 pull
git stash push -q -- "$CONF" 2>/dev/null || true
git pull origin develop
git stash drop -q 2>/dev/null || true   # 치환본은 버리고 아래서 다시 치환

# pull 이 모델을 LFS 포인터로 덮었으면 백업에서 복원
if [ -f "$MODEL" ] && [ "$(stat -c%s "$MODEL")" -lt 1000000 ]; then
  if [ -f "$MODEL_CACHE" ]; then
    echo "=== 모델이 LFS 포인터로 덮여 백업본에서 복원 ==="
    cp -f "$MODEL_CACHE" "$MODEL"
  else
    echo "⚠️  $MODEL 이 LFS 포인터이고 백업본도 없습니다 — 로컬에서 scp 로 올린 뒤 다시 실행하세요."
    exit 1
  fi
fi

# 도메인 치환 (.env 에 DOMAIN 이 있으면)
DOMAIN="$(grep -E '^DOMAIN=' .env 2>/dev/null | cut -d= -f2- || true)"
if [ -n "$DOMAIN" ]; then
  echo "=== nginx conf 도메인 치환: $DOMAIN ==="
  sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$CONF"
else
  echo "⚠️  .env 에 DOMAIN 이 없어 HTTPS conf 치환을 건너뜁니다 (HTTPS 안 쓰면 무시)."
fi

echo "=== 재빌드 + 기동 (web 은 conf 마운트 갱신 위해 강제 재생성) ==="
docker compose --env-file .env up -d --build
docker compose --env-file .env up -d --force-recreate web

echo "=== 상태 ==="
docker compose ps
echo ""
echo "헬스체크:"
echo "  SPA: $(curl -s -o /dev/null -w %{http_code} http://localhost/)"
echo "  API: $(curl -s -o /dev/null -w %{http_code} http://localhost/api/bakery)"
