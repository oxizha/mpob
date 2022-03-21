import { isEqualObj, cloneObj } from './utils';

const hasOwnProp = (obj, key) => {
  if (obj.hasOwnProperty(key)) {
    return true;
  }
};

export const storeMap = {};
export const notifyStackMap = {};

const timeout = 5;
let batch = 0;
const batchKeysF = [];

export function notifyUpdate(storeNameF, keyName) {
  batch++;
  batchKeysF.push(keyName);

  setTimeout(
    (storeName, batchKeys) => {
      if (--batch === 0) {
        const notifyStack = notifyStackMap[storeName];
        const len = notifyStack.length;

        //
        for (let i = len - 1; i >= 0; i--) {
          const [targetPage, dataFn, oldData, getters] = notifyStack[i];
          let newData = dataFn(storeMap[storeName]);

          // 先更新 getters
          if (getters.length) {
            let patchData = {};
            getters.forEach((item) => {
              if (newData[item]) {
                patchData[item] = newData[item];
              }
            });
            try {
              targetPage.setData(patchData);
            } catch (error) {
              console.log(error);
            }
          }

          // 单一更新key
          if (batchKeys.length) {
            let patchData = {};

            batchKeys.forEach((item) => {
              // 目标模块和 更新模块都有 patch更新
              if (hasOwnProp(oldData, item) && hasOwnProp(newData, item)) {
                patchData[item] = newData[item];
              }
            });
            try {
              targetPage.setData(patchData);
            } catch (error) {
              console.log(error);
            }
          } else {
            // if (!isEqualObj(oldData, newData)) {
            // notifyStack[i][2] = cloneObj(newData);
            try {
              console.log(Object.keys(newData).join(','));
              targetPage.setData(newData);
            } catch (error) {
              console.log(error);
            }
            // }
          }
        }
        // 清空batch key
        batchKeysF.length = 0;
      }
    },
    timeout,
    storeNameF,
    batchKeysF
  );
}
