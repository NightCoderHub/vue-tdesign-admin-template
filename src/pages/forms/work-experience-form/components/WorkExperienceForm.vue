<template>
  <div class="work-experience-item">
    <t-form-item label="是否在职" :name="`step2.workExperiences[${index}].isEmployed`" :rules="rules.isEmployed">
      <t-radio-group v-model="experience.isEmployed">
        <t-radio :value="true">是</t-radio>
        <t-radio :value="false">否</t-radio>
      </t-radio-group>
    </t-form-item>

    <t-space direction="vertical" style="width: 100%;" v-if="experience.isEmployed === true">
      <t-form-item label="公司名称" :name="`step2.workExperiences[${index}].companyName`" :rules="rules.companyName">
        <t-input v-model="experience.companyName" placeholder="请输入公司名称"></t-input>
      </t-form-item>
      <t-form-item label="职位" :name="`step2.workExperiences[${index}].jobTitle`" :rules="rules.jobTitle">
        <t-input v-model="experience.jobTitle" placeholder="请输入职位"></t-input>
      </t-form-item>
      <t-form-item label="工作年限" :name="`step2.workExperiences[${index}].workExperienceYears`" :rules="rules.workExperienceYears">
        <t-input-number v-model="experience.workExperienceYears" :min="0" placeholder="请输入工作年限"></t-input-number>
      </t-form-item>
      <t-form-item label="职业方向">
        <t-input v-model="experience.careerDirection" placeholder="如：软件工程师，产品经理"></t-input>
      </t-form-item>
    </t-space>

    <t-button
      v-if="canRemove"
      variant="dashed"
      theme="danger"
      size="small"
      @click="$emit('remove')"
      class="remove-btn"
    >
      删除此经历
    </t-button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Input as TInput, RadioGroup as TRadioGroup, Radio as TRadio, InputNumber as TInputNumber, FormItem as TFormItem, Button as TButton, Space as TSpace } from 'tdesign-vue-next';
import { workExperienceRules } from '../validation/rules'; // 引入验证规则

const props = defineProps({
  experience: Object,
  index: Number,
  canRemove: Boolean,
});

const emit = defineEmits(['remove']);

// 将工作经历的内部规则传入
const rules = workExperienceRules;
</script>

<style scoped>
.work-experience-item {
  border: 1px dashed var(--td-component-border);
  padding: 15px;
  margin-bottom: 20px;
  border-radius: var(--td-radius-default);
  position: relative;
}
.remove-btn {
  margin-top: 10px;
}
</style>