import { reactive, computed, watch } from 'vue'; // 移除 onMounted, onBeforeUnmount
import { personalUserStrategy } from './personalUserStrategy';
import { enterpriseUserStrategy } from './enterpriseUserStrategy';
// 移除 DialogPlugin 和 MessagePlugin 的引入，因为这些现在由 index.vue 管理

const userStrategies = {
  personal: personalUserStrategy,
  enterprise: enterpriseUserStrategy,
};

export function useDetailForm(props, emit) {
  const form = reactive({
    city: props.form.city,
    address: props.form.address,
    remark: props.form.remark,
    ...personalUserStrategy.getFormFields(props.form),
    ...enterpriseUserStrategy.getFormFields(props.form),
  });

  const cityOptions = computed(() => {
    if (props.basicInfo.userType === 'personal') {
      return [
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '成都', value: 'chengdu' },
      ];
    } else {
      return [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
      ];
    }
  });

  const cachedForms = reactive(JSON.parse(localStorage.getItem('cachedForms')) || {
    personal: {},
    enterprise: {},
  });

  // 移除 allFormsData 及其相关的 watch 监听，这些现在由 index.vue 管理
  // const allFormsData = reactive({
  //   basicInfo: { ...props.basicInfo },
  //   detailInfo: { ...form }
  // });

  // watch(form, (newVal) => {
  //   Object.assign(allFormsData.detailInfo, newVal);
  // }, { deep: true });

  // watch(() => props.basicInfo, (newVal) => {
  //   Object.assign(allFormsData.basicInfo, newVal);
  // }, { deep: true });

  watch(() => props.form, (newVal) => {
    Object.assign(form, newVal);
  }, { deep: true });

  // 监听 props.basicInfo.userType 的变化，以更新 cachedForms
  watch(
    () => props.basicInfo.userType,
    (newType, oldType) => {
      // 在类型切换前，保存当前表单数据到对应的缓存
      if (oldType) { 
        cachedForms[oldType] = { ...form }; // 直接保存 form 对象
      }
      // 加载新类型的缓存数据，如果没有则初始化为空对象
      Object.assign(form, cachedForms[newType] || {});
      localStorage.setItem('cachedForms', JSON.stringify(cachedForms));
    },
    { immediate: true } // 立即执行一次，以初始化表单数据
  );

  // 深度监听 cachedForms 的变化，并同步到 Local Storage
  watch(
    cachedForms,
    (newVal) => {
      localStorage.setItem('cachedForms', JSON.stringify(newVal));
    },
    { deep: true }
  );

  const updateForm = () => {
    emit('update:form', { ...form });
  };

  const rules = computed(() => {
    const commonRules = {
      city: [{ required: true, message: "请选择城市", trigger: "change" }],
      address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
    };
    const currentStrategy = userStrategies[props.basicInfo.userType];
    return {
      ...commonRules,
      ...(currentStrategy ? currentStrategy.getRules() : {}),
    };
  });

  // 移除 onMounted 和 onBeforeUnmount 逻辑，由 index.vue 管理
  // onMounted(() => {
  //   ...
  // });

  // const saveCurrentFormData = () => {
  //   ...
  // };

  // const handleVisibilityChange = () => {
  //   ...
  // };

  // onMounted(() => {
  //   ...
  // });

  // onBeforeUnmount(() => {
  //   ...
  // });

  return {
    form,
    cityOptions,
    updateForm,
    rules
  };
}