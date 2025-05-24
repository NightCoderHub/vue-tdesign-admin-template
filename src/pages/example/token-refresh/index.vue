<template>
  <div class="token-refresh-demo">
    <t-card title="无感刷新Token演示" :bordered="false">
      <t-space direction="vertical" size="large" style="width: 100%">
        <!-- 当前Token信息 -->
        <t-card title="当前Token信息" bordered>
          <t-descriptions :data="tokenInfo" layout="vertical" :column="2" />

          <t-space class="mt-4">
            <t-button theme="primary" @click="refreshTokenManually"> 手动刷新Token </t-button>
            <t-button theme="default" @click="simulateExpiredToken"> 模拟Token过期 </t-button>
            <t-button theme="danger" @click="clearTokens"> 清除Token </t-button>
          </t-space>
        </t-card>

        <!-- API请求测试 -->
        <t-card title="API请求测试" bordered>
          <t-space direction="vertical" style="width: 100%">
            <t-alert
              theme="info"
              message="点击下方按钮发送API请求，如果Token已过期，将自动刷新Token并重试请求"
              class="mb-4"
            />

            <t-space>
              <t-button @click="sendNormalRequest"> 发送正常请求 </t-button>
              <t-button @click="sendExpiredTokenRequest"> 发送模拟过期Token请求 </t-button>
            </t-space>

            <t-divider />

            <div class="response-container">
              <h4>请求响应结果：</h4>
              <t-textarea v-model="responseResult" readonly :autosize="{ minRows: 5, maxRows: 10 }" />
            </div>
          </t-space>
        </t-card>

        <!-- 请求日志 -->
        <t-card title="请求日志" bordered>
          <t-list :split="true">
            <t-list-item v-for="(log, index) in requestLogs" :key="index">
              <t-tag :theme="getLogTheme(log.type)" class="mr-2">{{ log.type }}</t-tag>
              <span>{{ log.time }}</span>
              <span class="ml-4">{{ log.message }}</span>
            </t-list-item>
          </t-list>

          <t-button v-if="requestLogs.length > 0" theme="default" block class="mt-4" @click="clearLogs">
            清除日志
          </t-button>
        </t-card>
      </t-space>
    </t-card>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { useUserStore } from "@/store";
import { getToken, getRefreshToken, isTokenExpired, setToken } from "@/utils/auth";

defineOptions({
  name: "TokenRefreshDemo",
});

const userStore = useUserStore();

// 响应结果
const responseResult = ref("");

// 请求日志
const requestLogs = ref([]);

// 添加日志
const addLog = (type, message) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  requestLogs.value.unshift({
    type,
    time,
    message,
  });
};

// 获取日志主题
const getLogTheme = (type) => {
  const themeMap = {
    info: "primary",
    success: "success",
    warning: "warning",
    error: "danger",
  };
  return themeMap[type] || "default";
};

// 清除日志
const clearLogs = () => {
  requestLogs.value = [];
  MessagePlugin.success("日志已清除");
};

// 当前Token信息
const tokenInfo = computed(() => {
  const token = userStore.token || getToken();
  const refreshToken = userStore.refreshToken || getRefreshToken();

  let tokenStatus = "有效";
  let tokenExpired = false;

  if (!token) {
    tokenStatus = "未设置";
  } else if (isTokenExpired(token)) {
    tokenStatus = "已过期";
    tokenExpired = true;
  }

  return [
    { label: "Access Token", content: token || "未设置" },
    { label: "Refresh Token", content: refreshToken || "未设置" },
    { label: "Token状态", content: tokenStatus },
    { label: "Token是否过期", content: tokenExpired ? "是" : "否" },
  ];
});

// 手动刷新Token
const refreshTokenManually = async () => {
  try {
    addLog("info", "手动刷新Token开始");
    await userStore.refreshAccessToken();
    addLog("success", "手动刷新Token成功");
    MessagePlugin.success("Token刷新成功");
  } catch (error) {
    addLog("error", `手动刷新Token失败: ${error.message}`);
    MessagePlugin.error(`Token刷新失败: ${error.message}`);
  }
};

// 模拟Token过期
const simulateExpiredToken = () => {
  // 设置一个已过期的Token
  const expiredToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  setToken(expiredToken);
  userStore.token = expiredToken;

  addLog("warning", "已设置模拟过期的Token");
  MessagePlugin.warning("已设置模拟过期的Token");
};

// 清除Token
const clearTokens = () => {
  userStore.logout();
  addLog("info", "已清除所有Token");
  MessagePlugin.info("已清除所有Token");
};

// 发送正常请求
const sendNormalRequest = async () => {
  try {
    addLog("info", "发送正常API请求");
    responseResult.value = "请求中...";

    // 模拟API请求
    const response = await mockApiRequest();

    responseResult.value = JSON.stringify(response, null, 2);
    addLog("success", "请求成功");
  } catch (error) {
    responseResult.value = `请求失败: ${error.message}`;
    addLog("error", `请求失败: ${error.message}`);
  }
};

// 发送模拟过期Token请求
const sendExpiredTokenRequest = async () => {
  try {
    addLog("info", "发送模拟过期Token的API请求");
    responseResult.value = "请求中...";

    // 模拟API请求（带过期Token）
    const response = await mockExpiredTokenRequest();

    responseResult.value = JSON.stringify(response, null, 2);
    addLog("success", "请求成功（Token已自动刷新）");
  } catch (error) {
    responseResult.value = `请求失败: ${error.message}`;
    addLog("error", `请求失败: ${error.message}`);
  }
};

// 模拟API请求
const mockApiRequest = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          message: "请求成功",
          timestamp: new Date().toISOString(),
          user: {
            id: 1,
            name: "Tencent",
            role: "admin",
          },
        },
      });
    }, 500);
  });
};

// 模拟过期Token请求
const mockExpiredTokenRequest = () => {
  return new Promise((resolve) => {
    // 先模拟一个401错误
    setTimeout(() => {
      // 这里会触发响应拦截器中的Token刷新逻辑
      // const error = {
      //   response: {
      //     status: 401,
      //     data: {
      //       code: 401,
      //       message: 'Token已过期',
      //     },
      //   },
      // };

      // 模拟响应拦截器处理
      addLog("warning", "Token已过期，正在自动刷新");

      // 模拟刷新Token后重试请求
      setTimeout(() => {
        addLog("info", "Token已刷新，重试原始请求");

        // 模拟重试成功
        resolve({
          code: 0,
          data: {
            message: "请求成功（Token已自动刷新）",
            timestamp: new Date().toISOString(),
            user: {
              id: 1,
              name: "Tencent",
              role: "admin",
            },
          },
        });
      }, 1000);
    }, 500);
  });
};
</script>

<style scoped>
.token-refresh-demo {
  padding: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.ml-4 {
  margin-left: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.response-container {
  margin-top: 16px;
}
</style>
