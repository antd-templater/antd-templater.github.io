import Tooltip from 'ant-design-vue/es/tooltip';
import { n as normalizeComponent } from '../../vendor/normalize-component-49e401f6.mjs';

var script = {
  name: 'SEllipsis',
  components: {
    Tooltip
  },
  props: {
    // 显示提示框
    tooltip: {
      type: Boolean,
      default: false
    },
    // 显示方式
    placement: {
      type: String,
      default: 'topLeft'
    },
    // 是否截取
    sheared: {
      type: Boolean,
      default: true
    },
    // 截取字节数长度
    length: {
      type: Number,
      default: 0
    }
  },
  methods: {
    /**
     * @description 获取文本字节数
     * @param {String} string?
     * @returns {Number}
     */
    getFullLength(string = '') {
      return string.split('').reduce((pre, cur) => {
        const charCode = cur.charCodeAt(0);
        const isSingleChar = charCode >= 0 && charCode <= 128;
        return isSingleChar ? pre + 1 : pre + 2;
      }, 0);
    },
    /**
     * @description 根据字节数获取文本
     * @param {String} string?
     * @param {Number} max?
     * @returns {String}
     */
    cutFullLength(string = '', max = Infinity) {
      let len = 0;
      return string.split('').reduce((pre, cur) => {
        const charCode = cur.charCodeAt(0);
        const isSingleChar = charCode >= 0 && charCode <= 128;
        isSingleChar ? len += 1 : len += 2;
        return len <= max ? pre + cur : pre;
      }, '');
    },
    /**
     * @description 渲染截取文本组件
     * @param {String} string
     * @param {Number} length
     * @returns {SpanElement}
     */
    renderTextNode(string, length) {
      const h = this.$createElement;
      if (this.length > 0 && this.sheared) {
        const content = this.cutFullLength(string, this.length);
        const expand = length > this.length ? '...' : '';
        return h("span", [content + expand]);
      }
      return h("span", [string]);
    },
    /**
     * @description 渲染提示框组件
     * @param {String} string
     * @param {Number} length
     * @returns {Tooltip}
     */
    renderTooltip(string, length) {
      const h = this.$createElement;
      return h(Tooltip, {
        "attrs": {
          "placement": this.placement
        }
      }, [h("template", {
        "slot": "title"
      }, [string]), this.renderTextNode(string, length)]);
    }
  },
  render() {
    const strings = this.$slots.default.map(vNode => vNode.text).join('').trim();
    const fullLength = this.getFullLength(strings);
    const tooltip = this.$props.tooltip;
    const length = this.$props.length;
    return tooltip && fullLength > length ? this.renderTooltip(strings, fullLength) : this.renderTextNode(strings, fullLength);
  }
};

/* script */
const __vue_script__ = script;

/* template */

/* style */
const __vue_inject_styles__ = undefined;
/* scoped */
const __vue_scope_id__ = undefined;
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

export { __vue_component__ as default };
