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
        <el-table-column prop="id" v-if="false" />
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column prop="platform" label="平台" width="180" sortable
          :filters="platformFilters"
          :filter-method="filterHandler" />
        <el-table-column prop="videoUrl" label="视频链接" width="400">
          <template #default="scope">
            <el-link type="primary" :href="scope.row.videoUrl" target="_blank">
              {{ scope.row.videoUrl }}
            </el-link>
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
        <el-table-column prop="active" label="状态" width="180" sortable>
          <template #default="scope">
            <el-tag :type="scope.row.active ? 'success' : 'info'">
              {{ scope.row.active ? '抓取' : '暂停抓取' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="200">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { getVideoLinks, removeVideoLink } from '@/api/videoapi';
import type { VideoLink } from '@/api/video.type';
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref<VideoLink[]>([])

// 页面加载时获取数据
onMounted(() => {
  fetchVideoLinks()
})

// 获取视频配置数据
const fetchVideoLinks = async () => {
  loading.value = true
  try {
    const response = await getVideoLinks()
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

// 处理编辑
const handleEdit = (row: VideoLink) => {
  console.log('编辑', row)
  // TODO: 实现编辑功能
}

// 处理删除
const handleDelete = (row: VideoLink) => {
  ElMessageBox.confirm(
    `此操作将永久删除以下配置, 是否继续?
    平台：${row.platform}
    KOL：${row.nameOfKOL}
    产品：${row.product}
    语言：${row.language}
    地区：${row.region}`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      console.log('删除', row)
      removeVideoLink(row.id)
        .then((response) => {
          if (response.code === 0) {
            // 删除成功后重新获取数据
            fetchVideoLinks()
          } else {
            ElMessage.error(response.msg || '删除失败')
          }
        })
        .catch((error) => {
          console.error('删除视频链接失败:', error)
          ElMessage.error('删除失败')
        })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

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
