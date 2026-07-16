# Groq API — 내 서비스에 AI 연결하기

키 발급 · 기본 호출 · Express 프록시 · 프론트 챗봇, 4단계로 정리.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 01. 키 발급

Groq는 무료 AI 호출 서비스이며 카드 등록 없이 시작 가능하다. **키 = AI 사용을 위한 전용 비밀번호**.

**받는 절차**
1. `console.groq.com` 접속 → 구글 계정으로 가입
2. 왼쪽 **API Keys** → **Create API Key**
3. `gsk_`로 시작하는 키 복사 (생성 직후 한 번만 표시됨)

**.env / .gitignore**
```
# .env — 서버에만 두는 비밀 파일 (절대 공개 금지)
GROQ_API_KEY=gsk_여기에-본인-키

# .gitignore — 깃에 안 올릴 목록
.env
node_modules/
```

**핵심 포인트**
- 키 = 출입증 — 남이 보면 대신 사용 가능
- 무료지만 분당 호출 횟수 한도 존재
- 코드·Git에 직접 입력 금지, 호출은 항상 서버(Express)에서만

**FAQ**
| 질문 | 답 |
|---|---|
| `.env`는 왜 점(.)으로 시작? | 숨김 파일 취급되어 비밀값이 눈에 안 띔 |
| 키를 실수로 깃허브에 올렸다면? | console.groq.com에서 Revoke 후 재발급 |
| `gsk_` 접두어의 의미는? | Groq 키임을 나타내는 prefix |
| `node_modules`를 gitignore에 넣는 이유? | `npm install`로 재생성되므로 Git에 올릴 필요 없음 |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 02. 기본 호출

Fetch로 Groq AI를 호출한다. 필수 요소는 **주소·헤더·내용** 3가지. Groq는 OpenAI 호환 형식을 쓰고, Node 18+는 fetch가 내장돼 있어 별도 설치 불필요.

**폴더 구조**
```
09_groq/
└── 02/
    ├── basic_call.js
    └── .env
```

**basic_call.js**
```javascript
require('dotenv').config()
const key = process.env.GROQ_API_KEY

const main = async () => {
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: '한 문장으로 자기소개 해줘' }]
    })
  })

  const data = await groqRes.json()
  console.log(data.choices?.[0]?.message?.content || data)
}

main()
```

**실행**
```bash
cd server
npm install dotenv   # 최초 1회
node basic_call.js
```

**채울 것 3가지**: 주소(엔드포인트) · 헤더 Authorization(`Bearer` + 키) · body(model, messages)

**코드 상세 — `data.choices?.[0]?.message?.content || data`**
- `?.`(Optional Chaining): 중간 값이 없어도 에러 대신 `undefined` 반환
- `||`: 왼쪽이 없으면 오른쪽 값 사용 → 정상 응답이면 답변, 구조가 다르면 전체 `data` 출력

**FAQ**
| 질문 | 답 |
|---|---|
| POST가 왜 필요? | GET은 정보 받기, POST는 질문 내용을 담아 보내는 것 |
| `Bearer`는 꼭 붙여야 하나? | 정해진 인증 형식, 빠지면 거부됨 |
| `JSON.stringify`는 왜? | JS 객체 → 문자열 변환(인터넷은 문자열만 송수신) |
| `await`는 왜? | 응답 올 때까지 기다림, 없으면 응답 전에 다음 줄 실행 |
| `require`+최상위 `await` 혼용 시 에러? | CommonJS(require)와 ESM(top-level await) 충돌 → `await`를 `async` 함수로 감싸서 해결 |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 03. 프론트 연결

화면(client)에 키를 입력하면 안 되고, 서버가 대신 호출해야 한다. 흐름: **화면 → 내 서버 `/api/chat` → 응답 표시**. 키는 서버에만 보관.

**폴더 구조**
```
09_groq/
└── 03/
    ├── server/
    │   ├── index.js      # 프록시 서버
    │   └── .env
    └── client/
        ├── index.html
        └── app.js
```

**server/index.js**
```javascript
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const key = process.env.GROQ_API_KEY
  if (!key) return res.json({ reply: '(mock) ' + req.body.prompt })

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: req.body.prompt }]
    })
  })

  const data = await groqRes.json()
  res.json({ reply: data.choices?.[0]?.message?.content || '(응답 없음)' })
})

app.listen(3000, () => console.log('http://localhost:3000'))
```

**server 실행**
```bash
cd server
npm install express cors dotenv   # 최초 1회
node index.js
```

**client/index.html**
```html
<input id="q" placeholder="물어보기" />
<button id="btn">보내기</button>
<p>AI 응답: <b id="ans">…</b></p>
<script src="app.js"></script>
```

**client/app.js**
```javascript
document.getElementById('btn').addEventListener('click', () => {
  const prompt = document.getElementById('q').value

  fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('ans').textContent = data.reply || data.error
  })
  .catch(() => {
    document.getElementById('ans').textContent = '❌ 서버 안 켜짐? (server서 node index.js 먼저)'
  })
})
```

**실행 순서**: server에서 `node index.js` 먼저 → `client/index.html` 열기 → 입력 후 보내기 클릭

**문자열 ↔ 객체 변환**
| 상황 | 타입 | 변환 |
|---|---|---|
| HTML 입력칸 꺼내기 | 문자열 | 불필요 |
| 객체를 네트워크로 보내기 | 객체 → 문자열 | `JSON.stringify()` |
| 네트워크 응답 받기 | 문자열 → 객체 | `.json()` |

**`res.json()`의 서버 ↔ 클라이언트 왕복**
```javascript
// [서버] 원래 객체 → res.json()이 내부에서 JSON.stringify 실행
const replyObj = { reply: "한컴은..." }
JSON.stringify(replyObj) = "{\"reply\":\"한컴은...\"}"

// [네트워크] 문자열 그대로 전송

// [클라이언트] fetch 응답의 body는 문자열 → res.json()으로 파싱해서 객체로 변환
res.json() = { reply: "한컴은..." }
```
같은 이름 `.json()`이지만 방향이 반대: 서버의 `res.json(객체)`는 객체→문자열, 클라이언트의 `res.json()`은 문자열→객체.

**`.then()` vs `.catch()`**
- `.then()` = 성공(응답이 오면, 404/500도 포함)했을 때 실행
- `.catch()` = 응답 자체가 불가능한 진짜 실패(서버 꺼짐, 네트워크 끊김)일 때 실행

**FAQ**
| 질문 | 답 |
|---|---|
| HTML·JS를 왜 파일로 나누나? | 화면(HTML)과 동작(JS) 분리 — 유지보수·협업 편의, `<script src="app.js">`로 연결 |
| `document.getElementById('q')`? | id가 'q'인 요소를 선택, `.value`로 입력값 추출 |
| `.then()`이 이어지는 이유? | "응답 오면 → 처리 → 또 처리" 순서를 약속하는 체이닝 |
| 여기 코드엔 왜 Authorization이 없나? | 화면 코드는 F12로 누구나 볼 수 있어 키 노출 위험 → 키는 서버에만 |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 핵심 정리
- Groq 키는 `.env`에만 저장하고 서버에서만 사용, 화면(client)에는 절대 노출 금지
- AI 호출의 3요소: 주소(엔드포인트) · 헤더(Authorization) · body(model, messages)
- 응답은 항상 `data.choices?.[0]?.message?.content` 위치에서 꺼냄
- 실서비스 구조는 client → 내 서버(프록시) → Groq 순으로, 서버가 키를 대신 들고 호출
