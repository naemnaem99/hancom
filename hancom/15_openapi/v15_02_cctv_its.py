import urllib #url 요청
import json #json 데이터 처리용
import pandas as pd # 데이터 프레임 생성 및 데이터 처리용
import urllib.request # url 요청2

#1. 인증 키 설정
key = "*****"

#2. 도로 유형 지정
Type = "its"    # its = 일반도로 / ex = 고속도로

#3. 관심 영역 설정
minX, maxX = 120.95, 127.02   # 동서(가로) 범위 → 한국 전체 가로
minY, maxY = 30.55, 37.69     # 남북(세로) 범위 → 한국 전체 세로

#4. 응답 데이터 형식 설정
getType = "json"

#5. api 요청 url 생성
url_cctv = (
    f"https://openapi.its.go.kr:9443/cctvInfo"
    f"?apiKey={key}&type={Type}&cctvType=1"
    f"&minX={minX}&maxX={maxX}"
    f"&minY={minY}&maxY={maxY}"
    f"&getType={getType}"
)
#6. api 요청 및 응답 받기
response = urllib.request.urlopen(url_cctv)
# print(response)  ->  <http.client.HTTPResponse object at 0x00000147E8711BE0>

#7. 응답 데이터 디코딩 => bytes => str(읽을 수 있는 문자)
json_str = response.read().decode("utf-8")
# print(json_str)

#8. JSON 문자열 => 파이썬 딕셔너리
json_object = json.loads(json_str)
# print(json_object) 

#9. 데이터프레임 변환
cctv_play = pd.json_normalize(json_object["response"],["data"])
# cctv 목록이 맨 위에 안 놓여있고, response => data 안에 숨어 있어서 거기까지 손 뻗기
# print(cctv_play)

#10. 특정 cctv 선택
test_url = cctv_play["cctvurl"][51]
print(f"선택된 CCTV URL => {test_url}")