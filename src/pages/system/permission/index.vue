<template>
  <div>
    <t-card title="菜单管理" :bordered="false" :hover-shadow="true">
      <template #actions>
        <t-space>
          <t-button @click="handleAdd">
            <template #icon>
              <t-icon name="add"></t-icon>
            </template>
            新增菜单
          </t-button>
          <t-button theme="default" @click="refreshDictList">
            <template #icon><t-icon name="refresh" /></template>
            刷新
          </t-button>
        </t-space>
      </template>

      <t-enhanced-table
        max-height="700px"
        bordered
        disable-data-page
        hover
        table-layout="auto"
        table-content-width="2000px"
        :data="tableData"
        :columns="columns"
        :tree="treeConfig"
        size="small"
        row-key="id"
        @row-click="handleRowClick"
      >
        <template #operate="{ row }">
          <t-button theme="primary" size="small" @click="handleEdit(row)"> 编辑 </t-button>
          <t-button theme="success" size="small" @click="handleCurrentAdd(row)">新增</t-button>
          <t-popconfirm content="确认删除吗" @confirm="handleDelete(row)">
            <t-button theme="danger" size="small">删除</t-button>
          </t-popconfirm>
        </template>
      </t-enhanced-table>
    </t-card>
    <component
      :is="MenuFormDialogComponent"
      v-if="shouldLoadDialog"
      :visible="dialogVisible"
      :title="dialogTitle"
      :initial-data="currentEditData"
      :menu-tree="menuTree"
      @update:visible="dialogVisible = $event"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<script setup lang="jsx">
import { ref, onBeforeMount, defineAsyncComponent, shallowRef } from "vue";
import { getMenuData } from "@/api/menu.js";
import { listToTreeIterative, filterTree } from "@/utils/utils";
import { Tag, Icon, MessagePlugin } from "tdesign-vue-next";
import { cloneDeep } from "lodash-es";

// import  MenuFormDialogComponent from './components/form/MenuFormDialog.vue';

const columns = ref([
  {
    title: "菜单名称",
    colKey: "title",
    width: 220,
  },
  {
    title: "菜单类型",
    colKey: "type",
    width: 100,
    align: "center",
    cell(h, { row }) {
      const type = row.type;
      const typeMap = new Map([
        [1, "目录"],
        [2, "菜单"],
        [3, "按钮"],
      ]);
      const menuTypeColorArray = ["", "primary", "warning", "success"];
      return h(Tag, { theme: menuTypeColorArray[type], variant: "light-outline" }, () => typeMap.get(type));
    },
  },
  {
    title: "图标",
    colKey: "icon",
    width: 70,
    align: "center",
    cell(h, { row }) {
      return h(Icon, { name: row.icon });
    },
  },
  {
    title: "路由路径",
    colKey: "path",
    ellipsis: true,
  },
  {
    title: "路由名称",
    colKey: "name",
    ellipsis: true,
  },
  {
    title: "组件路径",
    colKey: "component",
    ellipsis: true,
    cell(h, { row }) {
      return h("span", null, row.redirect ? row.redirect : row.component);
    },
  },
  {
    title: "权限标识",
    colKey: "permission",
    ellipsis: true,
    cell(h, { row }) {
      return h("span", null, row.permission);
    },
  },
  {
    title: "排序",
    colKey: "sort",
    ellipsis: true,
  },
  {
    title: "是否隐藏",
    colKey: "hide",
    width: 80,
    cell(h, { row }) {
      return h(Tag, { theme: row.hide ? "danger" : "primary" }, () => (row.hide ? "是" : "否"));
    },
  },
  {
    title: "是否禁用",
    colKey: "disable",
    width: 80,
    cell(h, { row }) {
      return h(Tag, { theme: row.disable ? "danger" : "primary" }, () => (row.disable ? "是" : "否"));
    },
  },
  {
    title: "是否缓存",
    colKey: "keepAlive",
    width: 80,
    cell(h, { row }) {
      return h(Tag, { theme: row.keepAlive ? "danger" : "primary" }, () => (row.keepAlive ? "是" : "否"));
    },
  },
  {
    title: "是否外链",
    colKey: "isLink",
    width: 80,
    cell(h, { row }) {
      return h(Tag, { theme: row.isLink ? "danger" : "primary" }, () => (row.isLink ? "是" : "否"));
    },
  },
  {
    title: "操作",
    colKey: "operate",
    align: "center",
    width: 170,
    fixed: "right",
  },
]);

