<template>
  <div class="item-container">
    <t-form ref="formRef" :data="formData" label-width="0" :rule="FORM_RULES" @submit="onSubmit">
      <t-form-item name="account">
        <t-input v-model="formData.account" size="large" placeholder="请输入账号">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
        <span class="tip">忘记账号</span>
      </div>

      <t-form-item class="btn-container">
        <t-button block size="large" type="submit"> 登录 </t-button>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { MessagePlugin } from "tdesign-vue-next";
import { useUserStore } from "@/store";

const userStore = useUserStore();

const INITIAL_DATA = {
  phone: "",
  account: "admin",
  password: "admin",
  verifyCode: "",
  checked: false,
};

const FORM_RULES = {
  phone: [{ required: true, message: "手机号必填", type: "error" }],
  account: [{ required: true, message: "账号必填", type: "error" }],
  password: [{ required: true, message: "密码必填", type: "error" }],
  verifyCode: [{ required: true, message: "验证码必填", type: "error" }],
};

// const formRef = useTemplateRef();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const router = useRouter();
const route = useRoute();
const onSubmit = async (ctx) => {
  if (ctx.validateResult === true) {
    try {
      await userStore.login(formData.value);

      MessagePlugin.success("登录成功");
      const redirect = route.query.redirect;
      const redirectUrl = redirect ? decodeURIComponent(redirect) : "/dashboard";
      router.push(redirectUrl);
    } catch (e) {
      MessagePlugin.error(e.message);
    }
  }
};
</script>
<style lang="scss" scoped>
@use "../index.scss";
</style>
