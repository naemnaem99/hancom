# HTML & CSS 요약 노트

> `02_html/`(HTML 실습 03~34번)와 `03_css/`(CSS 실습 01~19번) 폴더의 실제 실습 코드를 바탕으로 정리한 노트입니다.
> 각 예시 코드 아래 `> 출처`에 표시된 경로로 가면 원본 실습 파일을 볼 수 있습니다.

---

## HTML편

### HTML이란?

HTML(HyperText Markup Language)은 웹 페이지의 **뼈대(구조)**를 만드는 마크업 언어입니다. "이 텍스트는 제목이다", "이건 표다", "이건 입력칸이다" 처럼 콘텐츠의 의미와 구조를 태그로 표시하며, 실제 디자인(색, 크기, 배치)은 CSS가 담당합니다.

### 카테고리별 주요 태그

#### 1. 기본 구조 (Boilerplate)

모든 HTML 문서에 공통으로 들어가는 뼈대입니다.

| 태그 | 역할 |
|---|---|
| `<!DOCTYPE html>` | "이 문서는 HTML5 문서다" 선언 |
| `<html lang="ko">` | 문서 시작, 언어 설정 |
| `<head>` | 화면에 안 보이는 설정 칸 (메타정보, 제목, CSS 연결) |
| `<meta charset="UTF-8">` | 한글이 깨지지 않게 인코딩 지정 |
| `<title>` | 브라우저 탭에 뜨는 제목 |
| `<body>` | 화면에 실제로 보이는 내용 칸 |

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <title>자 드가자</title>
  </head>
  <body>
    <h1>안녕하세요! 제 첫 웹페이지입니다.</h1>
  </body>
</html>
```
> 출처: `02_html/03_index.html`

#### 2. 텍스트 & 제목

| 태그 | 역할 |
|---|---|
| `<h1>`~`<h6>` | 제목 (숫자가 작을수록 크고 중요) |
| `<p>` | 문단 |
| `<br>` | 줄바꿈 |
| `<hr>` | 가로 구분선 |
| `<strong>` | 굵게 강조 (의미상 "중요") |
| `<em>` | 기울임 강조 (의미상 "강조") |
| `<mark>` | 형광펜 표시 |
| `<small>` | 작은 글씨 (저작권 등 부가 정보) |
| `<sub>` / `<sup>` | 아래첨자 / 위첨자 |
| `<blockquote>` | 인용문 |

```html
<h1>글자 꾸미기</h1>
<p><em>기울임 강조</em></p>
<p><mark>형광펜</mark></p>
<p><small>작게 쓰는 글씨</small></p>
<blockquote>인용문</blockquote>
<p>H<sub>2</sub>O</p>
<p>X<sup>2</sup></p>
```
> 출처: `02_html/25_index.html`
> ⚠️ 실습 파일 원본에는 `<suP>`처럼 태그 대소문자가 섞여 있었는데, 태그명은 대소문자를 구분하지 않아도 동작은 하지만 `<sup>`로 소문자 통일하는 게 좋은 습관입니다.

#### 3. 리스트

| 태그 | 역할 |
|---|---|
| `<ul>` | 순서 없는 목록 (불릿) |
| `<ol>` | 순서 있는 목록 (번호), `type="A"`로 A,B,C.. 표기 가능 |
| `<li>` | 목록 항목 |

```html
<ol>
  <li>일어나기</li>
  <li>세수하기</li>
  <li>아침먹기</li>
  <ol type="A">
    <li>콩</li>
    <li>고기</li>
    <li>밥</li>
  </ol>
</ol>
```
> 출처: `02_html/12_index.html`

#### 4. 링크 & 이미지

| 태그 | 역할 |
|---|---|
| `<a href="...">` | 링크. `mailto:`, `tel:` 로 이메일/전화 링크도 가능 |
| `<img src="..." alt="...">` | 이미지 삽입 |

```html
<div><a href="https://www.google.com">구글로 가기</a></div>
<div><a href="https://www.naver.com">네이버로 가기</a></div>
```
> 출처: `02_html/09_index.html`

```html
<p>블로그: <a href="mailto:jiho@example.com">jiho@example.com</a></p>
<p>전화: <a href="tel:010-1234-5678">010-1234-5678</a></p>
```
> 출처: `02_html/34_index.html`

#### 5. 테이블

| 태그 | 역할 |
|---|---|
| `<table>` | 표 전체 상자 (`border` 속성으로 테두리) |
| `<tr>` | 가로 한 줄 |
| `<th>` | 제목 칸 |
| `<td>` | 내용 칸 |
| `<thead>` / `<tbody>` | 표의 머리글 영역 / 본문 영역 구분 |
| `colspan` / `rowspan` | 칸 병합 (가로/세로) |

```html
<table border="1">
  <tr><th>요일</th><th>과목</th></tr>
  <tr><td>월</td><td>코딩 이해</td></tr>
  <tr><td>화</td><td>코딩 기초 html</td></tr>
