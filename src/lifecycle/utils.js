/**
 * Simple deep compare for data Object
 */
export const isEqualObj = function (obj1, obj2) {
  if (Object.prototype.toString.call(obj1) !== Object.prototype.toString.call(obj2)) return false;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  let result = true;
  Object.keys(obj1).forEach((key) => {
    switch (Object.prototype.toString.call(obj1[key])) {
      case '[object Object]':
        if (!isEqualObj(obj1[key], obj2[key])) result = false;
        break;
      case '[object Array]':
        if (!isEqualArray(obj1[key], obj2[key])) result = false;
        break;
      default:
        if (obj1[key] !== obj2[key]) result = false;
    }
  });
  return result;
};

export const isEqualArray = (array1, array2) => {
  if (Object.prototype.toString.call(array1) !== Object.prototype.toString.call(array2)) return false;
  if (array1.length !== array2.length) return false;

  let result = true;
  array1.forEach((item, index) => {
    if (item !== array2[index]) result = false;
  });
  return result;
};

/**
 * Simple deep copy for data Object
 */
export const cloneObj = function (obj, includedKeys, isShallow) {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (includedKeys && !includedKeys.includes(key)) return;
    switch (Object.prototype.toString.call(obj[key])) {
      case '[object Object]':
        newObj[key] = cloneObj(obj[key]);
        break;
      case '[object Array]': {
        if (isShallow) {
          newObj[key] = obj[key].map((item) => item);
        } else {
          newObj[key] = cloneArray(obj[key]);
        }

        break;
      }
      default:
        newObj[key] = obj[key];
    }
  });
  return newObj;
};

const cloneArray = (array) => {
  return array.map((item) => {
    switch (Object.prototype.toString.call(item)) {
      case '[object Object]':
        return cloneObj(item);
      case '[object Array]':
        return cloneArray(item);
      default:
        return item;
    }
  });
};
