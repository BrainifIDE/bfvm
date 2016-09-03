import ExecutionContext from './ExecutionContext';
import Immutable from 'immutable';

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
  let newContext = context;
  let newStdin = stdin;

  switch (instruction.token) {
    case "+":
      newContext = context.increment();
      break;
    case "-":
      newContext = context.decrement();
      break;
    case ">":
      newContext = context.forward();
      break;
    case "<":
      newContext = context.backward();
      break;
    case "[":
      if (context.getCurrentCell() === 0) {
        instruction = instruction.counterpart;
      }
      break;
    case "]":
      if (context.getCurrentCell() !== 0) {
        instruction = instruction.counterpart;
      }
      break;
    case ".":
      stdout = String.fromCharCode(context.getCurrentCell());
      break;
    case ",":
      const char = stdin.first();
      newStdin = stdin.pop();
      if (char !== undefined) {
        newContext = context.setCurrentCell(char.charCodeAt(0));
      }
  }

  instruction = instruction.next;

  return {
    stdin: newStdin,
    stdout,
    context: newContext,
    instruction
  };
}

function execute(ast, stdinStr = "") {
  let context = new ExecutionContext();
  let stdout = "";
  let stdin = new Immutable.Stack(stdinStr.split(''));
  let instruction = ast[0];

  while (instruction) {
    const results = executeSingleInstruction(context, instruction, stdin);
    stdout += results.stdout;
    stdin = results.stdin;
    instruction = results.instruction;
    context = results.context;
  }

  return {
    context,
    stdout
  };
}

// Example
// const stepper = executeStep(ast, stdinStr);
// stepper((context, stdout, instruction) => {
// }); // Execute 1 instruction
function executeStep(ast, stdinStr = "") {
  let context = new ExecutionContext();
  let stdout = "";
  let stdin = stdinStr.split('');
  let instruction = ast[0];

  return (cb) => {
    if (instruction) {
      const results = executeSingleInstruction(context, instruction, stdin);
      stdout += results.stdout;
      stdin = results.stdin;
      instruction = results.instruction;
      context = results.context;
    }

    cb(context, stdout, instruction);
  };
}

export { linter, parser, execute, executeStep, executeSingleInstruction, ExecutionContext };
