<template>
  <result title="500 Internal Server Error" type="500" tip="抱歉, 服务器出错啦">
    <t-button @click="() => $router.push('/')">返回首页</t-button>
  </result>
</template>
<script>
export default {
  name: "Result500",
};
</script>
<script setup>
import Result from "@/components/result/index.vue";
</script>
