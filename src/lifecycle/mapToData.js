import { storeMap, notifyStackMap } from './index';
import { cloneObj } from './utils';

export const mapToData = function (storeName, dataFn) {
  return function (pageOpt) {
    const { onLoad, onUnload, attached, detached, lifetimes } = pageOpt;

    function mount(opt) {
      const targetPage = this;

      if (storeName) {
        const pageStore = storeMap[storeName];
        const dataFromStore = dataFn.call(targetPage, pageStore);
        const originData = cloneObj(dataFromStore, null, true);
        const originGetters = pageStore.__GETTERS__ || [];

        const notifyStack = notifyStackMap[storeName];

        notifyStack.push([targetPage, dataFn, originData, originGetters]);

        this.setData(Object.assign({}, this.data, dataFromStore));
      } else {
        console.warn('no storeName');
      }

      onLoad && onLoad.call(this, opt);
      attached && attached.call(this, opt);
      lifetimes && lifetimes.attached && lifetimes.attached.call(this, opt);
    }

    function unmount() {
      if (storeName) {
        const notifyStack = notifyStackMap[storeName];
        notifyStack.pop();
      }

      onUnload && onUnload.call(this);
      detached && detached.call(this);
      lifetimes && lifetimes.detached && lifetimes.detached.call(this);
    }

    pageOpt.onLoad = pageOpt.attached = mount;
    pageOpt.onUnload = pageOpt.detached = unmount;
    if (lifetimes) {
      lifetimes.attached = mount;
      lifetimes.detached = unmount;
    }

    return pageOpt;
  };
};
