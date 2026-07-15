const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");

// 계산기의 모든 상태를 하나의 객체로 관리한다.
const state = {
  current: "0",       // 현재 입력 중인 숫자
  previous: null,     // 이전 피연산자
  operator: null,     // 선택된 연산자
  justEvaluated: false, // 방금 '=' 를 눌렀는지
};

const OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// 부동소수점 잔여 오차를 정리하고 표시용 문자열로 만든다.
function formatNumber(numStr) {
  const n = Number(numStr);
  if (!isFinite(n)) return String(numStr);
  return String(Number(n.toFixed(10)));
}

// 상태 변경 후 항상 이 함수 하나로만 화면을 갱신한다.
function render() {
  resultEl.textContent =
    state.current === "Error" ? "Error" : formatNumber(state.current);

  if (state.previous !== null && state.operator) {
    historyEl.textContent =
      `${formatNumber(state.previous)} ${OP_SYMBOL[state.operator]}`;
  } else {
    historyEl.textContent = "";
  }
}

function compute(a, b, op) {
  const x = Number(a);
  const y = Number(b);
  let out;
  switch (op) {
    case "+": out = x + y; break;
    case "-": out = x - y; break;
    case "*": out = x * y; break;
    case "/":
      if (y === 0) return "Error";
      out = x / y;
      break;
    default: return b;
  }
  return Number(out.toFixed(10));
}

// --- 액션 함수들: state 만 수정하고 render() 호출 ---

function inputNumber(value) {
  if (state.justEvaluated) {
    state.current = value;
    state.justEvaluated = false;
  } else if (state.current === "0") {
    state.current = value;
  } else {
    state.current += value;
  }
  render();
}

function inputDecimal() {
  if (state.justEvaluated) {
    state.current = "0.";
    state.justEvaluated = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }
  render();
}

function chooseOperator(nextOp) {
  if (state.operator && state.previous !== null && !state.justEvaluated) {
    // 연속 연산: 먼저 이전 연산을 계산한다.
    state.current = String(compute(state.previous, state.current, state.operator));
  }
  state.previous = state.current;
  state.operator = nextOp;
  state.justEvaluated = false;
  state.current = "0";
  render();
  // 다음 숫자를 기다리는 동안 이전 값을 크게 보여준다.
  resultEl.textContent = formatNumber(state.previous);
}

function equals() {
  if (state.operator === null || state.previous === null) return;
  const result = compute(state.previous, state.current, state.operator);
  const line =
    `${formatNumber(state.previous)} ${OP_SYMBOL[state.operator]} ${formatNumber(state.current)} =`;
  state.current = String(result);
  state.previous = null;
  state.operator = null;
  state.justEvaluated = true;
  render();
  historyEl.textContent = line;
}

function clearAll() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.justEvaluated = false;
  render();
}

function toggleSign() {
  if (state.current === "0" || state.current === "Error") return;
  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : "-" + state.current;
  render();
}

function percent() {
  if (state.current === "Error") return;
  state.current = String(Number(state.current) / 100);
  render();
}

function backspace() {
  if (state.justEvaluated || state.current === "Error") {
    clearAll();
    return;
  }
  state.current =
    state.current.length > 1 ? state.current.slice(0, -1) : "0";
  render();
}

// --- 입력 라우팅 ---

const actions = {
  number: (btn) => inputNumber(btn.dataset.value),
  decimal: inputDecimal,
  operator: (btn) => chooseOperator(btn.dataset.op),
  equals,
  clear: clearAll,
  sign: toggleSign,
  percent,
  backspace,
};

// 버튼 클릭: .keys 에 이벤트 위임
document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;

  const action = btn.dataset.action;
  // Error 상태에서 초기화/백스페이스 외 입력이 들어오면 먼저 리셋
  if (state.current === "Error" && action !== "clear" && action !== "backspace") {
    clearAll();
  }
  actions[action]?.(btn);
});

// 키보드 지원
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (state.current === "Error" && key !== "Escape" && key !== "Backspace") {
    clearAll();
  }

  if (key >= "0" && key <= "9") inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
  else if (key === "Enter" || key === "=") { e.preventDefault(); equals(); }
  else if (key === "Escape") clearAll();
  else if (key === "%") percent();
  else if (key === "Backspace") backspace();
});

render();
