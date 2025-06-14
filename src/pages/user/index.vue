<template>
  <div class="welcome-container">
    <div class="header-card">
      <div class="header-content">
        <t-avatar :image="userAvatar" size="large" shape="circle" class="avatar" />
        <div class="user-info">
          <h2 class="greeting">{{ greetingText }}，{{ userName }}！</h2>
          <p class="role">欢迎使用 TDesign 后台管理系统</p>
        </div>
      </div>
      <div class="weather-info">
        <t-icon name="cloudy" size="24px" class="weather-icon" />
        <span class="temperature">28°C</span>
        <span class="city">晴转多云 · 深圳</span>
      </div>
    </div>

    <div class="dashboard-cards">
      <t-card class="card-item animate__animated animate__fadeInUp" :style="{ '--animate-delay': '0.1s' }">
        <div class="card-title">待办事项</div>
        <div class="card-value">12</div>
        <t-tag theme="warning" variant="light" size="small">进行中</t-tag>
      </t-card>
      <t-card class="card-item animate__animated animate__fadeInUp" :style="{ '--animate-delay': '0.2s' }">
        <div class="card-title">新增用户</div>
        <div class="card-value">85</div>
        <t-tag theme="success" variant="light" size="small">本周</t-tag>
      </t-card>
      <t-card class="card-item animate__animated animate__fadeInUp" :style="{ '--animate-delay': '0.3s' }">
        <div class="card-title">系统消息</div>
        <div class="card-value">5</div>
        <t-tag theme="danger" variant="light" size="small">未读</t-tag>
      </t-card>
      <t-card class="card-item animate__animated animate__fadeInUp" :style="{ '--animate-delay': '0.4s' }">
        <div class="card-title">访问量</div>
        <div class="card-value">12,345</div>
        <t-tag theme="primary" variant="light" size="small">今日</t-tag>
      </t-card>
    </div>

    <div class="chart-section">
      <t-card class="chart-card animate__animated animate__fadeInUp" :style="{ '--animate-delay': '0.5s' }">
        <template #title>近7日数据趋势</template>
        <t-loading :loading="chartLoading" size="small">
          <div ref="lineChartRef" style="height: 300px"></div>
        </t-loading>
      </t-card>
    </div>

    <div class="quick-links animate__animated animate__fadeInUp" :style="{ '--animate-delay': '0.6s' }">
      <t-card title="快速入口" class="quick-links-card">
        <t-row :gutter="[16, 16]">
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="user-circle" size="24px" />
              <span>用户管理</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="user-safety" size="24px" />
              <span>角色权限</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="setting" size="24px" />
              <span>系统设置</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="system-log" size="24px" />
              <span>日志管理</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="chart-bar" size="24px" />
              <span>数据报表</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="notification" size="24px" />
              <span>通知公告</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="help-circle" size="24px" />
              <span>帮助中心</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item">
              <t-icon name="ellipsis" size="24px" />
              <span>更多功能</span>
            </div>
          </t-col>
        </t-row>
      </t-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts"; // 引入 ECharts

// 假设用户数据从全局状态或 API 获取
const userName = ref("Admin");
const userAvatar = ref("https://tdesign.gtimg.com/site/avatar.jpg");

// 问候语
const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "上午好";
  } else if (hour < 18) {
    return "下午好";
    // 根据当前时间调整，现在是上午，所以会显示“上午好”
  } else {
    return "晚上好";
  }
});

// ECharts 相关
const lineChartRef = ref(null);
let lineChartInstance = null;
const chartLoading = ref(true);

