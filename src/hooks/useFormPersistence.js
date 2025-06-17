import { onMounted, ref, watch, unref, computed } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { DialogPlugin, MessagePlugin } from "tdesign-vue-next";

/**
 * 通用的表单数据持久化和导航守卫 Hook。
 *
 * @param {object} options 配置选项
 * @param {object | Ref<object>} options.formData 表单数据，可以是 reactive 对象或 Ref<reactiveObject>。
 * @param {object} [options.piniaStoreInstance] 可选：如果 formData 来源于 Pinia Store，请传入对应的 Store 实例，以便调用 $reset 等方法。
 * @param {string} [options.storageKey='appFormPersistence'] 数据在存储中的键名。
 * @param {function} [options.onSave] 保存数据到持久层的回调函数，默认为保存到 localStorage。
 * 接收当前表单数据（已解包）作为参数，应返回一个 Promise<boolean>。
 * @param {function} [options.onLoad] 从持久层加载数据的回调函数，默认为从 localStorage 加载。
 * 应返回一个 Promise<object | null>，resolve 加载到的数据或 null。
 * @param {function} [options.onClear] 清除持久层数据的回调函数，默认为从 localStorage 移除。
 * @param {function} [options.onReset] 可选：自定义的重置数据源的回调函数。如果提供了 piniaStoreInstance，则默认会尝试调用其 $reset 方法。
 * @param {boolean | Ref<boolean>} [options.shouldPromptOnLeave=true] 是否在离开路由时显示保存提示。
 * @param {Ref<boolean>} [options.hasUnsavedChanges] Ref 类型的布尔值，表示是否有未保存的更改。
 * 如果提供，则使用此值判断是否需要提示保存；否则，hook 内部会尝试判断。
 * @param {string} [options.dialogHeaderSave='数据保存'] 保存弹窗的标题。
 * @param {string} [options.dialogBodySave='您有未保存的表单数据，是否在离开前保存？'] 保存弹窗的内容。
 * @param {string} [options.dialogConfirmTextSave='保存'] 保存弹窗的确认按钮文本。
 * @param {string} [options.dialogCancelTextSave='不保存'] 保存弹窗的取消按钮文本。
 * @param {string} [options.dialogHeaderLoad='数据恢复'] 加载弹窗的标题。
 * @param {string} [options.dialogBodyLoad='检测到您有未保存的表单数据，是否恢复？'] 加载弹窗的内容。
 * @param {string} [options.dialogConfirmTextLoad='恢复'] 加载弹窗的确认按钮文本。
 * @param {string} [options.dialogCancelTextLoad='放弃'] 加载弹窗的取消按钮文本。
 */
