//依赖收集管理
export const DepManager = {
  nowEventFunc: null,
  nowTarget: null,
  store: {},

  collect(obId) {
    if (this.nowEventFunc) {
      this.addNowEventFunc(obId);
    }
  },

  addNowEventFunc(obId) {
    this.store[obId] = this.store[obId] || {};
    this.store[obId].target = this.nowTarget;
    this.store[obId].watchers = this.store[obId].watchers || [];
    this.store[obId].watchers.push(this.nowEventFunc);
  },

  trigger(obId) {
    const obj = this.store[obId];
    if (obj && obj.watchers) {
      obj.watchers.forEach((func) => {
        func.call(obj.target || this);
      });
    }
  },

  start(nowTarget, nowEventFunc) {
    this.nowTarget = nowTarget;
    this.nowEventFunc = nowEventFunc;
  },

  over() {
    this.nowTarget = null;
    this.nowEventFunc = null;
  }
};
