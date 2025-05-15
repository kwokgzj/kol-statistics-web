<template>
  <el-container class="home">
    <el-header>
      <h1>这是主页</h1>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="toAbout">去其他页面1</el-button>
          <router-link to="/about">去其他页面2</router-link>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 取得路由实例，用于跳转
const router = useRouter();

// 定义一个跳转到其他页面的方法
const toAbout = () => {
  console.log('toAbout');
  // router.push({ path: '/about' });
  router.push({ name: 'about' });
  // router.push('/about');
}

// 定义一个响应式数据，用于表格数据
// 这里使用了 Vue 3 的 Composition API
// 通过 ref 创建一个响应式数据
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
</script>


<style lang="less" scoped></style>
