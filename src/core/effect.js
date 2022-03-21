import { DepManager } from "./dep";

class Computed {
  constructor(target, name) {
    this.value = undefined;
    this.cb = target[name].bind(target);
    this.target = target;
    this.collectDependence();
  }

  collectDependence() {
    DepManager.start(this.target, this.updateValue.bind(this));
    this.updateValue();
    DepManager.over();
  }

  updateValue() {
    this.value = this.cb();
  }

  get() {
    return this.value;
  }
}

//计算属性
export function computed(target, name) {
  let computed = new Computed(target, name);

  return {
    enumerable: true,
    configurable: true,

    get: function () {
      return computed.get();
    },
  };
}

export function computedObj(target, obj) {
  Object.keys(obj).forEach((name) => {
    Object.defineProperty(target, name, computed(target, name));
  });
}

class Watch {
  constructor(target, key, cb) {
    this.cb = cb;
    this.target = target;
    this.key = key;
    this.collectDependence();
  }

  collectDependence() {
    DepManager.start(this.target, this.cb.bind(this.target));
    this.target[this.key];
    DepManager.over();
  }
}

// 监听
export function watch(target, obj) {
  Object.keys(obj).forEach((name) => {
    let watch = new Watch(target, name, obj[name]);
  });

  return descriptor;
}
