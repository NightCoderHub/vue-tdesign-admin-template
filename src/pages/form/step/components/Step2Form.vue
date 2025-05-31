<template>
  <t-form
    class="step-form"
    :data="stepData"
    :rules="FORM_RULES"
    label-align="left"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="发票抬头" name="title">
      <t-input v-model="stepData.title" :style="{ width: '480px' }" placeholder="请输入发票抬头" />
    </t-form-item>
    <t-form-item label="税号" name="taxNum">
      <t-input v-model="stepData.taxNum" :style="{ width: '480px' }" placeholder="请输入税号" />
    </t-form-item>
    <t-form-item label="地址" name="address">
      <t-input v-model="stepData.address" :style="{ width: '480px' }" placeholder="请输入地址" />
    </t-form-item>
    <t-form-item label="开户银行" name="bank">
      <t-input v-model="stepData.bank" :style="{ width: '480px' }" placeholder="请输入开户银行" />
    </t-form-item>
    <t-form-item label="银行账号" name="bankAccount">
      <t-input v-model="stepData.bankAccount" :style="{ width: '480px' }" placeholder="请输入银行账号" />
    </t-form-item>
    <t-form-item label="邮箱" name="email">
      <t-input v-model="stepData.email" :style="{ width: '480px' }" placeholder="请输入邮箱" />
    </t-form-item>
    <t-form-item label="电话" name="tel">
      <t-input v-model="stepData.tel" :style="{ width: '480px' }" placeholder="请输入电话" />
    </t-form-item>
    <t-form-item>
      <t-button type="reset" theme="default" variant="base"> 上一步 </t-button>
      <t-button theme="primary" type="submit"> 下一步 </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup>
import { FORM_RULES } from "../constants";

// 接收父组件传递的步骤数据
const stepData = defineModel("stepData", {
  type: Object, // Explicitly define prop type as Object
  required: true, // Add required flag if applicable
});

// 触发重置/提交事件给父组件
const emit = defineEmits(["reset", "submit"]);

// 上一步处理
const handleReset = () => emit("reset", 0); // 参数0表示返回步骤0

// 提交处理
const handleSubmit = (result) => emit("submit", result, 2); // 参数2表示下一步骤为2（对应 activeForm=2）
</script>
