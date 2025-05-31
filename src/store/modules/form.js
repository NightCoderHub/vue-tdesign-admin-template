import { defineStore } from "pinia";
import { INITIAL_DATA1, INITIAL_DATA2, INITIAL_DATA3 } from "@/pages/form/step/constants"; // 新增：导入初始数据常量

export const useFormStore = defineStore("form", {
  state: () => ({
    formData: {
      step1: { ...INITIAL_DATA1 }, // 替换空对象为初始数据
      step2: { ...INITIAL_DATA2 }, // 替换空对象为初始数据
      step3: { ...INITIAL_DATA3 }, // 替换空对象为初始数据
    },
  }),
  actions: {
    // 保存指定步骤数据
    saveStepData(step, data) {
      this.formData[`step${step}`] = { ...data };
    },
    // 清空所有步骤数据时恢复初始值（非空对象）
    clearAllData() {
      this.formData = {
        step1: { ...INITIAL_DATA1 },
        step2: { ...INITIAL_DATA2 },
        step3: { ...INITIAL_DATA3 },
      };
    },
  },
});
