<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录账号</h1>
        <div class="sub-title">
          <p class="tip">{{ type == "register" ? "已有账号" : "没有账号吗?" }}</p>
          <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">
            {{ type == "register" ? "登录" : "注册新账号" }}
          </p>
        </div>
      </div>

      <login v-if="type === 'login'" />
      <register v-else @register-success="switchType('login')" />
    </div>

    <footer class="copyright">Copyright @ 2021-{{ new Date().getFullYear() }} Tencent. All Rights Reserved</footer>
  </div>
</template>
<script>
export default {
  name: "LoginIndex",
};
</script>
<script setup>
import { ref } from "vue";
import login from "./components/login.vue";
import register from "./components/register.vue";
const type = ref("login");

function switchType(value) {
  type.value = value;
}
</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