const tableData = ref([]);
const menuTree = ref([]);

onBeforeMount(async () => {
  await fetchMenuData();
});

const fetchMenuData = async () => {
  const list = await getMenuData();
  const transformedList = list.map((item) => ({
    id: item.id,
    parentId: item.parentId || "",
    path: item.path,
    name: item.name,
    component: item.component,
    redirect: item.redirect,
    title: item.meta?.title || "",
    hide: item.meta?.hide || false,
    disable: item.meta?.disable || false,
    keepAlive: item.meta?.keepAlive || true,
    affix: item.meta?.affix || false,
    isLink: item.meta?.link || false,
    link: item.meta?.link || "",
    iframe: item.meta?.iframe || false,
    permission: item.meta?.permission || "",
    svgIcon: item.meta?.svgIcon || "",
    icon: item.meta?.icon || "",
    sort: item.meta?.sort !== undefined ? item.meta.sort : 1,
    type: item.meta?.type || 1,
  }));

  tableData.value = listToTreeIterative({ list: transformedList, sortBys: [{ key: "sort", order: "asc" }] });
  menuTree.value = filterTree(tableData.value, (node) => node.type === 1 || node.type === 2);
};

const treeConfig = ref({
  checkStrictly: true,
  childrenKey: "children",
  treeNodeColumnIndex: 0,
  expandTreeNodeOnClick: true,
});

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref("新增菜单");
const currentEditData = ref({}); // 用于传递给子组件的初始数据

// 1. 声明一个 shallowRef 来存储异步加载的组件
const MenuFormDialogComponent = shallowRef(null);
// 2. 声明一个标志，控制是否加载组件
const shouldLoadDialog = ref(false);

// 辅助函数：判断节点是否有子节点
const hasChildren = (node) => {
  return node.children && node.children.length > 0;
};

// 辅助函数：递归查找并使用 splice 删除节点**
const removeNodeInTree = (tree, idToRemove) => {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (String(node.id) === String(idToRemove)) {
      tree.splice(i, 1); // 找到并删除
      return true; // 成功删除
    }
    if (node.children && node.children.length > 0) {
      if (removeNodeInTree(node.children, idToRemove)) {
        return true; // 子树中删除成功
      }
    }
  }
  return false; // 未找到
};

// 封装一个函数来加载并显示对话框
const showDialog = () => {
  if (!shouldLoadDialog.value) {
    // 首次将 shouldLoadDialog 设置为 true，并异步加载组件
    shouldLoadDialog.value = true;
    MenuFormDialogComponent.value = defineAsyncComponent(() => import("./components/form/MenuFormDialog.vue"));
  }
  dialogVisible.value = true;
};

// 新增菜单
const handleAdd = () => {
  dialogTitle.value = "新增菜单";
  currentEditData.value = {}; // 传递空对象表示新增
  showDialog(); // 调用封装的函数显示对话框
};

// 编辑菜单
const handleEdit = (row) => {
  dialogTitle.value = "修改菜单";
  currentEditData.value = cloneDeep(row); // 传递当前行数据给子组件
  showDialog(); // 调用封装的函数显示对话框
};

// 当前行新增子菜单
const handleCurrentAdd = (row) => {
  dialogTitle.value = `新增子菜单 (上级: ${row.title})`;
  // 预设parentId和type为菜单，其他沿用默认值
  currentEditData.value = {
    ...cloneDeep(row), // 克隆当前行数据作为基础
    id: null, // 清空ID，表示新增
    parentId: row.id, // 设置上级菜单为当前行的ID
    type: 2, // 默认新增子菜单类型为菜单
    // 清空其他可能不应该继承的字段，例如path, name, component, link, permission等，根据实际业务需求
    path: "",
    name: "",
    component: "",
    permission: "",
    link: "",
    svgIcon: "",
    icon: "",
    sort: 1,
  };
  showDialog(); // 调用封装的函数显示对话框
};

