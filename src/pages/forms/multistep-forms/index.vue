<template>
  <div class="array-form-container">
    <h2>动态成员表单</h2>
    <t-form ref="form" :data="formData" :rules="formRules" label-width="100px" @submit="onSubmit">
      <div v-for="(member, index) in formData.members" :key="index" class="member-item">
        <h3>成员 {{ index + 1 }}</h3>
        <t-form-item
          :label="`姓名 ${index + 1}`"
          :name="`members[${index}].name`"
          :rules="[{ required: true, message: '姓名不能为空' }]"
        >
          <t-input v-model="member.name" placeholder="请输入姓名"></t-input>
        </t-form-item>

        <t-form-item
          :label="`年龄 ${index + 1}`"
          :name="`members[${index}].age`"
          :rules="[
            { required: true, message: '年龄不能为空' },
            { pattern: /^[0-9]+$/, message: '年龄必须是数字' },
            { validator: (val) => val > 0 && val < 150, message: '年龄必须在1-149之间' },
          ]"
        >
          <t-input-number v-model="member.age" :min="1" :max="149" placeholder="请输入年龄"></t-input-number>
        </t-form-item>

        <t-form-item
          :label="`邮箱 ${index + 1}`"
          :name="`members[${index}].email`"
          :rules="[
            { required: true, message: '邮箱不能为空' },
            { email: true, message: '请输入正确的邮箱格式' },
          ]"
        >
          <t-input v-model="member.email" placeholder="请输入邮箱"></t-input>
        </t-form-item>

        <t-button v-if="formData.members.length > 1" theme="danger" variant="dashed" @click="removeMember(index)">
          删除成员
        </t-button>
      </div>

      <t-form-item>
        <t-button theme="primary" variant="dashed" @click="addMember"> 添加成员 </t-button>
      </t-form-item>

      <t-form-item>
        <t-button type="submit" theme="primary">提交</t-button>
        <t-button type="reset" theme="default" variant="base" style="margin-left: 10px">重置</t-button>
      </t-form-item>
    </t-form>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { MessagePlugin } from "tdesign-vue-next";

export default {
  setup() {
    const form = ref(null);

    const formData = reactive({
      members: [{ name: "", age: undefined, email: "" }],
    });

    const formRules = reactive({
      // 这里的规则是针对整个 members 数组的，
      // 但 T-Form 的动态数组验证更推荐在每个动态项的 t-form-item 上单独定义。
      // 所以下面的 rules 在这个场景下可以省略，或者用于其他顶级字段。
      // members: [
      //   {
      //     validator: (val) => val.length > 0,
      //     message: '至少需要添加一个成员',
      //     trigger: 'submit',
      //   },
      // ],
    });

    // 添加成员
    const addMember = () => {
      formData.members.push({ name: "", age: undefined, email: "" });
    };

    // 删除成员
    const removeMember = (index) => {
      formData.members.splice(index, 1);
    };

    // 提交表单
    const onSubmit = ({ validateResult, firstError }) => {
      if (validateResult === true) {
        MessagePlugin.success("提交成功");
      } else {
        MessagePlugin.error(firstError);
      }
    };

    return {
      form,
      formData,
      formRules,
      addMember,
      removeMember,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.array-form-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.member-item {
  border: 1px dashed #dcdfe6;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 6px;
}

.member-item h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.t-form-item {
  margin-bottom: 16px; /* 调整表单项之间的间距 */
}
</style>
