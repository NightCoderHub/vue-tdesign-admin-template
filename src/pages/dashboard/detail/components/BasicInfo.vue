<template>
  <t-form ref="formRef" :data="form" :rules="rules" label-width="120px">
    <t-form-item label="姓名" name="name">
      <t-input v-model="form.name" placeholder="请输入姓名" @change="updateForm" />
    </t-form-item>
    <t-form-item label="用户类型" name="userType">
      <t-select v-model="form.userType" placeholder="请选择用户类型" @change="handleUserTypeChange">
        <t-option label="个人用户" value="personal" />
        <t-option label="企业用户" value="enterprise" />
      </t-select>
    </t-form-item>
    <t-form-item :label="idCardLabel" name="idCard">
      <t-input v-model="form.idCard" :placeholder="idCardPlaceholder" @change="updateForm" />
    </t-form-item>
    <t-form-item label="手机号码" name="phone">
      <t-input v-model="form.phone" placeholder="请输入手机号码" @change="updateForm" />
    </t-form-item>
    <t-form-item label="邮箱" name="email">
      <t-input v-model="form.email" placeholder="请输入邮箱" @change="updateForm" />
    </t-form-item>
  </t-form>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:form']);

const formRef = ref(null);
const form = reactive({
  name: props.form.name,
  userType: props.form.userType || 'personal',
  idCard: props.form.idCard,
  phone: props.form.phone,
  email: props.form.email,
});

// 身份证号码验证规则
const personalIdCardPattern = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/;
// 统一社会信用代码验证规则
const enterpriseIdCardPattern = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;

// 根据用户类型计算标签和占位符
const idCardLabel = computed(() => {
  return form.userType === 'personal' ? '身份证号码' : '统一社会信用代码';
});

const idCardPlaceholder = computed(() => {
  return form.userType === 'personal' ? '请输入身份证号码' : '请输入统一社会信用代码';
});

// 根据用户类型动态生成证件号码验证规则
const getIdCardRules = (userType) => {
  const pattern = userType === 'personal' ? personalIdCardPattern : enterpriseIdCardPattern;
  const message = userType === 'personal' ? '请输入正确的身份证号码' : '请输入正确的统一社会信用代码';
  
  return [
    { required: true, message: `请输入${userType === 'personal' ? '身份证号码' : '统一社会信用代码'}`, trigger: 'blur' },
    { pattern, message, trigger: 'blur' }
  ];
};

// 监听用户类型变化，更新证件号码验证规则
const handleUserTypeChange = () => {
  form.idCard = ''; // 清空证件号码
  rules.idCard = getIdCardRules(form.userType);
  updateForm();
};

// 监听外部表单数据变化
watch(() => props.form, (newVal) => {
  Object.assign(form, newVal);
}, { deep: true });

// 更新表单数据
const updateForm = () => {
  emit('update:form', { ...form });
};

const rules = reactive({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  userType: [{ required: true, message: "请选择用户类型", trigger: "change" }],
  idCard: getIdCardRules('personal'),
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
});

defineExpose({
  validate: () => formRef.value?.validate(),
  form
});
</script>
