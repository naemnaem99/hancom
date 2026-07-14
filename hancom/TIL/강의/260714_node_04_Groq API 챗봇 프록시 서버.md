# [node 04] Groq API로 챗봇 사이트 만들기 — 프록시 서버 패턴

> 작성: 2026-07-14

## Q&A

**Q. 프론트(브라우저)에서 바로 Groq API에 fetch를 날리면 안 되나?**

안 된다. Groq API를 호출하려면 `Authorization` 헤더에 API 키를 실어야 하는데, 그 코드를 브라우저에서 실행하면 개발자도구 Network 탭이나 페이지 소스만 봐도 키가 그대로 노출된다. 그래서 **키는 서버에만 두고, 프론트는 내 서버(3000번 포트)에만 요청**하고, 그 서버가 대신 Groq API를 호출해 응답을 돌려주는 "프록시" 구조를 쓴다. 지금까지 배운 POST 라우트가 그대로 이 프록시 역할을 한다.

```
브라우저(client) → 내 서버(3000, 키 있음) → Groq API(진짜 목적지)
              ← 답변만 돌아옴          ← 답변
```

**Q. API 키는 코드에 어떻게 넣어야 하나?**

소스 코드에 키 문자열을 직접 적으면 git에 커밋되는 순간 그대로 공개되므로, `.env` 파일에 `GROQ_API_KEY=...`처럼 따로 적어두고 `dotenv` 패키지로 그 파일을 읽어와 `process.env.GROQ_API_KEY`로 꺼내 쓴다. `.env`는 `.gitignore`에 등록해서 git에는 절대 올라가지 않게 한다.

```js
require('dotenv').config() // .env 파일을 읽어서 process.env에 등록
const key = process.env.GROQ_API_KEY
```

**Q. 서버 라우트 안에서 Groq API는 실제로 어떻게 호출하나?**

프론트에서 받은 `req.body.prompt`를 그대로 Groq의 채팅 완성 API 형식(`messages: [{ role, content }]`)에 맞춰 다시 감싸서 보낸다. 이때 Groq 쪽 `Authorization` 헤더에만 키를 넣고, 내 서버가 프론트에 보내는 응답에는 키가 전혀 들어가지 않는다.

```js
app.post('/api/chat', async (req, res) => {
  const key = process.env.GROQ_API_KEY
  if (!key) return res.json({ reply: '(mock)' + req.body.prompt }) // 키 없어도 UI 테스트 가능

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + key // 진짜 키는 여기, 서버 쪽에서만 사용
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: "user", content: req.body.prompt }]
    })
  })

  const data = await groqRes.json()
  res.json({ reply: data.choices?.[0]?.message?.content || '(응답없음)' })
})
```

**Q. 키가 아직 없거나 발급 전이어도 개발을 진행할 수 있나?**

`if (!key) return res.json({ reply: '(mock)' + req.body.prompt })` 한 줄 덕분에 가능하다. `.env`에 키를 아직 안 넣었으면 서버가 실제 Groq 호출 없이 `(mock)입력한말` 형태로 바로 흉내만 낸 응답을 돌려준다. 프론트 UI(말풍선 쌓기, 레이아웃 전환)는 이 mock 응답만으로도 완성해서 확인할 수 있고, 키가 발급되면 그 줄이 자동으로 통과되면서 진짜 AI 응답으로 바뀐다.

**Q. `data.choices?.[0]?.message?.content`처럼 물음표(`?.`)를 연달아 쓰는 이유는?**

Groq(그리고 OpenAI 호환 API 전반)의 정상 응답 구조는 `choices` 배열 안에 `message.content`가 들어있는 형태지만, 키가 잘못됐거나 요청 형식이 틀리면 이 구조 자체가 없는 에러 응답이 온다. `?.`(옵셔널 체이닝)을 안 쓰고 `data.choices[0].message.content`로 바로 접근하면 `choices`가 `undefined`인 순간 `Cannot read properties of undefined` 에러로 서버가 죽는다. `?.`를 쓰면 중간 어딘가가 없어도 에러 없이 `undefined`로 멈추고, `|| '(응답없음)'`이 그 자리를 대신 채워준다.

**Q. 프론트 쪽 채팅 UI는 어떤 흐름으로 동작하나?**

