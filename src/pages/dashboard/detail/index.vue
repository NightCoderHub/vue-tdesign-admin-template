<template>
  <div class="step-form-container">
    <t-card class="box-card">
      <t-steps :current="active" theme="simple">
        <t-step-item title="基本信息" />
        <t-step-item title="详细信息" />
        <t-step-item title="确认信息" />
      </t-steps>

      <div class="form-container">
        <Suspense>
          <template #default>
            <component
              :is="currentComponent"
              ref="formRef"
              v-model:form="formData[currentStep]"
              v-if="currentComponent"
              :basic-info="formData.basicInfo"
              :detail-info="formData.detailInfo"
            />
          </template>
          <template #fallback>
            <t-skeleton :rows="active === 2 ? 6 : 3" animation="gradient" />
          </template>
        </Suspense>

        <div class="form-footer">
          <t-button v-if="active > 0" @click="prev" theme="default">上一步</t-button>
          <t-button v-if="active < 2" @click="next" theme="primary">下一步</t-button>
          <t-button v-if="active === 2" @click="submitForm" theme="success">提交</t-button>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineAsyncComponent, onActivated } from "vue"; // 移除 onDeactivated
import { MessagePlugin, DialogPlugin } from "tdesign-vue-next";
import { useDetailForm } from './hooks/useDetailForm';
import { onBeforeRouteLeave } from 'vue-router'; // 引入 onBeforeRouteLeave

// 异步加载组件
const BasicInfo = defineAsyncComponent(() =>
  import("./components/BasicInfo.vue")
);
const DetailInfo = defineAsyncComponent(() =>
  import("./components/DetailInfo.vue")
);
const ConfirmInfo = defineAsyncComponent(() =>
  import("./components/ConfirmInfo.vue")
);

const active = ref(0);
const formRef = ref(null);

// 定义初始表单数据结构
const INITIAL_FORM_DATA = {
  basicInfo: {
    name: "",
    phone: "",
    email: "",
    userType: "personal",
  },
  detailInfo: {
    city: "",
    address: "",
    remark: "",
  },
};

// 使用对象展开运算符从INITIAL_FORM_DATA拷贝属性
const initialBasicInfo = reactive({ ...INITIAL_FORM_DATA.basicInfo });
const initialDetailInfo = reactive({ ...INITIAL_FORM_DATA.detailInfo });

// 使用 useDetailForm Hook，并传递 initialBasicInfo 和 initialDetailInfo
const { form: detailForm, rules } = useDetailForm({
  form: initialDetailInfo, // 传递 initialDetailInfo 作为表单数据
  basicInfo: initialBasicInfo // 传递 initialBasicInfo 作为 basicInfo
}, (event, value) => {
  if (event === 'update:form') {
    Object.assign(initialDetailInfo, value);
  }
});

// 将 formData 改为管理 initialBasicInfo 和 detailForm
const formData = reactive({
  basicInfo: initialBasicInfo,
  detailInfo: detailForm,
});

// 当前步骤对应的数据键名
const currentStep = computed(() => {
  return active.value === 0 ? 'basicInfo' : 'detailInfo';
});

// 当前步骤对应的组件
const currentComponent = computed(() => {
  const components = {
    0: BasicInfo,
    1: DetailInfo,
    2: ConfirmInfo,
  };
  return components[active.value];
});

// 下一步
const next = async () => {
  if (formRef.value) {
    try {
      const valid = await formRef.value.validate();
      if (valid === true) {
        active.value++;
      }
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  }
};

// 上一步
const prev = () => {
  active.value--;
};

// 提交表单
const submitForm = () => {
  console.log('提交的表单数据：', formData);
  MessagePlugin.success("表单提交成功！");
};

// 新增：在组件激活时检查是否有缓存数据
onActivated(() => {
  const savedFormData = localStorage.getItem('allFormsData');
  if (savedFormData) {
    const dialogInstance = DialogPlugin.confirm({
      header: '数据恢复',
      body: '检测到您有未保存的表单数据，是否恢复？',
      confirmBtn: '恢复',
      cancelBtn: '放弃',
      onConfirm: () => {
        const parsedData = JSON.parse(savedFormData);
        // 恢复 basicInfo
        Object.assign(formData.basicInfo, parsedData.basicInfo);
        // 恢复 detailInfo
        Object.assign(formData.detailInfo, parsedData.detailInfo);
        MessagePlugin.success('数据已恢复！');
        dialogInstance.destroy(); // 使用实例的 destroy 方法关闭弹窗
      },
      onCancel: () => {
        localStorage.removeItem('allFormsData'); // 如果选择放弃，则清空缓存
        MessagePlugin.info('已放弃恢复数据。');
        dialogInstance.destroy(); // 使用实例的 destroy 方法关闭弹窗
      },
      onClose: () => {
        dialogInstance.destroy(); // 使用实例的 destroy 方法关闭弹窗
      }
    });
  }
});

// 新增：在组件失活前保存数据
const saveCurrentFormData = () => {
  return new Promise((resolve) => {
    const dialogInstance = DialogPlugin.confirm({
      header: '数据保存',
      body: '您有未保存的表单数据，是否在离开前保存？',
      confirmBtn: '保存',
      cancelBtn: '不保存',
      onConfirm: () => {
        try {
          localStorage.setItem('allFormsData', JSON.stringify({
            basicInfo: formData.basicInfo,
            detailInfo: formData.detailInfo,
          }));
          MessagePlugin.success('数据已保存！');
          // 重置表单数据
          Object.assign(formData.basicInfo, INITIAL_FORM_DATA.basicInfo);
          Object.assign(formData.detailInfo, INITIAL_FORM_DATA.detailInfo);
          dialogInstance.destroy(); // 使用实例的 destroy 方法关闭弹窗
          resolve(true);
        } catch (e) {
          MessagePlugin.error('数据保存失败：' + e.message);
          dialogInstance.destroy(); // 使用实例的 destroy 方法关闭弹窗
          resolve(false);
        }
      },
      onCancel: () => {
        localStorage.removeItem('allFormsData');
        MessagePlugin.info('已放弃保存数据。');
        // 重置表单数据
        Object.assign(formData.basicInfo, INITIAL_FORM_DATA.basicInfo);
        Object.assign(formData.detailInfo, INITIAL_FORM_DATA.detailInfo);
        dialogInstance.destroy(); // 使用实例的 destroy 方法关闭弹窗
        resolve(true);
      },
      onClose: () => {
        dialogInstance.destroy(); // 使用实例的 destroy 方法关闭弹窗
        resolve(true);
      }
    });
  });
};

// 替换 onDeactivated 为 onBeforeRouteLeave
onBeforeRouteLeave(async (to, from, next) => {
  const shouldProceed = await saveCurrentFormData();
  if (shouldProceed) {
    next(); // 继续路由导航
  } else {
    // 如果保存失败且您希望阻止路由，可以在这里执行 next(false) 或其他逻辑
    next(false); // 阻止路由导航
  }
});
</script>

<style scoped>
.step-form-container {
  padding: 20px;
}

.form-container {
  margin-top: 30px;
}

.form-footer {
  margin-top: 30px;
  text-align: center;
}

:deep(.t-step__title) {
  font-size: 14px;
}

:deep(.t-descriptions) {
  margin: 20px 0;
}
</style>
