import ExecutionContext from './ExecutionContext';

// Take in a Brainfuck source code, check if there is any syntax error.
function linter(code) {
  let count = 0;

  for (const token of code) {
    if (token === '[') {
      count++;
    } else if (token === ']') {
      count--;
    }

    if (count < 0) {
      return false;
    }
  }

  return count === 0;
}

function parser(code) {
  const output = [];
  const jumpStack = [];
  const validToken = ["+", "-", "<", ">", ".", ",", "[", "]"];
  let previous = {};

  code.split('\n').forEach((line, i) => {
    line.split('').forEach((token, j) => {
      if (validToken.indexOf(token) === -1) {
        return;
      }

      const instruction = {
        token,
        line: i,
        column: j
      };

      previous.next = instruction;
      previous = instruction;

      if (token === '[') {
        jumpStack.push(instruction);
      } else if (token === ']') {
        const other = jumpStack.pop();
        other.counterpart = instruction;
        instruction.counterpart = other;
      }

      output.push(instruction);
    });
  });

  return output;
}

function execute(ast, stdinStr = "") {
  const context = new ExecutionContext();
  let stdout = "";
  const stdin = stdinStr.split('');
  let currentInstruction = ast[0];

  while (currentInstruction) {
    switch (currentInstruction.token) {
      case "+":
        context.increment();
        break;
      case "-":
        context.decrement();
        break;
      case ">":
        context.forward();
        break;
      case "<":
        context.backward();
        break;
      case "[":
        if (context.get() === 0) {
          currentInstruction = currentInstruction.counterpart;
        }
        break;
      case "]":
        if (context.get() !== 0) {
          currentInstruction = currentInstruction.counterpart;
        }
        break;
      case ".":
        stdout = stdout + String.fromCharCode(context.get());
      case ",":
        const char = stdin.shift();
        if (char !== undefined) {
          context.set(char.charCodeAt(0));
        }
    }

    currentInstruction = currentInstruction.next;
  }

  return stdout;
}
