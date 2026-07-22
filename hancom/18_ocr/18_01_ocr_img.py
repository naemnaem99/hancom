import pytesseract
from PIL import Image
import os

# 1. Tesseract 실행 파일 경로 지정
pytesseract.pytesseract.tesseract_cmd = "C:/Program Files/Tesseract-OCR/tesseract.exe"

# 2. 이미지 불러오기
image = Image.open("image.jpg")

# 2-1. 전처리: 그레이스케일 -> 이진화 -> 리사이즈
# 원본이 4000x6000 고해상도라 글자 획이 너무 커서 Tesseract가 인식을 못 함
# 흑백으로 이진화하고 폭 800px로 축소해야 정상 인식됨
gray = image.convert("L")
binarized = gray.point(lambda p: 255 if p > 150 else 0)
ratio = 800 / binarized.width
resized = binarized.resize((800, int(binarized.height * ratio)))

# 3. OCR 수행
results = pytesseract.image_to_string(
    resized, lang='eng', config='--psm 6'
    )

# 4. 결과 출력
print("결과값", results)
# Optical Character
# Recognition (OCR)