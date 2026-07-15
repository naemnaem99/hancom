class Calculator {
  constructor() {
    this.display = document.querySelector('.display');
    this.historyList = document.querySelector('.history-list');
    this.buttons = document.querySelectorAll('.btn');

    this.current = '0';
    this.previous = '';
    this.operator = null;
    this.justEvaluated = false;
    this.history = this.loadHistory();

    this.attachEventListeners();
    this.renderHistory();
  }

  attachEventListeners() {
    this.buttons.forEach(button => {
      const number = button.dataset.number;
      const action = button.dataset.action;
      const operator = button.dataset.operator;

      if (number !== undefined) {
        button.addEventListener('click', () => this.handleNumber(number));
      } else if (action === 'operator' && operator) {
        button.addEventListener('click', () => this.handleOperator(operator));
      } else if (action === 'equals') {
        button.addEventListener('click', () => this.handleEquals());
      } else if (action === 'clear') {
        button.addEventListener('click', () => this.handleClear());
      } else if (action === 'toggle-sign') {
        button.addEventListener('click', () => this.handleToggleSign());
      } else if (action === 'percent') {
        button.addEventListener('click', () => this.handlePercent());
      }
    });

    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleNumber(num) {
    if (this.justEvaluated && num !== '.') {
      this.current = num;
      this.justEvaluated = false;
    } else {
      if (num === '.') {
        if (this.current.includes('.')) return;
        this.current += num;
      } else {
        if (this.current === '0') {
          this.current = num;
        } else {
          this.current += num;
        }
      }
    }
    this.updateDisplay();
  }

  handleOperator(op) {
    if (this.current === '') return;

    if (this.previous !== '' && this.operator) {
      this.evaluate();
    }

    this.previous = this.current;
    this.operator = op;
    this.current = '';
  }

  handleEquals() {
    if (this.operator === null || this.previous === '') return;
    this.evaluate();
  }

  evaluate() {
    let result;
    const prev = parseFloat(this.previous);
    const curr = parseFloat(this.current);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (this.operator) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '*':
        result = prev * curr;
        break;
      case '/':
        if (curr === 0) {
          this.current = 'Error';
          this.operator = null;
          this.previous = '';
          this.updateDisplay();
          return;
        }
        result = prev / curr;
        break;
      default:
        return;
    }

    const expression = `${this.previous} ${this.getOperatorSymbol()} ${this.current}`;
    this.addToHistory(expression, result);

    this.current = String(Math.round(result * 100000000) / 100000000);
    this.operator = null;
    this.previous = '';
    this.justEvaluated = true;
    this.updateDisplay();
  }

  handleClear() {
    this.current = '0';
    this.previous = '';
    this.operator = null;
    this.justEvaluated = false;
    this.updateDisplay();
  }

  handleToggleSign() {
    if (this.current === '0' || this.current === '') return;
    this.current = String(parseFloat(this.current) * -1);
    this.updateDisplay();
  }

  handlePercent() {
    if (this.current === '0' || this.current === '') return;
    this.current = String(parseFloat(this.current) / 100);
    this.updateDisplay();
  }

  handleKeyboard(e) {
    if (/^[0-9.]$/.test(e.key)) {
      this.handleNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      e.preventDefault();
      this.handleOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      this.handleEquals();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.handleClear();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      this.current = this.current.slice(0, -1) || '0';
      this.updateDisplay();
    }
  }

  updateDisplay() {
    this.display.textContent = this.current;
  }

  getOperatorSymbol() {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return symbols[this.operator] || this.operator;
  }

  addToHistory(expression, result) {
    this.history.unshift({ expression, result });
    if (this.history.length > 5) {
      this.history.pop();
    }
    this.saveHistory();
    this.renderHistory();
  }

  renderHistory() {
    this.historyList.innerHTML = '';
    this.history.forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <strong>${item.expression}</strong>
        <span>= ${item.result}</span>
      `;
      this.historyList.appendChild(div);
    });
  }

  saveHistory() {
    localStorage.setItem('calcHistory', JSON.stringify(this.history));
  }

  loadHistory() {
    const stored = localStorage.getItem('calcHistory');
    return stored ? JSON.parse(stored) : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