</table>
```
> 출처: `02_html/14_index.html`

#### 6. 폼 & 입력

| 태그/속성 | 역할 |
|---|---|
| `<form>` | 입력칸들을 담는 상자 |
| `<label>` | 입력칸 설명 라벨 (`for`로 `input id`와 연결) |
| `<input type="...">` | text, email, password, checkbox, radio, date 등 |
| `name` | 같은 그룹의 radio를 묶어 중복 선택 방지 |
| `<textarea>` | 여러 줄 텍스트 입력 |
| `<select>` / `<option>` | 드롭다운 선택지 |
| `<button>` | 제출/초기화 버튼 |
| `<fieldset>` / `<legend>` | 관련 입력들을 그룹으로 묶고 제목 달기 |

```html
<form>
  <label>이메일: <input type="email" placeholder="hancom@hancom.com"></label>
  <label>비밀번호: <input type="password"></label>
  <label>동의: <input type="checkbox"></label>
  <label>성별: <input type="radio" name="gender"> 남</label>
  <label><input type="radio" name="gender"> 여</label>
  <label>날짜: <input type="date"></label>
  <textarea>안녕하세요!</textarea>
  <select>
    <option>서울</option>
    <option>부산</option>
    <option>제주</option>
  </select>
</form>
```
> 출처: `02_html/24_index.html`
> radio는 여러 개 중 하나만 고르는 동그라미 버튼이라, 선택지가 2개 이상이면 `name`을 똑같이 줘서 하나의 그룹으로 묶어야 합니다.

#### 7. 시맨틱 레이아웃 — `div`/`span`과의 차이

`div`는 뜻이 없는 빈 상자(블록)이고, `span`은 뜻이 없는 빈 상자(인라인, 줄바꿈 없음)입니다. 반면 **시맨틱 태그**는 이름만 봐도 어떤 구역인지 드러납니다.

| 시맨틱 태그 | 역할 |
|---|---|
| `<header>` | 페이지/섹션 상단 (제목, 네비게이션) |
| `<nav>` | 내비게이션 메뉴 |
| `<main>` | 페이지의 핵심 콘텐츠 |
| `<section>` | 주제로 묶인 구역 |
| `<article>` | 독립적으로 완결된 글 하나 |
| `<aside>` | 본문 옆 보조 정보 (사이드바) |
| `<footer>` | 페이지/섹션 하단 |
| `<div>` | 뜻 없는 블록 상자 — 스타일링을 위한 그룹핑용 |
| `<span>` | 뜻 없는 인라인 상자 — 문장 중 일부만 감쌀 때 |

```html
<header>
  <h1>시맨틱 구조</h1>
  <nav>홈 ㅣ 소개 ㅣ 연락처</nav>
</header>
<main>
  <section>
    <article>첫 번째 글 내용</article>
    <article>두 번째 글 내용</article>
  </section>
</main>
<aside>곁다리 정보(사이드바)</aside>
<footer>2026 내 사이트</footer>
```
> 출처: `02_html/28_index.html` — 핵심: `header, nav, main, section, article, aside, footer`

```html
<div class="card"> <!-- div: 뜻 없는 구역 나누기용 상자 -->
  <img src="...">
  <h3>운동화</h3>
  <p><strong>99,999원</strong></p>
