<template>
  <t-form
    class="step-form"
    :data="stepData"
    :rules="FORM_RULES"
    label-align="left"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <t-form-item label="收货人" name="consignee">
      <t-input v-model="stepData.consignee" :style="{ width: '480px' }" />
      <!-- 直接绑定模型属性 -->
    </t-form-item>
    <t-form-item label="手机号" name="mobileNum">
      <t-input v-model="stepData.mobileNum" :style="{ width: '480px' }" />
      <!-- 直接绑定模型属性 -->
    </t-form-item>
    <t-form-item label="配送地址" name="deliveryAddress">
      <t-select v-model="stepData.deliveryAddress" :style="{ width: '480px' }" class="demo-select-base" clearable>
        <t-option v-for="(item, index) in ADDRESS_OPTIONS" :key="index" :value="item.value" :label="item.label">
          {{ item.label }}
        </t-option>
      </t-select>
    </t-form-item>
    <t-form-item label="详细地址" name="fullAddress">
      <t-textarea v-model="stepData.fullAddress" :style="{ width: '480px' }" />
      <!-- 直接绑定模型属性 -->
    </t-form-item>
    <t-form-item>
      <t-button type="reset" theme="default" variant="base"> 上一步 </t-button>
      <t-button theme="primary" type="submit"> 下一步 </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup>
import { defineModel } from "vue";
import { ADDRESS_OPTIONS, FORM_RULES } from "../constants";

// Add type definition to satisfy eslintvue/require-prop-types rule
const stepData = defineModel("stepData", {
  type: Object, // Explicitly define prop type as Object
  required: true, // Add required flag if applicable
});

const emit = defineEmits(["reset", "submit"]);

const handleReset = () => emit("reset", 1);

const handleSubmit = () => emit("submit", 3);
</script>
