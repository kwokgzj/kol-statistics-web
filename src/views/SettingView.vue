<template>
  <el-container class="setting">
    <el-header>
      <h1>KOL数据抓取条目配置</h1>
    </el-header>
    <el-main>
      <!-- 新增条码按钮容器 -->
      <el-row :gutter="24" class="mb-24">
        <el-col :span="1.5">
          <el-button type="primary" @click="addVideoLink">新增条目</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" border v-loading="loading">
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column prop="platform" label="平台" width="180" sortable
          :filters="platformFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="videoUrl" label="视频链接" width="400">
          <template #default="scope">
            <el-link type="primary" :href="scope.row.videoUrl" target="_blank"></el-link>
          </template>
        </el-table-column>
        <el-table-column prop="product" label="产品" width="180" sortable column-key="product"
          :filters="productFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="nameOfKOL" label="KOL" width="180" sortable />
        <el-table-column prop="language" label="语言" width="180" sortable
          :filters="languageFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="region" label="地区" width="180" sortable
          :filters="regionFilters"
          :filter-method="filterHandler" />
          <el-table-column prop="isActive" label="状态" width="180" sortable />
          <el-table-column prop="operation" label="操作" width="200"/>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(false)
const tableData = ref<VideoStats[]>([])


// 页面加载时获取数据
onMounted(() => {
})

// 动态生成筛选选项
const productFilters = computed(() => {
  const products = new Set(tableData.value.map(item => item.product));
  return Array.from(products).map(product => ({
    text: product,
    value: product
  }));
});

const platformFilters = computed(() => {
  const platforms = new Set(tableData.value.map(item => item.platform));
  return Array.from(platforms).map(platform => ({
    text: platform,
    value: platform
  }));
});

const languageFilters = computed(() => {
  const languages = new Set(tableData.value.map(item => item.language));
  return Array.from(languages).map(language => ({
    text: language,
    value: language
  }));
});

const regionFilters = computed(() => {
  const regions = new Set(tableData.value.map(item => item.region));
  return Array.from(regions).map(region => ({
    text: region,
    value: region
  }));
});

// 筛选方法
const filterHandler = (value: string, row: any, column: any) => {
  const property = column.property;
  return row[property] === value;
};

</script>


<style lang="less" scoped>
.setting {
  .el-main {
    padding: 10px;
  }

  .mb-24 {
    margin-bottom: 10px;
  }
}
</style>
