/* ============================================================
   CALC · SERIES 07 — 계산 엔진 + 입력 처리
   eval() 미사용. 토크나이저 + shunting-yard 로 우선순위 평가.
   ============================================================ */

(function () {
  "use strict";

  const OPS = ["+", "−", "×", "÷"];
  const PRECEDENCE = { "+": 1, "−": 1, "×": 2, "÷": 2 };

  // ---- 상태 -------------------------------------------------
  // tokens: 숫자는 편집 가능한 문자열("12", "-3", "0.5"), 연산자는 기호.
  let tokens = [];
  let justEvaluated = false; // = 직후 여부
  let errored = false;

  // ---- DOM --------------------------------------------------
  const exprEl = document.getElementById("expr");
  const resultEl = document.getElementById("result");
  const keypad = document.getElementById("keypad");
  const tapeList = document.getElementById("tape-list");
  const tapeEmpty = document.getElementById("tape-empty");
  const tapeClearBtn = document.getElementById("tape-clear");

  // ---- 헬퍼 -------------------------------------------------
  const isOp = (t) => OPS.includes(t);
  const lastToken = () => tokens[tokens.length - 1];

  function toNumber(str) {
    return parseFloat(str);
  }

  // 결과 표시용: 자릿수 그룹 + 부동소수 오차 정리
  function formatNumber(n) {
    if (!isFinite(n)) throw new Error("범위 초과");
    const cleaned = parseFloat(n.toPrecision(12));
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 10,
      useGrouping: true,
    }).format(cleaned);
  }

  // 편집 중 숫자 문자열을 그룹 표기로 (수식 라인용)
  function prettyToken(t) {
    if (isOp(t)) return ` ${t} `;
    const neg = t.startsWith("-");
    const body = neg ? t.slice(1) : t;
    const [intPart, decPart] = body.split(".");
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let out = decPart !== undefined ? `${grouped}.${decPart}` : grouped;
    if (t.endsWith(".")) out += "";
    return (neg ? "-" : "") + out;
  }

  // ---- 평가 (shunting-yard → RPN) ---------------------------
  function evaluate(tks) {
    if (tks.length === 0) return null;
    // 끝이 연산자면 무시
    const seq = isOp(tks[tks.length - 1]) ? tks.slice(0, -1) : tks.slice();
    if (seq.length === 0) return null;

    const output = [];
    const stack = [];
    for (const t of seq) {
      if (isOp(t)) {
        while (
          stack.length &&
          PRECEDENCE[stack[stack.length - 1]] >= PRECEDENCE[t]
        ) {
          output.push(stack.pop());
        }
        stack.push(t);
      } else {
        output.push(toNumber(t));
      }
    }
    while (stack.length) output.push(stack.pop());

    // RPN 계산
    const rpn = [];
    for (const t of output) {
      if (typeof t === "number") {
        rpn.push(t);
      } else {
        const b = rpn.pop();
        const a = rpn.pop();
        rpn.push(apply(a, b, t));
      }
    }
    return rpn[0];
  }

  function apply(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷":
        if (b === 0) throw new Error("0으로 나눔");
        return a / b;
      default: return b;
    }
  }

  // ---- 입력 동작 --------------------------------------------
  function inputDigit(d) {
    if (errored) reset();
    if (justEvaluated) {
      tokens = [];
      justEvaluated = false;
    }
    let last = lastToken();
    if (last === undefined || isOp(last)) {
      tokens.push(d === "0" ? "0" : d);
    } else {
      // 선행 0 처리
      if (last === "0") last = "";
      else if (last === "-0") last = "-";
      tokens[tokens.length - 1] = last + d;
    }
    render();
  }

  function inputDecimal() {
    if (errored) reset();
    if (justEvaluated) {
      tokens = [];
      justEvaluated = false;
    }
    const last = lastToken();
    if (last === undefined || isOp(last)) {
      tokens.push("0.");
    } else if (!last.includes(".")) {
      tokens[tokens.length - 1] = last + ".";
    }
    render();
  }

  function inputOperator(op) {
    if (errored) return;
    justEvaluated = false;
    const last = lastToken();
    if (last === undefined) {
      // 아무것도 없으면 0에서 시작
      tokens.push("0", op);
    } else if (isOp(last)) {
      tokens[tokens.length - 1] = op; // 연산자 교체
    } else {
      // 편집 중 숫자가 '.'로 끝나면 정리
      if (last.endsWith(".")) tokens[tokens.length - 1] = last.slice(0, -1);
      tokens.push(op);
    }
    render();
  }

  function negate() {
    if (errored) return;
    const idx = tokens.length - 1;
    const last = tokens[idx];
    if (last === undefined || isOp(last)) return;
    tokens[idx] = last.startsWith("-") ? last.slice(1) : "-" + last;
    justEvaluated = false;
    render();
  }

  function percent() {
    if (errored) return;
    const idx = tokens.length - 1;
    const last = tokens[idx];
    if (last === undefined || isOp(last)) return;
    const v = toNumber(last) / 100;
    tokens[idx] = String(v);
    justEvaluated = false;
    render();
  }

  function backspace() {
    if (errored) { reset(); return; }
    if (justEvaluated) { reset(); return; }
    const last = lastToken();
    if (last === undefined) return;
    if (isOp(last)) {
      tokens.pop();
    } else if (last.length <= 1 || (last.length === 2 && last.startsWith("-"))) {
      tokens.pop();
    } else {
      tokens[tokens.length - 1] = last.slice(0, -1);
    }
    render();
  }

  function equals() {
    if (errored || tokens.length === 0) return;
    let value;
    try {
      value = evaluate(tokens);
    } catch (err) {
      showError();
      return;
    }
    if (value === null) return;

    const exprText = tokens.map(prettyToken).join("");
    const resultText = formatNumber(value);

    exprEl.textContent = exprText + " =";
    resultEl.textContent = resultText;
    resultEl.classList.remove("is-error");

    addTapeEntry(exprText, resultText);

    // 결과를 첫 토큰으로 두어 이어 계산 가능
    tokens = [String(parseFloat(value.toPrecision(12)))];
    justEvaluated = true;
  }

  function reset() {
    tokens = [];
    justEvaluated = false;
    errored = false;
    render();
  }

  function showError() {
    errored = true;
    tokens = [];
    exprEl.innerHTML = "&nbsp;";
    resultEl.textContent = "Error";
    resultEl.classList.add("is-error");
  }

  // ---- 렌더링 -----------------------------------------------
  function render() {
    if (errored) return;
    const exprText = tokens.map(prettyToken).join("").trim();
    exprEl.innerHTML = exprText === "" ? "&nbsp;" : exprText;

    // 결과 라인: 편집 중이면 마지막 숫자, 없으면 0
    const last = lastToken();
    let shown;
    if (justEvaluated) {
      shown = formatNumber(toNumber(tokens[0]));
    } else if (last === undefined) {
      shown = "0";
    } else if (isOp(last)) {
      // 연산자 직후: 직전 숫자 유지
      const prevNum = [...tokens].reverse().find((t) => !isOp(t));
      shown = prevNum !== undefined ? formatNumber(toNumber(prevNum)) : "0";
    } else {
      // 편집 중 원문 표기(끝의 '.', 선행 0 유지) + 그룹핑
      shown = prettyToken(last);
    }
    resultEl.textContent = shown;
    resultEl.classList.remove("is-error");
    highlightActiveOp();
  }

  function highlightActiveOp() {
    keypad.querySelectorAll(".key--op").forEach((b) => b.classList.remove("is-active"));
    const last = lastToken();
    if (!justEvaluated && isOp(last)) {
      const btn = keypad.querySelector(`.key--op[data-op="${last}"]`);
      if (btn) btn.classList.add("is-active");
    }
  }

  // ---- 테이프 -----------------------------------------------
  function addTapeEntry(exprText, resultText) {
    tapeEmpty.style.display = "none";
    const li = document.createElement("li");
    li.className = "tape__item";
    const op = document.createElement("span");
    op.className = "op";
    op.textContent = exprText.replace(/\s*=$/, "");
    const val = document.createElement("span");
    val.className = "val";
    val.textContent = resultText;
    li.append(op, val);
    tapeList.appendChild(li);
    li.scrollIntoView({ block: "nearest" });
  }

  function clearTape() {
    tapeList.innerHTML = "";
    tapeEmpty.style.display = "";
  }

  // ---- 이벤트: 클릭 -----------------------------------------
  keypad.addEventListener("click", (e) => {
    const key = e.target.closest(".key");
    if (!key) return;
    dispatch(key);
  });

  function dispatch(key) {
    if (key.dataset.num !== undefined) inputDigit(key.dataset.num);
    else if (key.dataset.op !== undefined) inputOperator(key.dataset.op);
    else {
      switch (key.dataset.action) {
        case "decimal": inputDecimal(); break;
        case "negate": negate(); break;
        case "percent": percent(); break;
        case "clear": reset(); break;
        case "equals": equals(); break;
      }
    }
  }

  tapeClearBtn.addEventListener("click", clearTape);

  // ---- 이벤트: 키보드 ---------------------------------------
  const KEY_MAP = {
    "*": '.key--op[data-op="×"]',
    "/": '.key--op[data-op="÷"]',
    "-": '.key--op[data-op="−"]',
    "+": '.key--op[data-op="+"]',
    "=": '.key--equals',
    "Enter": '.key--equals',
    ".": '.key[data-action="decimal"]',
    "Backspace": null, // 아래에서 직접 처리
    "Escape": '.key[data-action="clear"]',
    "%": '.key[data-action="percent"]',
  };

  document.addEventListener("keydown", (e) => {
    const k = e.key;
    let btn = null;

    if (k >= "0" && k <= "9") {
      btn = keypad.querySelector(`.key[data-num="${k}"]`);
      inputDigit(k);
    } else if (k === "Backspace") {
      backspace();
    } else if (KEY_MAP.hasOwnProperty(k)) {
      if (k === "Enter" || k === "=") { e.preventDefault(); equals(); }
      else if (k === "Escape") reset();
      else if (k === ".") inputDecimal();
      else if (k === "%") percent();
      else if (k === "*") inputOperator("×");
      else if (k === "/") { e.preventDefault(); inputOperator("÷"); }
      else if (k === "-") inputOperator("−");
      else if (k === "+") inputOperator("+");
      btn = KEY_MAP[k] ? keypad.querySelector(KEY_MAP[k]) : null;
    } else {
      return;
    }
    if (btn) flashKey(btn);
  });

  function flashKey(btn) {
    btn.classList.add("is-pressed");
    setTimeout(() => btn.classList.remove("is-pressed"), 90);
  }

  // ---- 테마 토글 --------------------------------------------
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-toggle__icon");
  const root = document.documentElement;

  function syncThemeUI() {
    const dark = root.getAttribute("data-theme") === "dark";
    themeIcon.textContent = dark ? "●" : "○"; // ● 다크 / ○ 라이트
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute(
      "aria-label",
      dark ? "라이트 모드로 전환" : "다크 모드로 전환"
    );
  }

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("calc-theme", next); } catch (e) { /* 저장 불가 무시 */ }
    syncThemeUI();
  });

  syncThemeUI(); // head 스크립트가 정한 초기 테마에 아이콘 맞추기

  // ---- 초기화 -----------------------------------------------
  render();
})();
