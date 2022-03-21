import { observable, observableObj } from "./core/observable";
import { computed, computedObj, watch } from "./core/effect";

import { mapToData } from "./lifecycle/mapToData";
import { storeMap, notifyStackMap, notifyUpdate } from "./lifecycle/index";

export { observable, computed, watch };
export { mapToData };

// 设定store 类似pinia
export function defineStore(storeName, storeIns) {
  const { state, actions = {}, getters } = storeIns;

  if (storeMap[storeName]) {
    return storeMap[storeName];
  }

  storeMap[storeName] = state;
  notifyStackMap[storeName] = [];
  const wrapUpdate = (keyName) => {
    notifyUpdate(storeName, keyName);
  };

  // 绑定 state 监听
  observableObj(state, {
    recursive: false,
    notifyUpdate: wrapUpdate,
  });

  // 绑定getters
  if (getters) {
    Object.assign(state, getters);
    state.__GETTERS__ = Object.keys(getters);
    //
    computedObj(state, getters);
  }

  // 绑定方法
  if (actions) {
    Object.assign(state, actions);
  }

  // 默认actions设置方法
  state.setData = function (options) {
    if (options) {
      Object.assign(state, options);
    }
  };

  return state;
}
