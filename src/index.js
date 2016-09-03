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

function executeSingleInstruction(context, instruction, stdin) {
  let stdout = "";

  switch (instruction.token) {
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
        instruction = instruction.counterpart;
      }
      break;
    case "]":
      if (context.get() !== 0) {
        instruction = instruction.counterpart;
      }
      break;
    case ".":
      stdout = String.fromCharCode(context.get());
      break;
    case ",":
      const char = stdin.shift();
      if (char !== undefined) {
        context.set(char.charCodeAt(0));
      }
  }

  instruction = instruction.next;

  return {
    stdin,
    stdout,
    context,
    instruction
  };
}

function execute(ast, stdinStr = "") {
  const context = new ExecutionContext();
  let stdout = "";
  let stdin = stdinStr.split('');
  let instruction = ast[0];

  while (instruction) {
    const results = executeSingleInstruction(context, instruction, stdin);
    stdout += results.stdout;
    stdin = results.stdin;
    instruction = results.instruction;
  }

  return {
    context,
    stdout
  };
}

export { linter, parser, execute };
