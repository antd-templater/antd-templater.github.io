'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var moment = require('moment');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

/**
 * @description 补齐数值精度
 *
 * @param {String | Number} num
 * @param {String | Number} keep?
 * @return {String}
 */
const takePadEnd = (num, keep = 0) => {
  const string = String(+num || 0);
  const [integer = '0', decimal = ''] = string.split('.');
  return +keep || decimal
    ? [integer, decimal.padEnd(+keep, '0')].join('.')
    : integer
};

/**
 * @description 处理数值精度
 *
 * @param {String | Number} num
 * @param {String | Number} digit?
 * @return {String}
 */
const takeFixed = (num, digit = 0) => {
  if (!isFinite(+num)) {
    return '0.' + ''.padEnd(digit, 0)
  }

  let string = '';

  num = +num || 0;
  digit = isFinite(digit) ? +digit : 2;

  string = Math.round(Math.pow(10, digit) * num) / Math.pow(10, digit);
  string = String(string);

  if (~string.indexOf('.')) {
    const arr = string.split('.');
    string = arr[0] + '.' + arr[1].padEnd(digit, 0);
  } else {
    if (digit !== 0) {
      string += '.' + ''.padEnd(digit, '0');
    }
  }

  return string
};

/**
 * @description 取出节点数据
 *
 * @param {Array} tree
 * @param {String | Number} key
 * @param {String} value?
 * @param {String} children?
 * @return {Object}
 */
const takeTreeByKey = (
  tree,
  key,
  value = 'value',
  children = 'children'
) => {
  function isOwnProperty (context, property) {
    return Object.prototype.hasOwnProperty.call(context, property)
  }
  function itType (val) {
    return Object.prototype.toString
      .call(val)
      .replace(/^\[[^\s\]]+\s*([^\s\]]+)]$/, '$1')
  }
  function isArray (arr) {
    return itType(arr) === 'Array'
  }
  function isString (obj) {
    return itType(obj) === 'String'
  }
  function isNumber (obj) {
    return itType(obj) === 'Number'
  }

  if (isArray(tree) && (isString(key) || isNumber(key))) {
    for (let i = 0, l = tree.length; i < l; i++) {
      if (isOwnProperty(tree[i], value) && key === tree[i][value]) {
        return tree[i]
      }
      if (isArray(tree[i][children]) && tree[i][children].length > 0) {
        const result = takeTreeByKey(tree[i][children], key, value, children);
        if (Object.keys(result).length > 0) {
          return result
        }
      }
    }
    return {}
  }

  return {}
};

/**
 * @description 取出节点文本
 *
 * @param {Array} tree
 * @param {String | Number} key
 * @param {String} value?
 * @param {String} children?
 * @return {String}
 */
const takeLabelByKey = (
  tree,
  key,
  label = 'label',
  value = 'value',
  children = 'children'
) => {
  function isOwnProperty (context, property) {
    return Object.prototype.hasOwnProperty.call(context, property)
  }
  function itType (val) {
    return Object.prototype.toString
      .call(val)
      .replace(/^\[[^\s\]]+\s*([^\s\]]+)]$/, '$1')
  }
  function isArray (arr) {
    return itType(arr) === 'Array'
  }

  if ([undefined, null].includes(key)) {
    return key
  }

  if (isArray(label)) {
    for (const name of label) {
      const node = takeTreeByKey(tree, key, value, children);
      if (isOwnProperty(node, name)) {
        return node[name]
      }
    }
    return key
  }

  return takeTreeByKey(tree, key, value, children)[label] || key
};

/**
 * @description 根据格式转换 日期
 *
 * @param {Date | String | Number} date
 * @param {String} format?
 * @return {Moment | null}
 */
const takeTimeToDate = (date, format) => {
  if (date) {
    try {
      return moment__default["default"](date, format)
    } catch {}
  }
  return null
};

/**
 * @description 根据格式转换 时间
 *
 * @param {Date | String | Number} date
 * @param {String} format?
 * @return {String}
 */
const takeTimeToFormat = (date, format) => {
  if (date) {
    try {
      return moment__default["default"](date).format(format || 'YYYY-MM-DD HH:mm:ss')
    } catch {}
  }
  return ''
};

/**
 * @description 默认导出
 */
var helper = {
  takePadEnd,
  takeFixed,
  takeTreeByKey,
  takeLabelByKey,
  takeTimeToDate,
  takeTimeToFormat
};

exports["default"] = helper;
exports.takeFixed = takeFixed;
exports.takeLabelByKey = takeLabelByKey;
exports.takePadEnd = takePadEnd;
exports.takeTimeToDate = takeTimeToDate;
exports.takeTimeToFormat = takeTimeToFormat;
exports.takeTreeByKey = takeTreeByKey;
