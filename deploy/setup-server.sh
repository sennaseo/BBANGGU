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
  echo "⚠️  $HOME/BBANGGU/.env 를 열어 값을 채운 뒤 다음을 실행하세요:"
  echo "    cd ~/BBANGGU && docker compose --env-file .env up -d --build"
else
  echo ".env 이미 존재"
fi

echo "=== 완료 ==="