</div>
```
> 출처: `02_html/20_index.html`

```html
<p>글자 중 <span>여기만</span> 강조</p> <!-- span: 줄 안 바꾸는 인라인 상자 -->
```
> 출처: `02_html/21_index.html`

**언제 무엇을 쓸까?**
- 페이지의 큰 구역(머리말/메뉴/본문/사이드바/꼬리말)을 나눌 때 → 뜻이 맞는 **시맨틱 태그**
- 스타일링만을 위해 여러 요소를 감싸야 하는데 마땅한 의미가 없을 때 → `div`(블록) / `span`(인라인)

#### 8. 미디어 (iframe / video / audio)

| 태그 | 역할 |
|---|---|
| `<iframe>` | 페이지 안에 다른 페이지(유튜브, 지도 등) 삽입 |
| `<video>` | 동영상 재생 |
| `<audio>` | 소리 재생 |
| `<source>` | video/audio 안에서 실제 파일 경로 지정 |

```html
<iframe width="400" height="260"
  src="https://www.youtube.com/embed/RhZLTbsDzqo"
  title="개발자를 위한 딥하우스 음악"
  frameborder="0" allowfullscreen></iframe>
```
> 출처: `02_html/16_index.html`

#### 9. 기타 인터랙티브 태그

| 태그 | 역할 |
|---|---|
| `<details>` | 클릭하면 펼쳐지는 상자 |
| `<summary>` | `details`의 항상 보이는 제목 줄 |

```html
<details>
  <summary>마지막으로 읽은 책</summary>
  <img src="...">
</details>
```
> 출처: `02_html/34_index.html`

---

## CSS편

### CSS란?

CSS(Cascading Style Sheets)는 HTML로 만든 뼈대에 **디자인(색, 크기, 배치, 애니메이션 등)** 을 입히는 언어입니다. "어떤 요소를(선택자) 어떻게 꾸밀지(속성: 값)"를 규칙으로 작성합니다.

### 카테고리별 핵심 개념

#### 1. 선택자 (Selector)

| 선택자 | 의미 | 예 |
|---|---|---|
| 타입 선택자 | 태그 이름으로 선택 | `h1 { }` |
| 클래스 선택자 | `class="..."` 로 선택 | `.special { }` |
| ID 선택자 | `id="..."` 로 선택 (문서 내 유일) | `#li1 { }` |
| 자손 선택자 | A 안의 B | `li em { }` |
| `:hover` 등 pseudo-class | 특정 상태일 때 | `a:hover { }` |
| `::before`/`::after` | 요소 앞/뒤에 가상 콘텐츠 삽입 | `.info::after { }` |

```css
/* 우선순위(specificity): 타입 < 클래스 < 자손 조합 < 인라인 순으로 점점 구체적 */
h1 { color: red }
p { color: green }
.special { color: orange }
li em { color: purple }
```
> 출처: `03_css/01/styles/main.css`

#### 2. 박스모델 (Box Model)

| 속성 | 역할 |
|---|---|
| `border` | 테두리 (두께, 스타일, 색) |
| `margin` | 요소 바깥 여백 |
| `padding` | 요소 안쪽 여백(테두리와 내용 사이) |
| `box-sizing: border-box` | width/height에 border·padding까지 포함해서 계산 |
| `border-radius` | 모서리 둥글게 |
| `list-style: none` | 리스트 기본 불릿 제거 |

```css
ul {
  background-color: white;
  border: 6px double navy;
  height: 100px;
  list-style: none;
  margin: 20px;
  padding: 30px;
  width: 100px;
}
```
> 출처: `03_css/04/styles/main.css`

#### 3. Flexbox

| 속성 | 역할 |
|---|---|
| `display: flex` | 자식 요소들을 한 줄(가로/세로)로 배치 |
| `flex-direction` | 배치 방향 (`row`/`column`) |
| `align-items` | 세로축 정렬 |
| `justify-content` | 가로축 정렬 |
| `gap` | 요소 사이 간격 |
| `flex: 1` | 남는 공간을 균등하게 나눠 가짐 |

```css
.box {
  display: flex;
  flex-direction: row; /* 가로 배치: 왼 -> 오 */
  gap: 10px;
}
.card {
  flex: 1; /* 남는 가로 공간 균등 분할 → 카드 너비 동일 */
}
```
> 출처: `03_css/15/styles/main.css`

#### 4. Grid

