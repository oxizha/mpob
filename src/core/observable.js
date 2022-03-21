import { DepManager } from "./dep";

let counter = 0;
//  依赖监听
class Observable {
  constructor(value) {
    this.obId = "observable-" + ++counter;
    this.value = value;
  }
  get() {
    DepManager.collect(this.obId);
    return this.value;
  }
  set(value) {
    this.value = value;
    DepManager.trigger(this.obId);
  }
}

// 属性劫持
export function observable(target, name, options = {}) {
  const { recursive = true, notifyUpdate } = options;

  let obj = target[name];
  //递归劫持
  if (recursive && typeof obj === "object") {
    observableObj(obj, options);
  }
  let obObj = new Observable(obj);

  return {
    enumerable: true,
    configurable: true,

    get() {
      return obObj.get();
    },

    set(value) {
      // 重新递归劫持
      if (recursive && typeof value === "object") {
        observableObj(value, options);
      }
      obObj.set(value);

      notifyUpdate && notifyUpdate(name);
    },
  };
}

//对象递归劫持
export function observableObj(obj, options) {
  Object.keys(obj).forEach((item) => {
    Object.defineProperty(obj, item, observable(obj, item, options));
  });
}
