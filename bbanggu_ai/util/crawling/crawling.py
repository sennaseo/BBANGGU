# pip install selenium beautifulsoup4 requests pillow tqdm
import os
import time

import requests
from PIL import Image
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from tqdm import tqdm

# 🔹 크롤링할 검색어 및 저장 폴더 지정
SEARCH_QUERY = "크로와상"  # 원하는 검색어로 변경 가능
SAVE_FOLDER = f"images/{SEARCH_QUERY.replace(' ', '_')}"

# 🔹 다운로드할 이미지 개수
NUM_IMAGES = 200  # 원하는 개수 지정

# 🔹 Chrome WebDriver 설정
CHROME_DRIVER_PATH = "chromedriver.exe"  # 크롬 드라이버 경로 지정 (운영체제에 맞게 변경)
options = Options()
options.add_argument("--headless")  # 브라우저 창 없이 실행 (UI 필요하면 제거)
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920x1080")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# 🔹 폴더 생성
os.makedirs(SAVE_FOLDER, exist_ok=True)

# 🔹 웹 드라이버 실행
service = Service(CHROME_DRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)
search_url = f"https://www.google.com/search?q={SEARCH_QUERY}&tbm=isch"
driver.get(search_url)


# 🔹 스크롤을 자동으로 내려 더 많은 이미지 로드
def scroll_to_end(driver):
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        # 페이지 끝까지 스크롤
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # 로딩 시간 대기

        # 더 많은 이미지 버튼 클릭 (있을 경우)
        try:
            more_button = driver.find_element(By.XPATH, '//input[@type="button" and @value="Show more results"]')
            more_button.click()
            time.sleep(2)
        except:
            pass

        # 스크롤 후 높이 확인
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break  # 더 이상 스크롤할 내용이 없으면 종료
        last_height = new_height


# 🔹 스크롤을 내려 더 많은 이미지 불러오기
scroll_to_end(driver)

# 🔹 페이지 로딩 대기
time.sleep(2)

# 🔹 이미지 URL 수집
soup = BeautifulSoup(driver.page_source, "html.parser")
img_tags = soup.find_all("img")

img_urls = []
for img_tag in img_tags:
    img_url = img_tag.get("src") or img_tag.get("data-src")
    if img_url and "http" in img_url:
        try:
            response = requests.get(img_url, stream=True, timeout=5)
            response.raise_for_status()
            with Image.open(response.raw) as img:
                if img.width > 100 and img.height > 100:  # 아이콘(100x100 이하) 제외
                    img_urls.append(img_url)
        except Exception:
            pass

# 🔹 중복 제거 및 개수 제한
img_urls = list(set(img_urls))[:NUM_IMAGES]


# 🔹 이미지 다운로드
def download_image(url, save_path):
    try:
        response = requests.get(url, stream=True, timeout=5)
        response.raise_for_status()

        # 원본 확장자 추출 후 임시 저장
        temp_path = save_path + "_temp"

        with open(temp_path, "wb") as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)

        # 이미지 포맷 확인 후 JPG로 변환
        with Image.open(temp_path) as img:
            img = img.convert("RGB")  # RGB 모드로 변환 (투명 배경 제거)
            img.save(save_path, "JPEG")  # JPG로 저장

        # 변환 후 원본 삭제
        os.remove(temp_path)

    except Exception as e:
        print(f"❌ 이미지 다운로드 실패: {url} | 오류: {e}")
        if os.path.exists(save_path):
            os.remove(save_path)


print(f"🔽 {SEARCH_QUERY} 이미지 다운로드 시작...")

for idx, img_url in tqdm(enumerate(img_urls), total=len(img_urls)):
    save_path = os.path.join(SAVE_FOLDER, f"{SEARCH_QUERY}_{idx + 1}.jpg")
    download_image(img_url, save_path)

print(f"✅ {SEARCH_QUERY} 이미지 {len(img_urls)}장 다운로드 완료!")
driver.quit()
