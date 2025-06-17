<template>
  <div class="dictionary-management">
    <t-card title="数据字典管理" :hover-shadow="true" :bordered="false">
      <template #actions>
        <t-space>
          <t-button theme="primary" @click="handleAddDict">
            <template #icon><t-icon name="add" /></template>
            新增字典
          </t-button>
          <t-button theme="default" @click="refreshDictList">
            <template #icon><t-icon name="refresh" /></template>
            刷新
          </t-button>
        </t-space>
      </template>

      <t-table
        :data="paginatedDictTypeList"
        :columns="dictTypeColumns"
        :loading="loading"
        :pagination="pagination"
        size="small"
        row-key="type"
        hover
        @page-change="onPageChange"
      >
        <template #operation="{ row }">
          <t-space>
            <t-button theme="primary" size="small" @click="handleEditDict(row)"> 编辑 </t-button>
            <t-button theme="success" size="small" @click="handleViewItems(row)"> 字典项 </t-button>

            <t-popconfirm content="确定要删除该字典吗？" @confirm="handleDeleteDict(row)">
              <t-button theme="danger" size="small"> 删除 </t-button>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="dictItemsVisible"
      :header="currentDict.dictName + ' - 字典项管理'"
      width="900px"
      :footer="false"
    >
      <template #body>
        <t-space direction="vertical" style="width: 100%">
          <t-space style="margin-bottom: 16px">
            <t-button theme="primary" @click="handleAddDictItem">
              <template #icon><t-icon name="add" /></template>
              新增字典项
            </t-button>
          </t-space>

          <t-table
            :data="dictItemList"
            size="small"
            :columns="dictItemColumns"
            :loading="itemsLoading"
            row-key="value"
            hover
          >
            <template #color="{ row }">
              <t-tag :theme="row.color || 'default'" variant="light">
                {{ row.color || "默认" }}
              </t-tag>
            </template>
            <template #disable="{ row }">
              <t-tag :theme="row.disable ? 'danger' : 'success'" variant="light">
                {{ row.disable ? "禁用" : "启用" }}
              </t-tag>
            </template>
            <template #operation="{ row }">
              <t-space>
                <t-link theme="primary" hover="color" @click="handleEditDictItem(row)">
                  <t-icon name="edit" />
                  编辑
                </t-link>
                <t-popconfirm content="确定要删除该字典项吗？" @confirm="handleDeleteDictItem(row)">
                  <t-link theme="danger" hover="color">
                    <t-icon name="delete" />
                    删除
                  </t-link>
                </t-popconfirm>
              </t-space>
            </template>
          </t-table>
        </t-space>
      </template>
    </t-dialog>

    <t-dialog
      v-model:visible="dictFormVisible"
      :header="isEdit ? '编辑字典' : '新增字典'"
      width="600px"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="submitDictForm"
      @cancel="closeDictForm"
    >
      <template #body>
        <t-form ref="dictFormRef" :data="dictForm" :rules="dictFormRules" label-width="100px" @submit="submitDictForm">
          <t-form-item label="字典名称" name="dictName">
            <t-input v-model="dictForm.dictName" placeholder="请输入字典名称，如：用户状态"  />
          </t-form-item>
          <t-form-item label="字典编码" name="dictCode">
            <t-input v-model="dictForm.dictCode" placeholder="请输入字典编码，如：USER_STATUS" :disabled="isEdit" />
          </t-form-item>
          <t-form-item label="字典描述" name="description">
            <t-textarea v-model="dictForm.description" placeholder="请输入字典描述" />
          </t-form-item>
          <t-form-item label="备注" name="remark">
            <t-textarea v-model="dictForm.remark" placeholder="请输入备注信息" />
          </t-form-item>
        </t-form>
      </template>
    </t-dialog>

    <t-dialog
      v-model:visible="dictItemFormVisible"
      :header="isItemEdit ? '编辑字典项' : '新增字典项'"
      width="600px"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="submitDictItemForm"
      @cancel="closeDictItemForm"
    >
      <template #body>
        <t-form
          ref="dictItemFormRef"
          :data="dictItemForm"
          :rules="dictItemFormRules"
          label-width="100px"
          @submit="submitDictItemForm"
        >
          <t-form-item label="字典值" name="value">
            <t-input v-model="dictItemForm.value" placeholder="请输入字典值，如：1" :disabled="isItemEdit" />
          </t-form-item>
          <t-form-item label="字典标签" name="label">
            <t-input v-model="dictItemForm.label" placeholder="请输入字典标签，如：正常" />
          </t-form-item>
          <t-form-item label="排序" name="sort">
            <t-input-number v-model="dictItemForm.sort" placeholder="请输入排序号" />
          </t-form-item>
          <t-form-item label="颜色" name="color">
            <t-select v-model="dictItemForm.color" placeholder="请选择颜色">
              <t-option value="default" label="默认" />
              <t-option value="primary" label="主要" />
              <t-option value="success" label="成功" />
              <t-option value="warning" label="警告" />
              <t-option value="danger" label="危险" />
            </t-select>
          </t-form-item>
          <t-form-item label="状态" name="disable">
            <t-radio-group v-model="dictItemForm.disable">
              <t-radio :value="false">启用</t-radio>
              <t-radio :value="true">禁用</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="备注" name="remark">
            <t-textarea v-model="dictItemForm.remark" placeholder="请输入备注信息" />
          </t-form-item>
        </t-form>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { DICTIONARY_MAPS } from "@/constants/dictionary";
