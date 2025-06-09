/**
 * 将平铺的列表数据转换为树形结构（迭代实现）
 * @param {Array} list - 平铺的列表数据（如菜单、部门等具有父子关系的数组）
 * @param {string} [idKey="id"] - 节点唯一标识的键名（如 "id"）
 * @param {string} [parentIdKey="parentId"] - 父节点唯一标识的键名（如 "parentId"）
 * @param {string} [childrenKey="children"] - 子节点列表的键名（用于存储子节点数组）
 * @returns {Array} 转换后的树形结构数组（根节点的集合）
 */
export function listToTreeIterative(list, idKey = "id", parentIdKey = "parentId", childrenKey = "children") {
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

  return tree;
}
