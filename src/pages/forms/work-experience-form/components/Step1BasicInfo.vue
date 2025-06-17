<template>
  <t-form-item label="姓名" name="name">
    <t-input v-model="form.name" placeholder="请输入姓名"></t-input>
  </t-form-item>
  <t-form-item label="性别" name="gender">
    <t-radio-group v-model="form.gender">
      <t-radio value="男">男</t-radio>
      <t-radio value="女">女</t-radio>
      <t-radio value="保密">保密</t-radio>
    </t-radio-group>
  </t-form-item>
  <t-form-item label="年龄" name="age">
    <t-input-number v-model="form.age" :min="1" :max="120" placeholder="请输入年龄"></t-input-number>
  </t-form-item>
  <t-form-item label="手机号" name="phoneNumber">
    <t-input v-model="form.phoneNumber" placeholder="请输入手机号" @blur="autoFillRegion"></t-input>
  </t-form-item>
  <t-form-item label="邮箱" name="email">
    <t-input v-model="form.email" placeholder="请输入邮箱"></t-input>
  </t-form-item>
  <t-form-item label="所在地区" name="region">
    <t-input v-model="form.region" placeholder="如：省/市"></t-input>
  </t-form-item>
</template>

<script setup>
import { computed } from "vue";
import { useRegistrationStore } from "../store";
import { simulatePhoneRegionAPI } from "../utils"; // 引入模拟 API

const store = useRegistrationStore();
const form = computed({
  get: () => store.step1,
  set: (value) => store.updateStep1(value),
});

const autoFillRegion = async () => {
  const phone = form.value.phoneNumber;
  if (phone) {
    const region = await simulatePhoneRegionAPI(phone); // 模拟 API 调用
    form.value.region = region || "";
  }
};
</script>