import { getDictionaryList, getDictionaryItemList } from "@/api/dictionaries";

// 字典类型列表
const paginatedDictTypeList = ref([]); // Store all dictionary types
const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
});

// 字典项列表
const dictItemList = ref([]);
const itemsLoading = ref(false);
const dictItemsVisible = ref(false);
const currentDict = ref({});

// 字典表单
const dictFormRef = ref(null);
const dictFormVisible = ref(false);
const isEdit = ref(false);

const initialDictFormState = {
  type: "",
  name: "",
  description: "",
  remark: "",
};
const dictForm = reactive({ ...initialDictFormState });

// 字典项表单
const dictItemFormRef = ref(null);
const dictItemFormVisible = ref(false);
const isItemEdit = ref(false);

const initialDictItemFormState = {
  type: "",
  value: "",
  label: "",
  sort: 1,
  color: "default",
  disable: false,
  remark: "",
};
const dictItemForm = reactive({ ...initialDictItemFormState });

// 表单校验规则
const dictFormRules = {
  dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  dictCode: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
};

const dictItemFormRules = {
  value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
  label: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
};

// 字典类型表格列定义
const dictTypeColumns = [
  { colKey: "dictName", title: "字典名称", width: 150 },
  { colKey: "dictCode", title: "字典编码", width: 150 },
  { colKey: "description", title: "描述" },
  { colKey: "remark", title: "备注" },
  { colKey: "operation", title: "操作", width: 180, fixed: "right", cell: { col: "operation" } },
];

// 字典项表格列定义
const dictItemColumns = [
  { colKey: "value", title: "字典值", width: 100 },
  { colKey: "label", title: "字典标签", width: 150 },
  { colKey: "sort", title: "排序", width: 80 },
  { colKey: "color", title: "颜色", width: 100, cell: { col: "color" } },
  { colKey: "disable", title: "状态", width: 80, cell: { col: "disable" } },
  { colKey: "remark", title: "备注" },
  { colKey: "operation", title: "操作", width: 150, fixed: "right", cell: { col: "operation" } },
];

// 初始化
onMounted(() => {
  loadDictTypeList();
});

// 加载字典类型列表
const loadDictTypeList = () => {
  loading.value = true;
  getDictionaryList().then((res) => {
    paginatedDictTypeList.value = res.list
    pagination.total = res.total;
  }).finally(() => {
    loading.value = false;
  });
};

// 获取字典类型名称
const getDictTypeName = (type) => {
  const nameMap = {
    USER_STATUS: "用户状态",
    GENDER: "性别",
    ORDER_STATUS: "订单状态",
    PAYMENT_METHOD: "支付方式",
    PRIORITY: "优先级",
    COMMON_STATUS: "通用状态",
    AUDIT_STATUS: "审核状态",
  };

  return nameMap[type] || type;
};

