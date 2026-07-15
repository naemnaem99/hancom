import { useState, useEffect, useCallback } from 'react'
import '../styles/Calculator.css'

// 부동소수점 오차 정리 (예: 0.1 + 0.2 → 0.3)
function clean(num) {
  if (!isFinite(num)) return 'Error'
  return String(Math.round(num * 1e10) / 1e10)
}

function calculate(a, b, op) {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
    case '÷':
      return b === 0 ? NaN : a / b
    default:
      return b
  }
}

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previous, setPrevious] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const isError = display === 'Error'

  const inputDigit = useCallback(
    (digit) => {
      setDisplay((prev) => {
        if (waitingForOperand || prev === 'Error') {
          setWaitingForOperand(false)
          return digit
        }
        if (prev === '0') return digit
        if (prev.replace('-', '').length >= 12) return prev // 자릿수 제한
        return prev + digit
      })
      setWaitingForOperand(false)
    },
    [waitingForOperand]
  )

  const inputDot = useCallback(() => {
    setDisplay((prev) => {
      if (waitingForOperand || prev === 'Error') {
        setWaitingForOperand(false)
        return '0.'
      }
      if (prev.includes('.')) return prev
      return prev + '.'
    })
    setWaitingForOperand(false)
  }, [waitingForOperand])

  const clear = useCallback(() => {
    setDisplay('0')
    setPrevious(null)
    setOperator(null)
    setWaitingForOperand(false)
  }, [])

  const backspace = useCallback(() => {
    if (waitingForOperand) return
    setDisplay((prev) => {
      if (prev === 'Error') return '0'
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) return '0'
      return prev.slice(0, -1)
    })
  }, [waitingForOperand])

  const toggleSign = useCallback(() => {
    setDisplay((prev) => {
      if (prev === '0' || prev === 'Error') return prev
      return prev.startsWith('-') ? prev.slice(1) : '-' + prev
    })
  }, [])

  const inputPercent = useCallback(() => {
    setDisplay((prev) => {
      if (prev === 'Error') return prev
      return clean(parseFloat(prev) / 100)
    })
  }, [])

  const performOperation = useCallback(
    (nextOp) => {
      const current = parseFloat(display)
      if (previous === null) {
        setPrevious(current)
      } else if (operator && !waitingForOperand) {
        const result = calculate(previous, current, operator)
        const cleaned = clean(result)
        setDisplay(cleaned)
        setPrevious(cleaned === 'Error' ? null : parseFloat(cleaned))
      }
      setOperator(nextOp)
      setWaitingForOperand(true)
    },
    [display, previous, operator, waitingForOperand]
  )

  const handleEquals = useCallback(() => {
    if (operator === null || previous === null) return
    const current = parseFloat(display)
    const result = calculate(previous, current, operator)
    setDisplay(clean(result))
    setPrevious(null)
    setOperator(null)
    setWaitingForOperand(true)
  }, [display, previous, operator])

  // 키보드 입력 지원
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e
      if (key >= '0' && key <= '9') inputDigit(key)
      else if (key === '.') inputDot()
      else if (key === '+') performOperation('+')
      else if (key === '-') performOperation('-')
      else if (key === '*') performOperation('×')
      else if (key === '/') {
        e.preventDefault()
        performOperation('÷')
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handleEquals()
      } else if (key === 'Backspace') backspace()
      else if (key === 'Escape' || key === 'c' || key === 'C') clear()
      else if (key === '%') inputPercent()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDot, performOperation, handleEquals, backspace, clear, inputPercent])

  // 버튼 정의 (grid 순서대로)
  const buttons = [
    { label: 'C', type: 'func', onClick: clear },
    { label: '←', type: 'func', onClick: backspace },
    { label: '%', type: 'func', onClick: inputPercent },
    { label: '÷', type: 'op', onClick: () => performOperation('÷') },
    { label: '7', type: 'num', onClick: () => inputDigit('7') },
    { label: '8', type: 'num', onClick: () => inputDigit('8') },
    { label: '9', type: 'num', onClick: () => inputDigit('9') },
    { label: '×', type: 'op', onClick: () => performOperation('×') },
    { label: '4', type: 'num', onClick: () => inputDigit('4') },
    { label: '5', type: 'num', onClick: () => inputDigit('5') },
    { label: '6', type: 'num', onClick: () => inputDigit('6') },
    { label: '−', type: 'op', onClick: () => performOperation('-') },
    { label: '1', type: 'num', onClick: () => inputDigit('1') },
    { label: '2', type: 'num', onClick: () => inputDigit('2') },
    { label: '3', type: 'num', onClick: () => inputDigit('3') },
    { label: '+', type: 'op', onClick: () => performOperation('+') },
    { label: '±', type: 'func', onClick: toggleSign },
    { label: '0', type: 'num', onClick: () => inputDigit('0') },
    { label: '.', type: 'num', onClick: inputDot },
    { label: '=', type: 'equals', onClick: handleEquals },
  ]

  return (
    <div className="calculator">
      <div className={`display ${isError ? 'display--error' : ''}`}>
        {display}
      </div>
      <div className="keypad">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className={`key key--${btn.type}`}
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calculator
