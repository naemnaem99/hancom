# Vercel — 학습 허브

내 컴퓨터의 localhost를 전 세계 URL로: 홈페이지 업로드 · CLI 배포 · GitHub 연동 · Claude 연동, 4단계로 정리.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 01. 홈페이지 업로드 (Vercel Drop)

Git · CLI · 설치 전부 없이 `vercel.com/drop`에 파일 · 폴더 · `.zip`을 드래그만 하면 배포된다. 프로토타입·정적 사이트·일회성 배포에 최적.

**배포 순서 (클릭 4번)**
```
1. vercel.com/drop 접속
2. 파일 · 폴더 · .zip 드래그 (또는 선택)
3. 팀 선택 + 프로젝트 이름 입력
4. Deploy 클릭 → production URL 즉시 발급
```
정적 사이트는 빌드 없이 그대로 게시되고, 프레임워크 프로젝트는 Vercel이 자동 감지해서 빌드한다.

**`index.html`이 없을 때**: 최상위에 `index.html`이 없으면 첫 화면 페이지를 물어봄(Root `/` 메뉴에서 선택). **No root page**를 선택하면 루트(`/`)는 404가 되고 각 파일은 자기 경로로만 접속 가능.

**배포 방법 비교**
| 방법 | Git | CLI | 적합한 상황 |
|---|---|---|---|
| Vercel Drop | ✗ | ✗ | 일회성 · 정적 · 프로토타입 |
| Git 연동 | ✓ | ✗ | push마다 자동 배포 |
| CLI | ✗ | ✓ | 로컬 · CI · 스크립트 |

**Drop의 한계**
- 드롭할 때마다 새 프로젝트가 생성됨 (기존 프로젝트 재배포 불가)
- Git 미연결 상태면 push해도 자동 배포 안 됨
- 큰 폴더는 브라우저 업로드라 느림

**이미 Drop으로 올린 사이트 업데이트하기** — 드래그앤드롭은 매번 새 프로젝트를 만들기 때문에, 같은 URL로 갱신하려면 아래 중 하나가 필요:
| 방법 | 같은 URL 유지 | 비고 |
|---|---|---|
| 또 드롭 | ✗ | 새 프로젝트·새 URL |
| CLI `vercel --prod` | ✓ | 가장 빠름 (02 참고) |
| Git 연결 | ✓ | push 자동배포 (03 참고) |

**Drop 프로젝트에 GitHub 나중에 연결**
```
대시보드 → 프로젝트 → Settings → Git
→ Connect Git Repository → 저장소 선택
연결 후 push → 자동 재배포 (URL 그대로 유지)
```

**Production 브랜치 바꾸기** — 연결한 브랜치와 production 브랜치(기본값 `main`)가 다르면 배포가 안 됨:
```
대시보드 → Settings → Environments → Production
→ Branch Tracking → "Branch is [main]" 클릭 → 원하는 브랜치 선택 → 저장
```
또는 작업 브랜치를 `main`에 머지해서 push하면 설정을 건드릴 필요 없음.

**대시보드에서 수동 재배포** — 코드 변경 없이 다시 빌드만 하려면 Deployments 탭 → 최신 배포 **⋯** → **Redeploy**. 단, 코드 수정분을 반영하려면 먼저 push가 필요.

**핵심 포인트**
- Vercel Drop = 일회성. 드롭마다 새 프로젝트라 기존 사이트 업데이트 불가
- 같은 URL로 업데이트하려면 CLI `vercel --prod` 또는 Git 연결 둘 중 하나 필수
- 자동배포 조건 = production 브랜치에 push (브랜치 불일치 시 배포 안 됨)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 02. CLI 배포

배포란 내 코드를 서버에 올려 누구나 접속하는 URL을 받는 것. 가장 빠른 방법은 Vercel CLI, 터미널 명령 4줄이면 끝.

**어디서 실행?** — vercel은 **실행한 현재 디렉토리**를 배포 대상으로 잡으므로 반드시 프로젝트 루트(`package.json` 있는 곳)에서 실행:
```bash
cd my-app    # 프로젝트 루트로 이동
ls           # package.json 보이면 위치 맞음
vercel       # 현재 폴더가 배포 대상
```
폴더 밖에서 실행하면 엉뚱한 폴더가 올라간다. 첫 실행 시 `? Code directory? → ./`의 `./`는 "현재 폴더"를 뜻함.

