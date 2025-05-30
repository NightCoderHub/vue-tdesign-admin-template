<template>
  <div class="dashboard-base">
    <t-tabs :default-value="1" @change="onChange">
      <t-tab-panel :value="1" label="选项卡1"> </t-tab-panel>
      <t-tab-panel :value="2" label="选项卡2"> </t-tab-panel>
      <t-tab-panel :value="3" label="选项卡3"> </t-tab-panel>
    </t-tabs>

    <div style="display: flex; flex-wrap: wrap; width: 1600px">
      <t-card v-for="item in list" :key="item.mal_id" :title="item.title" header-bordered :style="{ width: '400px' }">
        <t-image
          :src="item.images.jpg.large_image_url"
          :lazy="true"
          :style="{ width: '120px', height: '120px' }"
        ></t-image>
      </t-card>
    </div>

    <t-button @click="requestData">请求</t-button>
  </div>
</template>

<script setup>
defineOptions({
  name: "DashboardBase",
});
import { requestWithPublicAPi } from "@/utils/request";
import { getRouteList } from "@/api/permission";
import { ref } from "vue";
const list = ref([]);
// 添加缓存对象，存储各类型的历史数据
const cache = ref({});

const onChange = (value) => {
  const type = value === 1 ? "tv" : value === 2 ? "movie" : "ova";
  // 优先使用缓存数据
  if (cache.value[type]?.length) {
    list.value = cache.value[type];
    return;
  }
  // 无缓存时发起请求并缓存
  requestWithPublicAPi
    .get({
      url: "/api/jikan/v4/top/anime",
      params: {
        type: type,
      },
    })
    .then((res) => {
      cache.value[type] = res.data.data; // 缓存新数据
      list.value = res.data.data;
    })
    .catch((error) => {
      list.value = [];
      console.error("请求失败：", error);
    });
};
const requestData = () => {
  getRouteList();
};
</script>