// 分页变化
const onPageChange = (pageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
};

// 刷新字典列表
const refreshDictList = () => {
  loadDictTypeList();
  MessagePlugin.success("刷新成功");
};

// 加载字典项列表
const handleViewItems = (row) => {
  currentDict.value = row;
  dictItemsVisible.value = true;
  itemsLoading.value = true;
  getDictionaryItemList(row.dictCode).then((list) => {
    dictItemList.value = list;
  }).finally(() => {
    itemsLoading.value = false;
  });
};


// 新增字典
const handleAddDict = () => {
  isEdit.value = false;
  Object.assign(dictForm, initialDictFormState); // Reset form using initial state
  dictFormVisible.value = true;
   dictFormRef.value?.validate().then((result) => {
    if (result === true) {
      if (isEdit.value) {
        MessagePlugin.success("编辑成功");
      } else {
        MessagePlugin.success("新增成功");
      }

      dictFormVisible.value = false;
      Object.assign(dictForm, initialDictFormState); // Reset form after successful submission
    }
  });
};

// 编辑字典
const handleEditDict = (row) => {
  isEdit.value = true;
  Object.assign(dictForm, row);
  dictFormVisible.value = true;
};

// 删除字典
const handleDeleteDict = (row) => {MessagePlugin.success("删除成功");

};

// 关闭字典表单
const closeDictForm = () => {
  dictFormVisible.value = false;
  Object.assign(dictForm, initialDictFormState); // 重置表单数据
  dictFormRef.value?.clearValidate(); // 清除表单的验证结果
};

// 提交字典表单
const submitDictForm = () => {
  dictFormRef.value?.validate().then((result) => {
    if (result === true) {
      if (isEdit.value) {
        MessagePlugin.success("编辑成功");
      } else {
        MessagePlugin.success("新增成功");
      }

      dictFormVisible.value = false;
      Object.assign(dictForm, initialDictFormState); // Reset form after successful submission
    }
  });
};

// 新增字典项
const handleAddDictItem = () => {
  isItemEdit.value = false;
  Object.assign(dictItemForm, initialDictItemFormState); // Reset form using initial state
  dictItemForm.type = currentDict.value.type;
  dictItemFormVisible.value = true;
};

// 编辑字典项
const handleEditDictItem = (row) => {
  isItemEdit.value = true;
  Object.assign(dictItemForm, row);
  dictItemFormVisible.value = true;
};

// 删除字典项
const handleDeleteDictItem = (row) => {
  // 模拟删除操作
  const index = dictItemList.value.findIndex((item) => item.value === row.value);
  if (index > -1) {
    dictItemList.value.splice(index, 1);
    MessagePlugin.success("删除成功");
  }
};

// 关闭字典项表单
const closeDictItemForm = () => {
  dictItemFormVisible.value = false;
  Object.assign(dictItemForm, initialDictItemFormState); // 重置表单数据
  dictItemFormRef.value?.clearValidate(); // 新增：清除表单的验证结果
};

// 提交字典项表单
const submitDictItemForm = () => {
  dictItemFormRef.value?.validate().then((result) => {
    if (result === true) {
      if (isItemEdit.value) {
        // 编辑
        const index = dictItemList.value.findIndex((item) => item.value === dictItemForm.value);
        if (index > -1) {
          dictItemList.value[index] = { ...dictItemForm };
        }
        MessagePlugin.success("编辑成功");
      } else {
        // 新增
        // Check for duplicate value before adding (optional but good practice)
        if (dictItemList.value.some((item) => item.value === dictItemForm.value)) {
          MessagePlugin.error("字典值已存在，请修改");
          return;
        }
        dictItemList.value.push({ ...dictItemForm });
        MessagePlugin.success("新增成功");
      }

      dictItemFormVisible.value = false;
      Object.assign(dictItemForm, initialDictItemFormState); // Reset form after successful submission
    }
  });
};
</script>

<style scoped>
.dictionary-management {
  padding: 16px;
}
</style>
