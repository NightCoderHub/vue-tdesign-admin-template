<template>
  <div>
    <div class="form-step-container">
      <t-card :bordered="false">
        <t-steps class="step-container" :current="activeForm + 1" status="process">
          <t-step-item title="步骤1标题" content="步骤1副标题" />
          <t-step-item title="步骤2标题" content="步骤2副标题" />
          <t-step-item title="步骤3标题" content="步骤3副标题" />
          <t-step-item title="提交完成" content="信息确认" />
        </t-steps>
      </t-card>

      <!-- 使用 keep-alive 缓存动态组件 -->
      <keep-alive>
        <component :is="currentForm" :step-data="stepData" @submit="onSubmit" @reset="onReset" />
      </keep-alive>

      <!-- 提交完成页 -->
      <div v-show="activeForm === 3" key="complete" class="step-form-4">
        <t-space direction="vertical" style="align-items: center">
          <t-icon name="check-circle-filled" style="color: green" size="52px" />
          <p class="text">提交完成</p>
          <p class="tips">您的信息已提交成功</p>
          <div class="button-group">
            <t-button theme="primary" @click="onReset(0)"> 重新申请 </t-button>
            <t-button variant="base" theme="default" @click="complete"> 查看详情 </t-button>
          </div>
        </t-space>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "FormStep",
});
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useFormStore } from "@/store/modules/form";

// 引入步骤组件
import Step1Form from "./components/Step1Form.vue";
import Step2Form from "./components/Step2Form.vue";
import Step3Form from "./components/Step3Form.vue";

import { INITIAL_DATA1, INITIAL_DATA2, INITIAL_DATA3 } from "./constants";

// 统一表单状态（移除冗余的 formData1/formData2/formData3）
const formState = reactive({
  step1: { ...INITIAL_DATA1 },
  step2: { ...INITIAL_DATA2 },
  step3: { ...INITIAL_DATA3 },
});
const activeForm = ref(0);
const formStore = useFormStore();
const router = useRouter();

// 动态组件切换逻辑

const currentForm = computed(() => {
  switch (activeForm.value) {
    case 0:
      return Step1Form;
    case 1:
      return Step2Form;
    case 2:
      return Step3Form;
    default:
      return null;
  }
});
// 优化计算属性，明确依赖 activeForm 和 formState 的动态键

const stepData = computed(() => {
  const currentStep = activeForm.value + 1; // 显式提取步骤号
  // 确保键存在（可选：添加防御性检查）
  if (!formState[`step${currentStep}`]) {
    console.warn(`formState 中不存在 step${currentStep} 数据`);
    return {};
  }
  return formState[`step${currentStep}`];
});
// 从 Pinia 恢复历史数据（初始化）
const restoreStoreData = () => {
  const storeData = formStore.formData;
  Object.keys(storeData).forEach((step) => {
    if (Object.keys(storeData[step]).length > 0) {
      formState[step] = { ...storeData[step] };
    }
  });
};

// 恢复草稿（初始化时）
const restoreDraft = () => {
  const draft = localStorage.getItem("formDraft");
  if (draft) {
    const confirmRestore = confirm("检测到未提交的草稿，是否恢复？");
    if (confirmRestore) {
      Object.assign(formState, JSON.parse(draft));
    } else {
      localStorage.removeItem("formDraft");
    }
  }
};

onMounted(() => {
  restoreStoreData();
  restoreDraft();
});

// 提交逻辑（保存数据到 Pinia）

const onSubmit = (result, nextStep) => {
  if (result.validateResult === true) {
    formStore.saveStepData(activeForm.value + 1, formState[`step${activeForm.value + 1}`]);
    activeForm.value = nextStep;
  }
};

// 上一步逻辑
const onReset = (prevStep) => {
  activeForm.value = prevStep;
};

// 路由离开守卫（保存草稿）
onBeforeRouteLeave((to, from, next) => {
  if (activeForm.value !== 3) {
    const confirmResult = confirm("当前有未提交的表单数据，是否确认离开？离开后数据将保存为草稿");
    if (confirmResult) {
      localStorage.setItem("formDraft", JSON.stringify(formState));
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

// 完成提交（清空缓存）
const complete = () => {
  localStorage.removeItem("formDraft");
  formStore.clearAllData();
  router.replace({ path: "/detail/advanced" });
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