export function useFormPersistence(options) {
  const {
    formData: rawFormData,
    piniaStoreInstance, // 新增：接收 Pinia Store 实例
    storageKey = "appFormPersistence",
    onSave: customOnSave,
    onLoad: customOnLoad,
    onClear: customOnClear,
    onReset: customOnReset,
    shouldPromptOnLeave = ref(true),
    hasUnsavedChanges: propHasUnsavedChanges,
    dialogHeaderSave = "数据保存",
    dialogBodySave = "您有未保存的表单数据，是否在离开前保存？",
    dialogConfirmTextSave = "保存",
    dialogCancelTextSave = "不保存",
    dialogHeaderLoad = "数据恢复",
    dialogBodyLoad = "检测到您有未保存的表单数据，是否恢复？",
    dialogConfirmTextLoad = "恢复",
    dialogCancelTextLoad = "放弃",
  } = options;

  const currentFormData = computed(() => unref(rawFormData));

  const internalHasUnsavedChanges = ref(false);
  const getHasUnsavedChanges = () => propHasUnsavedChanges?.value ?? internalHasUnsavedChanges.value;

  let initialFormDataSnapshot = null;
  if (!propHasUnsavedChanges) {
    onMounted(() => {
      initialFormDataSnapshot = JSON.stringify(currentFormData.value);
    });
    watch(
      currentFormData,
      (newVal) => {
        internalHasUnsavedChanges.value = JSON.stringify(newVal) !== initialFormDataSnapshot;
      },
      { deep: true },
    );
  }

  const defaultOnSave = async (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      MessagePlugin.success("数据已保存！");
      return true;
    } catch (e) {
      MessagePlugin.error(`数据保存失败：${e.message}`);
      return false;
    }
  };

  const defaultOnLoad = async () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("加载数据失败:", e);
      MessagePlugin.error("加载保存的数据失败！");
      return null;
    }
  };

  const defaultOnClear = async () => {
    localStorage.removeItem(storageKey);
    MessagePlugin.info("已放弃保存数据。");
  };

  // 默认的重置逻辑：优先使用 customOnReset，否则尝试调用 piniaStoreInstance.$reset
  const defaultOnReset = async () => {
    if (piniaStoreInstance && typeof piniaStoreInstance.$reset === "function") {
      piniaStoreInstance.$reset(); // 正确地通过 Store 实例调用 $reset
    } else {
      // 对于普通的 reactive 对象，或者没有提供 Pinia Store 实例的情况
      // 警告并建议用户提供 customOnReset
      console.warn(
        "No specific $reset method found or Pinia store instance not provided. Please provide an 'onReset' callback for proper form data reset.",
      );
      // 为了通用性，这里不再尝试暴力清空，因为我们不知道初始状态
      // 如果需要清空，用户应该提供 customOnReset
    }
  };

  const onSave = customOnSave || defaultOnSave;
  const onLoad = customOnLoad || defaultOnLoad;
  const onClear = customOnClear || defaultOnClear;
  const onReset = customOnReset || defaultOnReset; // 使用新的 onReset

  const promptToLoadData = async () => {
    const savedData = await onLoad();
    if (savedData) {
      return new Promise((resolve) => {
        const dialogInstance = DialogPlugin({
          header: dialogHeaderLoad,
          body: dialogBodyLoad,
          confirmBtn: dialogConfirmTextLoad,
          cancelBtn: dialogCancelTextLoad,
          onConfirm: () => {
            // 这里依然优先使用 $patch，因为即使是 $state，它也是一个reactive对象，
            // 且 $patch 是 Pinia 推荐的方式，它在 $state 上通常不可用，但可以在 Store 实例上用
            // 但是如果 rawFormData 是 store.$state，我们不能直接在其上调用 $patch
            // 最安全的方式是：如果提供了 piniaStoreInstance，就用 piniaStoreInstance.$patch
            // 否则，用 Object.assign
            if (piniaStoreInstance && typeof piniaStoreInstance.$patch === "function") {
              piniaStoreInstance.$patch(savedData);
            } else {
              Object.assign(currentFormData.value, savedData);
            }

            if (!propHasUnsavedChanges) {
              initialFormDataSnapshot = JSON.stringify(currentFormData.value);
            }
            dialogInstance.destroy();
            resolve(true);
          },
          onCancel: async () => {
            await onClear();
            await onReset(); // 调用重置逻辑
            dialogInstance.destroy();
            resolve(false);
          },
          onClose: () => {
            dialogInstance.destroy();
            resolve(false);
          },
        });
      });
    }
    return false;
  };

  const promptToSaveData = async () => {
    if (!getHasUnsavedChanges()) {
      return true;
    }

    return new Promise((resolve) => {
      const dialogInstance = DialogPlugin.confirm({
        header: dialogHeaderSave,
        body: dialogBodySave,
        confirmBtn: dialogConfirmTextSave,
        cancelBtn: dialogCancelTextSave,
        onConfirm: async () => {
          const success = await onSave(currentFormData.value);
          dialogInstance.destroy();
          if (success) {
            if (!propHasUnsavedChanges) {
              initialFormDataSnapshot = JSON.stringify(currentFormData.value);
              internalHasUnsavedChanges.value = false;
            }
            await onReset(); // 建议：保存成功后也重置表单状态
            resolve(true);
          } else {
            resolve(false);
          }
        },
        onCancel: async () => {
          await onClear();
          await onReset(); // 调用重置逻辑
          dialogInstance.destroy();
          if (!propHasUnsavedChanges) {
            internalHasUnsavedChanges.value = false;
          }
          resolve(true);
        },
        onClose: () => {
          dialogInstance.destroy();
          resolve(false);
        },
      });
    });
  };

  onMounted(() => {
    promptToLoadData();
  });

  onBeforeRouteLeave(async (to, from, next) => {
    if (
      (typeof shouldPromptOnLeave === "boolean" ? shouldPromptOnLeave : shouldPromptOnLeave.value) &&
      getHasUnsavedChanges()
    ) {
      const canProceed = await promptToSaveData();
      if (canProceed) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  });

  return {
    promptToLoadData,
    promptToSaveData,
    getHasUnsavedChanges,
    resetFormData: onReset,
  };
}
