import { n as normalizeComponent } from '../../vendor/normalize-component-49e401f6.mjs';
import { c as createInjector } from '../../vendor/browser-22b3c5d3.mjs';

/**
 * @description 图标库映射
 */
var icons = [{
  key: 'Directional',
  title: '方向性图标',
  icons: ['step-backward', 'step-forward', 'fast-backward', 'fast-forward', 'shrink', 'arrows-alt', 'down', 'up', 'left', 'right', 'caret-up', 'caret-down', 'caret-left', 'caret-right', 'up-circle', 'down-circle', 'left-circle', 'right-circle', 'double-right', 'double-left', 'vertical-left', 'vertical-right', 'vertical-align-top', 'vertical-align-middle', 'vertical-align-bottom', 'forward', 'backward', 'rollback', 'enter', 'retweet', 'swap', 'swap-left', 'swap-right', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'play-circle', 'up-square', 'down-square', 'left-square', 'right-square', 'login', 'logout', 'menu-fold', 'menu-unfold', 'border-bottom', 'border-horizontal', 'border-inner', 'border-outer', 'border-left', 'border-right', 'border-top', 'border-verticle', 'pic-center', 'pic-left', 'pic-right', 'radius-bottomleft', 'radius-bottomright', 'radius-upleft', 'radius-upright', 'fullscreen', 'fullscreen-exit']
}, {
  key: 'Suggested',
  title: '提示建议性图标',
  icons: ['question', 'question-circle', 'plus', 'plus-circle', 'pause', 'pause-circle', 'minus', 'minus-circle', 'plus-square', 'minus-square', 'info', 'info-circle', 'exclamation', 'exclamation-circle', 'close', 'close-circle', 'close-square', 'check', 'check-circle', 'check-square', 'clock-circle', 'warning', 'issues-close', 'stop']
}, {
  key: 'Editor',
  title: '编辑类图标',
  icons: ['edit', 'form', 'copy', 'scissor', 'delete', 'snippets', 'diff', 'highlight', 'align-center', 'align-left', 'align-right', 'bg-colors', 'bold', 'italic', 'underline', 'strikethrough', 'redo', 'undo', 'zoom-in', 'zoom-out', 'font-colors', 'font-size', 'line-height', 'dash', 'small-dash', 'sort-ascending', 'sort-descending', 'drag', 'ordered-list', 'unordered-list', 'radius-setting', 'column-width', 'column-height']
}, {
  key: 'Data',
  title: '数据类图标',
  icons: ['area-chart', 'pie-chart', 'bar-chart', 'dot-chart', 'line-chart', 'radar-chart', 'heat-map', 'fall', 'rise', 'stock', 'box-plot', 'fund', 'sliders']
}, {
  key: 'Brand',
  title: '网站通用图标',
  icons: ['android', 'apple', 'windows', 'ie', 'chrome', 'github', 'aliwangwang', 'dingding', 'weibo-square', 'weibo-circle', 'taobao-circle', 'html5', 'weibo', 'twitter', 'wechat', 'youtube', 'alipay-circle', 'taobao', 'skype', 'qq', 'medium-workmark', 'gitlab', 'medium', 'linkedin', 'google-plus', 'dropbox', 'facebook', 'codepen', 'code-sandbox', 'amazon', 'google', 'codepen-circle', 'alipay', 'ant-design', 'ant-cloud', 'aliyun', 'zhihu', 'slack', 'slack-square', 'behance', 'behance-square', 'dribbble', 'dribbble-square', 'instagram', 'yuque', 'alibaba', 'yahoo', 'reddit', 'sketch']
}, {
  key: 'Application',
  title: '品牌和标识',
  icons: ['account-book', 'alert', 'api', 'appstore', 'audio', 'bank', 'bell', 'book', 'bug', 'bulb', 'calculator', 'build', 'calendar', 'camera', 'car', 'carry-out', 'cloud', 'code', 'compass', 'contacts', 'container', 'control', 'credit-card', 'crown', 'customer-service', 'dashboard', 'database', 'dislike', 'environment', 'experiment', 'eye-invisible', 'eye', 'file-add', 'file-excel', 'file-exclamation', 'file-image', 'file-markdown', 'file-pdf', 'file-ppt', 'file-text', 'file-unknown', 'file-word', 'file-zip', 'file', 'filter', 'fire', 'flag', 'folder-add', 'folder', 'folder-open', 'frown', 'funnel-plot', 'gift', 'hdd', 'heart', 'home', 'hourglass', 'idcard', 'insurance', 'interaction', 'layout', 'like', 'lock', 'mail', 'medicine-box', 'meh', 'message', 'mobile', 'money-collect', 'pay-circle', 'notification', 'phone', 'picture', 'play-square', 'printer', 'profile', 'project', 'pushpin', 'property-safety', 'read', 'reconciliation', 'red-envelope', 'rest', 'rocket', 'safety-certificate', 'save', 'schedule', 'security-scan', 'setting', 'shop', 'shopping', 'skin', 'smile', 'sound', 'star', 'switcher', 'tablet', 'tag', 'tags', 'tool', 'thunderbolt', 'trophy', 'unlock', 'usb', 'video-camera', 'wallet', 'apartment', 'audit', 'barcode', 'bars', 'block', 'border', 'branches', 'ci', 'cloud-download', 'cloud-server', 'cloud-sync', 'cloud-upload', 'cluster', 'coffee', 'copyright', 'deployment-unit', 'desktop', 'disconnect', 'dollar', 'download', 'ellipsis', 'euro', 'error', 'export', 'file-done', 'file-jpg', 'file-protect', 'file-sync', 'file-search', 'fork', 'gateway', 'global', 'gold', 'history', 'import', 'inbox', 'key', 'laptop', 'link', 'line', 'loading-3-quarters', 'loading', 'man', 'menu', 'monitor', 'more', 'number', 'percentage', 'paper-clip', 'pound', 'poweroff', 'pull-request', 'qrcode', 'reload', 'safety', 'robot', 'scan', 'search', 'select', 'shake', 'share-alt', 'shopping-cart', 'solution', 'sync', 'table', 'team', 'to-top', 'trademark', 'transaction', 'upload', 'user-add', 'user-delete', 'usergroup-add', 'user', 'usergroup-delete', 'wifi', 'woman']
}];

