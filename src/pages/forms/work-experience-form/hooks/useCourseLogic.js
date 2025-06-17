// hooks/useCourseLogic.js
import { computed } from "vue";
import { recommendationContext, priceCalculationContext } from "../strategies"; // 引入策略上下文

export function useCourseLogic(store) {
  // 执行课程推荐策略
  const generateAndSetRecommendedCourses = () => {
    const recommended = recommendationContext.execute(store.$state);
    store.setRecommendedCourses(recommended);
  };

  // 执行价格计算策略
  const calculateAndSetTotalPrice = () => {
    const total = priceCalculationContext.execute(store.$state);
    store.setTotalPrice(total);
  };

  // 课程限制列表，可以进一步从后端获取或在策略中定义
  const restrictedCoursesList = computed(() => [
    "高级数据分析实战",
    "资深项目管理认证",
    "企业战略管理",
    "高管领导力提升",
    "大数据处理与分析",
    "Java全栈开发",
    "产品经理实战",
    "高级英语口语",
  ]);

  // 判断课程是否因学历受限
  const isRestrictedCourse = (course) => {
    const { highestEducation } = store.step2;
    const restrictedForLowEducation = ["小学", "初中"].includes(highestEducation);
    return restrictedForLowEducation && restrictedCoursesList.value.includes(course);
  };

  return {
    generateAndSetRecommendedCourses,
    calculateAndSetTotalPrice,
    restrictedCoursesList,
    isRestrictedCourse,
  };
}