| 속성 | 역할 |
|---|---|
| `display: grid` | 2차원 격자 레이아웃 켜기 |
| `grid-template-columns` | 열 개수/너비 지정 (`repeat(2, 1fr)` = 동일 너비 2열) |
| `gap` | 격자 칸 사이 간격 |

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
```
> 출처: `03_css/13/styles/main.css`

#### 5. Position (배치)

| 값 | 역할 |
|---|---|
| `relative` | 원래 자리를 기준으로 살짝 이동 (자기 자리는 그대로 차지) |
| `absolute` | 가장 가까운 `relative` 조상 기준으로 배치 |
| `fixed` | 화면(뷰포트) 기준 고정, 스크롤해도 안 움직임 |
| `sticky` | 스크롤하다 특정 지점에서 딱 붙음 |
| `z-index` | 겹칠 때 위/아래 순서 |

```css
.abs {
  position: absolute;
  bottom: 10px;
  right: 16px;
  z-index: 10;
}
.fixed {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
.sticky {
  position: sticky;
  top: 0;
}
```
> 출처: `03_css/12/styles/main.css`

#### 6. Transform / Transition / Animation

| 속성 | 역할 |
|---|---|
| `transform` | 이동(`translate`)/회전(`rotate`)/크기(`scale`) 변형 |
| `transition` | 속성 값이 바뀔 때 부드럽게 변화 |
| `@keyframes` + `animation` | 반복/자동 애니메이션 정의 |

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
.ball:hover {
  animation: float 1.5s ease-in-out infinite;
}
```
> 출처: `03_css/10/styles/main.css`

```css
.card {
  opacity: 0.85;
  transition: all 0.3s ease; /* 바뀔 때 0.3초 부드럽게 */
}
.card:hover {
  opacity: 1;
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgb(115, 138, 80);
}
```
> 출처: `03_css/16/styles/main.css`

#### 7. 시각 효과 (그림자 / 그라데이션 / 가상요소 꾸미기)

```css
.info { position: relative; }
.info::after {
  content: "도움말";
  display: none;
}
.info:hover::after {
  display: block;
  position: absolute;
  background: black;
  color: white;
  border-radius: 4px;
}
```
> 출처: `03_css/07/styles/main.css` — 순수 CSS만으로 만드는 툴팁(hover 시 말풍선)

```css
.quote::before { content: "'"; color: tomato; }
.quote::after  { content: "'"; color: tomato; }
```
> 출처: `03_css/17/styles/main.css` — `::before`/`::after`의 `content`로 텍스트 앞뒤에 장식 추가

#### 8. 반응형 (Media Query)

```css
/* 화면 폭이 600px 이하일 때만 아래 규칙 적용 (모바일) */
@media (max-width: 600px) {
  .box {
    flex-direction: column;
  }
}
```
> 출처: `03_css/15/styles/main.css`

#### 9. CSS 변수 (Custom Properties)

```css
:root {
  --main-color: red;
  --gap: 12px;
}
.row {
  display: flex;
  gap: var(--gap);
}
.btn {
  background: var(--main-color);
}
```
> 출처: `03_css/15/styles/main.css`

#### 10. CSS 적용 3가지 방법 & 우선순위

| 방법 | 작성 위치 | 우선순위 |
|---|---|---|
| 외부 스타일시트 | `<link rel="stylesheet" href="styles/main.css">` | 낮음 |
| 내부 스타일 | `<style>` 태그를 `<head>` 안에 | 중간 |
| 인라인 스타일 | 태그 안 `style="..."` 속성 | 가장 높음 |

```html
<!-- 외부 -->
<link rel="stylesheet" href="styles/main.css">
<!-- 내부 -->
<style>
  p { color: green }
</style>
...
<!-- 인라인 -->
<p style="color:red;">인라인으로 빨강</p>
```
> 출처: `03_css/06/index.html`

#### 11. CSS Reset

브라우저마다 다른 기본 여백/스타일을 없애고 동일한 출발선에서 시작하기 위한 초기화 패턴입니다.

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
> 출처: `03_css/18/styles/main.css`

---

### 참고

- `03_css`에는 [stylelint](https://stylelint.io/) 설정(`.stylelintrc.json`, `stylelint-config-standard` + 속성 알파벳순 정렬 규칙)이 함께 들어있어, CSS 코드 스타일을 점검하는 용도로 쓸 수 있습니다.
- 두 폴더 모두 뒤로 갈수록(예: `02_html/34_index.html`, `03_css/19`) 앞서 배운 태그/개념들을 한 번에 조합하는 "미니 프로젝트" 파일이 있으니, 전체 복습용으로 열어보기 좋습니다.
