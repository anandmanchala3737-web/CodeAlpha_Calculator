const inputBox = document.getElementById('input_box');
const buttons = document.querySelectorAll('.num_btn');

let expression = '';
const operators = ['+', '-', '*', '/'];

const updateDisplay = (value) => {
  inputBox.value = value;
};

const evaluateExpression = (rawExpression) => {
  const expr = rawExpression.replace(/\s+/g, '');
  if (!expr) throw new Error('Empty expression');

  const tokens = [];
  let index = 0;

  while (index < expr.length) {
    const char = expr[index];

    if (operators.includes(char)) {
      const prevToken = tokens[tokens.length - 1];
      const isUnaryMinus = char === '-' && (!prevToken || operators.includes(prevToken));

      if (isUnaryMinus) {
        let numberText = '-';
        index += 1;

        while (index < expr.length && /[0-9.]/.test(expr[index])) {
          numberText += expr[index];
          index += 1;
        }

        const numberValue = Number(numberText);
        if (numberText === '-' || Number.isNaN(numberValue)) {
          throw new Error('Invalid unary minus usage');
        }

        tokens.push(numberValue);
        continue;
      }

      tokens.push(char);
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numberText = '';

      while (index < expr.length && /[0-9.]/.test(expr[index])) {
        numberText += expr[index];
        index += 1;
      }

      const numberValue = Number(numberText);
      if (Number.isNaN(numberValue)) {
        throw new Error('Invalid number');
      }

      tokens.push(numberValue);
      continue;
    }

    throw new Error('Invalid character');
  }

  const precedencePass = [];
  let tokenIndex = 0;
  while (tokenIndex < tokens.length) {
    const token = tokens[tokenIndex];

    if (token === '*' || token === '/') {
      const left = precedencePass.pop();
      const right = tokens[tokenIndex + 1];

      if (typeof left !== 'number' || typeof right !== 'number') {
        throw new Error('Invalid operator placement');
      }

      if (token === '/' && right === 0) {
        throw new Error('Division by zero');
      }

      const result = token === '*' ? left * right : left / right;
      precedencePass.push(result);
      tokenIndex += 2;
      continue;
    }

    precedencePass.push(token);
    tokenIndex += 1;
  }

  let result = precedencePass[0];
  if (typeof result !== 'number') {
    throw new Error('Invalid expression');
  }

  for (let i = 1; i < precedencePass.length; i += 2) {
    const operator = precedencePass[i];
    const right = precedencePass[i + 1];

    if (typeof right !== 'number') {
      throw new Error('Invalid expression');
    }

    if (operator === '+') {
      result += right;
    } else if (operator === '-') {
      result -= right;
    } else {
      throw new Error('Invalid operator');
    }
  }

  if (!Number.isFinite(result)) {
    throw new Error('Invalid result');
  }

  return result;
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
    const result = evaluateExpression(expression);

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
