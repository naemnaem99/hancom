# [node 03] POST·PUT·DELETE와 CORS — CRUD 완성

> 작성: 2026-07-14

## Q&A

**Q. Express 서버의 최소 뼈대는 어떤 4단계로 이루어지나?**

`불러오기 → 만들기 → 규칙(라우트) → 문 열기(listen)` 4박자가 전부다. 이 뼈대 위에 GET/POST/PUT/DELETE 라우트가 하나씩 얹히는 구조라, 뼈대를 정확히 외워두면 어떤 라우트를 추가하든 헷갈리지 않는다.

```js
const express = require('express') // 1. 불러오기
const app = express()               // 2. 서버 생성
app.get('/', (req, res) => {        // 3. 라우트 규칙
  res.send('Hello, Server!')
})
app.listen(3000, () => {            // 4. 포트 열기
  console.log('http://localhost:3000')
})
```

**Q. 프론트에서 서버로 데이터를 "보낼" 때(POST)는 GET과 뭐가 다른가?**

GET은 주소창(URL)만으로 요청이 끝나서 body를 실을 수 없지만, POST는 `body`에 데이터를 실어 보낼 수 있다. 서버 쪽에서는 `app.use(express.json())`이 먼저 있어야 그 body를 `req.body` 객체로 풀어서 꺼낼 수 있다.

```js
// 받기(서버)
const express = require('express')
const app = express()
app.use(express.json()) // 必 — 없으면 req.body는 undefined

app.post('/api/chat', (req, res) => {
  const { message } = req.body
  console.log('받은 메시지:', message)
  res.json({ ok: true, 받은문장: message }) // 잘 받았다는 확인(영수증)
})

app.listen(3000, () => console.log('http://localhost:3000'))
```

```js
// 보내기(프론트) — fetch로 POST
fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // "JSON 보낸다" 알림
  body: JSON.stringify({ message: '안녕' }) // 객체 → 문자열로 변환해서 실어 보냄
})
  .then(r => r.json())
  .then(console.log)
```

**Q. PUT(수정) 라우트를 만들었는데 브라우저 주소창으로는 테스트가 안 된다. 어떻게 확인하나?**

브라우저 주소창은 GET 요청만 보낼 수 있어서 PUT은 그렇게 테스트할 수 없다. curl 같은 별도 도구 없이 확인하려면, `app.listen`의 콜백 안에서 서버가 스스로 자기 자신에게 `fetch`를 날려보는 패턴을 쓸 수 있다 — 서버가 켜지자마자 스스로 요청/응답을 콘솔에 찍어 보여준다.

```js
let users = [{ id: 1, name: '지니' }, { id: 2, name: '철수' }]

app.put('/api/users/:id', (req, res) => {
  const u = users.find(u => u.id === Number(req.params.id))
  if (!u) return res.status(404).json({ error: '없는 유저' })
  u.name = req.body.name // 보낸 새 이름으로 교체
  res.json(u)
})

app.listen(3000, async () => { // 서버 켜지면 스스로 PUT 요청 → 응답 출력
  const res = await fetch('http://localhost:3000/api/users/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '민수' })
  })
  console.log(await res.json()) // → { id: 1, name: '민수' }
})
```

**Q. DELETE는 PUT과 달리 `express.json()`이 없어도 되는 경우가 있다는데 왜인가?**

DELETE는 보통 "어떤 항목을 지울지"를 주소의 `:id`만으로 지정하고 별도의 body를 보내지 않는다. body가 없으니 그걸 파싱하는 `express.json()`도 굳이 필요 없는 것이다. 삭제는 `filter`로 그 id만 뺀 새 배열을 만들어 원래 배열에 다시 대입하는 방식으로 구현한다.

```js
let users = [{ id: 1, name: '지니' }, { id: 2, name: '철수' }]

app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== Number(req.params.id)) // 그 id만 빼고 새 배열로
  res.json({ ok: true, 남은: users }) // 남은 목록까지 응답 → 삭제 결과를 눈으로 확인
})
```

**Q. 서버·프론트 코드 둘 다 문제없이 짰는데 브라우저 콘솔에 CORS 에러가 뜬다면?**

CORS는 "브라우저의 보안 규칙 — 출처(도메인·포트)가 다른 곳에서 온 요청은 기본적으로 차단한다"는 정책이다. 백엔드가 3000번 포트, 프론트가 5173번 포트처럼 포트만 달라도 브라우저는 이걸 "다른 출처"로 보고 막는다. 서버에 `cors()` 미들웨어를 추가해서 "이 출처는 허용한다"고 명시해야 정상적으로 통신된다.

