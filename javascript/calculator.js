const inputBox = document.getElementById('input_box');
const buttons = document.querySelectorAll('.num_btn');

let expression = '';

const updateDisplay = (value) => {
  inputBox.value = value;
};

const calculateResult = () => {
  if (!expression.trim()) return;

  try {
    const result = Function(`"use strict"; return (${expression})`)();

    if (typeof result === 'number' && Number.isFinite(result)) {
      expression = String(result);
      updateDisplay(expression);
    }
  } catch {
    updateDisplay('Error');
    expression = '';
  }
};

const toggleSign = () => {
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

    expression += value;
    updateDisplay(expression);
  });
});
