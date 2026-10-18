const inputBox = document.getElementById('input_box');
const buttons = document.querySelectorAll('.num_btn');

let expression = '';
const operators = ['+', '-', '*', '/'];

const updateDisplay = (value) => {
  inputBox.value = value;
};

const calculateResult = () => {
  expression = inputBox.value.trim();
  if (!expression) return;

  const lastChar = expression[expression.length - 1];
  if (operators.includes(lastChar)) {
    expression = expression.slice(0, -1);
  }
  if (!expression) return;

  try {
    const result = Function(`"use strict"; return (${expression})`)();

    if (typeof result === 'number' && Number.isFinite(result)) {
      expression = String(result);
      updateDisplay(expression);
    } else {
      updateDisplay('Error');
      expression = '';
    }
  } catch {
    updateDisplay('Error');
    expression = '';
  }
};

const toggleSign = () => {
  expression = inputBox.value.trim();
  if (!expression.trim()) return;

  const parsed = Number(expression);
  if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
    expression = String(parsed * -1);
    updateDisplay(expression);
  }
};

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent.trim();
    expression = inputBox.value.trim();

    if (value === 'AC') {
      expression = '';
      updateDisplay('');
      return;
    }

    if (value === 'C') {
      expression = expression.slice(0, -1);
      updateDisplay(expression);
      return;
    }

    if (value === '=') {
      calculateResult();
      return;
    }

    if (value === '+/-') {
      toggleSign();
      return;
    }

    if (operators.includes(value)) {
      if (!expression) {
        if (value === '-') {
          expression = '-';
          updateDisplay(expression);
        }
        return;
      }

      const lastChar = expression[expression.length - 1];
      if (operators.includes(lastChar)) {
        expression = `${expression.slice(0, -1)}${value}`;
      } else {
        expression += value;
      }

      updateDisplay(expression);
      return;
    }

    expression += value;
    updateDisplay(expression);
  });
});
