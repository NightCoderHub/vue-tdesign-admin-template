<template>
  <div class="dictionary-example">
    <t-card title="数据字典示例" :bordered="false" class="mb-4">
      <t-space direction="vertical" size="large" style="width: 100%">
        <!-- 字典选择器示例 -->
        <t-card title="字典选择器示例" bordered>
          <t-form :data="formData" label-width="120px">
            <t-form-item label="用户状态">
              <dict-select
                v-model="formData.userStatus"
                type="USER_STATUS_DICT"
                placeholder="请选择用户状态"
                @change="handleUserStatusChange"
              />
            </t-form-item>
            <t-form-item label="订单状态">
              <dict-select v-model="formData.orderStatus" type="ORDER_STATUS_DICT" placeholder="请选择订单状态" />
            </t-form-item>

            <t-form-item label="支付方式">
              <dict-select v-model="formData.paymentMethod" type="PAYMENT_METHOD_DICT" placeholder="请选择支付方式" />
            </t-form-item>

            <t-form-item label="优先级(多选)">
              <dict-select v-model="formData.priorities" type="PRIORITY_DICT" placeholder="请选择优先级" multiple />
            </t-form-item>
          </t-form>

          <t-divider></t-divider>

          <t-space>
            <t-button theme="primary" @click="handleSubmit">提交表单</t-button>
            <t-button @click="resetForm">重置表单</t-button>
          </t-space>
        </t-card>

        <!-- 自定义Hook使用示例 -->
        <t-card title="自定义Hook使用示例" bordered>
          <t-space direction="vertical">
            <t-alert theme="info" message="以下是使用useDictionary Hook获取的字典数据" class="mb-4"></t-alert>

            <div class="hook-example">
              <h4>用户状态选项:</h4>
              <t-tag v-for="option in userStatusOptions" :key="option.value" :theme="option.color" class="mr-2 mb-2">
                {{ option.label }} ({{ option.value }})
                <t-tooltip v-if="option.remark" content-class="dict-tooltip">
                  <template #content>
                    <div>{{ option.remark }}</div>
                  </template>
                  <t-icon name="help-circle" size="14px" />
                </t-tooltip>
              </t-tag>
            </div>

            <div class="hook-example">
              <h4>性别选项:</h4>
              <t-tag v-for="option in genderOptions" :key="option.value" :theme="option.color" class="mr-2 mb-2">
                {{ option.label }} ({{ option.value }})
                <t-tooltip v-if="option.remark" content-class="dict-tooltip">
                  <template #content>
                    <div>{{ option.remark }}</div>
                  </template>
                  <t-icon name="help-circle" size="14px" />
                </t-tooltip>
              </t-tag>
            </div>

            <div class="hook-example">
              <h4>动态获取字典标签:</h4>
              <t-space>
                <t-select v-model="testValue" placeholder="选择字典值">
                  <t-option
                    v-for="option in userStatusOptions"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                  />
                </t-select>
                <t-button @click="testGetLabel">获取标签</t-button>
              </t-space>
              <div class="mt-2">
                <t-space>
                  <span>用户状态:</span>
                  <t-tag :theme="getDictColor('USER_STATUS', testValue)">
                    {{ getDictLabel("USER_STATUS", testValue) }}
                  </t-tag>
                </t-space>
              </div>
            </div>

            <div class="hook-example">
              <h4>数据字典完整信息:</h4>
              <t-table :data="userStatusDictData" :columns="dictColumns" row-key="value" />
            </div>
          </t-space>
        </t-card>
      </t-space>
    </t-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { DictSelect } from "@/components/dictionary";
import { useDictionary } from "@/hooks/useDictionary";

defineOptions({
  name: "DictionaryExample",
});

// 使用字典Hook
const { getDictionary, getDictOptions, getDictLabel, getDictColor } = useDictionary([
  "USER_STATUS_DICT",
  "GENDER_DICT",
  "ORDER_STATUS_DICT",
  "PAYMENT_METHOD_DICT",
  "PRIORITY_DICT",
]);

// 表单数据
const formData = reactive({
  userStatus: "1",
  orderStatus: "",
  paymentMethod: "",
  priorities: [],
});

// 测试值
const testValue = ref("1");

// 获取字典选项
const userStatusOptions = ref([]);
const genderOptions = ref([]);

// 用户状态字典数据
const userStatusDictData = computed(() => {
  return getDictionary("USER_STATUS_DICT");
});

// 字典表格列定义
const dictColumns = [
  { colKey: "value", title: "值", width: 80 },
  { colKey: "label", title: "标签", width: 100 },
  { colKey: "sort", title: "排序", width: 80 },
  { colKey: "color", title: "颜色", width: 100 },
  { colKey: "disable", title: "禁用", width: 80 },
  { colKey: "remark", title: "备注" },
];

// 初始化
const initDictOptions = () => {
  userStatusOptions.value = getDictOptions("USER_STATUS_DICT");
  genderOptions.value = getDictOptions("GENDER_DICT");
};

// 页面加载完成后初始化字典选项
setTimeout(initDictOptions, 500);

// 处理用户状态变化
const handleUserStatusChange = (value) => {
  const label = getDictLabel("USER_STATUS_DICT", value);
  MessagePlugin.info(`选择了用户状态: ${label}`);
};

// 提交表单
const handleSubmit = () => {
  MessagePlugin.success("表单提交成功");
};

// 重置表单
const resetForm = () => {
  formData.userStatus = "1";
  formData.userStatus1 = "";
  formData.orderStatus = "";
  formData.paymentMethod = "";
  formData.priorities = [];
  MessagePlugin.info("表单已重置");
};

// 测试获取标签
const testGetLabel = () => {
  const label = getDictLabel("USER_STATUS", testValue.value);
  MessagePlugin.info(`用户状态 ${testValue.value} 对应的标签是: ${label}`);
};
</script>

<style scoped>
.dictionary-example {
  padding: 16px;
}

.dict-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.dict-label {
  width: 120px;
  text-align: right;
  margin-right: 8px;
  color: var(--td-text-color-secondary);
}

.hook-example {
  margin-bottom: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.mt-2 {
  margin-top: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}

.dict-tooltip {
  max-width: 300px;
}
</style>

<style scoped>
.dictionary-example {
  padding: 16px;
}

.dict-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.dict-label {
  width: 120px;
  text-align: right;
  margin-right: 8px;
  color: var(--td-text-color-secondary);
}

.hook-example {
  margin-bottom: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.mt-2 {
  margin-top: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
