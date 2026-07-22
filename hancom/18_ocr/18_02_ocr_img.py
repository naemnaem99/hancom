#1. 이미지에서 한글 추출
#2. 추출된 한글 요약

import pytesseract
from PIL import Image
import os

# 1. Tesseract 실행 파일 경로 지정
pytesseract.pytesseract.tesseract_cmd = "C:/Program Files/Tesseract-OCR/tesseract.exe"

# 2. 이미지 불러오기
image = Image.open("image2.jpg")

# 2-1. 전처리: 업스케일
# 원본이 342x584로 저해상도라 영어 알파벳 획이 뭉개져서 인식이 안 됨
# 3배 확대해야 정상 인식됨 (한글은 저해상도에서도 비교적 잘 읽힘)
w, h = image.size
resized = image.resize((w * 3, h * 3), Image.LANCZOS)

# 3. OCR 수행
results = pytesseract.image_to_string(
    resized, lang='eng+kor',
    )

# 4. 결과 출력
print("결과값", results)
# Optical Character
# Recognition (OCR)