// strategies/priceCalculationStrategies.js

// 策略接口
class PriceStrategy {
  calculate() {
    throw new Error("Method 'calculate()' must be implemented.");
  }
}

// 具体策略：基础课程价格
class BaseCoursePriceStrategy extends PriceStrategy {
  calculate(price, state) {
    const coursePrices = {
      高级数据分析实战: 2000,
      资深项目管理认证: 1800,
      零基础编程入门: 800,
      实用生活英语: 600,
      "Python Web开发": 1500,
      前端框架进阶: 1200,
      "UI/UX设计实战": 1600,
      平面设计基础: 900,
      职业生涯规划: 500,
      面试技巧提升: 400,
      企业战略管理: 2500,
      专业技能进阶: 1300,
      高效团队管理: 1600,
      商务英语听说: 1000,
      青少年兴趣培养: 700,
      高管领导力提升: 3000,
      职场女性发展: 1100,
      "大湾区/长三角IT就业指导": 900,
      Java全栈开发: 2200,
      产品经理实战: 1900,
      高级英语口语: 1200,
      大数据处理与分析: 2100,
    };
    let currentPrice = 0;
    state.step4.selectedCourses.forEach((course) => {
      currentPrice += coursePrices[course] || 0;
    });
    return currentPrice;
  }
}

// 具体策略：学习资料包价格
class MaterialPackPriceStrategy extends PriceStrategy {
  calculate(price, state) {
    if (state.step4.needsMaterialPack) {
      return price + 100;
    }
    return price;
  }
}

// 具体策略：优惠码价格
class DiscountCodePriceStrategy extends PriceStrategy {
  calculate(price, state) {
    const { discountCode } = state.step4;
    const { highestEducation } = state.step2;
    const isAnyEmployed = state.step2.workExperiences.some((exp) => exp.isEmployed === true);

    if (discountCode.toUpperCase() === "STUDENT80" && ["大专", "本科", "硕士", "博士"].includes(highestEducation)) {
      return price * 0.8;
    } else if (discountCode.toUpperCase() === "EMPLOYEE90" && isAnyEmployed) {
      return price * 0.9;
    } else if (discountCode.toUpperCase() === "NEWUSER75") {
      return price * 0.75;
    }
    return price;
  }
}

// 策略上下文 (用于按顺序执行多个价格策略)
class PriceCalculationContext {
  constructor(strategies) {
    this.strategies = strategies;
  }

  execute(state) {
    let totalPrice = 0;
    // 确保基础价格最先计算
    totalPrice = this.strategies[0].calculate(totalPrice, state); // 假设第一个策略是 BaseCoursePriceStrategy

    // 依序应用其他策略
    for (let i = 1; i < this.strategies.length; i++) {
      totalPrice = this.strategies[i].calculate(totalPrice, state);
    }
    return Math.max(0, totalPrice);
  }
}

// 导出价格计算的上下文，注意策略顺序
export const priceCalculationContext = new PriceCalculationContext([
  new BaseCoursePriceStrategy(),
  new MaterialPackPriceStrategy(),
  new DiscountCodePriceStrategy(),
]);
