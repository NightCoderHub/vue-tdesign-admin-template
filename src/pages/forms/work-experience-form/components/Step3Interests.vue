<template>
  <t-form-item label="主要兴趣" name="primaryInterest">
    <t-select v-model="form.primaryInterest" placeholder="请选择主要兴趣">
      <t-option value="编程">编程</t-option>
      <t-option value="设计">设计</t-option>
      <t-option value="艺术">艺术</t-option>
      <t-option value="管理">管理</t-option>
      <t-option value="语言">语言</t-option>
      <t-option value="其他">其他</t-option>
    </t-select>
  </t-form-item>
  <t-form-item label="次要兴趣">
    <t-checkbox-group v-model="form.secondaryInterests">
      <t-checkbox value="音乐">音乐</t-checkbox>
      <t-checkbox value="阅读">阅读</t-checkbox>
      <t-checkbox value="运动">运动</t-checkbox>
      <t-checkbox value="旅行">旅行</t-checkbox>
    </t-checkbox-group>
  </t-form-item>

  <template v-if="store.shouldShowLearningGoalFields">
    <t-form-item label="是否有明确的学习目标" name="hasLearningGoal">
      <t-radio-group v-model="form.hasLearningGoal">
        <t-radio :value="true">是</t-radio>
        <t-radio :value="false">否</t-radio>
      </t-radio-group>
    </t-form-item>

    <template v-if="form.hasLearningGoal === true">
      <t-form-item label="具体学习目标" name="specificLearningGoal">
        <t-textarea
          v-model="form.specificLearningGoal"
          placeholder="例如：掌握前端开发技能，转行成为一名Web开发者。"
          :autosize="{ minRows: 3, maxRows: 5 }"
        ></t-textarea>
      </t-form-item>
      <t-form-item label="偏好的学习方式">
        <t-checkbox-group v-model="form.preferredLearningMethod">
          <t-checkbox value="线上">线上</t-checkbox>
          <t-checkbox value="线下">线下</t-checkbox>
          <t-checkbox value="混合">混合</t-checkbox>
        </t-checkbox-group>
      </t-form-item>
    </template>
  </template>
</template>

<script setup>
import { computed } from "vue";
import { useRegistrationStore } from "../store";

const store = useRegistrationStore();
const form = computed({
  get: () => store.step3,
  set: (value) => store.updateStep3(value),
});
</script>
