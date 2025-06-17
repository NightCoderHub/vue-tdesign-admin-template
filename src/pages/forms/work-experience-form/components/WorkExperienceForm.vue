<template>
  <div class="work-experience-item">
    <t-form-item label="是否在职" :name="`workExperiences[${index}].isEmployed`" :rules="rules.isEmployed">
      <t-radio-group v-model="modelValue.isEmployed">
        <t-radio :value="true">是</t-radio>
        <t-radio :value="false">否</t-radio>
      </t-radio-group>
    </t-form-item>

    <t-space v-if="modelValue.isEmployed === true" direction="vertical" style="width: 100%">
      <t-form-item label="公司名称" :name="`workExperiences[${index}].companyName`" :rules="rules.companyName">
        <t-input v-model="modelValue.companyName" placeholder="请输入公司名称"></t-input>
      </t-form-item>
      <t-form-item label="职位" :name="`workExperiences[${index}].jobTitle`" :rules="rules.jobTitle">
        <t-input v-model="modelValue.jobTitle" placeholder="请输入职位"></t-input>
      </t-form-item>
      <t-form-item
        label="工作年限"
        :name="`workExperiences[${index}].workExperienceYears`"
        :rules="rules.workExperienceYears"
      >
        <t-input-number v-model="modelValue.workExperienceYears" :min="0" placeholder="请输入工作年限"></t-input-number>
      </t-form-item>
      <t-form-item label="职业方向">
        <t-input v-model="modelValue.careerDirection" placeholder="如：软件工程师，产品经理"></t-input>
      </t-form-item>
    </t-space>

    <t-button v-if="canRemove" variant="dashed" theme="danger" size="small" class="remove-btn" @click="$emit('remove')">
      删除此经历
    </t-button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, defineModel } from "vue"; // 引入 defineModel
import { workExperienceRules } from "../validation/rules"; // 引入验证规则

defineProps({
  // 'experience' prop 现在由 defineModel 管理，所以可以从 defineProps 中移除
  index: Number,
  canRemove: Boolean,
});

defineEmits(["remove"]);

// 定义一个名为 'experience' 的 model prop
// modelValue 将是一个 ref，其 .value 会自动与父组件传入的 :experience 双向绑定
// 当你修改 modelValue.value.someProperty 时，Vue 会自动触发 update:experience 事件
const modelValue = defineModel("experience", {
  type: Object,
  default: () => ({ isEmployed: false, companyName: "", jobTitle: "", workExperienceYears: 0, careerDirection: "" }),
});

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
