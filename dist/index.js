'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = exports.parser = exports.linter = undefined;

var _ExecutionContext = require('./ExecutionContext');

var _ExecutionContext2 = _interopRequireDefault(_ExecutionContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Take in a Brainfuck source code, check if there is any syntax error.
function linter(code) {
  var count = 0;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = code[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var token = _step.value;

      if (token === '[') {
        count++;
      } else if (token === ']') {
        count--;
      }

      if (count < 0) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return count === 0;
}

function parser(code) {
  var output = [];
  var jumpStack = [];
  var validToken = ["+", "-", "<", ">", ".", ",", "[", "]"];
  var previous = {};

  code.split('\n').forEach(function (line, i) {
    line.split('').forEach(function (token, j) {
      if (validToken.indexOf(token) === -1) {
        return;
      }

      var instruction = {
        token: token,
        line: i,
        column: j
      };

      previous.next = instruction;
      previous = instruction;

      if (token === '[') {
        jumpStack.push(instruction);
      } else if (token === ']') {
        var other = jumpStack.pop();
        other.counterpart = instruction;
        instruction.counterpart = other;
      }

      output.push(instruction);
    });
  });

  return output;
}

function execute(ast) {
  var stdinStr = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

  var context = new _ExecutionContext2.default();
  var stdout = "";
  var stdin = stdinStr.split('');
  var currentInstruction = ast[0];

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
        var char = stdin.shift();
        if (char !== undefined) {
          context.set(char.charCodeAt(0));
        }
    }

    currentInstruction = currentInstruction.next;
  }

  return stdout;
}

exports.linter = linter;
exports.parser = parser;
exports.execute = execute;