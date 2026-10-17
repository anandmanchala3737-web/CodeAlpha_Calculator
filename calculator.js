
const inputBox = document.getElementById("input_box");
const buttons = document.querySelectorAll(".num_btn");

let expression = "";

const operators = ["+", "−", "×", "÷"];

// Update the calculator display
function updateDisplay(value) {
    inputBox.value = value;
}

// Clear everything
function clearAll() {
    expression = "";
    updateDisplay("");
}

// Delete the last character
function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay(expression);
}

// Change the sign of a number
function toggleSign() {
    if (!expression) return;

    const match = expression.match(/(\d*\.?\d+)$/);

    if (match) {
        const number = match[0];
        const start = match.index;

        if (start > 0 && expression[start - 1] === "-") {
            expression =
                expression.slice(0, start - 1) +
                number;
        } else {
            expression =
                expression.slice(0, start) +
                "-" + number;
        }

        updateDisplay(expression);
    }
}

// Calculate the result
function calculateResult() {
    if (!expression) return;

    let exp = expression;

    // Remove a trailing operator
    if (operators.includes(exp.slice(-1))) {
        exp = exp.slice(0, -1);
    }

    // Convert calculator symbols to JavaScript operators
    exp = exp
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

    // Allow only numbers, operators, decimals and parentheses
    if (!/^[0-9+\-*/().\s]+$/.test(exp)) {
        updateDisplay("Error");
        expression = "";
        return;
    }

    try {
        const result = Function(
            '"use strict"; return (' + exp + ')'
        )();

        if (
            typeof result === "number" &&
            Number.isFinite(result)
        ) {
            expression = String(
                Number(result.toPrecision(12))
            );
            updateDisplay(expression);
        } else {
            updateDisplay("Error");
            expression = "";
        }
    } catch {
        updateDisplay("Error");
        expression = "";
    }
}

// Handle button clicks
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim();

        if (value === "AC") {
            clearAll();
            return;
        }

        if (value === "C") {
            deleteLast();
            return;
        }

        if (value === "=") {
            calculateResult();
            return;
        }

        if (value === "±" || value === "+/-") {
            toggleSign();
            return;
        }

        if (operators.includes(value)) {
            if (!expression) {
                if (value === "−") {
                    expression = "−";
                    updateDisplay(expression);
                }
                return;
            }

            const lastChar = expression.slice(-1);

            if (operators.includes(lastChar)) {
                expression =
                    expression.slice(0, -1) + value;
            } else {
                expression += value;
            }

            updateDisplay(expression);
            return;
        }

        // Prevent multiple decimal points in one number
        if (value === ".") {
            const currentNumber = expression.split(/[+−×÷]/).pop();

            if (currentNumber.includes(".")) return;

            if (!currentNumber) {
                expression += "0";
            }
        }
        
        // Handle decimal point
        if (value === ".") {
            const currentNumber = expression
                .split(/[+−×÷]/)
                .pop();

            if (currentNumber.includes(".")) {
                return;
            }

            if (currentNumber === "") {
                expression += "0";
            }

            expression += ".";
            updateDisplay(expression);
            return;
        }

        expression += value;
        updateDisplay(expression);

        // expression += value;
        // updateDisplay(expression);
    });
});
