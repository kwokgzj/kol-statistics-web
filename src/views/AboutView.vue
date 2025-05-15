<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-button type="primary" @click="hanleQuery">查询</el-button>
    <p>接口信息：{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
import { getQueryRecords } from '@/api/demoapi';
import { ref } from 'vue';

// 定义一个响应式的数据，修改这个值，页面会自动更新
const message = ref('')

// 如果想等待接口请求完成后再执行后面的代码，可以使用 async/await
const hanleQuery = async () => {

  try {
    // 这里可以使用 async/await 来处理异步请求
    const res = await getQueryRecords({ page: 1, pageSize: 10 });
    console.log(res);
    message.value = res.code + res.msg
  } catch (error) {
    console.error(error);
    message.value = '出错啦！'
  }

  // 也可以使用 Promise 的 then/catch 来处理异步请求
  getQueryRecords({ page: 1, pageSize: 10 })
    .then((res) => {
      console.log(res);
      message.value = res.code + res.msg
    })
    .catch((err) => {
      console.error(err);
      message.value = '出错啦！'
    });
};
</script>

<style lang="less" scoped></style>
