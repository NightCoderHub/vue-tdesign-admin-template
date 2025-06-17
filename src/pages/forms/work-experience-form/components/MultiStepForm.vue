<template>
  <div class="multi-step-form">
    <ProgressBar :current-step="store.currentStep" :total-steps="4" />

    <t-form
      ref="formRef"
      :data="currentStepData"
      :rules="currentStepRules"
      label-align="right"
      :label-width="120"
      :prevent-submit-default="true"
      @submit="handleFormSubmit"
    >
      <template v-if="store.currentStep === 1">
        <Step1BasicInfo />
      </template>
      <template v-else-if="store.currentStep === 2">
        <Step2Education />
      </template>
      <template v-else-if="store.currentStep === 3">
        <Step3Interests />
      </template>
      <template v-else-if="store.currentStep === 4">
        <Step4Courses />
      </template>

      <t-form-item class="form-navigation">
        <t-space>
          <t-button variant="outline" :disabled="store.currentStep === 1" @click="prevStep"> 上一步 </t-button>
          <t-button v-if="store.currentStep < 4" type="submit" theme="primary"> 下一步 </t-button>
          <t-button v-else theme="primary" @click="submitFinalForm"> 提交 </t-button>
        </t-space>
      </t-form-item>
    </t-form>

    <t-dialog
      v-model:visible="showSuccessDialog"
      header="注册成功"
      :confirm-btn="null"
      :cancel-btn="null"
      width="400px"
      @close="handleDialogClose"
    >
      <p>恭喜您，注册成功！</p>
      <p>我们会尽快与您联系并提供个性化课程推荐。</p>
      <template #footer>
        <t-button theme="primary" @click="handleDialogClose">关闭</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRegistrationStore } from "../store";
import ProgressBar from "./ProgressBar.vue";
import Step1BasicInfo from "./Step1BasicInfo.vue";
import Step2Education from "./Step2Education.vue";
import Step3Interests from "./Step3Interests.vue";
import Step4Courses from "./Step4Courses.vue";
import { MessagePlugin } from "tdesign-vue-next";

// 引入 Hooks
import { useFormValidation } from "../hooks/useFormValidation";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useCourseLogic } from "../hooks/useCourseLogic";

const store = useRegistrationStore();
const formRef = ref(null); // TForm 的引用

// 使用步骤导航 Hook
const { nextStep, prevStep } = useStepNavigation(store);

// 使用表单验证 Hook
const { currentStepData, currentStepRules, validateCustomRules } = useFormValidation(store, formRef);

// 使用课程联动逻辑 Hook
const { generateAndSetRecommendedCourses, calculateAndSetTotalPrice } = useCourseLogic(store);

const showSuccessDialog = ref(false);

// TDesign 表单的提交事件
const handleFormSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    // 执行自定义联动校验
    if (!validateCustomRules(store.currentStep)) {
      return; // 如果自定义校验失败，停止流程
    }

    if (store.currentStep === 3) {
      // 从步骤3进入步骤4，生成推荐课程
      generateAndSetRecommendedCourses();
    }
    nextStep(); // 只有 TDesign 校验和自定义校验都通过才进入下一步
  } else {
    MessagePlugin.error("请检查表单填写，有必填项未填写或格式错误。");
  }
};

const submitFinalForm = async () => {
  // 最终提交前，TDesign Form 的 submit 事件会先触发校验
  const { validateResult } = await formRef.value.validate();
  if (validateResult === true) {
    if (!validateCustomRules(store.currentStep)) {
      return;
    }
    calculateAndSetTotalPrice(); // 最终提交前确保价格最新
    store.setFormSubmitted(true);
    showSuccessDialog.value = true;
  } else {
    MessagePlugin.error("请检查表单填写，有必填项未填写或格式错误。");
  }
};

const handleDialogClose = () => {
  showSuccessDialog.value = false;
  // store.$reset(); // 重置整个 Pinia store, 根据需要启用
};
</script>

<style scoped>
.multi-step-form {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-default);
  box-shadow: var(--td-shadow-1);
}
.form-navigation {
  margin-top: 30px !important;
  display: flex;
  justify-content: flex-end;
}
.form-navigation .t-space {
  width: 100%;
  justify-content: space-between;
}
</style>
