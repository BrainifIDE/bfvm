"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExecutionContext = function () {
  function ExecutionContext(stdinStr) {
    _classCallCheck(this, ExecutionContext);

    this.table = {};
    this.pointer = 0;
  }

  _createClass(ExecutionContext, [{
    key: "forward",
    value: function forward() {
      this.pointer++;
    }
  }, {
    key: "backward",
    value: function backward() {
      this.pointer--;
    }
  }, {
    key: "increment",
    value: function increment() {
      this.set(this.get() + 1);
    }
  }, {
    key: "decrement",
    value: function decrement() {
      this.set(this.get() - 1);
    }
  }, {
    key: "get",
    value: function get() {
      return this.table[this.pointer] || 0;
    }
  }, {
    key: "set",
    value: function set(val) {
      this.table[this.pointer] = val;
    }
  }]);

  return ExecutionContext;
}();

exports.default = ExecutionContext;