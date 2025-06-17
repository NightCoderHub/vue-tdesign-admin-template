// validation/rules.js
import { MessagePlugin } from "tdesign-vue-next";

// TDesign 表单规则
export const formRules = {
  step1: {
    name: [{ required: true, message: "姓名必填" }],
    age: [
      { required: true, message: "年龄必填" },
      { number: true, message: "年龄必须是数字" },
      { min: 1, message: "年龄不能小于1" },
    ],
    phoneNumber: [
      { required: true, message: "手机号必填" },
      { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
    ],
    email: [
      { required: true, message: "邮箱必填" },
      { email: true, message: "邮箱格式不正确" },
    ],
    gender: [{ required: true, message: "性别必选" }], // 补充
    region: [{ required: true, message: "所在地区必填" }], // 补充
  },
  step2: {
    highestEducation: [{ required: true, message: "最高学历必选" }],
    graduationYear: [
      { required: true, message: "毕业年份必填" },
      { number: true, message: "毕业年份必须是数字", trigger: "blur" },
      { min: 1900, message: "毕业年份不能早于1900", trigger: "blur" },
    ],
  },
  step3: {
    primaryInterest: [{ required: true, message: "主要兴趣必选" }],
    hasLearningGoal: [{ required: true, message: "请选择是否有明确学习目标", trigger: "change" }],
    specificLearningGoal: [{ required: true, message: "具体学习目标必填", trigger: "blur" }],
  },
  step4: {
    selectedCourses: [
      { required: true, message: "请至少选择一门课程", trigger: "change", validator: (val) => val && val.length > 0 },
    ],
  },
};

// 动态添加的工作经历项的规则，用于 WorkExperienceForm 组件内部
export const workExperienceRules = {
  isEmployed: [{ required: true, message: "请选择是否在职", trigger: "change" }],
  companyName: [{ required: true, message: "公司名称必填", trigger: "blur" }],
  jobTitle: [{ required: true, message: "职位必填", trigger: "blur" }],
  workExperienceYears: [
    { required: true, message: "工作年限必填", trigger: "blur" },
    { number: true, message: "工作年限必须是数字", trigger: "blur" },
    { min: 0, message: "工作年限不能为负", trigger: "blur" },
  ],
};

// 自定义校验规则 (联动校验)
export const customValidationRules = {
  // 步骤2 的自定义规则
  2: [
    {
      name: "ageEducation",
      message: "您的年龄与所选学历不符，18岁以下用户最高学历只能选择高中及以下！",
      validator: (store) => {
        const { age } = store.step1;
        const { highestEducation } = store.step2;
        if (!age || !highestEducation) return true; // 未填写则不校验
        if (age < 18 && ["大专", "本科", "硕士", "博士"].includes(highestEducation)) {
          return false;
        }
        return true;
      },
    },
    {
      name: "workExperienceDetails",
      message: "请填写完整工作经历的在职信息！",
      validator: (store) => {
        let isValid = true;
        store.step2.workExperiences.forEach((exp, index) => {
          // 如果该工作经历项应该显示在职信息
          if (store.shouldShowEmploymentFields(index)) {
            if (exp.isEmployed === null) {
              MessagePlugin.error(`请选择第${index + 1}条工作经历的“是否在职”！`);
              isValid = false;
            }
            if (
              exp.isEmployed === true &&
              (!exp.companyName || !exp.jobTitle || exp.workExperienceYears === null || exp.workExperienceYears < 0)
            ) {
              MessagePlugin.error(`请填写完整第${index + 1}条工作经历的在职信息（公司、职位、年限且年限不为负）！`);
              isValid = false;
            }
          }
        });
        return isValid;
      },
    },
  ],
  // 步骤3 的自定义规则
  3: [
    {
      name: "isLearningGoalFilled",
      message: "请填写完整学习目标信息！",
      validator: (store) => {
        if (store.shouldShowLearningGoalFields) {
          if (store.step3.hasLearningGoal === null) {
            MessagePlugin.error("请选择是否有明确学习目标！");
            return false;
          }
          if (store.step3.hasLearningGoal === true && !store.step3.specificLearningGoal) {
            MessagePlugin.error("请填写具体学习目标！");
            return false;
          }
        }
        return true;
      },
    },
  ],
  // 步骤4 的自定义规则
  4: [
    {
      name: "educationCourseSelection",
      message: "您的学历不支持选择某些高级课程，请重新选择！",
      validator: (store) => {
        const { highestEducation } = store.step2;
        const { selectedCourses } = store.step4;
        if (["小学", "初中"].includes(highestEducation)) {
          const restrictedCourses = [
            "高级数据分析实战",
            "资深项目管理认证",
            "企业战略管理",
            "高管领导力提升",
            "大数据处理与分析",
            "Java全栈开发",
            "产品经理实战",
            "高级英语口语",
          ];
          const hasRestricted = selectedCourses.some((course) => restrictedCourses.includes(course));
          if (hasRestricted) {
            MessagePlugin.error(customValidationRules[4].find((r) => r.name === "educationCourseSelection").message);
            return false;
          }
        }
        return true;
      },
    },
    {
      name: "minCoursesSelected",
      message: "请至少选择一门课程！",
      validator: (store) => {
        if (store.step4.selectedCourses.length === 0) {
          MessagePlugin.error(customValidationRules[4].find((r) => r.name === "minCoursesSelected").message);
          return false;
        }
        return true;
      },
    },
  ],
};
