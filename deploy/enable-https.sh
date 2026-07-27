#!/usr/bin/env bash
# BBANGGU HTTPS 활성화 (Let's Encrypt) — 서버에서 1회 실행.
# 사용법: bash ~/BBANGGU/deploy/enable-https.sh <도메인> <이메일>
#   예:   bash ~/BBANGGU/deploy/enable-https.sh 168-110-54-87.sslip.io senna077@gmail.com
set -euo pipefail

DOMAIN="${1:?도메인을 인자로 주세요 (예: 168-110-54-87.sslip.io)}"
EMAIL="${2:?이메일을 인자로 주세요}"
cd "$HOME/BBANGGU"

CONF=nginx/conf.d/default.conf

echo "=== 1. HTTPS 정식 설정 준비 (도메인 치환) ==="
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$CONF"
cp "$CONF" "$CONF.final"   # 인증서 발급 후 되돌릴 최종본

echo "=== 2. 부트스트랩용 HTTP-only conf 로 교체 후 nginx 기동 ==="
# 인증서가 아직 없으니 443 블록이 있으면 nginx 크래시 → 발급 챌린지만 받는 최소 conf
cat > "$CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 'bootstrapping'; add_header Content-Type text/plain; }
}
EOF
docker compose --env-file .env up -d web
sleep 3

echo "=== 3. certbot 인증서 발급 (webroot) ==="
docker compose --env-file .env run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    -d "$DOMAIN" --email "$EMAIL" \
    --agree-tos --no-eff-email --non-interactive

echo "=== 4. HTTPS 정식 설정 복원 후 nginx 재기동 + certbot 갱신 데몬 기동 ==="
mv "$CONF.final" "$CONF"
docker compose --env-file .env up -d web certbot
sleep 3

echo "=== 5. 검증 ==="
echo "HTTP→HTTPS: $(curl -s -o /dev/null -w '%{http_code}' http://$DOMAIN/)  (301 기대)"
echo "HTTPS SPA : $(curl -s -o /dev/null -w '%{http_code}' https://$DOMAIN/)"
echo "HTTPS API : $(curl -s -o /dev/null -w '%{http_code}' https://$DOMAIN/api/bakery)"
echo ""
echo "완료! 다음 단계(주소를 https 로 전환)는 스크립트 밖에서 진행하세요."
