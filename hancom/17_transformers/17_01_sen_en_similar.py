from sentence_transformers import SentenceTransformer, util

#1. 사전 학습 모델 로드
model = SentenceTransformer("all-MiniLM-L6-v2")
"""
all-MiniLM-L6-v2 모델 설명 :
- 경량 6레이어 트랜스포머, 384차원 벡터 출력
 - 영어 문장을 의미 공간에 매핑 (방향이 곧 의미)
 - 특징
   1. 빠른 연산 속도 (CPU·모바일 가능)
   2. 의미 보존력 우수 (어순 변화에 강건)
   3. 검색·추천·중복 탐지·클러스터링에 표준 모델

벡터 : 문장 => 숫자로 나열
임베딩 : 의미를 가진 숫자 좌표로 변환 

"""

#2. 비교할 두 문장 정의
sen1 = "He was reading a book in the library"
sen2 = "she was at the bunker running with her dog"
# 결과 두 문장의 유사도 : 0.1585

#3. 두 문장을 모델이 이해할 수 있도록 벡터로 변환
emb1 = model.encode(sen1, convert_to_tensor=True)
emb2 = model.encode(sen2, convert_to_tensor=True)

#4. 코사인 유사도 계산
cos_sim = util.pytorch_cos_sim(emb1,emb2)

#5. 결과 출력
print(f"결과 두 문장의 유사도 : {cos_sim.item():.4f}")
#-1 : 완전히 반대
#0 : 무관
#1 : 완전히 동일 