```js
const express = require('express')
const cors = require('cors') // npm install cors (최초 1회)
const app = express()

// 미들웨어는 위→아래 순서대로 모든 요청이 라우트 전에 거침
app.use(cors())          // 다른 포트(프론트 5173 등)의 요청 허용
app.use(express.json())  // POST/PUT body → req.body 객체로 해석
app.use((req, res, next) => { // 직접 만든 로깅 미들웨어
  console.log(req.method, req.url)
  next() // 다음으로 넘김 — 안 부르면 여기서 요청이 멈춤
})

app.get('/api/users', (req, res) => res.json([{ id: 1, name: '지니' }]))

app.listen(3000, () => console.log('http://localhost:3000/api/users'))
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 개념 요약

### CRUD ↔ HTTP 메서드 대응

| 동작 | 메서드 | body 필요 | express.json() 필요 |
|---|---|---|---|
| Create(생성) | POST | O | O |
| Read(조회) | GET | X | X |
| Update(수정) | PUT | O | O |
| Delete(삭제) | DELETE | 보통 X | 보통 X |

**실무 예시**: REST API를 설계할 때 "이 기능은 조회니까 GET, 새로 만드니까 POST"처럼 동작과 메서드를 1:1로 맞추는 게 관례다. 이 규칙을 어기고 아무 동작이나 GET/POST로 처리하면 협업하는 프론트/백엔드 팀원끼리 API 문서만 봐도 헷갈리게 된다.

### 서버 스스로 테스트하는 패턴 (`app.listen` 콜백 안 fetch)

```js
app.listen(3000, async () => {
  const res = await fetch('http://localhost:3000/api/users/1', { method: 'PUT', ... })
  console.log(await res.json())
})
```

**실무 예시**: 실무에서는 이 자리에 Postman이나 curl, 또는 Jest 같은 테스트 코드가 들어가지만, 학습 단계에서는 별도 도구 설치 없이 "서버 켜자마자 결과를 바로 눈으로 확인"하는 용도로 쓰기 좋다. 실제 서비스 코드에는 남기지 않는 것이 원칙(테스트용 임시 코드).

### CORS와 `cors()` 미들웨어

| 상황 | 결과 |
|---|---|
| 프론트(5173)·백엔드(3000) 포트가 다름 + `cors()` 없음 | 브라우저가 요청을 차단 (콘솔에 CORS 에러) |
| `app.use(cors())` 추가 | 다른 출처의 요청도 허용되어 정상 통신 |

**실무 예시**: 배포 환경에서는 `cors()`를 인자 없이 전부 허용하기보다 `cors({ origin: '프론트 도메인' })`처럼 허용할 출처를 명시하는 경우가 많다 — 아무 출처나 다 열어두면 보안상 위험하기 때문. 개발 단계에서는 편의상 전체 허용을 많이 쓴다.

### 미들웨어 등록 순서

| 순서 | 코드 | 역할 |
|---|---|---|
| 1 | `app.use(cors())` | 출처 허용 |
| 2 | `app.use(express.json())` | body 파싱 |
| 3 | `app.use((req,res,next)=>{...})` | 커스텀 로직(로깅 등) + `next()` 필수 |
| 4 | `app.get/post/put/delete(...)` | 실제 라우트 |

**실무 예시**: 미들웨어는 **등록한 순서대로** 실행되므로, `express.json()`을 라우트보다 뒤에 두면 그 라우트에서는 `req.body`를 못 쓴다. "공용 처리(미들웨어)는 항상 라우트보다 위에 선언한다"는 순서 원칙을 지켜야 한다.

### CRUD 종합 실습 — "우리 반 배치도" 과제

| 항목 | 내용 |
|---|---|
| 데이터 출처 | 강사 서버 `http://192.168.10.28:5000/hancom/:반이름/users` (Authorization: `HANCOM` 토큰 필수) |
| 조회 | fetch로 학생 20명 데이터를 가져와 4열×5행 HTML 그리드로 표시 |
| 수정 | 이름 클릭 → PUT으로 이름 변경 |
| 추가 | POST로 신규 학생 추가 |
| 삭제 | DELETE로 학생 제거 |
| 검증 | 정상 명단(20명)과 서버 데이터를 비교해 오염된 항목을 찾아 수정 |

**실무 예시**: "서버에서 받아온 데이터가 정답과 다를 수 있으니 검증 후 고친다"는 흐름은 실제 서비스의 **데이터 정합성 체크·관리자 도구**와 같은 구조다. fetch로 조회 → 화면에 렌더 → 특정 항목 클릭해 수정(PUT) → 즉시 화면 갱신, 이 사이클이 CRUD 프론트엔드 개발의 기본 패턴이다.
