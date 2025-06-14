/**
 * 将平铺的列表数据转换为树形结构（迭代实现），并支持排序功能。
 * 使用配置对象作为参数，提高可读性和维护性。
 * @param {Object} config - 配置对象
 * @param {Array} config.list - 平铺的列表数据（如菜单、部门等具有父子关系的数组）。
 * @param {string} [config.idKey="id"] - 节点唯一标识的键名（如 "id"）。
 * @param {string} [config.parentIdKey="parentId"] - 父节点唯一标识的键名（如 "parentId"）。
 * @param {string} [config.childrenKey="children"] - 子节点列表的键名（用于存储子节点数组）。
 * @param {Array<Object>} [config.sortBys=[]] - 排序规则数组。每个对象包含 { key: string, order: "asc" | "desc" }。
 * - key: 用于排序的字段名。
 * - order: 排序方向，"asc" 为升序 (默认)，"desc" 为降序。
 * 例如: [{ key: "sortOrder", order: "asc" }, { key: "name", order: "desc" }]
 * @returns {Array} 转换后的树形结构数组（根节点的集合）。
 */
export function listToTreeIterative({
  list,
  idKey = "id",
  parentIdKey = "parentId",
  childrenKey = "children",
  sortBys = [],
}) {
  // 处理空列表情况：若输入列表为空或不存在，直接返回空数组
  if (!list || list.length === 0) {
    return [];
  }

  // 步骤1：构建查找表（ID到节点的映射）
  // 同时为每个节点初始化一个空的子节点列表（避免修改原始数据）
  const nodeMap = new Map();
  list.forEach((item) => {
    // 创建节点副本，防止修改原始数据
    // 并为每个节点添加一个空的 children 数组（键名由 childrenKey 指定）
    const newItem = { ...item, [childrenKey]: [] };
    nodeMap.set(newItem[idKey], newItem);
  });

  // 步骤2：构建树形结构
  const tree = [];
  nodeMap.forEach((node) => {
    const parentId = node[parentIdKey]; // 当前节点的父节点ID

    // 判断是否为根节点：父节点ID不存在 或 父节点不存在于查找表中
    if (parentId === null || parentId === 0 || !nodeMap.has(parentId)) {
      // 根节点直接添加到树结构中
      tree.push(node);
    } else {
      // 非根节点：找到父节点并添加到其 children 列表中
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        parentNode[childrenKey].push(node);
      }
    }
  });

  // 步骤3：对树进行排序（如果指定了排序规则）
  if (sortBys.length > 0) {
    // 递归排序函数
    const sortNodes = (nodes) => {
      if (!nodes || nodes.length === 0) {
        return;
      }

      nodes.sort((a, b) => {
        for (let i = 0; i < sortBys.length; i++) {
          const { key, order = "asc" } = sortBys[i];
          const valA = a[key];
          const valB = b[key];

          if (valA < valB) {
            return order === "asc" ? -1 : 1;
          }
          if (valA > valB) {
            return order === "asc" ? 1 : -1;
          }
        }
        return 0; // 如果所有排序字段都相等，则保持原有顺序
      });

      // 递归排序子节点
      nodes.forEach((node) => {
        if (node[childrenKey] && node[childrenKey].length > 0) {
          sortNodes(node[childrenKey]);
        }
      });
    };

    sortNodes(tree);
  }

  return tree;
}

/**
 * 根据条件筛选树形结构数据。
 *
 * @param {Array<Object>} tree - 原始树形结构数据。每个节点必须包含一个 'children' 数组（即使为空）。
 * @param {Function} conditionFn - 一个函数，接收一个节点作为参数，返回 true 表示该节点满足筛选条件，false 则不满足。
 * @returns {Array<Object>} 筛选后的新树形结构数据。
 */
export function filterTree(tree, conditionFn) {
  const newTree = [];

  for (const node of tree) {
    // 深度克隆节点以避免修改原始数据，但只克隆其自身属性，不克隆 children
    const newNode = { ...node };

    // 递归筛选子节点
    if (node.children && node.children.length > 0) {
      newNode.children = filterTree(node.children, conditionFn);
    } else {
      newNode.children = []; // 确保没有子节点时 children 属性依然存在且为空数组
    }

    // 如果当前节点满足条件，或者它的任何子节点被保留了（即 newNode.children 非空），则保留当前节点
    if (conditionFn(node) || newNode.children.length > 0) {
      newTree.push(newNode);
    }
  }

  return newTree;
}
