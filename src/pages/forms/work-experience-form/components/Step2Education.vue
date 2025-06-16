<template>
  <t-form-item label="最高学历" name="highestEducation">
    <t-select v-model="form.highestEducation" placeholder="请选择最高学历">
      <t-option value="小学">小学</t-option>
      <t-option value="初中">初中</t-option>
      <t-option value="高中">高中</t-option>
      <t-option value="大专">大专</t-option>
      <t-option value="本科">本科</t-option>
      <t-option value="硕士">硕士</t-option>
      <t-option value="博士">博士</t-option>
    </t-select>
    <t-alert v-if="!isAgeValidForEducation" theme="error" title="年龄与学历不符" :message="`您的年龄（${store.step1.age}岁）与所选学历不符。18岁以下用户最高学历只能选择高中及以下。`" class="error-alert" />
  </t-form-item>
  <t-form-item label="专业">
    <t-input v-model="form.major" @change="suggestCoursesByMajor" placeholder="如：计算机科学与技术"></t-input>
    <t-alert v-if="majorSuggestion" theme="info" :message="`💡 您的专业可能对这些课程感兴趣：${majorSuggestion}`" class="hint-alert" />
  </t-form-item>
  <t-form-item label="毕业年份" name="graduationYear">
    <t-input-number v-model="form.graduationYear" :min="1900" :max="store.currentYear" placeholder="请输入毕业年份"></t-input-number>
  </t-form-item>

  <t-divider align="left">工作经历</t-divider>
  <div v-for="(exp, index) in workExperiences" :key="index">
    <WorkExperienceForm
      :experience="exp"
      :index="index"
      :can-remove="workExperiences.length > 1"
      @remove="removeWorkExperience(index)"
    />
  </div>
  <t-button variant="dashed" theme="primary" @click="addWorkExperience" class="add-work-exp-btn">
    <template #icon><t-icon name="add" /></template> 添加工作经历
  </t-button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRegistrationStore } from '../store';
import WorkExperienceForm from './WorkExperienceForm.vue';
import { Input as TInput, Select as TSelect, Option as TOption, InputNumber as TInputNumber, FormItem as TFormItem, Button as TButton, Icon as TIcon, Alert as TAlert, Divider as TDivider } from 'tdesign-vue-next';
import { useWorkExperience } from '../hooks/useWorkExperience'; // 引入工作经历 Hook
import { useFormValidation } from '../hooks/useFormValidation'; // 引入用于获取 isAgeValidForEducation 的 hook

const store = useRegistrationStore();
const form = computed({
  get: () => store.step2,
  set: (value) => store.updateStep2(value),
});

// 使用工作经历 Hook
const { workExperiences, addWorkExperience, removeWorkExperience } = useWorkExperience(store);

// 从 FormValidation Hook 中获取联动校验状态
const { isAgeValidForEducation } = useFormValidation(store);

const majorSuggestion = ref('');

const suggestCoursesByMajor = () => {
    const major = form.value.major;
    if (major && (major.includes('计算机') || major.includes('软件'))) {
        majorSuggestion.value = '编程、大数据、人工智能';
    } else if (major && (major.includes('设计') || major.includes('艺术'))) {
        majorSuggestion.value = 'UI/UX设计、平面设计';
    } else if (major && (major.includes('金融') || major.includes('经济'))) {
        majorSuggestion.value = '财务管理、数据分析、投资理财';
    } else {
        majorSuggestion.value = '';
    }
};
</script>

<style scoped>
.add-work-exp-btn {
    margin-top: 10px;
    width: 100%;
}
.error-alert, .hint-alert {
    margin-top: 10px;
}
</style>