const initLineChart = () => {
  if (lineChartRef.value) {
    lineChartInstance = echarts.init(lineChartRef.value);
    const option = {
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "数据量",
          type: "line",
          stack: "总量",
          data: [120, 132, 101, 134, 90, 230, 210],
          areaStyle: {}, // 启用面积图
          smooth: true, // 平滑曲线
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              // 渐变色
              { offset: 0, color: "rgba(75, 123, 236, 0.8)" }, // 渐变起始颜色
              { offset: 1, color: "rgba(75, 123, 236, 0.0)" }, // 渐变结束颜色
            ]),
          },
          lineStyle: {
            color: "#4B7BEC", // 线条颜色
          },
        },
      ],
    };
    lineChartInstance.setOption(option);
    chartLoading.value = false;
  }
};

// 窗口大小变化时重设图表大小
const resizeChart = () => {
  lineChartInstance?.resize();
};

onMounted(() => {
  // 模拟数据加载
  setTimeout(() => {
    initLineChart();
  }, 500); // 模拟数据加载延迟

  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  lineChartInstance?.dispose(); // 组件销毁时销毁图表实例
});
</script>

<style scoped lang="scss">
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"); // 引入 Animate.css

.welcome-container {
  padding: 24px;
  background-color: var(--td-bg-color-container); // 使用 TDesign 变量
  min-height: calc(100vh - 64px - 48px); // 减去头部和padding的高度
  display: flex;
  flex-direction: column;
  gap: 24px; // 间距
}

.header-card {
  background: linear-gradient(135deg, var(--td-brand-color-7) 0%, var(--td-brand-color-5) 100%); // 漂亮的渐变背景
  padding: 32px 40px;
  border-radius: var(--td-radius-default);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--td-shadow-2); // TDesign 阴影
  .animate__animated.animate__fadeInUp {
    animation-duration: 0.8s; // 更快的动画
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  border: 2px solid rgba(255, 255, 255, 0.3); // 半透明边框
}

.user-info {
  .greeting {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .role {
    font-size: 16px;
    opacity: 0.9;
  }
}

.weather-info {
  display: flex;
  align-items: center;
  font-size: 16px;
  opacity: 0.8;

  .weather-icon {
    margin-right: 8px;
  }
  .temperature {
    font-size: 20px;
    font-weight: bold;
    margin-right: 8px;
  }
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); // 响应式布局
  gap: 24px;
}

.card-item {
  text-align: center;
  padding: 24px;
  border-radius: var(--td-radius-default);
  box-shadow: var(--td-shadow-1);
  transition: transform 0.3s ease; // 悬停动画

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--td-shadow-3);
  }

  .card-title {
    font-size: 16px;
    color: var(--td-text-color-secondary);
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 32px;
    font-weight: bold;
    color: var(--td-text-color-primary);
    margin-bottom: 16px;
  }
}

.chart-section {
  .chart-card {
    border-radius: var(--td-radius-default);
    box-shadow: var(--td-shadow-1);
    padding: 24px;
  }
}

.quick-links-card {
  border-radius: var(--td-radius-default);
  box-shadow: var(--td-shadow-1);
  padding: 24px;

  // SCSS 嵌套语法 for deep selector
  :deep(.t-card__title) {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  // 针对 t-row 和 t-col 实现的快速入口项样式
  .quick-link-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 0; // 调整内边距
    cursor: pointer;
    transition:
      transform 0.2s ease,
      color 0.2s ease; // 增加颜色过渡

    &:hover {
      transform: translateY(-3px);
      color: var(--td-brand-color); // 悬停时文字颜色
      .t-icon {
        // 悬停时图标颜色
        color: var(--td-brand-color);
      }
    }

    .t-icon {
      margin-bottom: 8px;
      color: var(--td-brand-color-8); // 默认图标颜色
      transition: color 0.2s ease; // 添加图标颜色过渡
    }
    span {
      font-size: 14px;
      color: var(--td-text-color-primary); // 默认文本颜色
      transition: color 0.2s ease; // 添加文本颜色过渡
    }
  }
}

// 确保 Animate.css 生效
.animate__animated {
  -webkit-animation-duration: 0.8s;
  animation-duration: 0.8s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
</style>
