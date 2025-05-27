<template>
  <div>
    <t-button @click="getuseInfo">获取用户信息</t-button>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store";
const userStore = useUserStore();
import { getRouteList } from "@/api/permission";

const getuseInfo = () => {
  userStore
    .getUserInfo()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  getRouterInfo();
};

const getRouterInfo = () => {
  getRouteList()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
