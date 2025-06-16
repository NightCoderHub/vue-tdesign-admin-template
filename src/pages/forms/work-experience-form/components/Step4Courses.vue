<template>
  <t-form-item label="推荐课程" :label-width="0">
    <h3 class="section-title">推荐课程:</h3>
    <t-alert v-if="store.step4.recommendedCourses.length === 0" theme="info" message="根据您的信息，暂无推荐课程。您可以手动选择。" class="alert-message" />
    <t-checkbox-group v-else v-model="form.selectedCourses" :min="1" @change="calculateAndSetTotalPrice">
      <t-space direction="vertical">
        <div v-for="course in store.step4.recommendedCourses" :key="course" class="course-item">
          <t-checkbox
            :value="course"
            :disabled="isRestrictedCourse(course)"
          >
            {{ course }}
            <span v-if="isRestrictedCourse(course)" class="restricted-hint">(学历不符，不可选)</span>
          </t-checkbox>
        </div>
      </t-space>
    </t-checkbox-group>
  </t-form-item>

  <t-form-item label="手动选择课程" :label-width="0">
    <h3 class="section-title">手动选择课程:</h3>
    <t-checkbox-group v-model="form.selectedCourses" @change="calculateAndSetTotalPrice">
      <t-space direction="vertical">
        <div class="course-item">
          <t-checkbox
            value="Java全栈开发"
            :disabled="isRestrictedCourse('Java全栈开发')"
          >
            Java全栈开发
            <span v-if="isRestrictedCourse('Java全栈开发')" class="restricted-hint">(学历不符，不可选)</span>
          </t-checkbox>
        </div>
        <div class="course-item">
          <t-checkbox
            value="产品经理实战"
            :disabled="isRestrictedCourse('产品经理实战')"
          >
            产品经理实战
            <span v-if="isRestrictedCourse('产品经理实战')" class="restricted-hint">(学历不符，不可选)</span>
          </t-checkbox>
        </div>
        <div class="course-item">
          <t-checkbox
            value="高级英语口语"
            :disabled="isRestrictedCourse('高级英语口语')"
          >
            高级英语口语
            <span v-if="isRestrictedCourse('高级英语口语')" class="restricted-hint">(学历不符，不可选)</span>
          </t-checkbox>
        </div>
      </t-space>
    </t-checkbox-group>
    <t-alert v-if="!isCourseSelectionValidByEducation" theme="error" :message="`您当前的学历（${store.step2.highestEducation}）不支持选择某些高级课程。`" class="error-alert" />
  </t-form-item>


  <t-form-item label="学习资料包" v-if="store.shouldShowMaterialPackOption">
    <t-radio-group v-model="form.needsMaterialPack" @change="calculateAndSetTotalPrice">
      <t-radio :value="true">需要 (额外收取100元)</t-radio>
      <t-radio :value="false">不需要</t-radio>
    </t-radio-group>
  </t-form-item>

  <t-form-item label="优惠码" v-if="store.shouldShowDiscountCode">
    <t-input v-model="form.discountCode" @change="calculateAndSetTotalPrice" placeholder="例如：STUDENT80 或 EMPLOYEE90 或 NEWUSER75"></t-input>
    <p class="t-form__help">提示：学生（大专及以上学历）可使用 **STUDENT80** 享受8折；在职人士可使用 **EMPLOYEE90** 享受9折；新用户可使用 **NEWUSER75** 享受7.5折。</p>
  </t-form-item>

  <t-divider align="left">订单总览</t-divider>
  <div class="summary">
    <p v-if="form.selectedCourses.length === 0">您还没有选择任何课程。</p>
    <t-list v-else size="small">
      <t-list-item v-for="course in form.selectedCourses" :key="course">
        <t-list-item-meta :title="course" />
      </t-list-item>
      <t-list-item v-if="form.needsMaterialPack">
        <t-list-item-meta title="学习资料包" />
      </t-list-item>
    </t-list>
    <p class="total-price">
      <strong>总计金额:</strong>
      <span class="price-value">￥{{ store.step4.totalPrice.toFixed(2) }}</span>
    </p>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRegistrationStore } from '../store';
import { Input as TInput, RadioGroup as TRadioGroup, Radio as TRadio, CheckboxGroup as TCheckboxGroup, Checkbox as TCheckbox, FormItem as TFormItem, Alert as TAlert, List as TList, ListItem as TListItem, ListItemMeta as TListItemMeta, Divider as TDivider, Space as TSpace } from 'tdesign-vue-next';
import { useCourseLogic } from '../hooks/useCourseLogic'; // 引入课程逻辑 Hook
import { useFormValidation } from '../hooks/useFormValidation'; // 引入用于获取校验状态的 hook

const store = useRegistrationStore();
const form = computed({
  get: () => store.step4,
  set: (value) => store.updateStep4(value),
});

// 使用课程逻辑 Hook
const { calculateAndSetTotalPrice, restrictedCoursesList, isRestrictedCourse } = useCourseLogic(store);

// 从 FormValidation Hook 中获取联动校验状态
const { isCourseSelectionValidByEducation } = useFormValidation(store);

// 监听选中的课程变化，实时计算总价
watch(() => form.value.selectedCourses, () => {
    calculateAndSetTotalPrice();
}, { deep: true });

// 初始加载时计算一次价格
calculateAndSetTotalPrice();
</script>

<style scoped>
.section-title {
    font-size: 16px;
    margin-bottom: 10px;
    color: var(--td-text-color-primary);
}
.alert-message {
    margin-bottom: 15px;
}
.restricted-hint {
    color: var(--td-error-color-5);
    font-size: 0.85em;
    margin-left: 5px;
}
.error-alert {
    margin-top: 10px;
    margin-bottom: 15px;
}
.summary {
  margin-top: 20px;
  border-top: 1px dashed var(--td-border-level-2-color);
  padding-top: 20px;
  text-align: left;
}
.summary .t-list {
  margin-bottom: 15px;
}
.total-price {
  font-size: 20px;
  font-weight: bold;
  color: var(--td-error-color-5);
}
</style>