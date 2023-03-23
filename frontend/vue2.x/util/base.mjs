/**
 * @description 获取 ClassTag
 * @param {Any} val
 * @return {String}
 */
function itType (val) {
  return Object.prototype.toString
    .call(val)
    .replace(/^\[[^\s\]]+\s*([^\s\]]+)]$/, '$1')
}

/**
 * @description 是否为 Array
 * @param {Any} arr
 * @return {Boolean}
 */
function isArray (arr) {
  if (itType(arr) === 'Array') {
    return true
  }
  return false
}

/**
 * @description 是否为 Object
 * @param {Any} obj
 * @return {Boolean}
 */
function isObject (obj) {
  if (itType(obj) === 'Object') {
    return true
  }
  return false
}

/**
 * @description 是否为 String
 * @param {Any} str
 * @return {Boolean}
 */
function isString (str) {
  if (itType(str) === 'String') {
    return true
  }
  return false
}

/**
 * @description 是否为 Number
 * @param {Any} num
 * @return {Boolean}
 */
function isNumber (num) {
  if (itType(num) === 'Number') {
    return true
  }
  return false
}

/**
 * @description 是否为 RegExp
 * @param {Any} reg
 * @return {Boolean}
 */
function isRegExp (reg) {
  if (itType(reg) === 'RegExp') {
    return true
  }
  return false
}

/**
 * @description 是否为 Boolean
 * @param {Any} val
 * @return {Boolean}
 */
function isBoolean (val) {
  if (itType(val) === 'Boolean') {
    return true
  }
  return false
}

/**
 * @description 是否为 Function
 * @param {Any} num
 * @return {Boolean}
 */
function isFunction (num) {
  if (itType(num) === 'Function') {
    return true
  }
  return false
}

/**
 * @description 是否为 NotEmptyArray
 * @param {Any} arr
 * @return {Boolean}
 */
function isNotEmptyArray (arr) {
  if (isArray(arr)) {
    return arr.length > 0
  }
  return false
}

/**
 * @description 是否为 NotEmptyObject
 * @param {Any} obj
 * @return {Boolean}
 */
function isNotEmptyObject (obj) {
  if (isObject(obj)) {
    return Object.keys(obj).length > 0
  }
  return false
}

/**
 * @description 是否为 NotEmptyString
 * @param {Any} str
 * @return {Boolean}
 */
function isNotEmptyString (str) {
  if (isString(str)) {
    return !!str.trim()
  }
  return false
}

/**
 * @description 是否为 NotFiniteNumber
 * @param {Any} num
 * @return {Boolean}
 */
function isNotFiniteNumber (num) {
  if (isNumber(num)) {
    return !isFinite(num)
  }
  return false
}

/**
 * @description 是否为 finiteNumber
 * @param {Any} num
 * @return {Boolean}
 */
function isFiniteNumber (num) {
  if (isNumber(num)) {
    return isFinite(num)
  }
  return false
}

/**
 * @description 是否为 emptyString
 * @param {Any} str
 * @return {Boolean}
 */
function isEmptyString (str) {
  if (isString(str)) {
    return !str.trim()
  }
  return false
}

/**
 * @description 是否为 emptyObject
 * @param {Any} obj
 * @return {Boolean}
 */
function isEmptyObject (obj) {
  if (isObject(obj)) {
    return Object.keys(obj).length === 0
  }
  return false
}

/**
 * @description 是否为 emptyArray
 * @param {Any} arr
 * @return {Boolean}
 */
function isEmptyArray (arr) {
  if (isArray(arr)) {
    return arr.length === 0
  }
  return false
}

/**
 * @description 深度拷贝
 * @param {Array | Object} source
 * @param {Array <Array|Object>} reset
 * @return {Boolean}
 */
function toDeepClone (source, ...reset) {
  function keys (own) {
    if (isObject(own)) {
      return Object.keys(own)
    }
    if (isArray(own)) {
      return own.keys()
    }
    return []
  }
  function clone (i, o) {
    for (const key of keys(o)) {
      const iIsArray = isArray(i[key]);
      const oIsArray = isArray(o[key]);
      const iIsObject = isObject(i[key]);
      const oIsObject = isObject(o[key]);
      const ioIsArray = iIsArray && oIsArray;
      const ioIsObject = iIsObject && oIsObject;
      if (ioIsArray || ioIsObject) {
        clone(i[key], o[key]);
      } else if (oIsArray) {
        if (i[key] === undefined) {
          i[key] = [];
          clone(i[key], o[key]);
        }
      } else if (oIsObject) {
        if (i[key] === undefined) {
          i[key] = {};
          clone(i[key], o[key]);
        }
      } else {
        i[key] = o[key];
      }
    }
  }
  let inData;
  let inArgs;
  if (!isObject(source) && !isArray(source)) {
    return source
  } else if (isObject(source)) {
    inData = {};
    inArgs = [source, ...reset];
  } else if (isArray(source)) {
    inData = [];
    inArgs = [source, ...reset];
  }
  for (const onData of inArgs) {
    const iIsArray = isArray(inData);
    const oIsArray = isArray(onData);
    const iIsObject = isObject(inData);
    const oIsObject = isObject(onData);
    const ioIsArray = iIsArray && oIsArray;
    const ioIsObject = iIsObject && oIsObject;
    if (ioIsArray) {
      clone(inData, onData);
    }
    if (ioIsObject) {
      clone(inData, onData);
    }
  }
  return inData
}

/**
 * @description 默认导出
 */
var Util = {
  itType,
  isArray,
  isObject,
  isString,
  isNumber,
  isRegExp,
  isBoolean,
  isFunction,
  isEmptyArray,
  isEmptyObject,
  isEmptyString,
  isNotEmptyArray,
  isNotEmptyObject,
  isNotEmptyString,
  isNotFiniteNumber,
  isFiniteNumber,
  toDeepClone
};

export { Util as default, isArray, isBoolean, isEmptyArray, isEmptyObject, isEmptyString, isFiniteNumber, isFunction, isNotEmptyArray, isNotEmptyObject, isNotEmptyString, isNotFiniteNumber, isNumber, isObject, isRegExp, isString, itType, toDeepClone };
