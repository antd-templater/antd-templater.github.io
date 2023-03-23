'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('../../util/base.cjs');

/**
 * @description 校验器
 */
const validator = {
  number(options) {
    const rule = {};
    const pattern = options.pattern;
    const message = options.message;
    const validator = options.validator;
    if (base["default"].isObject(options)) {
      Object.assign(rule, options);
    }
    if (base["default"].isString(validator)) {
      if (!base["default"].isRegExp(pattern)) {
        Object.assign(rule, {
          pattern: /^[+-]?\d+\.?\d*$/i
        });
      }
      rule.validator = (rule, value, callback) => {
        if (!value && value !== 0) {
          if (rule.required !== true) {
            return callback();
          }
          return callback(new Error(message || '该项必填'));
        }
        if (!rule.pattern.test(value)) {
          return callback(new Error(validator || message || '格式有误'));
        }
        return callback();
      };
      Object.assign(rule, {
        message: undefined
      });
    }
    return rule;
  },
  password(options) {
    const rule = {};
    const pattern = options.pattern;
    const message = options.message;
    const validator = options.validator;
    if (base["default"].isObject(options)) {
      Object.assign(rule, options);
    }
    if (base["default"].isString(validator)) {
      if (!base["default"].isRegExp(pattern)) {
        Object.assign(rule, {
          pattern: /.{6,}/iu
        });
      }
      rule.validator = (rule, value, callback) => {
        if (!value && value !== 0) {
          if (rule.required !== true) {
            return callback();
          }
          return callback(new Error(message || '密码必填'));
        }
        if (!rule.pattern.test(value)) {
          return callback(new Error(validator || message || '密码过短'));
        }
        return callback();
      };
      Object.assign(rule, {
        message: undefined
      });
    }
    return rule;
  }
};

/**
 * @description 扩展器
 */
const extender = {
  groups(groups = [], fn = null, options = {}) {
    if (base["default"].isFunction(fn)) {
      let region = {
        type: 'AGroup'
      };
      const clones = base["default"].toDeepClone(groups);
      const entries = groups.entries();
      for (const [index, group] of entries) {
        group.type === 'AGroup' ? region = base["default"].toDeepClone(group) : region = base["default"].toDeepClone(region);
        const result = fn(group, index, clones, region);
        if (base["default"].isObject(result)) {
          const clone = clones[index];
          const part = base["default"].toDeepClone(result);
          Object.assign(group, result);
          Object.assign(clone, part);
        }
      }
    }
    return groups;
  },
  options(groups = [], fn = null, options = {}) {
    if (base["default"].isFunction(fn)) {
      let region = {
        type: 'AGroup'
      };
      const clones = base["default"].toDeepClone(groups);
      const entries = groups.entries();
      for (const [index, group] of entries) {
        group.type === 'AGroup' ? region = base["default"].toDeepClone(group) : region = base["default"].toDeepClone(region);
        const result = fn(group, index, clones, region);
        if (base["default"].isObject(result)) {
          if (group.field) {
            options[group.field] = Object.assign(options[group.field] || {}, result);
          }
        }
      }
    }
    return options;
  }
};

exports.extender = extender;
exports.validator = validator;
