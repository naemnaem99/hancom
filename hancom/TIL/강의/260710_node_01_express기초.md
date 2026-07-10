# [node 01] Express — 왜 쓰는지, 순수 Node http와의 차이

> 작성: 2026-07-10

## Q&A

**Q. Node.js에 기본으로 있는 `http` 모듈만으로도 서버를 만들 수 있는데, Express는 왜 따로 쓰나?**

`http` 모듈만으로도 서버를 만들 수는 있지만, 주소별로 다른 응답을 주려면 사람이 직접 `if`문으로 주소·요청 방식을 비교하고 상태코드·헤더까지 손으로 지정해야 한다. Express는 이 반복 작업을 `app.get('/주소', 처리함수)`라는 정해진 한 줄 문법으로 대신 처리해준다.

```js
// 순수 Node — 주소·메서드 직접 비교, 헤더/상태코드 수동
const http = require('http')
http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('OK')
  } else {
    res.writeHead(404); res.end('Not Found')
  }
}).listen(3000)
```

```js
// Express — 한 줄, 404는 자동
const express = require('express')
const app = express()
app.get('/', (req, res) => res.send('OK'))
app.listen(3000)
```

**Q. 라우트(주소)가 여러 개로 늘어나면 차이가 왜 더 커지나?**

순수 Node는 라우트가 하나 늘 때마다 `else if` 덩어리가 계속 붙어서 코드가 길고 중첩이 깊어진다. Express는 `app.get(...)`을 그냥 한 줄씩 나란히 추가하기만 하면 되므로, 라우트가 100개여도 코드가 깔끔하게 유지된다. **이게 실무에서 Express(혹은 비슷한 프레임워크)를 쓰는 가장 큰 이유다.**

```js
// 순수 Node — 라우트가 늘수록 if/else 체인이 길어짐
if (req.url === '/') { res.end('Home') }
else if (req.url === '/about') { res.end('About') }
else { res.writeHead(404); res.end('Not Found') }
```

```js
// Express — 나란히 한 줄씩만 추가
app.get('/', (req, res) => res.send('Home'))
app.get('/about', (req, res) => res.send('About'))
```

**Q. "런타임", "프레임워크", "프로토콜", "라이브러리"라는 용어들이 헷갈리는데 Express는 뭐라고 부르나?**

각각 역할이 다른 개념이다.

| 용어 | 뜻 | 예시 |
|---|---|---|
| 런타임 | 코드가 실제로 실행되는 환경 | Node.js |
| 프레임워크 | 정해진 틀에 내 코드를 끼워 넣어 쓰는 도구 | Express |
| 프로토콜 | 컴퓨터끼리 통신할 때 지키는 규칙 | HTTP |
| 라이브러리 | 필요할 때 가져다 쓰는 도구 모음 | axios, lodash |

Express는 라이브러리에 가까운 아주 가벼운 **프레임워크**로 분류된다. 한 줄로 정리하면: Node.js(런타임) 위에서 HTTP(프로토콜)로 통신하는 백엔드 서버를, Express(프레임워크)로 쉽게 만드는 것.

**Q. `npm install express`는 새 파일을 만들 때마다 매번 해야 하나?**

아니다, **프로젝트당 한 번**만 하면 된다. 실행하면 `node_modules` 폴더 안에 Express 코드가 다운로드되고, 그 뒤로는 같은 프로젝트 안에서 계속 재사용된다. 다만 완전히 새로운 프로젝트를 시작하면 그 프로젝트에서 다시 설치해야 한다.

**Q. Express 말고 다른 선택지도 있나?**

Nest, Koa, Fastify 등 다른 Node.js 프레임워크도 있다. 각자 특징이 조금씩 다르지만, 자료가 가장 많고 널리 쓰이는 Express로 입문하는 것으로 충분하다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 개념 요약

### 순수 Node http vs Express

| | 순수 Node (`http`) | Express |
|---|---|---|
| 라우팅 | `if`/`else if`로 직접 분기 | `app.get('/주소', ...)` 한 줄 |
| 상태코드/헤더 | 손으로 직접 지정 | 자동 처리 (`res.send`가 알아서) |
| 라우트 늘어날 때 | 코드가 계속 길어짐 | 한 줄씩 나란히 추가 |
| 비유 | 맨손 요리 | 잘 갖춰진 주방 도구 |

**실무 예시**: 라우트가 1~2개인 아주 작은 테스트 서버라면 순수 `http` 모듈로도 충분하지만, 실제 서비스는 로그인/회원가입/상품목록/주문 등 라우트가 수십~수백 개가 되기 때문에 거의 항상 Express 같은 프레임워크를 쓴다.

### 용어 4종 세트

```
Node.js(런타임) 위에서
HTTP(프로토콜)로 통신하는
백엔드 서버를,
Express(프레임워크)로 쉽게 만든다.
```

**실무 예시**: 채용 공고에 "Node.js, Express 경험자 우대"라고 적혀있다면, "JS를 서버(Node.js)에서 실행할 줄 알고, 그 서버의 라우팅을 Express로 짜본 경험"을 의미한다. axios 같은 라이브러리는 이 서버에 요청을 보내는 클라이언트 쪽 도구라 역할이 또 다르다.

### 설치는 프로젝트당 1회

```
npm install express
```

**실무 예시**: 새 백엔드 프로젝트를 시작할 때마다(예: `mkdir my-server && cd my-server && npm init -y`) 그 폴더 안에서 다시 `npm install express`를 해줘야 한다. `node_modules`는 보통 `.gitignore`에 등록해서 git에는 안 올리고, 대신 `package.json`에 적힌 의존성 목록만 공유해서 다른 사람이 `npm install`로 똑같이 설치하게 한다.
