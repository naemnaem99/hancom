# [JS] feel 프로젝트 — 쓴 HTML/CSS/JS 기술 정리

> 작성: 2026-07-09 (8일차 작업물 회고)

## 개념 요약 (기록)

### HTML
- 시맨틱 태그 없이 순수 `div` 여러 개(`#prompt`, `#controls`, `#cards`, `#basketHint`, `#fire`, `#fireHint`)만 뼈대로 두고, 내용은 전부 JS가 채워 넣는 구조
- `<script src="scripts/main.js">`를 `</body>` 바로 앞에 둬서 DOM이 다 그려진 뒤 스크립트가 실행되게 함 (`defer` 없이도 순서 보장하는 흔한 방법)

### CSS

| 기법 | 어디에 썼나 |
|---|---|
| `position: fixed` + `inset: 0` | 카드/눈송이 텍스트를 화면(뷰포트) 전체 기준으로 고정 배치 |
| `pointer-events: none` / `auto` | `.cards` 컨테이너는 클릭이 통과되게, 그 안의 실제 카드(`.cards > *`)만 클릭 가능하게 분리 |
| `@keyframes` (`cardIn`, `fall`) | 카드 등장 애니메이션, 텍스트가 눈처럼 떨어지는 애니메이션 |
| `box-shadow`를 여러 개 겹쳐서 픽셀 그림 그리기 | 화살표 아이콘을 이미지 파일 없이 CSS만으로 표현 (`arrow-pixel`) |
| `touch-action: none` | 드래그 중 모바일에서 스크롤/줌이 같이 발생하는 걸 방지 |
| `@media (max-width: 600px)` | 좁은 화면에서 카드 크기 축소 |

### JS

| 기법 | 어디에 썼나 |
|---|---|
| `localStorage` + `JSON.stringify`/`parse` | 입력 기록을 3개 단위(`CYCLE_SIZE`)로 묶어 저장, 새로고침 시 마지막 묶음만 재생 |
| `document.createElement` + `appendChild` | 카드, 화살표 아이콘, 눈송이 텍스트를 전부 동적으로 생성 |
| Pointer Events (`pointerdown`/`pointermove`/`pointerup`) | 마우스와 터치를 하나의 이벤트 체계로 통합해서 드래그 구현 (`mousedown` 등을 따로 안 씀) |
| 사각형 충돌 판정 함수 `overlaps(a, b)` | "카드가 불에 닿았는지"와 "낙하 텍스트가 바구니 입구에 닿았는지" 두 곳에서 재사용 |
| `requestAnimationFrame` 반복 루프 (`checkCatches`) | 매 프레임마다 낙하 텍스트와 바구니 입구의 충돌을 계속 검사 |
| 클릭 횟수 상태(`clickCount`)로 단계 전환 | 버튼 하나로 안내 문구·placeholder·버튼 텍스트를 세트로 3단계 전환 |
| `animationend` 이벤트로 요소 재활용 (`resetEl`) | 떨어지는 텍스트가 바닥에 닿으면 다시 랜덤 위치에서 재시작 |

---

## 복습 Q&A

**Q. `.cards`에는 `pointer-events: none`, `.cards > *`에는 다시 `auto`를 건 이유는?**

`.cards`는 화면 전체를 덮는 `fixed` 레이어라서 그대로 두면 그 아래 있는 입력창·버튼 클릭을 다 막아버린다. 컨테이너 자체는 클릭을 "투과"시키고, 실제 카드 요소만 다시 클릭 가능하게 살려서 카드 바깥 영역은 다른 UI를 그대로 조작할 수 있게 한 것.

**Q. `checkCatches()`는 왜 `setInterval`이 아니라 `requestAnimationFrame`으로 반복 호출하나?**

`requestAnimationFrame`은 브라우저가 화면을 실제로 다시 그리는 타이밍(보통 초당 60회)에 맞춰 실행되고, 탭이 비활성화되면 자동으로 쉬어서 배터리/성능에 유리하다. 애니메이션 중인 요소의 위치를 매 프레임 검사해야 하는 충돌 판정에는 `setInterval`(고정된 시간 간격)보다 자연스럽게 맞는다.

**Q. `overlaps()` 하나로 두 가지 다른 충돌(카드-불, 텍스트-바구니)을 처리하는 게 가능한 이유는?**

두 상황 모두 결국 "사각형 두 개가 겹치는가"라는 같은 문제라서, `getBoundingClientRect()`로 구한 사각형 좌표(`left/right/top/bottom`)만 넘기면 어떤 요소끼리든 재사용 가능하다. DOM 요소가 아니라 좌표값을 인자로 받게 만든 게 재사용의 핵심.

**Q. `localStorage`에 배열 안에 배열(`groups` 안의 `lastGroup`) 구조로 저장한 이유는?**

한 사이클(`CYCLE_SIZE = 3`번 입력)을 하나의 묶음으로 관리하기 위해서다. `lastGroup`이 꽉 차면(3개) 새 배열을 만들어 `groups`에 추가하는 식으로, 새로고침 후에는 가장 최근 묶음(`groups[groups.length - 1]`)만 다시 재생할 수 있다.

**Q. 마우스 이벤트 대신 Pointer 이벤트를 쓴 이유는?**

`mousedown`/`touchstart`처럼 입력 방식별로 이벤트를 따로 처리할 필요 없이, Pointer Events는 마우스·터치·펜 입력을 하나의 API로 통합해서 다룬다. 드래그 로직을 한 번만 작성해도 데스크톱/모바일 모두 동작한다.

---

## 핵심 정리
- 화면 전체를 덮는 레이어는 `pointer-events: none` + 자식만 `auto`로 클릭 영역을 세밀하게 제어
- 반복되는 애니메이션 프레임 검사는 `setInterval`보다 `requestAnimationFrame`이 적합
- 충돌 판정 함수는 DOM 요소가 아니라 좌표(rect)를 받게 만들면 여러 상황에 재사용 가능
- `localStorage`에 묶음 단위(배열 안 배열)로 저장하면 "최근 N개만 복원" 같은 로직이 단순해짐
- 드래그 기능은 마우스/터치를 따로 안 다루고 Pointer Events로 통일하는 게 유리
