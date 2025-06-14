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
      <div class="system-announcement">
        <t-icon name="sound" size="20px" />
        <span>系统公告：新功能上线，请留意查收！</span>
      </div>
    </div>

    <div class="quick-links animate__animated animate__fadeInUp" :style="{ '--animate-delay': '0.6s' }">
      <t-card title="快速入口" class="quick-links-card">
        <t-row :gutter="[16, 16]">
          <t-col v-if="hasPermission('user-manage')" :span="3">
            <div class="quick-link-item" @click="navigateTo('/users')">
              <t-icon name="user-circle" size="24px" />
              <span>用户管理</span>
            </div>
          </t-col>
          <t-col v-if="hasPermission('role-manage')" :span="3">
            <div class="quick-link-item" @click="navigateTo('/roles')">
              <t-icon name="safe" size="24px" />
              <span>角色权限</span>
            </div>
          </t-col>
          <t-col v-if="hasPermission('system-setting')" :span="3">
            <div class="quick-link-item" @click="navigateTo('/settings')">
              <t-icon name="setting" size="24px" />
              <span>系统设置</span>
            </div>
          </t-col>
          <t-col v-if="hasPermission('log-view')" :span="3">
            <div class="quick-link-item" @click="navigateTo('/logs')">
              <t-icon name="file-document" size="24px" />
              <span>日志管理</span>
            </div>
          </t-col>
          <t-col :span="3">
            <div class="quick-link-item" @click="navigateTo('/help')">
              <t-icon name="help-circle" size="24px" />
              <span>帮助中心</span>
            </div>
          </t-col>
        </t-row>
      </t-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router"; // 引入 useRouter

const router = useRouter(); // 获取路由实例

const userName = ref("Admin");
const userAvatar = ref("https://tdesign.gtimg.com/site/avatar.jpg");

const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "上午好";
  } else if (hour < 18) {
    return "下午好";
  } else {
    return "晚上好";
  }
});

// === 权限相关，需要根据你的实际权限系统进行调整 ===
// 假设你有一个全局的权限管理工具或store
// 这是一个模拟的权限检查函数
const userPermissions = ref(["user-manage", "log-view", "system-announcement-view"]); // 假设当前用户拥有的权限
const hasPermission = (permissionKey) => {
  return userPermissions.value.includes(permissionKey);
};
// === 权限相关结束 ===

// 导航到指定路径
const navigateTo = (path) => {
  router.push(path);
};

// 移除 ECharts 相关的代码和生命周期钩子，因为这个页面不展示图表了
// onMounted, onUnmounted, initLineChart, resizeChart, lineChartRef, lineChartInstance, chartLoading 都应该移除
</script>

<style scoped lang="scss">
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");

.welcome-container {
  padding: 24px;
  background-color: var(--td-bg-color-container);
  min-height: calc(100vh - 64px - 48px);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-card {
  background: linear-gradient(135deg, var(--td-brand-color-7) 0%, var(--td-brand-color-5) 100%);
  padding: 32px 40px;
  border-radius: var(--td-radius-default);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--td-shadow-2);
  .animate__animated.animate__fadeInUp {
    animation-duration: 0.8s;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
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

.system-announcement {
  display: flex;
  align-items: center;
  font-size: 16px;
  opacity: 0.9;
  .t-icon {
    margin-right: 8px;
  }
}

.quick-links-card {
  border-radius: var(--td-radius-default);
  box-shadow: var(--td-shadow-1);
  padding: 24px;

  :deep(.t-card__title) {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .quick-link-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 0;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      color 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      color: var(--td-brand-color);
      .t-icon {
        color: var(--td-brand-color);
      }
    }

    .t-icon {
      margin-bottom: 8px;
      color: var(--td-brand-color-8);
      transition: color 0.2s ease;
    }
    span {
      font-size: 14px;
      color: var(--td-text-color-primary);
      transition: color 0.2s ease;
    }
  }
}

.animate__animated {
  -webkit-animation-duration: 0.8s;
  animation-duration: 0.8s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
</style>
