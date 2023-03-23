'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var moment = require('moment');
var normalizeComponent = require('../../vendor/normalize-component-e94b9a59.cjs');
var browser = require('../../vendor/browser-935f37ba.cjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

//
var script = {
  name: 'SEditCellDatePicker',
  props: {
    // 日期模式
    mode: {
      type: String,
      default: 'date'
    },
    // 格式化
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    // 允许清理
    allowClear: {
      type: Boolean,
      default: false
    },
    // 是否只读
    inputReadOnly: {
      type: Boolean,
      default: false
    },
    // 文本值
    text: {
      type: [String, Number],
      default: ''
    },
    // 编辑按钮
    edit: {
      type: Boolean,
      default: true
    },
    // 确认按钮
    check: {
      type: Boolean,
      default: true
    },
    // 输入框激活
    opened: {
      type: Boolean,
      default: false
    },
    // 输入框状态
    status: {
      type: Boolean,
      default: false
    },
    // 是否同步
    synced: {
      type: Boolean,
      default: false
    },
    // 禁用与否
    disabled: {
      type: Boolean,
      default: false
    },
    // 单元格样式
    cellStyle: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      date: this.doMoment(this.text),
      value: this.text,
      editable: false
    };
  },
  watch: {
    // 输入框状态更改处理
    status: {
      handler(status) {
        if (!this.disabled && status === false) {
          this.editable = false;
        }
      }
    },
    // 输入框激活与否处理
    opened: {
      immediate: true,
      handler(opened) {
        if (this.disabled) {
          this.editable = false;
        } else {
          this.date = this.doMoment(this.text);
          this.value = this.text;
          this.editable = opened;
        }
      }
    },
    // 输入框禁用与否处理
    disabled: {
      immediate: true,
      handler(disabled) {
        if (disabled) {
          this.editable = false;
        } else {
          this.editable = this.opened;
        }
      }
    }
  },
  created() {
    this.date = this.doMoment(this.text);
    this.value = this.text;
  },
  methods: {
    /**
     * @description 转换为 Moment Date
     * @param {Date | String | Number} date
     * @returns {Moment}
     */
    doMoment(date) {
      return date ? moment__default["default"](date) : null;
    },
    /**
     * @description 转换为 指定格式的时间
     * @param {Date | String | Number} date
     * @returns {String}
     */
    doFormat(date) {
      return date ? moment__default["default"](date).format(this.mode === 'time' ? 'YYYY-MM-DD HH:mm:ss' : this.format) : '';
    },
    /**
     * @description 更改事件
     * @param {Event} event
     * @returns {undefined}
     */
    doChange(event) {
      this.value = this.doFormat(this.date);
      this.$emit('change', this);
    },
    /**
     * @description 编辑操作
     * @param {Event} event
     * @returns {undefined}
     */
    doEdit(event) {
      const ev = event || window.event;
      this.$emit('update:status', true);
      this.date = this.doMoment(this.text);
      this.value = this.text;
      this.editable = true;
      this.$emit('edit', this);
      ev.stopPropagation();
    },
    /**
     * @description 确认操作
     * @param {Event} event
     * @returns {undefined}
     */
    doConfirm(event) {
      const ev = event || window.event;
      if (!this.opened) {
        this.editable = false;
      }
      this.$emit('confirm', this);
      ev.stopPropagation();
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "s-editable-cell-container",
    class: {
      editabled: _vm.editable
    },
    style: _vm.cellStyle.container
  }, [!_vm.disabled && _vm.editable ? _c("div", {
    staticClass: "s-editable-cell-input-wrapper",
    class: {
      "disabled-icon": _vm.disabled || !_vm.check
    },
    style: _vm.cellStyle.inputWrapper
  }, [_c("a-date-picker", {
    staticClass: "s-editable-cell-input",
    style: _vm.cellStyle.input,
    attrs: {
      mode: _vm.mode,
      format: _vm.format,
      allowClear: _vm.allowClear,
      inputReadOnly: _vm.inputReadOnly
    },
    on: {
      change: _vm.doChange
    },
    nativeOn: {
      dblclick: function ($event) {
        $event.stopPropagation();
        return function () {}.apply(null, arguments);
      },
      click: function ($event) {
        $event.stopPropagation();
        return function () {}.apply(null, arguments);
      }
    },
    model: {
      value: _vm.date,
      callback: function ($$v) {
        _vm.date = $$v;
      },
      expression: "date"
    }
  }), _vm._v(" "), !_vm.disabled && _vm.check ? _c("a-button", {
    staticClass: "s-editable-cell-button-check",
    staticStyle: {
      color: "#0d8557"
    },
    style: _vm.cellStyle.check,
    attrs: {
      icon: "check",
      type: "link"
    },
    on: {
      click: function ($event) {
        $event.stopPropagation();
        return _vm.doConfirm.apply(null, arguments);
      }
    }
  }) : _vm._e()], 1) : _c("div", {
    staticClass: "s-editable-cell-text-wrapper",
    class: {
      "disabled-icon": _vm.disabled || !_vm.edit
    },
    style: _vm.cellStyle.textWrapper,
    attrs: {
      title: _vm.text
    },
    on: {
      click: function ($event) {
        $event.stopPropagation();
        !_vm.disabled && _vm.edit && _vm.doEdit($event);
      }
    }
  }, [_vm._t("editableCellText", function () {
    return [_vm._v(_vm._s(_vm.text))];
  }, {
    text: _vm.text
  }), _vm._v(" "), !_vm.disabled && _vm.edit ? _c("a-button", {
    staticClass: "s-editable-cell-button-edit",
    style: _vm.cellStyle.edit,
    attrs: {
      icon: "edit",
      type: "link"
    }
  }) : _vm._e()], 2)]);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-62294442_0", {
    source: ".s-editable-cell-container[data-v-62294442] {\n  width: 100%;\n  position: relative;\n}\n.s-editable-cell-container.editabled[data-v-62294442] {\n  min-width: 90px;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper[data-v-62294442] {\n  position: relative;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper[data-v-62294442]:not(.disabled-icon) {\n  padding-right: 24px;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper.disabled-icon[data-v-62294442] {\n  padding-right: 5px;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper > .s-editable-cell-input[data-v-62294442] {\n  width: 100%;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper > .s-editable-cell-button-check[data-v-62294442] {\n  position: absolute;\n  top: 52%;\n  right: 2px;\n  width: 20px;\n  transform: translateY(-50%);\n  cursor: pointer;\n  border: none;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper[data-v-62294442] {\n  min-height: 20px;\n  width: 100%;\n  position: relative;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  word-break: break-all;\n  overflow: hidden;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper[data-v-62294442]:not(.disabled-icon) {\n  padding-right: 24px;\n  cursor: pointer;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper.disabled-icon[data-v-62294442] {\n  padding-right: 2px;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper > .s-editable-cell-button-edit[data-v-62294442] {\n  position: absolute;\n  top: 52%;\n  right: 8px;\n  width: 20px;\n  transform: translateY(-50%);\n  cursor: pointer;\n  border: none;\n}\n",
    map: {
      "version": 3,
      "sources": ["DatePicker.vue"],
      "names": [],
      "mappings": "AAAA;EACE,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,eAAe;AACjB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,UAAU;EACV,WAAW;EACX,2BAA2B;EAC3B,eAAe;EACf,YAAY;AACd;AACA;EACE,gBAAgB;EAChB,WAAW;EACX,kBAAkB;EAClB,mBAAmB;EACnB,uBAAuB;EACvB,qBAAqB;EACrB,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,UAAU;EACV,WAAW;EACX,2BAA2B;EAC3B,eAAe;EACf,YAAY;AACd",
      "file": "DatePicker.vue",
      "sourcesContent": [".s-editable-cell-container {\n  width: 100%;\n  position: relative;\n}\n.s-editable-cell-container.editabled {\n  min-width: 90px;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper {\n  position: relative;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper:not(.disabled-icon) {\n  padding-right: 24px;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper.disabled-icon {\n  padding-right: 5px;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper > .s-editable-cell-input {\n  width: 100%;\n}\n.s-editable-cell-container > .s-editable-cell-input-wrapper > .s-editable-cell-button-check {\n  position: absolute;\n  top: 52%;\n  right: 2px;\n  width: 20px;\n  transform: translateY(-50%);\n  cursor: pointer;\n  border: none;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper {\n  min-height: 20px;\n  width: 100%;\n  position: relative;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  word-break: break-all;\n  overflow: hidden;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper:not(.disabled-icon) {\n  padding-right: 24px;\n  cursor: pointer;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper.disabled-icon {\n  padding-right: 2px;\n}\n.s-editable-cell-container > .s-editable-cell-text-wrapper > .s-editable-cell-button-edit {\n  position: absolute;\n  top: 52%;\n  right: 8px;\n  width: 20px;\n  transform: translateY(-50%);\n  cursor: pointer;\n  border: none;\n}\n"]
    },
    media: undefined
  });
};
/* scoped */
const __vue_scope_id__ = "data-v-62294442";
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent.normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, browser.createInjector, undefined, undefined);

exports["default"] = __vue_component__;
