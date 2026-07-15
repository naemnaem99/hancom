const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");

let current = "0";      // 현재 입력 중인 숫자
let previous = null;    // 이전 피연산자
let operator = null;    // 선택된 연산자
let justEvaluated = false; // 방금 '=' 를 눌렀는지

const OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function updateDisplay() {
  resultEl.textContent = current;
  if (previous !== null && operator) {
    historyEl.textContent = `${formatNumber(previous)} ${OP_SYMBOL[operator]}`;
  } else {
    historyEl.textContent = "";
  }
}

function formatNumber(numStr) {
  const n = Number(numStr);
  if (!isFinite(n)) return numStr;
  // 소수점 이하가 길어지는 것을 방지하되 불필요한 반올림은 최소화
  return String(Number(n.toFixed(10)));
}

function inputNumber(value) {
  if (justEvaluated) {
    current = value;
    justEvaluated = false;
  } else if (current === "0") {
    current = value;
  } else {
    current += value;
  }
  updateDisplay();
}

function inputDecimal() {
  if (justEvaluated) {
    current = "0.";
    justEvaluated = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  updateDisplay();
}

function chooseOperator(nextOp) {
  if (operator && previous !== null && !justEvaluated) {
    // 연속 연산: 먼저 계산
    current = String(compute(previous, current, operator));
  }
  previous = current;
  operator = nextOp;
  justEvaluated = false;
  current = "0";
  // 다음 숫자를 기다리는 동안 이전 값을 크게 보여준다
  resultEl.textContent = formatNumber(previous);
  historyEl.textContent = `${formatNumber(previous)} ${OP_SYMBOL[nextOp]}`;
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

function equals() {
  if (operator === null || previous === null) return;
  const result = compute(previous, current, operator);
  historyEl.textContent =
    `${formatNumber(previous)} ${OP_SYMBOL[operator]} ${formatNumber(current)} =`;
  current = String(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  resultEl.textContent = current;
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
  updateDisplay();
}

function toggleSign() {
  if (current === "0" || current === "Error") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
  updateDisplay();
}

function percent() {
  current = String(Number(current) / 100);
  updateDisplay();
}

// 버튼 클릭 처리
document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;

  const { action, value, op } = btn.dataset;
  if (current === "Error" && action !== "clear") clearAll();

  switch (action) {
    case "number":   inputNumber(value); break;
    case "decimal":  inputDecimal(); break;
    case "operator": chooseOperator(op); break;
    case "equals":   equals(); break;
    case "clear":    clearAll(); break;
    case "sign":     toggleSign(); break;
    case "percent":  percent(); break;
  }
});

// 키보드 지원
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key >= "0" && key <= "9") inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
  else if (key === "Enter" || key === "=") { e.preventDefault(); equals(); }
  else if (key === "Escape") clearAll();
  else if (key === "%") percent();
  else if (key === "Backspace") {
    if (!justEvaluated && current.length > 1) current = current.slice(0, -1);
    else current = "0";
    updateDisplay();
  }
});

updateDisplay();
