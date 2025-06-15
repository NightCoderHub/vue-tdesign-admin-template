<template>
  <t-descriptions title="信息确认" :column="1" bordered>
    <t-descriptions-item label="姓名">{{ basicInfo.name }}</t-descriptions-item>
    <t-descriptions-item label="用户类型">
      {{ basicInfo.userType === 'personal' ? '个人用户' : '企业用户' }}
    </t-descriptions-item>
    <t-descriptions-item :label="idCardLabel">{{ basicInfo.idCard }}</t-descriptions-item>
    <t-descriptions-item label="手机号码">{{ basicInfo.phone }}</t-descriptions-item>
    <t-descriptions-item label="邮箱">{{ basicInfo.email }}</t-descriptions-item>
    
    <!-- 企业用户特有信息 -->
    <template v-if="basicInfo.userType === 'enterprise'">
      <t-descriptions-item label="企业规模">
        {{ detailInfo.companySize || '未填写' }}
      </t-descriptions-item>
      <t-descriptions-item label="成立时间">
        {{ detailInfo.establishTime || '未填写' }}
      </t-descriptions-item>
      <t-descriptions-item label="法定代表人">
        {{ detailInfo.legalPerson || '未填写' }}
      </t-descriptions-item>
    </template>
    
    <!-- 个人用户特有信息 -->
    <template v-else>
      <t-descriptions-item label="年龄">
        {{ detailInfo.age || '未填写' }}
      </t-descriptions-item>
      <t-descriptions-item label="职业">
        {{ detailInfo.occupation || '未填写' }}
      </t-descriptions-item>
    </template>
    
    <t-descriptions-item label="所在城市">{{ detailInfo.city }}</t-descriptions-item>
    <t-descriptions-item label="详细地址">{{ detailInfo.address }}</t-descriptions-item>
    <t-descriptions-item label="备注">{{ detailInfo.remark }}</t-descriptions-item>
  </t-descriptions>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  basicInfo: {
    type: Object,
    required: true,
  },
  detailInfo: {
    type: Object,
    required: true,
  },
});

// 根据用户类型计算证件标签
const idCardLabel = computed(() => {
  return props.basicInfo.userType === 'personal' ? '身份证号码' : '统一社会信用代码';
});
</script>
