// strategies/courseRecommendationStrategies.js

// 策略接口
class RecommendationStrategy {
  recommend() {
    throw new Error("Method 'recommend()' must be implemented.");
  }
}

// 具体策略：学历和工作状态推荐
class EducationWorkStrategy extends RecommendationStrategy {
  recommend(state) {
    const { highestEducation, workExperiences } = state.step2;
    const recommended = new Set();
    const isEmployedAny = workExperiences.some((exp) => exp.isEmployed === true);
    const totalWorkYears = workExperiences.reduce((sum, exp) => sum + (exp.workExperienceYears || 0), 0);

    if (["本科", "硕士", "博士"].includes(highestEducation) && isEmployedAny) {
      recommended.add("高级数据分析实战");
      recommended.add("资深项目管理认证");
      if (totalWorkYears >= 5) {
        recommended.add("企业战略管理");
      }
    } else if (["大专"].includes(highestEducation) && isEmployedAny) {
      recommended.add("专业技能进阶");
    } else if (["小学", "初中", "高中"].includes(highestEducation)) {
      recommended.add("零基础编程入门");
      recommended.add("实用生活英语");
    }
    return recommended;
  }
}

// 具体策略：兴趣推荐
class InterestStrategy extends RecommendationStrategy {
  recommend(state) {
    const { primaryInterest } = state.step3;
    const recommended = new Set();
    if (primaryInterest === "编程") {
      recommended.add("Python Web开发");
      recommended.add("前端框架进阶");
    } else if (primaryInterest === "设计") {
      recommended.add("UI/UX设计实战");
      recommended.add("平面设计基础");
    } else if (primaryInterest === "管理") {
      recommended.add("高效团队管理");
    } else if (primaryInterest === "语言") {
      recommended.add("商务英语听说");
    }
    return recommended;
  }
}

// 具体策略：学习目标和专业推荐
class LearningGoalMajorStrategy extends RecommendationStrategy {
  recommend(state) {
    const { specificLearningGoal } = state.step3;
    const { major } = state.step2;
    const recommended = new Set();
    if (specificLearningGoal.includes("职业发展") || specificLearningGoal.includes("升职")) {
      recommended.add("职业生涯规划");
      recommended.add("面试技巧提升");
    }
    if (specificLearningGoal.includes("数据分析") || (major && major.includes("数据"))) {
      recommended.add("大数据处理与分析");
    }
    return recommended;
  }
}

// 具体策略：用户画像推荐
class UserProfileStrategy extends RecommendationStrategy {
  recommend(state) {
    const { age, gender, region } = state.step1;
    const { workExperiences } = state.step2;
    const recommended = new Set();
    const isEmployedAny = workExperiences.some((exp) => exp.isEmployed === true);
    const totalWorkYears = workExperiences.reduce((sum, exp) => sum + (exp.workExperienceYears || 0), 0);

    if (age && age < 20) {
      recommended.add("青少年兴趣培养");
    }
    if (age && age >= 35 && isEmployedAny && totalWorkYears > 8) {
      recommended.add("高管领导力提升");
    }
    if (gender === "女") {
      recommended.add("职场女性发展");
    }
    if (region.includes("广东") || region.includes("上海")) {
      recommended.add("大湾区/长三角IT就业指导");
    }
    return recommended;
  }
}

// 策略上下文 (用于执行多个推荐策略)
class RecommendationContext {
  constructor(strategies) {
    this.strategies = strategies;
  }

  execute(state) {
    const allRecommendedCourses = new Set();
    for (const strategy of this.strategies) {
      const courses = strategy.recommend(state);
      courses.forEach((course) => allRecommendedCourses.add(course));
    }
    return Array.from(allRecommendedCourses);
  }
}

// 导出推荐策略的上下文
export const recommendationContext = new RecommendationContext([
  new EducationWorkStrategy(),
  new InterestStrategy(),
  new LearningGoalMajorStrategy(),
  new UserProfileStrategy(),
]);
