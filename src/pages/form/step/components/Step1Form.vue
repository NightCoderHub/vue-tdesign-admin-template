<template>
  <div>
    <!-- 步骤1规则说明 -->
    <div class="rule-tips">
      <t-alert theme="info" title="步骤1规则说明" :close="true">
        <template #message>
          <p>规则1：示例内容</p>
          <p>规则2：示例内容</p>
          <p>规则3：示例内容</p>
        </template>
      </t-alert>
    </div>

    <t-form class="step-form" :data="stepData" :rules="FORM_RULES" label-align="right" @submit="handleSubmit">
      <t-form-item label="合同名称" name="name">
        <t-select v-model="stepData.name" :style="{ width: '480px' }" class="demo-select-base" clearable>
          <t-option v-for="(item, index) in NAME_OPTIONS" :key="index" :value="item.value" :label="item.label">
            {{ item.label }}
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="发票类型" name="type">
        <t-select v-model="stepData.type" :style="{ width: '480px' }" class="demo-select-base" clearable>
          <t-option v-for="(item, index) in TYPE_OPTIONS" :key="index" :value="item.value" :label="item.label">
            {{ item.label }}
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="金额"> ¥ {{ amount }} </t-form-item>
      <t-form-item>
        <t-button theme="primary" type="submit"> 提交 </t-button>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { NAME_OPTIONS, TYPE_OPTIONS, FORM_RULES } from "../constants";

// 接收父组件传递的步骤数据
const stepData = defineModel("stepData", {
  type: Object, // Explicitly define prop type as Object
  required: true, // Add required flag if applicable
});
// 触发提交事件给父组件
const emit = defineEmits(["submit"]);

// 金额计算（直接使用 stepData 中的值）
const amount = computed(() => {
  if (stepData.value.name === "1") return "565421";
  if (stepData.value.name === "2") return "278821";
  if (stepData.value.name === "3") return "109824";
  return "--";
});

// 提交处理
const handleSubmit = (result) => {
  emit("submit", result, 1); // 参数1表示下一步骤为1（对应 activeForm=1）
};
</script>
