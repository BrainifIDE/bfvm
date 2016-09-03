'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseExecutionContext = new _immutable2.default.Record({
  table: new _immutable2.default.Map(),
  pointer: 0
});

var ExecutionContext = function (_BaseExecutionContext) {
  _inherits(ExecutionContext, _BaseExecutionContext);

  function ExecutionContext() {
    _classCallCheck(this, ExecutionContext);

    return _possibleConstructorReturn(this, (ExecutionContext.__proto__ || Object.getPrototypeOf(ExecutionContext)).apply(this, arguments));
  }

  _createClass(ExecutionContext, [{
    key: 'forward',
    value: function forward() {
      return this.set('pointer', this.pointer + 1);
    }
  }, {
    key: 'backward',
    value: function backward() {
      return this.set('pointer', this.pointer - 1);
    }
  }, {
    key: 'increment',
    value: function increment() {
      return this.setCurrentCell(this.getCurrentCell() + 1);
    }
  }, {
    key: 'decrement',
    value: function decrement() {
      return this.setCurrentCell(this.getCurrentCell() - 1);
    }
  }, {
    key: 'getCurrentCell',
    value: function getCurrentCell() {
      return this.table.get(this.pointer) || 0;
    }
  }, {
    key: 'setCurrentCell',
    value: function setCurrentCell(val) {
      return this.setIn(['table', this.pointer], val);
    }
  }]);

  return ExecutionContext;
}(BaseExecutionContext);

exports.default = ExecutionContext;