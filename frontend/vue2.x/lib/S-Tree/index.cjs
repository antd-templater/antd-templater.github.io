'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('../S-Ellipsis/index.cjs');
var base = require('../../util/base.cjs');
var normalizeComponent = require('../../vendor/normalize-component-e94b9a59.cjs');
var browser = require('../../vendor/browser-935f37ba.cjs');

//
var script = {
  name: 'STree',
  components: {
    SEllipsis: index["default"]
  },
  props: {
    // 允许 check 操作的级别
    allowCheckedLevel: {
      type: [Number, Function],
      default: 1
    },
    // 允许 select 操作的级别
    allowSelectedLevel: {
      type: [Number, Function],
      default: 1
    },
    // 允许 select 转换 check 操作
    allowSelectToCheck: {
      type: Boolean,
      default: false
    },
    // 允许多个树节点展开
    allowMultiExpanded: {
      type: Boolean,
      default: true
    },
    // 允许通过非折叠图标折叠
    allowAutoCollapsed: {
      type: Boolean,
      default: true
    },
    // 允许通过非展开图标展开
    allowAutoExpanded: {
      type: Boolean,
      default: true
    },
    // 允许通过非展开图标展开
    allowUnSelected: {
      type: Boolean,
      default: false
    },
    // 允许所有树节点未 check
    allowUnChecked: {
      type: Boolean,
      default: false
    },
    // 树节点字段映射
    replaceFields: {
      type: Object,
      default: function () {
        return {
          children: 'children',
          title: 'label',
          key: 'value'
        };
      }
    },
    // selectable 模式
    selectable: {
      type: Boolean,
      default: true
    },
    // checkable 模式
    checkable: {
      type: Boolean,
      default: false
    },
    // 通过传参方式获取数据源
    treeData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    // 通过接口调用获取数据源
    loadData: {
      type: Function,
      default: undefined
    },
    // 树节点禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 树节点左侧图标
    showIcon: {
      type: Boolean,
      default: false
    },
    // 树节点连接支线
    showLine: {
      type: Boolean,
      default: false
    },
    // 控制树组件 loading
    loading: {
      type: Boolean,
      default: false
    },
    // 允许文本过长显示提示框
    tooltip: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      // 各状态 - 节点key
      loadKeys: [],
      loadedKeys: [],
      expandedKeys: [],
      // 树组件 - 数据源
      treeNodes: [],
      // selected - 节点
      selectedNode: {},
      selectedKeys: [],
      selectedNodes: [],
      // selected - 相关链路上节点
      selectedLinkNode: {},
      selectedLinkKeys: [],
      selectedLinkNodes: [],
      // checked - 节点
      checkedNode: {},
      checkedKeys: [],
      checkedNodes: [],
      // checked - 相关half节点
      checkedHalfNode: {},
      checkedHalfKeys: [],
      checkedHalfNodes: [],
      // checked - 相关链路上节点
      checkedLinkNode: {},
      checkedLinkKeys: [],
      checkedLinkNodes: [],
      // 树节点映射储存
      flatTreeNodes: [],
      childTreeNodes: {},
      parentTreeNodes: {}
    };
  },
  watch: {
    // 传参数据源
    treeData: {
      handler(nodes) {
        this.resetTreeNodes(nodes);
      },
      immediate: true
    },
    // 加载中节点key
    loadKeys: {
      handler() {
        if (base["default"].isEmptyArray(this.loadKeys)) {
          this.$emit('load', {
            loadKeys: [...this.loadKeys],
            loadedKeys: [...this.loadedKeys],
            expandedKeys: [...this.expandedKeys],
            selectedNode: {
              ...this.selectedNode
            },
            selectedKeys: [...this.selectedKeys],
            selectedNodes: [...this.selectedNodes],
            selectedLinkNode: {
              ...this.selectedLinkNode
            },
            selectedLinkKeys: [...this.selectedLinkKeys],
            selectedLinkNodes: [...this.selectedLinkNodes],
            checkedNode: {
              ...this.checkedNode
            },
            checkedKeys: [...this.checkedKeys],
            checkedNodes: [...this.checkedNodes],
            checkedHalfNode: {
              ...this.checkedHalfNode
            },
            checkedHalfKeys: [...this.checkedHalfKeys],
            checkedHalfNodes: [...this.checkedHalfNodes],
            checkedLinkNode: {
              ...this.checkedLinkNode
            },
            checkedLinkKeys: [...this.checkedLinkKeys],
            checkedLinkNodes: [...this.checkedLinkNodes],
            flatTreeNodes: [...this.flatTreeNodes],
            childTreeNodes: {
              ...this.childTreeNodes
            },
            parentTreeNodes: {
              ...this.parentTreeNodes
            }
          });
        }
      }
    },
    // checkable模式
    checkable: {
      handler() {
        this.cleanNodeConfig(true);
      }
    }
  },
  methods: {
    /**
     * @description 渲染【展开/收缩】样式
     * @param {Object <Node>} node
     * @return {Boolean}
     */
    renderSwitcher(node) {
      const isLeafedNode = !node || node.isLeaf === true;
      const isAsyncNode = !isLeafedNode && base["default"].isFunction(this.loadData);
      const isLoadedNode = this.loadedKeys.includes(node.value);
      const isLoadNode = this.loadKeys.includes(node.value);
      if (isAsyncNode && isLoadNode) {
        return 'loading';
      }
      if (this.showLine) {
        if (base["default"].isNotEmptyArray(node.children) || isAsyncNode && !isLoadedNode) {
          return !this.expandedKeys.includes(node.value) ? 'plus-square' : 'minus-square';
        }
        return 'file';
      }
      if (base["default"].isNotEmptyArray(node.children) || isAsyncNode && !isLoadedNode) {
        return 'caret-down';
      }
      return false;
    },
    /**
     * @description 切换【展开/收缩】事件
     * @param {Object <Node>} node
     * @return {undefined}
     */
    triggerSwitcher(node) {
      if (this.flatTreeNodes.some(every => every.value === node.value)) {
        this.doTreeExpand(this.expandedKeys.includes(node.value) ? this.expandedKeys.filter(key => key !== node.value) : [...this.expandedKeys, node.value]);
      }
    },
    /**
     * @description 重新计算树各节点配置
     * @param {Boolean} force
     * @return {undefined}
     */
    resetNodeConfig(force) {
      this.selectedLinkNodes.splice(0, this.selectedLinkNodes.length);
      this.checkedHalfNodes.splice(0, this.checkedHalfNodes.length);
      this.checkedLinkNodes.splice(0, this.checkedLinkNodes.length);

      // 是否必选
      if (!base["default"].isNotEmptyArray(this.selectedNodes)) {
        if (this.selectable && !this.allowUnSelected) {
          this.selectedNodes.push(...this.flatTreeNodes.filter(item => item.selectable).slice(0, 1));
        }
      }
      if (!base["default"].isNotEmptyArray(this.checkedNodes)) {
        if (this.checkable && !this.allowUnChecked) {
          this.checkedNodes.push(...this.flatTreeNodes.filter(item => item.checkable).slice(0, 1));
        }
      }

      // 核心逻辑
      if (base["default"].isNotEmptyArray(this.selectedNodes)) {
        const flatTreeNodes = this.flatTreeNodes;
        const selectedNodes = this.selectedNodes;
        const upHandleNode = flatTreeNodes.find(every => selectedNodes.some(node => node.value === every.value));
        const parentNodes = this.parentTreeNodes[upHandleNode.value] || [];
        if (upHandleNode) {
          this.selectedLinkNodes.push(...parentNodes, upHandleNode);
        }
      }
      if (base["default"].isNotEmptyArray(this.checkedNodes)) {
        const checkedHalfNodes = this.checkedHalfNodes;
        const childTreeNodes = this.childTreeNodes;
        const flatTreeNodes = this.flatTreeNodes;
        const checkedNodes = this.checkedNodes;
        let downHandleNodes = [...checkedNodes];
        let upHandleNodes = [...checkedNodes];
        let downHandleNode;
        let upHandleNode;

        // 向下处理
        downHandleNode = downHandleNodes.pop();
        while (downHandleNode) {
          if (flatTreeNodes.some(every => every.value === downHandleNode.value)) {
            if (base["default"].isNotEmptyArray(childTreeNodes[downHandleNode.value])) {
              upHandleNodes.push(...childTreeNodes[downHandleNode.value].filter(child => !upHandleNodes.some(node => node.value === child.value)));
              downHandleNodes = downHandleNodes.filter(node => !childTreeNodes[downHandleNode.value].some(child => node.value === child.value));
            }
          }
          downHandleNode = downHandleNodes.pop();
        }

        // 向上处理
        if (base["default"].isNotEmptyArray(upHandleNodes)) {
          let tempUpNodes;
          let tempUpNode;
          upHandleNodes.sort((a, b) => a.level - b.level);
          upHandleNode = upHandleNodes.pop();
          tempUpNode = upHandleNode;
          tempUpNodes = upHandleNodes.filter(node => node.level === upHandleNode.level);
          upHandleNodes = upHandleNodes.filter(node => !tempUpNodes.some(temp => temp.node === node.level));
          while (tempUpNode) {
            if (tempUpNode.parentNode) {
              const parent = tempUpNode.parentNode;
              const children = tempUpNode.parentNode.children;
              if (children.every(child => checkedNodes.some(node => node.value === child.value))) {
                if (!checkedNodes.some(node => node.value === parent.value)) {
                  checkedNodes.push(parent);
                }
              } else {
                if (checkedNodes.some(node => node.value === parent.value)) {
                  checkedNodes.splice(checkedNodes.findIndex(node => node.value === parent.value), 1);
                }
                if (children.some(child => checkedNodes.some(node => node.value === child.value) || checkedHalfNodes.some(node => node.value === child.value))) {
                  if (!this.checkedHalfNodes.some(node => node.value === parent.value)) {
                    this.checkedHalfNodes.push(parent);
                  }
                }
              }
              if (!upHandleNodes.some(node => node.value === parent.value)) {
                upHandleNodes.push(parent);
              }
              tempUpNodes = tempUpNodes.filter(temp => !children.some(child => child.value === temp.value));
            }
            if (base["default"].isNotEmptyArray(tempUpNodes)) {
              tempUpNode = tempUpNodes.pop();
            } else if (base["default"].isNotEmptyArray(upHandleNodes)) {
              upHandleNode = upHandleNodes.pop();
              tempUpNode = upHandleNode;
              tempUpNodes = upHandleNodes.filter(node => node.level === upHandleNode.level);
              upHandleNodes = upHandleNodes.filter(node => !tempUpNodes.some(temp => temp.node === node.level));
            } else {
              tempUpNode = null;
            }
          }
        }
      }

      // 排序逻辑
      if (base["default"].isArray(this.expandedKeys)) {
        this.expandedKeys.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a) - this.flatTreeNodes.findIndex(node => node.value === b));
      }
      if (base["default"].isArray(this.selectedNodes)) {
        this.selectedNodes.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a.value) - this.flatTreeNodes.findIndex(node => node.value === b.value));
        this.selectedKeys.splice(0, this.selectedKeys.length, ...this.selectedNodes.map(node => node.value));
        this.selectedNode = this.selectedNodes[0] || {};
      }
      if (base["default"].isArray(this.selectedLinkNodes)) {
        this.selectedLinkNodes.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a.value) - this.flatTreeNodes.findIndex(node => node.value === b.value));
        this.selectedLinkKeys.splice(0, this.selectedLinkKeys.length, ...this.selectedLinkNodes.map(node => node.value));
        this.selectedLinkNode = this.selectedLinkNodes[0] || {};
      }
      if (base["default"].isArray(this.checkedNodes)) {
        this.checkedNodes.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a.value) - this.flatTreeNodes.findIndex(node => node.value === b.value));
        this.checkedKeys.splice(0, this.checkedKeys.length, ...this.checkedNodes.map(node => node.value));
        this.checkedNode = this.checkedNodes[0] || {};
      }
      if (base["default"].isArray(this.checkedHalfNodes)) {
        this.checkedHalfNodes.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a.value) - this.flatTreeNodes.findIndex(node => node.value === b.value));
        this.checkedHalfKeys.splice(0, this.checkedHalfKeys.length, ...this.checkedHalfNodes.map(node => node.value));
        this.checkedHalfNode = this.checkedHalfNodes[0] || {};
      }
      if (base["default"].isArray(this.checkedLinkNodes)) {
        this.checkedLinkNodes.push(...this.checkedNodes, ...this.checkedHalfNodes);
        this.checkedLinkNodes.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a.value) - this.flatTreeNodes.findIndex(node => node.value === b.value));
        this.checkedLinkKeys.splice(0, this.checkedLinkKeys.length, ...this.checkedLinkNodes.map(node => node.value));
        this.checkedLinkNode = this.checkedLinkNodes[0] || {};
      }
    },
    /**
     * @description 清理树各节点配置
     * @param {Boolean} force
     * @return {undefined}
     */
    cleanNodeConfig(force) {
      if (force === true) {
        this.loadKeys = [];
        this.loadedKeys = [];
        this.expandedKeys = [];
        this.selectedNode = {};
        this.selectedKeys = [];
        this.selectedNodes = [];
        this.selectedLinkNode = {};
        this.selectedLinkKeys = [];
        this.selectedLinkNodes = [];
        this.checkedNode = {};
        this.checkedKeys = [];
        this.checkedNodes = [];
        this.checkedHalfNode = {};
        this.checkedHalfKeys = [];
        this.checkedHalfNodes = [];
      }
      const findByNode = node => this.flatTreeNodes.some(every => every.value === node.value);
      const nodeToValue = node => node.value;

      // 清理中 - loadKeys
      this.loadKeys.splice(0, this.loadKeys.length, ...this.loadKeys.filter(value => this.flatTreeNodes.some(every => every.value === value && base["default"].isNotEmptyArray(every.children))));

      // 清理中 - loadedKeys
      this.loadedKeys.splice(0, this.loadedKeys.length, ...this.loadedKeys.filter(value => this.flatTreeNodes.some(every => every.value === value && base["default"].isNotEmptyArray(every.children))));

      // 清理中 - expanded
      this.expandedKeys.splice(0, this.expandedKeys.length, ...this.expandedKeys.filter(value => this.flatTreeNodes.some(every => every.value === value && base["default"].isNotEmptyArray(every.children))));

      // 清理中 - selected
      this.selectedNodes.splice(0, this.selectedNodes.length, ...this.selectedNodes.filter(findByNode));

      // 清理中 - checked
      this.checkedNodes.splice(0, this.checkedNodes.length, ...this.checkedNodes.filter(findByNode));

      // 默认设置 - expanded
      if (base["default"].isEmptyArray(this.expandedKeys)) {
        if (this.treeNodes.length === 1) {
          this.expandTreeNodes(this.flatTreeNodes.map(nodeToValue).slice(0, 1));
        }
      }

      // 默认设置 - selected
      if (base["default"].isEmptyArray(this.selectedNodes)) {
        if (this.selectable && !this.allowUnSelected) {
          this.selectedNodes.push(...this.flatTreeNodes.filter(item => item.selectable).slice(0, 1));
        }
      }

      // 默认设置 - checked
      if (base["default"].isEmptyArray(this.checkedNodes)) {
        if (this.checkable && !this.allowUnChecked) {
          this.checkedNodes.push(...this.flatTreeNodes.filter(item => item.checkable).slice(0, 1));
        }
      }

      // 重置配置
      this.resetNodeConfig();
    },
    /**
     * @description 重置树组件数据源
     * @param {Array <Node>} nodes
     * @return {Promise}
     */
    resetTreeNodes(nodes) {
      if (!base["default"].isArray(nodes)) {
        nodes = this.treeNodes;
      }
      if (nodes !== this.treeNodes) {
        this.treeNodes = [...nodes];
      }

      // 创建节点
      return this.reloadTreeNodes(nodes, null).then(() => {
        // 初始化事件
        this.$emit('init', {
          loadKeys: [...this.loadKeys],
          loadedKeys: [...this.loadedKeys],
          expandedKeys: [...this.expandedKeys],
          selectedNode: {
            ...this.selectedNode
          },
          selectedKeys: [...this.selectedKeys],
          selectedNodes: [...this.selectedNodes],
          selectedLinkNode: {
            ...this.selectedLinkNode
          },
          selectedLinkKeys: [...this.selectedLinkKeys],
          selectedLinkNodes: [...this.selectedLinkNodes],
          checkedNode: {
            ...this.checkedNode
          },
          checkedKeys: [...this.checkedKeys],
          checkedNodes: [...this.checkedNodes],
          checkedHalfNode: {
            ...this.checkedHalfNode
          },
          checkedHalfKeys: [...this.checkedHalfKeys],
          checkedHalfNodes: [...this.checkedHalfNodes],
          checkedLinkNode: {
            ...this.checkedLinkNode
          },
          checkedLinkKeys: [...this.checkedLinkKeys],
          checkedLinkNodes: [...this.checkedLinkNodes],
          flatTreeNodes: [...this.flatTreeNodes],
          childTreeNodes: {
            ...this.childTreeNodes
          },
          parentTreeNodes: {
            ...this.parentTreeNodes
          }
        });
      });
    },
    /**
     * @description 根据父节点刷新子节点数据源
     * @param {Array <Node>} nodes
     * @param {Object <Node>} parent
     * @return {Promise}
     */
    reloadTreeNodes(nodes, parent) {
      if (!base["default"].isNotEmptyArray(nodes)) {
        if (!base["default"].isNotEmptyObject(parent)) {
          this.treeNodes = [];
          this.loadKeys = [];
          this.loadedKeys = [];
          this.expandedKeys = [];
          this.selectedNode = {};
          this.selectedKeys = [];
          this.selectedNodes = [];
          this.selectedLinkNode = {};
          this.selectedLinkKeys = [];
          this.selectedLinkNodes = [];
          this.checkedNode = {};
          this.checkedKeys = [];
          this.checkedNodes = [];
          this.checkedHalfNode = {};
          this.checkedHalfKeys = [];
          this.checkedHalfNodes = [];
          this.checkedLinkNode = {};
          this.checkedLinkKeys = [];
          this.checkedLinkNodes = [];
          this.flatTreeNodes = [];
          this.childTreeNodes = {};
          this.parentTreeNodes = {};
        }
        return Promise.resolve();
      }
      if (base["default"].isNotEmptyObject(parent) && !this.flatTreeNodes.some(every => every.value === parent.value)) {
        return Promise.resolve();
      }
      if (!base["default"].isNotEmptyObject(parent)) {
        if (nodes !== this.treeNodes) {
          this.treeNodes = [...nodes];
        }
        this.loadKeys = [];
        this.loadedKeys = [];
        this.flatTreeNodes = [];
        this.childTreeNodes = {};
      }
      if (base["default"].isNotEmptyObject(parent)) {
        parent = this.flatTreeNodes.find(every => every.value === parent.value);
        if (!this.loadedKeys.includes(parent.value)) {
          this.loadedKeys.push(parent.value);
        }
        if (base["default"].isNotEmptyArray(parent.children)) {
          parent.children.splice(0, parent.children.length);
        }
        for (const node of nodes) {
          if (!parent.children.some(every => every.value === node[this.replaceFields.key])) {
            parent.children.push(node);
          }
        }
        if (base["default"].isNotEmptyArray(parent.children)) {
          parent.isLeaf = false;
          const isLeafedNode = parent.isLeaf === true;
          const isLoadedNode = this.loadedKeys.includes(parent.value);
          const isAsyncNode = !isLeafedNode && base["default"].isFunction(this.loadData);
          isAsyncNode && !isLoadedNode && this.loadedKeys.push(parent.value);
        }
      }

      // 提取变量
      const flatTreeNodes = this.flatTreeNodes;
      const childTreeNodes = this.childTreeNodes;
      const resultTreeNodes = this.compileTreeNodes(nodes, parent);

      // 储存所有节点
      if (base["default"].isNotEmptyObject(parent)) {
        flatTreeNodes.splice(0, flatTreeNodes.length, ...flatTreeNodes.filter(every => !childTreeNodes[parent.value].some(child => child.value === every.value)));
        flatTreeNodes.splice(flatTreeNodes.findIndex(every => every.value === parent.value) + 1, 0, ...resultTreeNodes);
      } else {
        flatTreeNodes.splice(0, 0, ...resultTreeNodes);
      }

      // 储存节点映射
      this.childTreeNodes = {};
      this.parentTreeNodes = {};
      for (const every of flatTreeNodes) {
        const value = every.value;
        let parent = every.parentNode;
        if (!this.parentTreeNodes[value]) {
          this.parentTreeNodes[value] = [];
        }
        if (!this.childTreeNodes[value]) {
          this.childTreeNodes[value] = [];
        }
        while (parent) {
          this.parentTreeNodes[value].unshift(parent);
          this.childTreeNodes[parent.value].push(every);
          parent = parent.parentNode;
        }
      }

      // 异步重置节点
      return Promise.resolve().then(() => {
        this.cleanNodeConfig();
      });
    },
    /**
     * @description 根据父节点追加子节点数据源
     * @param {Array <Node>} nodes
     * @param {Object <Node>} parent
     * @return {Promise}
     */
    appendTreeNodes(nodes, parent) {
      if (!base["default"].isNotEmptyArray(nodes)) {
        return Promise.resolve();
      }
      if (base["default"].isNotEmptyObject(parent) && !this.flatTreeNodes.some(every => every.value === parent.value)) {
        return Promise.resolve();
      }
      if (!base["default"].isNotEmptyObject(parent)) {
        for (const node of nodes) {
          if (!this.treeNodes.some(every => every.value === node[this.replaceFields.key])) {
            this.treeNodes.push(node);
          }
        }
      }
      if (base["default"].isNotEmptyObject(parent)) {
        parent = this.flatTreeNodes.find(every => every.value === parent.value);
        for (const node of nodes) {
          if (!parent.children.some(every => every.value === node[this.replaceFields.key])) {
            parent.children.push(node);
          }
        }
        if (base["default"].isNotEmptyArray(parent.children)) {
          if (!this.loadedKeys.includes(parent.value)) {
            this.loadedKeys.push(parent.value);
          }
          if (!this.expandedKeys.includes(parent.value)) {
            this.expandedKeys.push(parent.value);
          }
          parent.isLeaf = false;
        }
      }

      // 提取变量
      const flatTreeNodes = this.flatTreeNodes;
      const childTreeNodes = this.childTreeNodes;
      const resultTreeNodes = this.compileTreeNodes(nodes, parent);

      // 储存所有节点
      if (base["default"].isNotEmptyObject(parent)) {
        flatTreeNodes.splice(0, flatTreeNodes.length, ...flatTreeNodes.filter(every => !childTreeNodes[parent.value].some(child => child.value === every.value)));
        flatTreeNodes.splice(flatTreeNodes.findIndex(every => every.value === parent.value) + 1, 0, ...childTreeNodes[parent && parent.value], ...resultTreeNodes.filter(node => !childTreeNodes[parent.value].some(child => child.value === node.value)));
      } else {
        flatTreeNodes.splice(flatTreeNodes.length, 0, ...resultTreeNodes);
      }

      // 储存节点映射
      this.childTreeNodes = {};
      this.parentTreeNodes = {};
      for (const every of flatTreeNodes) {
        const value = every.value;
        let parent = every.parentNode;
        if (!this.parentTreeNodes[value]) {
          this.parentTreeNodes[value] = [];
        }
        if (!this.childTreeNodes[value]) {
          this.childTreeNodes[value] = [];
        }
        while (parent) {
          this.parentTreeNodes[value].unshift(parent);
          this.childTreeNodes[parent.value].push(every);
          parent = parent.parentNode;
        }
      }

      // 异步重置节点
      return Promise.resolve().then(() => {
        this.cleanNodeConfig();
      });
    },
    /**
     * @description 根据父节点移除子节点数据源
     * @param {Array <Node>} nodes
     * @param {Object <Node>} parent
     * @return {Promise}
     */
    removeTreeNodes(nodes, parent) {
      if (!base["default"].isNotEmptyArray(nodes)) {
        return Promise.resolve();
      }
      if (base["default"].isNotEmptyObject(parent) && !this.flatTreeNodes.some(every => every.value === parent.value)) {
        return Promise.resolve();
      }
      const flatTreeNodes = this.flatTreeNodes;
      const childTreeNodes = this.childTreeNodes;
      if (!base["default"].isNotEmptyObject(parent)) {
        for (const node of nodes) {
          if (flatTreeNodes.some(every => every.value === node.value)) {
            const current = flatTreeNodes.find(every => every.value === node.value);
            const parent = current.parentNode || {
              children: this.treeNodes
            };
            if (parent.children.some(every => every.value === node.value)) {
              parent.children.splice(parent.children.findIndex(every => every.value === node.value), 1);
              flatTreeNodes.splice(0, flatTreeNodes.length, ...flatTreeNodes.filter(every => every.value !== node.value).filter(every => !childTreeNodes[node.value].some(child => child.value === every.value)));
            }
          }
        }
      }
      if (base["default"].isNotEmptyObject(parent)) {
        parent = flatTreeNodes.find(every => every.value === parent.value);
        for (const node of nodes) {
          if (parent.children.some(every => every.value === node.value)) {
            parent.children.splice(parent.children.findIndex(every => every.value === node.value), 1);
            flatTreeNodes.splice(0, flatTreeNodes.length, ...flatTreeNodes.filter(every => every.value !== node.value).filter(every => !childTreeNodes[node.value].some(child => child.value === every.value)));
          }
        }
      }

      // 储存节点映射
      this.childTreeNodes = {};
      this.parentTreeNodes = {};
      for (const every of flatTreeNodes) {
        const value = every.value;
        let parent = every.parentNode;
        if (!this.parentTreeNodes[value]) {
          this.parentTreeNodes[value] = [];
        }
        if (!this.childTreeNodes[value]) {
          this.childTreeNodes[value] = [];
        }
        while (parent) {
          this.parentTreeNodes[value].unshift(parent);
          this.childTreeNodes[parent.value].push(every);
          parent = parent.parentNode;
        }
      }

      // 异步重置节点
      return Promise.resolve().then(() => {
        this.cleanNodeConfig();
      });
    },
    /**
     * @description 根据父节点初始化节点配置
     * @param {Array <Node>} nodes
     * @param {Object <Node>} parent
     * @return {Array <Node>}
     */
    compileTreeNodes(nodes, parent) {
      const currentNodes = [];
      const currentParent = parent || null;
      const currentLevel = parent ? parent.level + 1 : 1;
      if (!base["default"].isNotEmptyArray(nodes)) {
        return currentNodes;
      }

      // 遍历 node
      for (const item of nodes) {
        // 储存原始数据
        item.original = JSON.parse(JSON.stringify(item));

        // 字段映射
        if (currentLevel > 0) {
          item.children = item[this.replaceFields.children] || [];
          item.label = item[this.replaceFields.title] || '';
          item.value = item[this.replaceFields.key] || '';
        }

        // 初始化数据
        const iconChild = {
          icon: 'treeIconChild'
        };
        const iconManage = {
          icon: 'treeIconRoot'
        };
        const titleChild = {
          title: 'treeTitleChild',
          switcherIcon: 'switcherIcon'
        };
        const titleManage = {
          title: 'treeTitleRoot',
          switcherIcon: 'switcherIcon'
        };
        const currentSlots = currentLevel === 1 ? iconManage : iconChild;
        const currentScopedSlots = currentLevel === 1 ? titleManage : titleChild;
        item.scopedSlots = currentScopedSlots;
        item.parentNode = currentParent;
        item.isLeaf = item.isLeaf === true;
        item.slots = currentSlots;
        item.level = currentLevel;

        // selectable
        item.selectable = base["default"].isFunction(this.allowSelectedLevel) ? !!this.allowSelectedLevel(item) : item.level >= this.allowSelectedLevel;

        // checkable
        item.checkable = base["default"].isFunction(this.allowCheckedLevel) ? !!this.allowCheckedLevel(item) : item.level >= this.allowCheckedLevel;

        // 添加当前节点
        currentNodes.push(item);

        // 遍历子节点
        if (item.children) {
          currentNodes.push(...this.compileTreeNodes(item.children, item));
        }

        // 容错处理
        if (!item.children) {
          item.children = [];
        }
      }
      return currentNodes;
    },
    /**
     * @description 根据节点key 进行收缩
     * @param {Array <String>} expandedKey
     * @return {undefined}
     */
    collapseTreeNodes(expandedKeys) {
      if (base["default"].isNotEmptyArray(expandedKeys)) {
        for (const value of expandedKeys) {
          const findNode = node => value === node.value;
          const selectedNode = this.flatTreeNodes.find(findNode);
          if (this.expandedKeys.includes(value)) {
            const find = key => key === value;
            const index = this.expandedKeys.findIndex(find);
            this.expandedKeys.splice(index, 1);
            if (this.allowAutoCollapsed) {
              if (base["default"].isNotEmptyArray(this.expandedKeys) && base["default"].isNotEmptyObject(selectedNode)) {
                for (const node of this.childTreeNodes[selectedNode.value]) {
                  if (this.expandedKeys.includes(node.value)) {
                    const find = key => key === node.value;
                    const index = this.expandedKeys.findIndex(find);
                    this.expandedKeys.splice(index, 1);
                  }
                }
              }
            }
          }
        }
      }
      if (base["default"].isNotEmptyArray(this.expandedKeys)) {
        this.expandedKeys.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a) - this.flatTreeNodes.findIndex(node => node.value === b));
      }
    },
    /**
     * @description 根据节点key 进行展开
     * @param {Array <String>} expandedKey
     * @return {undefined}
     */
    expandTreeNodes(expandedKeys) {
      if (base["default"].isNotEmptyArray(expandedKeys)) {
        for (const expandedKey of expandedKeys) {
          const findNode = node => expandedKey === node.value;
          const selectedNode = this.flatTreeNodes.find(findNode);
          const isLeafedNode = !selectedNode || selectedNode.isLeaf === true;
          const isAsyncNode = !isLeafedNode && base["default"].isFunction(this.loadData);
          const isLoadedNode = this.loadedKeys.includes(expandedKey);
          if (selectedNode && (base["default"].isNotEmptyArray(selectedNode.children) || isAsyncNode && !isLoadedNode)) {
            if (!this.expandedKeys.includes(selectedNode.value)) {
              this.expandedKeys.push(selectedNode.value);
            }
            if (this.allowAutoExpanded) {
              let onlyOneChild = selectedNode.children.length === 1;
              let firstChildNode = selectedNode.children[0];
              while (onlyOneChild && base["default"].isNotEmptyObject(firstChildNode) && base["default"].isNotEmptyArray(firstChildNode.children) && !expandedKeys.includes(firstChildNode.value)) {
                if (!this.expandedKeys.includes(firstChildNode.value)) {
                  this.expandedKeys.push(firstChildNode.value);
                }
                onlyOneChild = firstChildNode.children.length === 1;
                firstChildNode = onlyOneChild && firstChildNode.children[0];
              }
            }
          }
        }
      }
      if (base["default"].isNotEmptyArray(this.expandedKeys)) {
        this.expandedKeys.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a) - this.flatTreeNodes.findIndex(node => node.value === b));
        if (base["default"].isFunction(this.loadData)) {
          this.doTreeLoad(this.expandedKeys.filter(value => !this.loadKeys.includes(value) && !this.loadedKeys.includes(value) && this.flatTreeNodes.find(node => node.value === value).isLeaf !== true));
        }
      }
    },
    /**
     * @description 展开所有树节点
     * @param {Array <String>} expandedKey
     * @return {undefined}
     */
    doTreeAllCollapse(expandedKeys) {
      if (this.treeNodes.length <= 1 && base["default"].isNotEmptyArray(this.flatTreeNodes)) {
        this.expandedKeys.splice(0, this.expandedKeys.length, this.flatTreeNodes[0].value);
      }
      if (this.treeNodes.length > 1) {
        this.expandedKeys.splice(0, this.expandedKeys.length);
      }
    },
    /**
     * @description 收缩所有树节点
     * @param {Array <String>} expandedKey
     * @return {undefined}
     */
    doTreeAllExpand(expandedKeys) {
      this.expandedKeys.splice(0, this.expandedKeys.length, ...this.flatTreeNodes.filter(every => base["default"].isNotEmptyArray(every.children)).map(every => every.value));
    },
    /**
     * @description 展开指定节点key的树节点
     * @param {Array <String>} expandedKey
     * @return {undefined}
     */
    doTreeExpand(expandedKeys) {
      if (!base["default"].isArray(expandedKeys)) {
        return;
      }
      const delExpandedNodes = this.flatTreeNodes.filter(every => {
        return this.expandedKeys.some(value => every.value === value) && !expandedKeys.some(value => every.value === value);
      });
      const addExpandedNodes = this.flatTreeNodes.filter(every => {
        return !this.expandedKeys.some(value => every.value === value) && expandedKeys.some(value => every.value === value);
      });
      const delExpandedKeys = delExpandedNodes.map(node => node.value);
      const addExpandedKeys = addExpandedNodes.map(node => node.value);
      if (base["default"].isNotEmptyArray(delExpandedNodes)) {
        this.collapseTreeNodes(delExpandedKeys);
      }
      if (base["default"].isNotEmptyArray(addExpandedNodes)) {
        if (!this.allowMultiExpanded) {
          // 折叠
          if (base["default"].isNotEmptyArray(this.expandedKeys)) {
            this.collapseTreeNodes([...this.expandedKeys]);
          }

          // 排序
          addExpandedKeys.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a) - this.flatTreeNodes.findIndex(node => node.value === b));

          // 展开
          const expandKeys = [];
          const firstValue = addExpandedKeys[0];
          const firstNode = this.flatTreeNodes.find(node => node.value === firstValue);
          const isLeafedNode = !firstNode || firstNode.isLeaf === true;
          const isAsyncNode = !isLeafedNode && base["default"].isFunction(this.loadData);
          const isLoadedNode = this.loadedKeys.includes(firstValue);
          const parents = this.parentTreeNodes[firstValue];
          const childs = this.childTreeNodes[firstValue];
          if (base["default"].isNotEmptyArray(parents)) {
            expandKeys.push(...parents.map(node => node.value));
          }
          if (base["default"].isNotEmptyArray(childs) || isAsyncNode && !isLoadedNode) {
            expandKeys.push(firstValue);
            expandKeys.push(...childs.filter(child => addExpandedKeys.includes(child.value)).filter(child => base["default"].isNotEmptyArray(child.children)).map(node => node.value));
          }
          this.expandTreeNodes(expandKeys);
        }
        if (this.allowMultiExpanded) {
          const expandKeys = [];
          for (const value of addExpandedKeys) {
            const firstNode = this.flatTreeNodes.find(node => node.value === value);
            const isLeafedNode = !firstNode || firstNode.isLeaf === true;
            const isAsyncNode = !isLeafedNode && base["default"].isFunction(this.loadData);
            const isLoadedNode = this.loadedKeys.includes(value);
            const parents = this.parentTreeNodes[value];
            const childs = this.childTreeNodes[value];
            if (base["default"].isNotEmptyArray(parents)) {
              expandKeys.push(...parents.filter(node => !expandKeys.includes(node.value)).map(node => node.value));
            }
            if (base["default"].isNotEmptyArray(childs) || isAsyncNode && !isLoadedNode) {
              if (!expandKeys.includes(value)) {
                expandKeys.push(value);
              }
              expandKeys.push(...childs.filter(child => addExpandedKeys.includes(child.value)).filter(child => !expandKeys.includes(child.value)).filter(child => base["default"].isNotEmptyArray(child.children)).map(node => node.value));
            }
          }
          expandKeys.sort((a, b) => this.flatTreeNodes.findIndex(node => node.value === a) - this.flatTreeNodes.findIndex(node => node.value === b));
          this.expandTreeNodes(expandKeys);
        }
      }
      this.$emit('expand', {
        loadKeys: [...this.loadKeys],
        loadedKeys: [...this.loadedKeys],
        expandedKeys: [...this.expandedKeys],
        selectedNode: {
          ...this.selectedNode
        },
        selectedKeys: [...this.selectedKeys],
        selectedNodes: [...this.selectedNodes],
        selectedLinkNode: {
          ...this.selectedLinkNode
        },
        selectedLinkKeys: [...this.selectedLinkKeys],
        selectedLinkNodes: [...this.selectedLinkNodes],
        checkedNode: {
          ...this.checkedNode
        },
        checkedKeys: [...this.checkedKeys],
        checkedNodes: [...this.checkedNodes],
        checkedHalfNode: {
          ...this.checkedHalfNode
        },
        checkedHalfKeys: [...this.checkedHalfKeys],
        checkedHalfNodes: [...this.checkedHalfNodes],
        checkedLinkNode: {
          ...this.checkedLinkNode
        },
        checkedLinkKeys: [...this.checkedLinkKeys],
        checkedLinkNodes: [...this.checkedLinkNodes],
        flatTreeNodes: [...this.flatTreeNodes],
        childTreeNodes: {
          ...this.childTreeNodes
        },
        parentTreeNodes: {
          ...this.parentTreeNodes
        }
      });
    },
    /**
     * @description 根据指定节点key selected
     * @param {Array <String>} selectedKeys
     * @return {undefined}
     */
    doTreeSelect(selectedKeys) {
      if (!this.selectable) {
        if (base["default"].isNotEmptyArray(selectedKeys)) {
          if (!this.allowSelectToCheck) {
            const findNode = node => selectedKeys.includes(node.value);
            const firstNode = this.flatTreeNodes.find(findNode);
            const firstValue = firstNode.value;
            this.expandedKeys.includes(firstValue) ? this.allowAutoCollapsed && this.doTreeExpand(this.expandedKeys.filter(key => key !== firstValue)) : this.allowAutoExpanded && this.doTreeExpand([...this.expandedKeys, firstValue]);
          }
          if (this.allowSelectToCheck) {
            const findNode = node => selectedKeys.includes(node.value);
            const firstNode = this.flatTreeNodes.find(findNode);
            const firstValue = firstNode.value;
            this.checkedKeys.includes(firstValue) ? this.doTreeCheck(this.checkedKeys.filter(value => {
              const parents = this.parentTreeNodes[firstValue].map(parent => parent.value);
              const children = this.childTreeNodes[firstValue].map(child => child.value);
              return value !== firstValue && !parents.includes(value) && !children.includes(value);
            })) : this.doTreeCheck([firstValue, ...this.checkedKeys, ...this.childTreeNodes[firstValue].map(child => child.value)]);
          }
        }
        return;
      }
      const allowUnSelected = !!this.allowUnSelected;
      const oldFirstSelectedNode = this.flatTreeNodes.find(node => this.selectedKeys.includes(node.value)) || {};
      const newFirstSelectedNode = this.flatTreeNodes.find(node => selectedKeys.includes(node.value)) || {};
      const isSomeSelectedNode = oldFirstSelectedNode.value === newFirstSelectedNode.value;
      if (base["default"].isNotEmptyObject(newFirstSelectedNode)) {
        !allowUnSelected || !isSomeSelectedNode ? this.selectedNodes.splice(0, this.selectedNodes.length, newFirstSelectedNode) : this.selectedNodes.splice(0, this.selectedNodes.length);
      }
      if (!base["default"].isNotEmptyObject(newFirstSelectedNode)) {
        !allowUnSelected && base["default"].isNotEmptyObject(oldFirstSelectedNode) ? this.selectedNodes.splice(0, this.selectedNodes.length, oldFirstSelectedNode) : this.selectedNodes.splice(0, this.selectedNodes.length);
      }
      const nowFirstSelectedNode = this.selectedNodes[0] || {};
      const nowSomeSelectedNode = oldFirstSelectedNode.value === nowFirstSelectedNode.value;
      if (base["default"].isNotEmptyArray(this.selectedNodes)) {
        const selectedNode = this.selectedNodes[0];
        const selectedValue = selectedNode.value;
        this.expandedKeys.includes(selectedValue) ? nowSomeSelectedNode && this.allowAutoCollapsed && this.doTreeExpand(this.expandedKeys.filter(key => key !== selectedValue)) : this.allowAutoExpanded && this.doTreeExpand([...this.expandedKeys, selectedValue]);
      }
      if (!base["default"].isNotEmptyArray(this.selectedNodes)) {
        if (base["default"].isNotEmptyObject(oldFirstSelectedNode) && this.allowAutoCollapsed) {
          this.doTreeExpand(this.expandedKeys.filter(key => key !== oldFirstSelectedNode.value));
        }
      }
      let delSelectedNodes = [];
      let addSelectedNodes = [];
      if (!nowSomeSelectedNode && base["default"].isNotEmptyObject(oldFirstSelectedNode)) {
        delSelectedNodes = !this.selectedNodes.includes(oldFirstSelectedNode) ? [oldFirstSelectedNode] : [];
      }
      if (!nowSomeSelectedNode && base["default"].isNotEmptyObject(newFirstSelectedNode)) {
        addSelectedNodes = this.selectedNodes.includes(newFirstSelectedNode) ? [newFirstSelectedNode] : [];
      }
      this.resetNodeConfig();
      this.$emit('select', {
        delSelectedNodes: [...delSelectedNodes],
        addSelectedNodes: [...addSelectedNodes],
        loadKeys: [...this.loadKeys],
        loadedKeys: [...this.loadedKeys],
        expandedKeys: [...this.expandedKeys],
        selectedNode: {
          ...this.selectedNode
        },
        selectedKeys: [...this.selectedKeys],
        selectedNodes: [...this.selectedNodes],
        selectedLinkNode: {
          ...this.selectedLinkNode
        },
        selectedLinkKeys: [...this.selectedLinkKeys],
        selectedLinkNodes: [...this.selectedLinkNodes],
        checkedNode: {
          ...this.checkedNode
        },
        checkedKeys: [...this.checkedKeys],
        checkedNodes: [...this.checkedNodes],
        checkedHalfNode: {
          ...this.checkedHalfNode
        },
        checkedHalfKeys: [...this.checkedHalfKeys],
        checkedHalfNodes: [...this.checkedHalfNodes],
        checkedLinkNode: {
          ...this.checkedLinkNode
        },
        checkedLinkKeys: [...this.checkedLinkKeys],
        checkedLinkNodes: [...this.checkedLinkNodes],
        flatTreeNodes: [...this.flatTreeNodes],
        childTreeNodes: {
          ...this.childTreeNodes
        },
        parentTreeNodes: {
          ...this.parentTreeNodes
        }
      });
    },
    /**
     * @description 根据指定节点key checked
     * @param {Array <String>} selectedKeys
     * @return {undefined}
     */
    doTreeCheck(checkedKeys) {
      if (!this.checkable) {
        return;
      }
      const delCheckedNodes = this.flatTreeNodes.filter(every => {
        return this.checkedNodes.some(node => every.value === node.value) && !checkedKeys.some(value => every.value === value);
      });
      const addCheckedNodes = this.flatTreeNodes.filter(every => {
        return !this.checkedNodes.some(node => every.value === node.value) && checkedKeys.some(value => every.value === value);
      });
      if (base["default"].isNotEmptyArray(delCheckedNodes)) {
        this.checkedNodes.splice(0, this.checkedNodes.length, ...this.checkedNodes.filter(node => !delCheckedNodes.some(del => node.value === del.value)));
      }
      if (base["default"].isNotEmptyArray(addCheckedNodes)) {
        this.checkedNodes.push(...addCheckedNodes);
      }
      this.resetNodeConfig();
      this.$emit('check', {
        delCheckedNodes: [...delCheckedNodes],
        addCheckedNodes: [...addCheckedNodes],
        loadKeys: [...this.loadKeys],
        loadedKeys: [...this.loadedKeys],
        expandedKeys: [...this.expandedKeys],
        selectedNode: {
          ...this.selectedNode
        },
        selectedKeys: [...this.selectedKeys],
        selectedNodes: [...this.selectedNodes],
        selectedLinkNode: {
          ...this.selectedLinkNode
        },
        selectedLinkKeys: [...this.selectedLinkKeys],
        selectedLinkNodes: [...this.selectedLinkNodes],
        checkedNode: {
          ...this.checkedNode
        },
        checkedKeys: [...this.checkedKeys],
        checkedNodes: [...this.checkedNodes],
        checkedHalfNode: {
          ...this.checkedHalfNode
        },
        checkedHalfKeys: [...this.checkedHalfKeys],
        checkedHalfNodes: [...this.checkedHalfNodes],
        checkedLinkNode: {
          ...this.checkedLinkNode
        },
        checkedLinkKeys: [...this.checkedLinkKeys],
        checkedLinkNodes: [...this.checkedLinkNodes],
        flatTreeNodes: [...this.flatTreeNodes],
        childTreeNodes: {
          ...this.childTreeNodes
        },
        parentTreeNodes: {
          ...this.parentTreeNodes
        }
      });
    },
    /**
     * @description 根据指定节点key 加载
     * @param {Array <String>} loadKeys
     * @return {Promise}
     */
    doTreeLoad(loadKeys) {
      const promises = [];
      if (base["default"].isNotEmptyArray(loadKeys)) {
        for (const loadKey of loadKeys) {
          // 加载中
          if (!this.loadKeys.includes(loadKey) && !this.loadedKeys.includes(loadKey)) {
            this.loadKeys.push(loadKey);
          }

          // 提取
          const filter = value => value !== loadKey;
          const findNode = every => every.value === loadKey;
          const loadNode = this.flatTreeNodes.find(findNode);

          // 回调
          const doSuccess = () => {
            if (this.loadKeys.includes(loadKey)) {
              const length = this.loadKeys.length;
              const filters = this.loadKeys.filter(filter);
              this.loadKeys.splice(0, length, ...filters);
            }
            if (!this.loadedKeys.includes(loadKey)) {
              this.loadedKeys.push(loadKey);
            }
          };
          const doError = () => {
            if (this.loadKeys.includes(loadKey)) {
              const length = this.loadKeys.length;
              const filters = this.loadKeys.filter(filter);
              this.loadKeys.splice(0, length, ...filters);
            }
            if (this.expandedKeys.includes(loadKey)) {
              this.expandedKeys.splice(0, this.expandedKeys.length, ...this.expandedKeys.filter(filter));
            }
          };

          // 处理
          promises.push(Promise.resolve(this.loadData(loadNode)).then(nodes => {
            if (base["default"].isNotEmptyArray(nodes) && this.flatTreeNodes.some(findNode)) {
              if (this.allowAutoExpanded) {
                Promise.resolve().then(() => {
                  this.doTreeExpand([loadNode.value, ...this.expandedKeys, ...nodes.filter(node => nodes.length === 1 && node.isLeaf !== true && base["default"].isFunction(this.loadData)).map(node => node.value)]);
                });
              }
              this.reloadTreeNodes(nodes, this.flatTreeNodes.find(findNode));
            }
            this.loadKeys.length <= 1 ? setTimeout(doSuccess, 300) : doSuccess();
          }).catch(() => {
            this.$message.error({
              content: '加载失败，请重试!',
              onClose: doError,
              duration: 0.3
            });
          }));
        }
      }
      return Promise.all(promises);
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
  return _c("section", {
    staticClass: "s-tree-container"
  }, [_c("a-spin", {
    attrs: {
      spinning: _vm.loading
    }
  }, [_c("a-tree", {
    attrs: {
      treeData: _vm.treeNodes,
      replaceFields: _vm.replaceFields,
      expandedKeys: _vm.expandedKeys,
      selectedKeys: _vm.selectedKeys,
      checkedKeys: _vm.checkedKeys,
      selectable: _vm.selectable,
      checkable: _vm.checkable,
      disabled: _vm.disabled,
      showIcon: _vm.showIcon,
      showLine: _vm.showLine
    },
    on: {
      expand: _vm.doTreeExpand,
      select: _vm.doTreeSelect,
      check: _vm.doTreeCheck
    },
    scopedSlots: _vm._u([{
      key: "switcherIcon",
      fn: function (item) {
        return [_vm.renderSwitcher(item) ? _c("a-icon", {
          class: {
            "ant-tree-switcher-icon": _vm.renderSwitcher(item) === "caret-down"
          },
          staticStyle: {
            cursor: "pointer"
          },
          attrs: {
            type: _vm.renderSwitcher(item)
          },
          on: {
            click: function ($event) {
              $event.stopPropagation();
              return _vm.triggerSwitcher(item);
            }
          }
        }) : _vm._e()];
      }
    }, {
      key: "treeIconRoot",
      fn: function () {
        return [_vm._t("iconRoot", function () {
          return [_c("a-icon", {
            attrs: {
              type: "appstore"
            }
          })];
        })];
      },
      proxy: true
    }, {
      key: "treeIconChild",
      fn: function () {
        return [_vm._t("iconChild", function () {
          return [_c("a-icon", {
            attrs: {
              type: "apartment"
            }
          })];
        })];
      },
      proxy: true
    }, {
      key: "treeTitleRoot",
      fn: function (item) {
        return [_vm._t("titleRoot", function () {
          return [_c("div", {
            staticClass: "s-tree-title-container"
          }, [_vm._t("titleRootLabel", function () {
            return [_c("span", {
              staticClass: "s-tree-title-label"
            }, [_c("s-ellipsis", {
              attrs: {
                length: _vm.tooltip || 0,
                tooltip: _vm.tooltip > -1
              }
            }, [_vm._v("\n                  " + _vm._s(item.label) + "\n                ")])], 1)];
          }, {
            level: item.level,
            label: item.label,
            value: item.value,
            isLeaf: item.isLeaf,
            checked: item.checked,
            selected: item.selected,
            expanded: item.expanded,
            checkable: item.checkable,
            selectable: item.selectable,
            parentNode: item.parentNode,
            original: item.original,
            children: item.children,
            loading: item.loading,
            loaded: item.loaded
          }), _vm._v(" "), _vm._t("titleRootButton", function () {
            return [_c("span", {
              staticClass: "s-tree-title-button"
            })];
          }, {
            level: item.level,
            label: item.label,
            value: item.value,
            isLeaf: item.isLeaf,
            checked: item.checked,
            selected: item.selected,
            expanded: item.expanded,
            checkable: item.checkable,
            selectable: item.selectable,
            parentNode: item.parentNode,
            original: item.original,
            children: item.children,
            loading: item.loading,
            loaded: item.loaded
          })], 2)];
        }, {
          level: item.level,
          label: item.label,
          value: item.value,
          isLeaf: item.isLeaf,
          checked: item.checked,
          selected: item.selected,
          expanded: item.expanded,
          checkable: item.checkable,
          selectable: item.selectable,
          parentNode: item.parentNode,
          original: item.original,
          children: item.children,
          loading: item.loading,
          loaded: item.loaded
        })];
      }
    }, {
      key: "treeTitleChild",
      fn: function (item) {
        return [_vm._t("titleChild", function () {
          return [_c("div", {
            staticClass: "s-tree-title-container"
          }, [_vm._t("titleChildLabel", function () {
            return [_c("span", {
              staticClass: "s-tree-title-label"
            }, [_c("s-ellipsis", {
              attrs: {
                length: _vm.tooltip ? _vm.tooltip - item.level * 2 : 0,
                tooltip: _vm.tooltip > -1
              }
            }, [_vm._v("\n                  " + _vm._s(item.label) + "\n                ")])], 1)];
          }, {
            level: item.level,
            label: item.label,
            value: item.value,
            isLeaf: item.isLeaf,
            checked: item.checked,
            selected: item.selected,
            expanded: item.expanded,
            checkable: item.checkable,
            selectable: item.selectable,
            parentNode: item.parentNode,
            original: item.original,
            children: item.children,
            loading: item.loading,
            loaded: item.loaded
          }), _vm._v(" "), _vm._t("titleChildButton", function () {
            return [_c("span", {
              staticClass: "s-tree-title-button"
            })];
          }, {
            level: item.level,
            label: item.label,
            value: item.value,
            isLeaf: item.isLeaf,
            checked: item.checked,
            selected: item.selected,
            expanded: item.expanded,
            checkable: item.checkable,
            selectable: item.selectable,
            parentNode: item.parentNode,
            original: item.original,
            children: item.children,
            loading: item.loading,
            loaded: item.loaded
          })], 2)];
        }, {
          item: item,
          level: item.level,
          label: item.label,
          value: item.value,
          isLeaf: item.isLeaf,
          checked: item.checked,
          selected: item.selected,
          expanded: item.expanded,
          checkable: item.checkable,
          selectable: item.selectable,
          parentNode: item.parentNode,
          original: item.original,
          children: item.children,
          loading: item.loading,
          loaded: item.loaded
        })];
      }
    }], null, true)
  })], 1)], 1);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-1f153e34_0", {
    source: ".s-tree-container[data-v-1f153e34] {\n  width: calc(100% - 48px);\n  height: calc(100% - 48px);\n  position: absolute;\n  top: 24px;\n  left: 24px;\n}\n.s-tree-container[data-v-1f153e34] .ant-spin-nested-loading,\n.s-tree-container[data-v-1f153e34] .ant-spin-container {\n  width: 100%;\n  height: 100%;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li {\n  position: relative;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-checkbox {\n  margin: 0 0 0 3px;\n  vertical-align: top;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-switcher.ant-tree-switcher-noop {\n  width: 15px;\n  vertical-align: top;\n  display: inline-block;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-checkbox + .ant-tree-node-content-wrapper {\n  width: calc(100% - 44px);\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper {\n  width: calc(100% - 24px);\n  display: inline-flex;\n  height: 24px;\n  margin: 0 3px;\n  padding: 0 3px;\n  line-height: 24px;\n  vertical-align: top;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title {\n  width: 100%;\n  display: inline-block;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container {\n  display: flex;\n  width: 100%;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-label {\n  flex: 1 1 auto;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button {\n  display: none;\n  flex: 0 0 auto;\n  margin: 0;\n  padding: 0;\n  font-size: 15px;\n  line-height: 20px;\n  right: 5px;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button.always-show {\n  display: block;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button > button:not(.ant-btn-background-ghost),\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button > .ant-btn:not(.ant-btn-background-ghost) {\n  border: none;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-switcher {\n  width: 15px;\n  vertical-align: top;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span.ant-tree-iconEle {\n  width: 20px;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree li span:hover .ant-tree-title .s-tree-title-container .s-tree-title-button {\n  display: block;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree:only-of-type {\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree:only-of-type > li:only-of-type {\n  height: 100%;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree:only-of-type > li:only-of-type > ul:only-of-type {\n  width: 100%;\n  height: calc(100% - 28px);\n  margin-top: 4px;\n  overflow: auto;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree:only-of-type > li:only-of-type > ul:only-of-type > li:first-child {\n  padding-top: 3px;\n}\n.s-tree-container[data-v-1f153e34] .ant-tree.ant-tree-show-line li:not(:last-child)::before {\n  position: absolute;\n  left: 7px;\n  width: 1px;\n  height: calc(100% - 22px);\n  margin: 22px 0 0;\n  border-left: 1px solid #d9d9d9;\n  content: '';\n}\n",
    map: {
      "version": 3,
      "sources": ["index.vue"],
      "names": [],
      "mappings": "AAAA;EACE,wBAAwB;EACxB,yBAAyB;EACzB,kBAAkB;EAClB,SAAS;EACT,UAAU;AACZ;AACA;;EAEE,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;AACpB;AACA;EACE,iBAAiB;EACjB,mBAAmB;AACrB;AACA;EACE,WAAW;EACX,mBAAmB;EACnB,qBAAqB;AACvB;AACA;EACE,wBAAwB;AAC1B;AACA;EACE,wBAAwB;EACxB,oBAAoB;EACpB,YAAY;EACZ,aAAa;EACb,cAAc;EACd,iBAAiB;EACjB,mBAAmB;AACrB;AACA;EACE,WAAW;EACX,qBAAqB;EACrB,mBAAmB;EACnB,uBAAuB;EACvB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,WAAW;AACb;AACA;EACE,cAAc;EACd,uBAAuB;EACvB,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,cAAc;EACd,SAAS;EACT,UAAU;EACV,eAAe;EACf,iBAAiB;EACjB,UAAU;AACZ;AACA;EACE,cAAc;AAChB;AACA;;EAEE,YAAY;AACd;AACA;EACE,WAAW;EACX,mBAAmB;AACrB;AACA;EACE,WAAW;AACb;AACA;EACE,cAAc;AAChB;AACA;EACE,WAAW;EACX,YAAY;EACZ,cAAc;AAChB;AACA;EACE,YAAY;EACZ,cAAc;EACd,iBAAiB;AACnB;AACA;EACE,WAAW;EACX,yBAAyB;EACzB,eAAe;EACf,cAAc;AAChB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,UAAU;EACV,yBAAyB;EACzB,gBAAgB;EAChB,8BAA8B;EAC9B,WAAW;AACb",
      "file": "index.vue",
      "sourcesContent": [".s-tree-container::v-deep {\n  width: calc(100% - 48px);\n  height: calc(100% - 48px);\n  position: absolute;\n  top: 24px;\n  left: 24px;\n}\n.s-tree-container::v-deep .ant-spin-nested-loading,\n.s-tree-container::v-deep .ant-spin-container {\n  width: 100%;\n  height: 100%;\n}\n.s-tree-container::v-deep .ant-tree li {\n  position: relative;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-checkbox {\n  margin: 0 0 0 3px;\n  vertical-align: top;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-switcher.ant-tree-switcher-noop {\n  width: 15px;\n  vertical-align: top;\n  display: inline-block;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-checkbox + .ant-tree-node-content-wrapper {\n  width: calc(100% - 44px);\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper {\n  width: calc(100% - 24px);\n  display: inline-flex;\n  height: 24px;\n  margin: 0 3px;\n  padding: 0 3px;\n  line-height: 24px;\n  vertical-align: top;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title {\n  width: 100%;\n  display: inline-block;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container {\n  display: flex;\n  width: 100%;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-label {\n  flex: 1 1 auto;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button {\n  display: none;\n  flex: 0 0 auto;\n  margin: 0;\n  padding: 0;\n  font-size: 15px;\n  line-height: 20px;\n  right: 5px;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button.always-show {\n  display: block;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button > button:not(.ant-btn-background-ghost),\n.s-tree-container::v-deep .ant-tree li span.ant-tree-node-content-wrapper .ant-tree-title .s-tree-title-container .s-tree-title-button > .ant-btn:not(.ant-btn-background-ghost) {\n  border: none;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-switcher {\n  width: 15px;\n  vertical-align: top;\n}\n.s-tree-container::v-deep .ant-tree li span.ant-tree-iconEle {\n  width: 20px;\n}\n.s-tree-container::v-deep .ant-tree li span:hover .ant-tree-title .s-tree-title-container .s-tree-title-button {\n  display: block;\n}\n.s-tree-container::v-deep .ant-tree:only-of-type {\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n}\n.s-tree-container::v-deep .ant-tree:only-of-type > li:only-of-type {\n  height: 100%;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.s-tree-container::v-deep .ant-tree:only-of-type > li:only-of-type > ul:only-of-type {\n  width: 100%;\n  height: calc(100% - 28px);\n  margin-top: 4px;\n  overflow: auto;\n}\n.s-tree-container::v-deep .ant-tree:only-of-type > li:only-of-type > ul:only-of-type > li:first-child {\n  padding-top: 3px;\n}\n.s-tree-container::v-deep .ant-tree.ant-tree-show-line li:not(:last-child)::before {\n  position: absolute;\n  left: 7px;\n  width: 1px;\n  height: calc(100% - 22px);\n  margin: 22px 0 0;\n  border-left: 1px solid #d9d9d9;\n  content: '';\n}\n"]
    },
    media: undefined
  });
};
/* scoped */
const __vue_scope_id__ = "data-v-1f153e34";
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
