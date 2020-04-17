class ToolStates {
  constructor() {
    this.states = {};
  }

  set(tool, data) {
    this.states[tool] = data;
  }

  get(tool) {
    return this.states[tool] || {};
  }

}

export default new ToolStates();
