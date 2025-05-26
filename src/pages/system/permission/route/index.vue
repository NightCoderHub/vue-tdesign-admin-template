<template>
  <div class="route-management">
    <!-- 操作按钮 -->
    <div class="action-bar">
      <t-button @click="handleAdd">新增路由</t-button>
    </div>

    <!-- 路由列表 -->
    <t-table :data="routeList" :columns="columns" row-key="id">
      <template #action="{ row }">
        <t-button size="small" @click="handleEdit(row)">编辑</t-button>
        <t-button size="small" theme="danger" @click="handleDelete(row.id)">删除</t-button>
      </template>
    </t-table>

    <!-- 新增/编辑弹窗 -->
    <t-dialog :visible="visible" :title="currentRoute.id ? '编辑路由' : '新增路由'" @close="visible = false">
      <t-form ref="formRef" :model="formData" :rules="rules">
        <t-form-item label="路由路径" name="path">
          <t-input v-model:value="formData.path" placeholder="请输入路由路径" />
        </t-form-item>
        <t-form-item label="路由名称" name="name">
          <t-input v-model:value="formData.name" placeholder="请输入路由名称" />
        </t-form-item>
        <t-form-item label="组件路径" name="component">
          <t-input v-model:value="formData.component" placeholder="请输入组件路径" />
        </t-form-item>
        <t-form-item label="显示标题" name="title">
          <t-input v-model:value="formData.meta.title" placeholder="请输入显示标题" />
        </t-form-item>
        <t-form-item label="菜单图标" name="icon">
          <t-input v-model:value="formData.meta.icon" placeholder="请输入菜单图标" />
        </t-form-item>
      </t-form>

      <template #footer>
        <t-button @click="visible = false">取消</t-button>
        <t-button theme="primary" @click="handleSubmit">提交</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getRouteList, addRoute, updateRoute, deleteRoute } from "@/api/permission";

// 路由列表数据
const routeList = ref([]);
// 弹窗可见状态
const visible = ref(false);
// 当前操作的路由（新增时为{}，编辑时为路由对象）
const currentRoute = ref({});
// 表单数据
const formData = reactive({
  path: "",
  name: "",
  component: "",
  meta: { title: "", icon: "" },
});
// 表单验证规则
const rules = {
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  name: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  "meta.title": [{ required: true, message: "请输入显示标题", trigger: "blur" }],
};
// 表单ref
const formRef = ref(null);

// 表格列配置
const columns = ref([
  { title: "路由路径", key: "path" },
  { title: "路由名称", key: "name" },
  { title: "组件路径", key: "component" },
  { title: "操作", key: "action", width: 200 },
]);

// 初始化加载路由列表
const loadRouteList = async () => {
  const res = await getRouteList();
  routeList.value = res?.list || [];
};

// 处理新增
const handleAdd = () => {
  currentRoute.value = {};
  // 清空表单
  Object.keys(formData).forEach((key) => {
    if (key === "meta") {
      formData.meta = { title: "", icon: "" };
    } else {
      formData[key] = "";
    }
  });
  visible.value = true;
};

// 处理编辑
const handleEdit = (row) => {
  currentRoute.value = row;
  // 填充表单数据
  formData.path = row.path;
  formData.name = row.name;
  formData.component = row.component;
  formData.meta.title = row.meta?.title || "";
  formData.meta.icon = row.meta?.icon || "";
  visible.value = true;
};

// 处理删除
const handleDelete = async (id) => {
  if (!window.confirm("确定要删除该路由吗？")) return;
  const res = await deleteRoute(id);
  if (res.code === 0) {
    loadRouteList();
    alert("删除成功");
  } else {
    alert(`删除失败：${res.message}`);
  }
};

// 提交表单
const handleSubmit = async () => {
  const form = formRef.value;
  await form
    .validate()
    .then(async () => {
      let res;
      if (currentRoute.value.id) {
        // 编辑操作
        res = await updateRoute(currentRoute.value.id, formData);
      } else {
        // 新增操作
        res = await addRoute(formData);
      }
      if (res.code === 0) {
        visible.value = false;
        loadRouteList();
        alert(currentRoute.value.id ? "编辑成功" : "新增成功");
      } else {
        alert(`操作失败：${res.message}`);
      }
    })
    .catch(() => {
      // 验证失败
    });
};
onMounted(() => {
  loadRouteList();
});
// 初始化加载数据
</script>

<style lang="scss" scoped>
.route-management {
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
