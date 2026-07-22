# [transformers 17] 문장 임베딩·감정분석·텍스트생성·요약+번역

> 작성: 2026-07-22

## Q&A

**Q. 임베딩(Embedding)이 뭐고, 왜 문장을 벡터로 바꿔야 하나?**

임베딩은 문장·단어를 숫자 좌표로 바꾸는 방법이다. 컴퓨터는 "의미"를 직접 비교할 수 없지만, 문장을 384차원 같은 벡터(숫자 나열)로 바꿔두면 두 벡터 사이의 거리·각도를 계산해서 "의미가 얼마나 비슷한가"를 수치로 낼 수 있다. `SentenceTransformer`의 `all-MiniLM-L6-v2` 모델은 문장을 384차원 벡터로 변환해주고, 두 벡터의 코사인 유사도(cosine similarity)를 구하면 0~1 사이 값으로 의미 유사도가 나온다. 실제로 "He is reading a book in the library"와 "He is at the library reading a book"은 표현이 달라도 유사도 ≈ 0.94로 매우 높게 나오고, 아예 다른 문장끼리는 ≈ 0.12로 낮게 나온다.

**Q. `pipeline("sentiment-analysis")`처럼 `pipeline()` 함수 하나로 여러 작업(감정분석, 텍스트생성, 요약)이 다 되는데, 내부적으로 뭐가 다른가?**

`pipeline()`은 태스크 이름만 바꿔주면 해당 작업에 맞는 사전학습 모델과 후처리 로직을 자동으로 골라서 연결해주는 HuggingFace의 고수준 래퍼(wrapper)다. `"sentiment-analysis"`를 주면 감정분석용 모델이, `"text-generation"`을 주면 GPT-2가, `"summarization"`을 주면 T5가 로드된다. 내부적으로 쓰는 모델 구조(인코더만/디코더만/인코더-디코더)는 태스크마다 다르지만, 사용자 입장에서는 `pipeline(태스크명)` 한 줄로 통일된 인터페이스를 쓰게 되는 게 핵심이다.

**Q. 감정분석 결과에서 `label`과 `score`는 각각 뭘 의미하나?**

`label`은 POSITIVE(긍정)/NEGATIVE(부정) 같은 분류 결과이고, `score`는 그 판단에 대한 모델의 확신도(confidence)로 0~1 사이 값이다. 이 확신도는 모델이 마지막에 뽑아낸 raw 숫자 묶음을 Softmax 함수로 0~1 확률값으로 변환한 것이다(예: `[2.0, 1.0, 0.1]` → `[0.66, 0.24, 0.10]`, 합이 항상 1이 되도록 정규화). 다만 이 기본 파이프라인은 영어 전용이고, 중립이나 복합 감정은 지원하지 않는다는 한계가 있다.

**Q. T5로 영어 문단을 요약하는 건 되는데, 한국어로 결과를 보고 싶으면 어떻게 하나?**

T5(`t5-small`) 자체가 영어 전용 모델이라 한국어 요약은 지원하지 않는다. 그래서 "T5로 영어 요약 → 그 결과를 구글 번역 API(`deep-translator`의 `GoogleTranslator`)로 한국어 변환"하는 2단계 파이프라인을 쓴다. 즉 `원문(영) → T5 요약 → 요약(영) → GoogleTranslator → 요약(한)` 순서로, 영어 모델의 한계를 별도 번역 단계로 보완하는 구조다. 이 방식은 API 키가 필요 없고 무료지만, 인터넷 연결이 필수이고 번역 품질은 전적으로 구글 번역에 의존한다는 한계가 있다.

**Q. 인코더(Encoder)와 디코더(Decoder)의 역할 차이가 뭔가?**

인코더는 입력 문장을 의미 벡터(문맥 표현)로 압축하는 역할이다 — "원문을 이해"하는 단계로, 예를 들어 "고양이가 매트 위에 있다"를 수백 차원의 숫자 벡터로 바꾼다. 디코더는 그 반대로, 인코더가 만든 숫자 벡터를 다시 글자(문장)로 한 글자씩 차례대로 만들어 이어붙이는 역할이다. T5 같은 요약 모델은 이 둘을 다 갖춘 인코더-디코더 구조이고, GPT-2 같은 텍스트 생성 모델은 디코더 중심 구조다. T5는 `"summarize: 원문"`, `"translate English to Korean: ..."`처럼 맨 앞에 태스크 접두사(Task Prefix)를 붙여서 "이번엔 무슨 작업을 할지" 모델에게 알려주는데, `pipeline`을 쓰면 이 접두사를 자동으로 붙여준다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 개념 요약

| 개념 | 설명 |
|---|---|
| 임베딩(Embedding) | 문장·단어를 의미가 가까우면 좌표도 가까워지는 숫자 벡터로 변환 |
| 코사인 유사도 | 두 벡터 사잇각으로 의미 유사도를 0~1 수치화 |
| 토크나이즈(Tokenize) | 문장을 작은 조각(토큰)으로 쪼개는 과정. 예: `"I love cats"` → `["I","love","cats"]` |
| Softmax | 모델이 뽑은 raw 숫자들을 합이 1이 되는 확률값으로 변환하는 함수 |
| 인코더 / 디코더 | 인코더=입력을 벡터로 압축(이해), 디코더=벡터를 다시 문장으로 복원(생성) |
| Task Prefix | T5 계열에 "이번 작업이 뭔지" 알려주는 머리말 문자열 (`"summarize: "` 등) |
| `pipeline(task)` | 태스크명만 주면 알맞은 사전학습 모델·후처리를 자동 연결해주는 고수준 API |
| 한국어 한계 보완 | 영어 전용 모델(T5 등) 결과를 `GoogleTranslator`로 후처리 번역해서 보완 |

```python
# 문장 유사도
from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("all-MiniLM-L6-v2")
emb1 = model.encode(sen1, convert_to_tensor=True)
emb2 = model.encode(sen2, convert_to_tensor=True)
cos_sim = util.pytorch_cos_sim(emb1, emb2)

# 감정 분석
from transformers import pipeline
classifier = pipeline("sentiment-analysis")
results = classifier("I'm feeling really great today")
# results[0]['label'], results[0]['score']

# 요약 + 한국어 번역
from deep_translator import GoogleTranslator
summarizer = pipeline("summarization", model="t5-small")
summary = summarizer(text, min_length=20, max_length=60)
kr_text = GoogleTranslator(source='en', target='ko').translate(summary[0]['summary_text'])
```

**실무 예시**: 문장 유사도(코사인 유사도)는 고객 문의를 FAQ와 매칭하는 챗봇의 검색 기반, 중복 리뷰 탐지, 추천 시스템의 핵심 로직으로 그대로 쓰인다. 감정분석은 SNS·리뷰 모니터링으로 브랜드 평판을 자동 집계할 때, 요약+번역 파이프라인은 해외 뉴스/논문을 한국어 요약으로 자동 브리핑해주는 서비스에 실제로 쓰이는 구조다. 다만 영어 전용 모델이 많다는 한계 때문에 한국어 서비스에는 번역 후처리 단계가 거의 항상 따라붙는다.
