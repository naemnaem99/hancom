# [tool 03] npm run dev는 Node.js 실행인가 & Live Server와 차이

> 작성: 2026-07-10

## Q&A

**Q. `npm run dev`로 뜨는 로컬 서버는 결국 Node.js로 실행된 서버인가?**

맞다. `npm run dev`는 `package.json`의 `scripts.dev`에 적힌 명령(Vite 프로젝트라면 보통 `vite`)을 실행하라는 뜻이고, 그 `vite`라는 프로그램 자체가 JS로 작성되어 Node.js 위에서 동작한다. `localhost:5173` 같은 주소로 접속했을 때 요청을 받아 응답해주는 주체가 바로 이 Node.js 프로세스다. 터미널에서 `npm run dev`를 실행하는 순간 Node.js 프로세스 하나가 백그라운드에 떠서 `Ctrl+C`로 끄기 전까지 계속 실행된다.

역할을 층으로 나누면:

| 층 | 역할 |
|---|---|
| npm | `package.json`을 보고 `dev`가 뭘 실행할지 찾아주는 실행기 |
| vite | 실제로 개발 서버를 띄우는 프로그램 (JS로 작성됨) |
| Node.js | vite라는 JS 코드를 실제로 돌려주는 런타임 |

단, 이건 **개발 전용**이다. 배포 시에는 `npm run build`로 순수 정적 파일(HTML/CSS/JS)만 뽑아내고, 그건 Node.js 없이 Nginx나 GitHub Pages 같은 정적 파일 서버에서도 그대로 돌아간다.

**Q. VSCode의 Live Server("Go Live")로 띄우는 것과 뭐가 다른가?**

가장 큰 차이는 **JS를 변환해주는지 여부**다.

- **Live Server**는 있는 파일을 그대로 브라우저에 전달하는 단순 정적 파일 서버다. 순수 HTML/CSS/JS(`03_css`, `04_js` 폴더 실습)에는 문제없이 쓸 수 있지만, JSX나 `import`/`export` 같은 최신 모듈 문법은 브라우저가 직접 이해할 수 없어서 그대로 에러가 난다. 파일 저장 시 브라우저를 **전체 새로고침**하는 정도의 기능만 있다.
- **Vite dev server(`npm run dev`)**는 JSX 코드를 브라우저가 이해할 수 있는 JS로 즉석에서 변환(트랜스파일)해주고, `import` 구문으로 연결된 컴포넌트/npm 패키지(MUI 등)까지 번들링/해석해준다. 저장 시에도 전체 새로고침이 아니라 **HMR(Hot Module Replacement)**로 바뀐 컴포넌트만 갈아끼우기 때문에 `useState` 값 같은 상태가 유지된 채로 화면만 갱신된다.

| | Live Server | Vite dev server |
|---|---|---|
| 대상 | 순수 HTML/CSS/JS | React(JSX) 등 빌드가 필요한 프로젝트 |
| JSX 처리 | 못함 (에러) | 실시간 변환 |
| 저장 시 갱신 방식 | 전체 새로고침 | HMR (상태 유지하며 부분 갱신) |
| npm 패키지 사용 | 불가 | 가능 |

그래서 지금 `my-app`(React) 프로젝트는 Live Server로 띄울 수 없고, 반대로 `03_css`/`04_js`의 순수 HTML 실습은 Vite 없이 Live Server만으로 충분하다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 개념 요약

- `npm run dev` = `package.json.scripts.dev`에 적힌 명령(Vite 프로젝트는 보통 `vite`)을 대신 실행하는 것
- 그 `vite`는 JS 프로그램이고, 이를 구동하는 게 Node.js → 로컬 개발 서버는 결국 **Node.js 프로세스**
- 정적 파일 서버(Live Server)는 변환 없이 파일을 그대로 서빙 → JSX 같은 빌드 필요 문법은 처리 불가
- Vite dev server는 JSX 트랜스파일 + 모듈 번들링 + HMR(상태 유지 갱신)까지 제공 → React 프로젝트에 필수
- 배포용 정적 파일(`npm run build` 결과물)은 Node.js 없이도 어떤 정적 호스팅에서든 동작
