#!/usr/bin/env bash
# 서버에서 최신 코드 반영 재배포 — git pull 후 변경분만 재빌드+기동
# 사용법: ssh 접속 후  bash ~/BBANGGU/deploy/redeploy.sh
set -euo pipefail
cd "$HOME/BBANGGU"

echo "=== git pull ==="
git pull origin develop

# 모델이 LFS 포인터로 덮여버렸는지 재확인 (pull 이 실파일을 되돌리진 않지만 안전차원)
MODEL="bbanggu_ai/models/efficientnet_b7.pth"
if [ -f "$MODEL" ] && [ "$(stat -c%s "$MODEL")" -lt 1000000 ]; then
  echo "⚠️  $MODEL 이 LFS 포인터입니다 — 로컬에서 scp 로 실제 파일을 올린 뒤 다시 실행하세요."
  exit 1
fi

echo "=== 재빌드 + 기동 ==="
docker compose --env-file .env up -d --build

echo "=== 상태 ==="
docker compose ps
echo ""
echo "헬스체크:"
echo "  SPA:  $(curl -s -o /dev/null -w %{http_code} http://localhost/)"
echo "  API:  $(curl -s -o /dev/null -w %{http_code} http://localhost/api/bakery)"