//
var script = {
  name: 'SIconSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 默认描述
    placeholder: {
      type: String,
      default: ''
    },
    // 允许搜索
    showSearch: {
      type: Boolean,
      default: true
    },
    // 允许清理
    allowClear: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 图标类型
    value: {
      type: String,
      default: undefined
    }
  },
  computed: {
    iconSelect() {
      const options = [];
      for (const item of icons) {
        const option = {
          key: item.key,
          title: item.title,
          children: []
        };
        for (const child of item.icons) {
          option.children.push({
            key: child,
            label: child,
            value: child
          });
        }
        options.push(option);
      }
      return options;
    }
  },
  methods: {
    /**
     * @description 更改事件
     * @param {String | Number} value
     * @returns {undefined}
     */
    doChange(value) {
      this.$emit('change', value);
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
  return _c("a-select", {
    attrs: {
      value: _vm.value,
      disabled: _vm.disabled,
      showSearch: _vm.showSearch,
      allowClear: _vm.allowClear,
      placeholder: _vm.placeholder,
      optionFilterProp: "label",
      dropdownClassName: "s-icon-dropdown-wrapper"
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
    }
  }, _vm._l(_vm.iconSelect, function (group) {
    return _c("a-select-opt-group", {
      key: group.key,
      attrs: {
        label: group.title
      }
    }, [_c("span", {
      staticStyle: {
        "font-size": "14px"
      },
      attrs: {
        slot: "label"
      },
      slot: "label"
    }, [_vm._v(_vm._s(group.title))]), _vm._v(" "), _vm._l(group.children, function (item) {
      return _c("a-select-option", {
        key: item.key,
        attrs: {
          value: item.value,
          title: item.label,
          label: item.label
        }
      }, [_c("a-icon", {
        staticStyle: {
          "font-size": "18px",
          "vertical-align": "middle"
        },
        attrs: {
          type: item.value
        }
      }), _vm._v(" "), _c("span", {
        staticClass: "s-icon-dropdown-hidden",
        staticStyle: {
          padding: "0 3px",
          "font-size": "12px",
          "vertical-align": "middle"
        }
      }, [_vm._v("\n        " + _vm._s(item.label) + "\n      ")])], 1);
    })], 2);
  }), 1);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-aefaacd6_0", {
    source: ".s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list {\n  padding-left: 8px;\n  margin-bottom: 4px;\n}\n.s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item-selected {\n  background-color: #b1d6fe;\n}\n.s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item {\n  margin: 3px 5px;\n  padding: 5px 7px;\n  line-height: 18px;\n  display: inline-block;\n}\n.s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item .s-icon-dropdown-hidden {\n  display: none !important;\n}\n",
    map: {
      "version": 3,
      "sources": ["index.vue"],
      "names": [],
      "mappings": "AAAA;EACE,iBAAiB;EACjB,kBAAkB;AACpB;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,eAAe;EACf,gBAAgB;EAChB,iBAAiB;EACjB,qBAAqB;AACvB;AACA;EACE,wBAAwB;AAC1B",
      "file": "index.vue",
      "sourcesContent": [".s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list {\n  padding-left: 8px;\n  margin-bottom: 4px;\n}\n.s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item-selected {\n  background-color: #b1d6fe;\n}\n.s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item {\n  margin: 3px 5px;\n  padding: 5px 7px;\n  line-height: 18px;\n  display: inline-block;\n}\n.s-icon-dropdown-wrapper .ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item .s-icon-dropdown-hidden {\n  display: none !important;\n}\n"]
    },
    media: undefined
  });
};
/* scoped */
const __vue_scope_id__ = undefined;
/* module identifier */
const __vue_module_identifier__ = undefined;
/* functional template */
const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

export { __vue_component__ as default };
