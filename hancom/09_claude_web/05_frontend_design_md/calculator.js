'use strict';

const resultEl  = document.getElementById('result');
const historyEl = document.getElementById('history');

const state = {
  current:       '0',
  previous:      null,
  operator:      null,
  history:       '',
  justEvaluated: false,
};

function render() {
  resultEl.textContent  = state.current;
  historyEl.textContent = state.history;

  // 긴 숫자 폰트 축소
  const len = state.current.length;
  resultEl.style.fontSize = len > 13 ? '1.5rem' : len > 10 ? '2rem' : '';
}

function compute(a, b, op) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  switch (op) {
    case '÷': return y === 0 ? 'Error' : parseFloat(Number(x / y).toPrecision(12));
    case '×': return parseFloat(Number(x * y).toPrecision(12));
    case '−': return parseFloat(Number(x - y).toPrecision(12));
    case '+': return parseFloat(Number(x + y).toPrecision(12));
    default:  return y;
  }
}

function inputNumber(digit) {
  if (state.current === 'Error') return;
  if (state.justEvaluated) {
    state.current       = digit;
    state.history       = '';
    state.justEvaluated = false;
  } else {
    state.current = state.current === '0' ? digit : state.current + digit;
  }
  render();
}

function inputDecimal() {
  if (state.current === 'Error') return;
  if (state.justEvaluated) {
    state.current       = '0.';
    state.history       = '';
    state.justEvaluated = false;
  } else if (!state.current.includes('.')) {
    state.current += '.';
  }
  render();
}

function chooseOperator(op) {
  if (state.current === 'Error') return;
  if (state.previous !== null && !state.justEvaluated) {
    const result   = compute(state.previous, state.current, state.operator);
    state.current  = String(result);
    state.previous = String(result);
  } else {
    state.previous = state.current;
  }
  state.operator      = op;
  state.history       = `${state.previous} ${op}`;
  state.justEvaluated = false;
  render();
}

function equals() {
  if (state.operator === null || state.previous === null) return;
  const result    = compute(state.previous, state.current, state.operator);
  state.history   = `${state.previous} ${state.operator} ${state.current} =`;
  state.current   = String(result);
  state.previous  = null;
  state.operator  = null;
  state.justEvaluated = true;
  render();
}

function clear() {
  state.current       = '0';
  state.previous      = null;
  state.operator      = null;
  state.history       = '';
  state.justEvaluated = false;
  render();
}

function backspace() {
  if (state.justEvaluated || state.current === 'Error') return;
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0';
  render();
}

function negate() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  render();
}

function percent() {
  if (state.current === 'Error') return;
  const val     = parseFloat(state.current) / 100;
  state.current = String(parseFloat(Number(val).toPrecision(12)));
  render();
}

// 이벤트 위임
document.querySelector('.calc-keys').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, value } = btn.dataset;
  switch (action) {
    case 'number':   inputNumber(value); break;
    case 'decimal':  inputDecimal();     break;
    case 'operator': chooseOperator(value); break;
    case 'equals':   equals();           break;
    case 'clear':    clear();            break;
    case 'negate':   negate();           break;
    case 'percent':  percent();          break;
  }
});

// 키보드 지원
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') { inputNumber(e.key); return; }
  switch (e.key) {
    case '.':         inputDecimal();        break;
    case '+':         chooseOperator('+');  break;
    case '-':         chooseOperator('−');  break;
    case '*':         chooseOperator('×');  break;
    case '/':         e.preventDefault(); chooseOperator('÷'); break;
    case 'Enter':
    case '=':         equals();             break;
    case 'Escape':    clear();              break;
    case 'Backspace': backspace();          break;
    case '%':         percent();            break;
  }
});
