<template>
  <t-form
    :class="['item-container', `register-phone`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="phone">
      <t-input v-model="formData.phone" :maxlength="11" size="large" placeholder="请输入您的手机号">
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

    <t-form-item class="verification-code" name="verifyCode">
      <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
      <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
        {{ countDown == 0 ? "发送验证码" : `${countDown}秒后可重发` }}
      </t-button>
    </t-form-item>

    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox> <span>TDesign服务协议</span> 和
      <span>TDesign 隐私声明</span>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup>
import { MessagePlugin } from "tdesign-vue-next";
import { ref } from "vue";

import { useCounter } from "@/hooks/useCounter";

const INITIAL_DATA = {
  phone: "",
  password: "",
  verifyCode: "",
  checked: false,
};

const FORM_RULES = {
  phone: [{ required: true, message: "手机号必填", type: "error" }],
  password: [{ required: true, message: "密码必填", type: "error" }],
  verifyCode: [{ required: true, message: "验证码必填", type: "error" }],
};

const formData = ref({ ...INITIAL_DATA });

const showPsw = ref(false);

const [countDown, handleCounter] = useCounter();

const emit = defineEmits(["registerSuccess"]);

const onSubmit = (ctx) => {
  if (ctx.validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error("请同意TDesign服务协议和TDesign 隐私声明");
      return;
    }
    MessagePlugin.success("注册成功");
    emit("registerSuccess");
  }
};
</script>
<style lang="scss" scoped>
@use "../index.scss";
</style>
