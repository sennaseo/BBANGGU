#!/usr/bin/env bash
# BBANGGU 서버 초기 설정 (Ubuntu 24.04, 오라클 A1 기준) — 멱등: 재실행해도 안전
# 사용법: ssh 접속 후  bash setup-server.sh
set -euo pipefail

echo "=== 1. 패키지 갱신 + docker 설치 ==="
if ! command -v docker >/dev/null; then
  sudo apt-get update -y
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER"
  echo "docker 설치 완료 (그룹 반영은 재로그인 후)"
else
  echo "docker 이미 설치됨"
fi

echo "=== 2. OS 방화벽(iptables) 80/443 개방 ==="
# 오라클 우분투 이미지는 SSH 외 인바운드를 iptables로 막아둠 (보안 리스트와 별개!)
for port in 80 443; do
  if ! sudo iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null; then
    sudo iptables -I INPUT 5 -p tcp --dport "$port" -m state --state NEW -j ACCEPT
    echo "포트 $port 개방"
  fi
done
sudo netfilter-persistent save 2>/dev/null || sudo apt-get install -y iptables-persistent

echo "=== 3. 리포 클론 ==="
if [ ! -d "$HOME/BBANGGU" ]; then
  git clone https://github.com/sennaseo/BBANGGU.git "$HOME/BBANGGU"
else
  echo "리포 이미 존재 — git pull"
  git -C "$HOME/BBANGGU" pull
fi

echo "=== 4. .env 준비 ==="
if [ ! -f "$HOME/BBANGGU/.env" ]; then
  cp "$HOME/BBANGGU/.env.example" "$HOME/BBANGGU/.env"
  echo "⚠️  $HOME/BBANGGU/.env 를 열어 값을 채운 뒤 아래 5단계를 실행하세요."
else
  echo ".env 이미 존재"
fi

echo "=== 5. AI 모델 파일(LFS) 점검 ==="
# efficientnet_b7.pth 는 .gitattributes 에서 LFS 로 지정돼 있으나 GitHub LFS 쿼터 미사용이라
# git clone 하면 134바이트 포인터 텍스트로 온다. 실제 파일(약 250MB)은 로컬 PC에서 scp 로 채운다.
MODEL="$HOME/BBANGGU/bbanggu_ai/models/efficientnet_b7.pth"
if [ -f "$MODEL" ] && [ "$(stat -c%s "$MODEL")" -lt 1000000 ]; then
  echo "⚠️  $MODEL 이 LFS 포인터($(stat -c%s "$MODEL") bytes)입니다."
  echo "    로컬 PC(작업 PC)에서 아래를 실행해 실제 파일을 올리세요:"
  echo "    scp -i ~/.ssh/bbanggu_oracle \\"
  echo "        <로컬>/bbanggu_ai/models/efficientnet_b7.pth \\"
  echo "        ubuntu@<이 서버 IP>:$MODEL"
else
  echo "모델 파일 정상 ($([ -f "$MODEL" ] && stat -c%s "$MODEL" || echo 0) bytes)"
fi

echo ""
echo "=== 완료. 다음 순서로 기동하세요 ==="
echo "  1) nano ~/BBANGGU/.env         # 키/주소 채우기 (주소는 이 서버 IP 기준)"
echo "  2) 위 5번 안내대로 모델 scp (포인터일 때만)"
echo "  3) cd ~/BBANGGU && docker compose --env-file .env up -d --build"
