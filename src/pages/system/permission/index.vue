<template>
  <div class="permission-management">
    <!-- 操作按钮 -->
    <div class="action-bar">
      <t-button @click="handleAddPermission">新增权限</t-button>
    </div>

    <!-- 树形权限管理表格 -->
    <t-enhanced-table :data="permissionList" :columns="permissionColumns" row-key="id" :tree="treeConfig">
      <template #type="{ row }">
        <t-tag :theme="row.type === 'route' ? 'primary' : 'success'" variant="light">
          {{ row.type === "route" ? "菜单路由" : "按钮权限" }}
        </t-tag>
      </template>
      <template #action="{ row }">
        <t-button size="small" @click="handleEditPermission(row)">编辑</t-button>
        <t-button size="small" theme="danger" @click="handleDeletePermission(row.id)">删除</t-button>
      </template>
    </t-enhanced-table>

    <!-- 新增/编辑弹窗 -->
    <t-dialog
      :visible="permissionVisible"
      :title="currentPermission.id ? '编辑权限' : '新增权限'"
      @close="permissionVisible = false"
    >
      <t-form ref="permissionFormRef" :model="permissionForm" :rules="permissionRules">
        <t-form-item label="权限类型" name="type">
          <t-radio-group v-model="permissionForm.type">
            <t-radio value="route">菜单路由</t-radio>
            <t-radio value="button">按钮权限</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="权限标识" name="permKey">
          <t-input v-model:value="permissionForm.permKey" placeholder="示例：route:user:index 或 button:user:edit" />
        </t-form-item>
        <t-form-item label="关联路径" name="routePath">
          <t-input v-model:value="permissionForm.routePath" placeholder="示例：/user/index" />
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-input v-model:value="permissionForm.description" placeholder="示例：用户管理菜单 或 用户编辑按钮" />
        </t-form-item>
      </t-form>

      <template #footer>
        <t-button @click="permissionVisible = false">取消</t-button>
        <t-button theme="primary" @click="handleSubmitPermission">提交</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
// 树形权限数据（路由作为父节点，按钮权限作为子节点）
const permissionList = ref([
  {
    id: 1,
    type: "route",
    permKey: "route:user:index",
    routePath: "/user/index",
    description: "用户管理菜单",
    children: [
      {
        id: 2,
        type: "button",
        permKey: "button:user:edit",
        routePath: "/user/index",
        description: "用户编辑按钮",
      },
      {
        id: 3,
        type: "button",
        permKey: "button:user:delete",
        routePath: "/user/index",
        description: "用户删除按钮",
      },
    ],
  },
  {
    id: 4,
    type: "route",
    permKey: "route:role:index",
    routePath: "/role/index",
    description: "角色管理菜单",
    children: [
      {
        id: 5,
        type: "button",
        permKey: "button:role:add",
        routePath: "/role/index",
        description: "角色新增按钮",
      },
    ],
  },
]);

// 统一表格列配置（移除固定宽度，适应树形缩进）
const permissionColumns = ref([
  { title: "权限类型", colKey: "type", slot: "type" },
  { title: "权限标识", colKey: "permKey" },
  { title: "关联路径", colKey: "routePath" },
  { title: "描述", colKey: "description" },
  { title: "操作", colKey: "action" }, // 移除width固定宽度，自动适应内容
]);

// 弹窗状态
const permissionVisible = ref(false);
const currentPermission = ref({});
const permissionForm = reactive({ type: "route", permKey: "", routePath: "", description: "" });
const permissionRules = {
  type: [{ required: true, message: "请选择权限类型", trigger: "change" }],
  permKey: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
  routePath: [{ required: true, message: "请输入关联路径", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
};
const permissionFormRef = ref(null);

// 新增权限
const handleAddPermission = () => {
  currentPermission.value = {};
  permissionForm.type = "route"; // 默认路由类型
  permissionForm.permKey = "";
  permissionForm.routePath = "";
  permissionForm.description = "";
  permissionVisible.value = true;
};

// 编辑权限
const handleEditPermission = (row) => {
  currentPermission.value = row;
  permissionForm.type = row.type;
  permissionForm.permKey = row.permKey;
  permissionForm.routePath = row.routePath;
  permissionForm.description = row.description;
  permissionVisible.value = true;
};

// 删除权限
const handleDeletePermission = (id) => {
  if (!window.confirm("确定要删除该权限吗？")) return;
  permissionList.value = permissionList.value.filter((item) => item.id !== id);
};

// 提交权限
const handleSubmitPermission = async () => {
  const form = permissionFormRef.value;
  await form
    .validate()
    .then(() => {
      if (currentPermission.value.id) {
        // 编辑操作
        const index = permissionList.value.findIndex((item) => item.id === currentPermission.value.id);
        permissionList.value[index] = { ...currentPermission.value, ...permissionForm };
      } else {
        // 新增操作
        permissionList.value.push({
          id: Date.now(),
          ...permissionForm,
        });
      }
      permissionVisible.value = false;
    })
    .catch(() => {});
};

// 树形表格配置
const treeConfig = ref({
  children: "children", // 指定子节点字段名（与数据中的children属性一致）
  indent: 20, // 子节点缩进距离（px）
  expandable: true, // 是否可展开
  defaultExpandAll: true, // 默认展开所有节点（可根据需求改为false）
});
</script>

<style lang="scss" scoped>
.permission-management {
  padding: 20px;

  .action-bar {
    margin-bottom: 20px;
  }

  .t-table {
    border: 1px solid #e5e7eb;
    border-radius: 4px;
  }

  .t-dialog {
    max-width: 600px;
  }

  .t-form-item {
    margin-bottom: 16px;
  }
}
</style>