**설치 · 로그인 · 배포**
```bash
npm i -g vercel      # CLI 설치 (최초 1회)
vercel login         # 브라우저 인증 (1회)
vercel               # preview 배포 — 임시 URL
vercel --prod        # production 배포 — 실서비스 URL
```
- `vercel` = preview (매번 새 임시 URL, 실서비스에 영향 없음)
- `vercel --prod` = production (실서비스 도메인 갱신)
- 첫 배포는 production이 없어서 자동 승격됨
- 오타 주의: `--pord`(X) / `--prod`(O)

**첫 실행 시 질문**
```
? Set up and deploy? → y
? Project name? → my-app
? Code directory? → ./
✔ Detected Vite → 빌드 설정 자동 감지 (vite build · dist)
? Customize settings? → no
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 03. GitHub 연동

GitHub 저장소를 Vercel에 연결하면 `git push` 할 때마다 자동 재배포된다 — 실무 표준.

**GitHub에 올리기**
```bash
git init
git add .
git commit -m "first deploy"
git branch -M main
git remote add origin https://github.com/내아이디/my-app.git
git push -u origin main
```

**Vercel 웹에서 GitHub 레포 연동 (권장)** — CLI로 만든 프로젝트에 Git을 붙이는 방법. 클릭만으로 끝나고 CLI 인증이 꼬이지 않음:
```
Vercel 웹사이트 로그인 → 해당 프로젝트 클릭 (Overview)
→ 좌측 사이드바 맨 아래 Settings 클릭
→ Settings 탭 목록에서 Git 선택
→ Connect Git Repository → GitHub 레포 선택
연동 후 git push → 자동 재배포 켜짐
```
신규 프로젝트라면 `vercel.com/new` → **Import Git Repository** → 레포 선택 → Deploy 한 번에도 가능.

**CLI로 연결 (선택 · 파워유저용)**
```bash
vercel link          # Vercel 프로젝트 연결
vercel git connect   # git 원격 연결 → 자동 배포 켜짐
```
- `.vercel/` 폴더는 연결 정보이므로 **git에 올리지 말 것**
- `.gitignore`에 `node_modules`, `dist`, `.vercel` 포함 확인
- 모노레포라면 Settings → **Root Directory**로 배포할 하위 폴더 지정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 04. Claude 연동 ✦ AI 연동 · 특수 노드

03에서 GitHub ↔ Vercel이 이미 연결돼 있다면, Claude에게 코드 작업 후 **"깃허브에 푸시해줘"** 한마디만 하면 자동으로 Vercel에 반영된다. 터미널·CLI를 직접 만질 필요 없음.

**흐름**
1. Claude에게 코드 수정 요청
2. "깃허브 푸시해줘" 한마디
3. Claude가 `git add · commit · push` 실행
4. Vercel이 push 감지 → 자동 재배포
5. 잠시 뒤 실서비스 URL에 반영

**예시 대화**
```
나: 버튼 색 파란색으로 바꾸고 깃허브에 푸시해줘
Claude: 색상 변경 완료. 커밋·푸시했습니다. → Vercel이 배포 시작 (1~2분 후 URL 반영)
```

**핵심 정보**
- 배포 명령을 따로 실행하지 않음 — GitHub 연동(03) 덕분에 push = 배포
- 커밋 author 이메일이 Vercel 계정과 맞아야 배포됨. 안 되면 `git config user.email` 확인

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 핵심 정리
- 일회성/프로토타입 배포 → Vercel Drop, 반복 업데이트가 필요하면 CLI나 Git 연동으로 전환
- 같은 URL로 계속 갱신하려면 `vercel --prod` 또는 GitHub 연동이 필수
- 실무 표준은 GitHub 연동 — push만 하면 자동 배포되고, production 브랜치(기본 `main`)와 일치해야 함
- GitHub 연동이 돼 있으면 Claude에게 "푸시해줘"만 시켜도 배포까지 자동으로 이어짐
