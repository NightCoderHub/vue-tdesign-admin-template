<template>
  <div class="token-refresh-test">
    <h2>无感刷新Token测试页</h2>

    <!-- Token状态展示 -->
    <div class="token-info">
      <p>当前Token：{{ token }}</p>
      <p>Token是否过期：{{ isTokenExpiredVal }}</p>
      <p>剩余有效时间：{{ remainingTime }}秒</p>
    </div>

    <!-- 功能操作按钮 -->
    <div class="actions">
      <button @click="fetchUserInfo">触发需要认证的请求（获取用户信息）</button>
      <button @click="mockTokenExpire">手动模拟Token过期</button>
    </div>

    <!-- 请求结果展示 -->
    <div v-if="userInfo" class="result">
      <h3>用户信息：</h3>
      <p>姓名：{{ userInfo.name }}</p>
      <p>角色：{{ userInfo.roles?.join(", ") }}</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/store";
import { getUserInfoApi } from "@/api/user";
import { isTokenExpired } from "@/utils/auth";

const userStore = useUserStore();
const userInfo = ref(null);
const errorMsg = ref("");
const isLoading = ref(false);

// 计算属性：当前Token状态
const token = computed(() => userStore.token);
const isTokenExpiredVal = computed(() => {
  return isTokenExpired(token.value);
});
const remainingTime = computed(() => {
  if (!token.value) return 0;
  try {
    const payload = JSON.parse(atob(token.value.split(".")[1]));
    return Math.max(payload.exp - Math.floor(Date.now() / 1000), 0);
  } catch (error) {
    console.error("解析Token错误：", error);
    return 0;
  }
});

// 触发认证请求
const fetchUserInfo = async () => {
  isLoading.value = true;
  errorMsg.value = "";
  try {
    const res = await getUserInfoApi();
    userInfo.value = res;
  } catch (error) {
    errorMsg.value = `请求失败：${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

// 手动模拟Token过期（将exp设置为当前时间前1秒）
const mockTokenExpire = () => {
  if (!token.value) return;
  const [header, payloadBase64, signature] = token.value.split(".");
  const payload = JSON.parse(atob(payloadBase64));
  payload.exp = Math.floor(Date.now() / 1000) - 1; // 设置为1秒前过期
  const newPayloadBase64 = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  userStore.token = `${header}.${newPayloadBase64}.${signature}`;
};
</script>

<style scoped>
.token-refresh-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.token-info {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.actions {
  margin: 20px 0;
  display: flex;
  gap: 15px;
}

button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.result,
.error {
  margin: 20px 0;
  padding: 15px;
  border-radius: 8px;
}

.result {
  background: #e6f4ff;
}

.error {
  background: #ffe6e6;
  color: #f56c6c;
}
</style>
