# 폴더 생성 자동화

번호만 말하면 해당 폴더 구조를 자동 생성.

**공통 규칙**
- 번호 형식: 2자리 zero-padding (5 → `05`, 12 → `12`)
- stylelint 설정 파일 복사 안 함 (루트 `.stylelintrc.json` 자동 적용)

---

## CSS (`hancom/03_css/`)

```
N/
├── index.html
└── styles/
    └── main.css
```

- `index.html`: `lang="ko"`, `<title></title>` 빈 값, `styles/main.css` 링크 포함
- `styles/main.css`: 빈 파일

**사용 예시**
> "12번 만들어줘" → `hancom/03_css/12/index.html`, `hancom/03_css/12/styles/main.css` 생성

---

## JS (`hancom/04_js/`)

```
N/
├── index.html
├── styles/
│   └── main.css
└── scripts/
    └── main.js
```

- `index.html`: `lang="ko"`, `<title></title>` 빈 값, `styles/main.css` 링크 + `scripts/main.js` 스크립트 포함
- `styles/main.css`, `scripts/main.js`: 빈 파일

**사용 예시**
> "08번 만들어줘" → `hancom/04_js/08/index.html`, `hancom/04_js/08/styles/main.css`, `hancom/04_js/08/scripts/main.js` 생성
