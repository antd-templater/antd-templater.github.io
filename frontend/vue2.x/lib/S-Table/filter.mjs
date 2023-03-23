/**
 * @description 下拉列选项
 */
var STableFilter = {
  name: 'STableFilter',
  props: {
    // 按钮图标
    icon: {
      type: String,
      default: 'filter'
    },
    // 按钮类型
    type: {
      type: String,
      default: 'default'
    },
    // 表格实例
    refTable: {
      type: Function,
      default: function () {}
    },
    // 列选项文本模版
    templete: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      values: [],
      selects: [],
      options: [],
      visible: false,
      table: null
    };
  },
  watch: {
    selects: {
      handler(selects) {
        this.values = selects.filter(select => select.filter).map(select => select.value);
      },
      deep: true
    }
  },
  methods: {
    /**
     * @description 初始化列选项
     * @return {undefined}
     */
    initHandler() {
      if (!this.table) {
        if (this.refTable()) {
          this.table = this.refTable();
          this.selects = this.table.selectColumns;
          this.options = this.table.optionColumns.map(option => {
            return {
              label: this.templete.replace(/(label|value)/g, key => {
                return option[key];
              }),
              value: option.value
            };
          });
        }
      }
    },
    /**
     * @description 选项更改配置
     * @param {Array} selects
     * @return {undefined}
     */
    changeHandler(selects) {
      for (const select of this.selects) {
        select.filter = selects.includes(select.value);
      }
    }
  },
  render() {
    const h = arguments[0];
    return h("a-dropdown", {
      "attrs": {
        "trigger": ['click']
      },
      "nativeOn": {
        ...{
          mousedown: this.initHandler
        }
      },
      "model": {
        value: this.visible,
        callback: $$v => {
          this.visible = $$v;
        }
      }
    }, [h("a-menu", {
      "slot": "overlay",
      "style": "padding: 6px 12px;"
    }, [h("a-checkbox-group", {
      "on": {
        ...{
          change: this.changeHandler
        }
      },
      "attrs": {
        "value": this.values
      }
    }, [this.options.map(option => {
      return h("a-menu-item", [h("a-checkbox", {
        "attrs": {
          "value": option.value
        }
      }, [option.label])]);
    })])]), h("a-button", {
      "attrs": {
        "type": this.type,
        "icon": this.icon
      }
    }, [this.$slots.default || '列筛选', h("a-icon", {
      "attrs": {
        "type": "down"
      }
    })])]);
  }
};

export { STableFilter as default };
