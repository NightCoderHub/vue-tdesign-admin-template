<template>
  <t-form ref="formRef" :data="form" :rules="rules" label-width="120px">
    <t-form-item label="所在城市" name="city">
      <t-select v-model="form.city" placeholder="请选择城市" @change="updateForm">
        <t-option v-for="city in cityOptions" :key="city.value" :label="city.label" :value="city.value" />
      </t-select>
    </t-form-item>
    <t-form-item label="详细地址" name="address">
      <t-textarea v-model="form.address" placeholder="请输入详细地址" @change="updateForm" />
    </t-form-item>
    <t-form-item label="备注" name="remark">
      <t-textarea v-model="form.remark" placeholder="请输入备注信息" @change="updateForm" />
    </t-form-item>

    <!-- 企业用户特有信息 -->
    <template v-if="basicInfo.userType === 'enterprise'">
      <t-form-item label="企业规模" name="companySize">
        <t-input v-model="form.companySize" placeholder="请输入企业规模" @change="updateForm" />
      </t-form-item>
      <t-form-item label="成立时间" name="establishTime">
        <t-date-picker v-model="form.establishTime" placeholder="请选择成立时间" @change="updateForm" />
      </t-form-item>
      <t-form-item label="法定代表人" name="legalPerson">
        <t-input v-model="form.legalPerson" placeholder="请输入法定代表人" @change="updateForm" />
      </t-form-item>
    </template>

    <!-- 个人用户特有信息 -->
    <template v-else>
      <t-form-item label="年龄" name="age">
        <t-input-number v-model="form.age" placeholder="请输入年龄" @change="updateForm" />
      </t-form-item>
      <t-form-item label="职业" name="occupation">
        <t-input v-model="form.occupation" placeholder="请输入职业" @change="updateForm" />
      </t-form-item>
    </template>
  </t-form>
</template>

<script setup>
import { ref } from "vue";
import { useDetailForm } from '../hooks/useDetailForm'; // 引入自定义Hook

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  basicInfo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:form']);

const formRef = ref(null);

// 使用自定义Hook来管理表单逻辑
const { form, cityOptions, updateForm, rules } = useDetailForm(props, emit);

defineExpose({
  validate: () => formRef.value?.validate(),
  form
});
</script>
