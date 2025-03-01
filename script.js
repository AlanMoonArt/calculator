const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");

let expression = "";
let result = "";

document.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();
  }
});

inputBox.addEventListener("click", buttonClick);

function buttonClick(event) {
  const target = event.target;
  const action = target.dataset.action;
  const value = target.dataset.value;

  handlePress(event);
  playRandomClickSound();
  target.blur();

  switch (action) {
    case "number":
      addValue(value);
      break;

    case "clear":
      clear();
      break;

    case "backspace":
      backspace();
      break;

    case "addition":
    case "subtraction":
    case "multiplication":
    case "division":
      if (expression === "" && result !== "") {
        startFromResult(value);
      } else if (expression !== "" && !isLastCharOperator()) {
        addValue(value);
      }
      break;

    case "submit":
      submit(value);
      break;

    case "negate":
      negate();
      break;

    case "mod":
      percentage();
      break;

    case "decimal":
      decimal(value);
      break;
  }
  updateDisplay(expression, result);
}

function handlePress(event) {
  let target = event.target;

  if (!target.classList.contains("pressed")) {
    target.classList.add("pressed");

    setTimeout(() => {
      target.classList.remove("pressed");
    }, 100);
  }
}

function addValue(value) {
  if (value === ".") {
    const lastOperatorIndex = expression.search(/[+\-×÷]/);
    const lastDecimalIndex = expression.lastIndexOf(".");
    const lastNumberIndex = Math.max(
      expression.lastIndexOf("+"),
      expression.lastIndexOf("÷"),
      expression.lastIndexOf("×"),
      expression.lastIndexOf("-")
    );

    if (
      (lastDecimalIndex < lastOperatorIndex ||
        lastDecimalIndex < lastNumberIndex ||
        lastDecimalIndex === -1) &&
      (expression === "" ||
        expression.slice(lastNumberIndex + 1).indexOf("-") === -1)
    ) {
      expression += value;
    }
  } else if (expression.length <= 13) {
    expression += value;
  }
}

function clear() {
  expression = "";
  result = "";
}

function backspace() {
  expression = expression.slice(0, -1);
}

function updateDisplay(expression, result) {
  expressionDiv.textContent = expression;
  resultDiv.textContent = result;
}

function isLastCharOperator() {
  return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
  expression += result + value;
}

function submit() {
  convertSymbol();
  result = evaluateExpression();
  expression = "";
}

function decimal(value) {
  if (!expression.endsWith(".") && !isNaN(expression.slice(-1))) {
    addValue(value);
  }
}

function convertSymbol() {
  expression = expression.replace(/×/g, "*").replace(/÷/g, "/");
}

function evaluateExpression() {
  const evalResult = eval(expression);
  return isNaN(evalResult) || !isFinite(evalResult)
    ? " "
    : evalResult < 1
    ? parseFloat(evalResult.toFixed(10))
    : parseFloat(evalResult.toFixed(10));
}

function negate() {
  if (expression === "" && result !== "") {
    result = -result;
  } else if (!expression.startsWith("-") && expression !== "") {
    expression = "-" + expression;
  } else if (expression.startsWith("-")) {
    expression = expression.slice(1);
  }
}

function percentage() {
  if (expression !== "") {
    result = evaluateExpression();
    expression = "";

    if (!isNaN(result) && isFinite(result)) {
      result /= 100;
    } else {
      result = "";
    }
  } else if (result !== "") {
    result = parseFloat(result) / 100;
  }
}

function playRandomClickSound() {
  const sounds = [
    "./sounds/click1.mp3",
    "./sounds/click2.mp3",
    "./sounds/click3.mp3",
  ];
  const randomIndex = Math.floor(Math.random() * sounds.length);
  const audio = new Audio(sounds[randomIndex]);
  audio.volume = 0.6;
  audio.play();
}

document.addEventListener("keyup", handleKeyboardInput);

function handleKeyboardInput(event) {
  const key = event.key;

  playRandomClickSound();

  switch (true) {
    case !isNaN(key):
      addValue(key);
      break;

    case ["+", "-", "*", "/"].includes(key):
      if (expression !== "" && !isLastCharOperator()) {
        addValue(key);
      }
      break;

    case key === "Enter":
      submit();
      break;

    case key === "Backspace":
      backspace();
      break;

    case key === "Escape":
      clear();
      break;

    case key === "." || key === ",":
      decimal(".");
      break;
  }
  updateDisplay(expression, result);
}