// 处理 MenuFormDialog 确认事件
const handleDialogConfirm = async (formDataSubmitted) => {
  // 这里可以对 formDataSubmitted 进行最终处理，例如调用后端 API

  if (formDataSubmitted.id) {
    MessagePlugin.success("菜单修改成功 (模拟)");
    // 模拟更新表格数据，注意这里接收的是扁平化后的数据
    updateTableData(tableData.value, formDataSubmitted);
  } else {
    MessagePlugin.success("菜单新增成功 (模拟)");
    // 模拟新增数据
    formDataSubmitted.id = Date.now(); // 简单生成一个ID
    addTableData(tableData.value, formDataSubmitted);
  }
  // dialogVisible 已经由子组件内部控制关闭，或通过 @update:visible 联动
};

// 处理 MenuFormDialog 取消事件
const handleDialogCancel = () => {
  // 可以在这里处理取消后的逻辑，例如清空父组件的临时数据
  // dialogVisible 已经由子组件内部控制关闭，或通过 @update:visible 联动
};

// 删除菜单
const handleDelete = (row) => {
  if (hasChildren(row)) {
    MessagePlugin.warning(`请先删除菜单 "${row.title}" 的所有子菜单！`);
    return;
  }

  // 因为 popconfirm 是异步的，它的确认会在点击后触发，
  // 所以这里仅仅是 handleDelete 的前置检查。
  // 实际删除逻辑会发生在 popconfirm 确认回调中（如果你在那里定义）。
  // 你的template中：<t-popconfirm content="确认删除吗" @confirm="handleDelete(row)">
  // 这个设计有点小问题，handleDelete 应该只负责删除逻辑，popconfirm 应该独立处理。
  // 为了让这里的校验生效，你需要修改模板中的 @confirm。

  // 假设你的 @confirm 内部已经确认，这里直接执行删除

  // **使用新的辅助函数，直接修改 tableData 和 menuTree**
  const deletedFromTable = removeNodeInTree(tableData.value, row.id);

  // const deletedFromMenuTree = removeNodeInTree(menuTree.value, row.id); // 同样操作menuTree
  if (deletedFromTable) {
    MessagePlugin.success(`菜单 "${row.title}" 删除成功 (模拟)`);
  } else {
    MessagePlugin.error(`菜单 "${row.title}" 未找到或删除失败！`);
  }
};

// 模拟更新表格数据
const updateTableData = (data, updatedItem) => {
  for (let i = 0; i < data.length; i++) {
    if (String(data[i].id) === String(updatedItem.id)) {
      Object.assign(data[i], updatedItem);
      return true;
    }
    if (data[i].children && data[i].children.length > 0) {
      if (updateTableData(data[i].children, updatedItem)) {
        return true;
      }
    }
  }
  return false;
};

// 模拟新增表格数据
const addTableData = (data, newItem) => {
  const itemToInsert = cloneDeep(newItem);
  if (itemToInsert.parentId) {
    const parentNode = findNodeById(data, itemToInsert.parentId);
    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(itemToInsert);
    } else {
      // If parent not found, add as a root level item.
      // This might happen if parentId refers to a node not currently in the tree
      // (e.g., filtered out or not yet loaded), which needs careful handling in real apps.
      data.push(itemToInsert);
    }
  } else {
    data.push(itemToInsert);
  }

  const currentFlatList = flattenTree(tableData.value);
  const uniqueItems = Array.from(new Map(currentFlatList.map((item) => [item.id, item])).values());
  tableData.value = listToTreeIterative({ list: uniqueItems, sortBys: [{ key: "sort", order: "asc" }] });
  menuTree.value = filterTree(tableData.value, (node) => node.type === 1 || node.type === 2);
};

// 辅助函数：将树形结构扁平化
const flattenTree = (tree) => {
  const flatList = [];
  const traverse = (nodes) => {
    nodes.forEach((node) => {
      flatList.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  traverse(tree);
  return flatList;
};

// 辅助函数：根据ID查找节点
const findNodeById = (tree, id) => {
  for (const node of tree) {
    if (String(node.id) === String(id)) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const handleRowClick = () => {};
</script>

<style scoped>
/* 可以在这里添加一些 scoped 样式 */
</style>
