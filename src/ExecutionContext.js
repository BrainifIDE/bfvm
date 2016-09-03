import Immutable from 'immutable';

const BaseExecutionContext = new Immutable.Record({
  table: new Immutable.Map(),
  pointer: 0
});

class ExecutionContext extends BaseExecutionContext {
  forward() {
    return this.set('pointer', this.pointer + 1);
  }

  backward() {
    return this.set('pointer', this.pointer - 1);
  }

  increment() {
    return this.setCurrentCell(this.getCurrentCell() + 1);
  }

  decrement() {
    return this.setCurrentCell(this.getCurrentCell() - 1);
  }

  getCurrentCell() {
    return this.table.get(this.pointer) || 0;
  }

  setCurrentCell(val) {
    return this.setIn(['table', this.pointer], val);
  }
}

export default ExecutionContext;
