class ExecutionContext {
  constructor(stdinStr) {
    this.table = {};
    this.pointer = 0;
  }

  forward() {
    this.pointer++;
  }

  backward() {
    this.pointer--;
  }

  increment() {
    this.set(this.get() + 1);
  }

  decrement() {
    this.set(this.get() - 1);
  }

  get() {
    return this.table[this.pointer] || 0;
  }

  set(val) {
    this.table[this.pointer] = val;
  }
}

export default ExecutionContext;
