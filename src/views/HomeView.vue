<template>
  <el-container class="home">
    <el-header>
      <h1>KOL视频数据抓取结果</h1>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="toAbout">去其他页面1</el-button>
          <router-link to="/about">去其他页面2</router-link>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" border v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="title" label="视频标题" width="250" show-overflow-tooltip sortable >
          <template #default="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
              <span>{{ scope.row.title ? scope.row.title : '/' }}</span>
            </el-tooltip>
          </template>
          </el-table-column>
        <el-table-column prop="product" label="产品" width="120" sortable column-key="product"
          :filters="productFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="viewCount" label="观看量" width="100" sortable />
        <el-table-column prop="commentCount" label="评论数" width="100" sortable />
        <el-table-column prop="likeCount" label="点赞数" width="100" sortable />
        <el-table-column prop="engagementRate" label="互动率" width="100" sortable />
        <el-table-column prop="publisher" label="发布者" width="120" sortable />
        <el-table-column prop="channelTitle" label="频道标题" width="120" sortable />
        <el-table-column prop="nameOfKOL" label="KOL名称" width="120" sortable />
        <el-table-column prop="platform" label="平台" width="100" sortable
          :filters="platformFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="language" label="语言" width="100" sortable
          :filters="languageFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="region" label="地区" width="100" sortable
          :filters="regionFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="publishedAt" label="发布时间" width="140" sortable />
        <el-table-column prop="captureDate" label="抓取时间" width="110" sortable />
        <el-table-column prop="videoUrl" label="视频链接" width="120">
          <template #default="scope">
            <el-link type="primary" :href="scope.row.videoUrl" target="_blank">查看视频</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getVideoStats } from '@/api/videoapi';
import type { VideoStats } from '@/api/video.type';
import { ElMessage } from 'element-plus';

// 取得路由实例，用于跳转
const router = useRouter();
const loading = ref(false)
const tableData = ref<VideoStats[]>([])

// 定义一个跳转到其他页面的方法
const toAbout = () => {
  console.log('toAbout');
  // router.push({ path: '/about' });
  router.push({ name: 'about' });
  // router.push('/about');
}

// 获取视频统计数据
const fetchVideoStats = async () => {
  loading.value = true
  try {
    const response = await getVideoStats()
    if (response.code === 0) {
      tableData.value = response.data
    } else {
      ElMessage.error(response.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取视频统计数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchVideoStats()
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
.home {
  .el-main {
    padding: 20px;
  }
}
</style>