입력창에 질문을 적고 버튼을 누르면, 먼저 내 질문을 말풍선으로 쌓고, 내 서버의 `/api/chat`에 POST로 보낸 뒤, 돌아온 `reply`를 AI 말풍선으로 또 쌓는다. 이때 `body.classList.add('chatting')`으로 화면 상태를 바꾸는데, 처음엔 입력창이 화면 정중앙에 있다가 첫 메시지를 보내는 순간 CSS 클래스 하나로 "대화 로그가 보이는 하단 고정 레이아웃"으로 전환된다.

```js
document.getElementById('btn').addEventListener('click', () => {
  const prompt = input.value
  if (!prompt) return

  document.body.classList.add('chatting') // 중앙 레이아웃 → 하단 고정 레이아웃 전환

  addMessage('user', prompt)
  input.value = ''

  fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
    .then(res => res.json())
    .then(data => { addMessage('assistant', data.reply || data.error) })
    .catch(() => { addMessage('assistant', '❌ 서버 안 켜짐? (server서 node index.js 먼저)') })
})
```

```css
/* 기본: 입력창이 화면 정중앙 */
#input-bar { flex: 1; display: flex; align-items: center; justify-content: center; }

/* .chatting이 붙으면 대화 로그 등장 + 입력창 하단 고정 */
body.chatting #chat-container { display: flex; }
body.chatting #input-bar { flex: none; flex-direction: row; border-top: 2px solid #000; }
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 개념 요약

### 프록시 서버 구조

| 구간 | 요청 | 키 노출 여부 |
|---|---|---|
| 브라우저 → 내 서버 | `POST /api/chat { prompt }` | 키 없음(안전) |
| 내 서버 → Groq API | `POST .../chat/completions` + `Authorization: Bearer 키` | 서버 안에서만 사용, 응답에 포함 안 됨 |

**실무 예시**: OpenAI, Groq, 각종 결제 API 등 "비밀 키가 필요한 외부 API"는 프론트에서 절대 직접 호출하지 않고 항상 이런 자체 백엔드(BFF, Backend-for-Frontend) 프록시를 하나 거치는 게 표준 패턴이다. 지금까지 만든 GET/POST/PUT/DELETE 라우트와 구조적으로 동일하고, 그 안에서 "다른 서버에 다시 fetch를 보낸다"는 한 단계만 추가된 것뿐이다.

### `.env` + `dotenv`로 키 관리

| 항목 | 내용 |
|---|---|
| 저장 위치 | `server/.env` (예: `GROQ_API_KEY=키값`) |
| 코드에서 읽기 | `require('dotenv').config()` 후 `process.env.GROQ_API_KEY` |
| git 관리 | `.gitignore`에 `.env` 등록 필수 |

**실무 예시**: 협업 시 `.env` 자체는 공유하지 않고, 어떤 변수 이름이 필요한지만 적어둔 `.env.example`(`GROQ_API_KEY=`처럼 값은 비움)을 대신 커밋해서 팀원이 각자 자기 키로 채워 넣게 한다.

### 키 없이도 개발 가능한 mock 패턴

```js
if (!key) return res.json({ reply: '(mock)' + req.body.prompt })
```

**실무 예시**: 외부 API 키 발급을 기다리는 동안 프론트 팀이 손 놓고 있지 않도록, 백엔드가 실제 응답과 형태만 같은 가짜 응답을 미리 만들어두는 경우가 흔하다. 이렇게 하면 "키가 없어서 아무것도 못 만든다"는 병목 없이 UI/UX 작업을 API 발급과 동시에 진행할 수 있다.

### 옵셔널 체이닝(`?.`)으로 안전하게 응답 파싱

| 접근 방식 | `choices`가 없을 때 |
|---|---|
| `data.choices[0].message.content` | 즉시 에러로 서버가 죽음(500) |
| `data.choices?.[0]?.message?.content` | 에러 없이 `undefined` → `\|\| '(응답없음)'`로 대체 |

**실무 예시**: 외부 API는 언제든 요금 초과, 키 만료, 요청 형식 오류 등으로 평소와 다른 응답을 줄 수 있다. 응답 구조를 100% 신뢰하지 않고 `?.`와 기본값(`||`)으로 방어해두면, 외부 서비스 쪽 문제가 내 서버 전체를 다운시키는 상황을 막을 수 있다.
