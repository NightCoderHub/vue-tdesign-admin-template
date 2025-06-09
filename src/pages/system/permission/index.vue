<template>
  <div>
    <t-card size="small" :bordered="false" :hover-shadow="true">
      <t-enhanced-table
        max-height="700px"
        bordered
        disable-data-page
        hover
        table-layout="auto"
        row-key="menuId"
        :data="tableData"
        :columns="columns"
        :tree="treeConfig"
        @row-click="handleRowClick"
      ></t-enhanced-table>
    </t-card>
  </div>
</template>

<script setup lang="jsx">
import { ref, onBeforeMount } from "vue";
import { getMenuData } from "@/api/menu.js";
import { listToTreeIterative } from "@/utils/utils";
import { Tag, Icon } from "tdesign-vue-next";
const columns = ref([
  {
    title: "名称",
    colKey: "menuName",
    width: 220,
  },
  {
    title: "类型",
    colKey: "menuType",
    width: 100,
    align: "center",
    cell(h, { row }) {
      const type = row.menuType;
      const typeMap = new Map([
        [1, "目录"],
        [2, "菜单"],
        [3, "按钮"],
      ]);
      const menuTypeColorArray = ["danger", "primary", "warning", "success"];
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
    title: "路径",
    colKey: "path",
    ellipsis: true,
  },
  {
    title: "组件",
    colKey: "component",
    ellipsis: true,
  },
  {
    title: "后端权限",
    colKey: "apiPerms",
    ellipsis: true,
  },
  {
    title: "前端权限",
    colKey: "webPerms",
    ellipsis: true,
  },
  {
    title: "顺序",
    colKey: "sort",
    width: 80,
  },
  {
    title: "操作",
    colKey: "operate",
    width: 170,
    align: "center",
  },
]);

const tableData = ref([]);
onBeforeMount(async () => {
  const list = await getMenuData();
  tableData.value = listToTreeIterative(list, "menuId");
});

const treeConfig = ref({
  checkStrictly: true,
  childrenKey: "children",
  treeNodeColumnIndex: 0,
  expandTreeNodeOnClick: true,
});

const handleRowClick = () => {};
</script>
