<template>
  <el-header>
    <div class="header-container">
      <el-button @click="goBack" type="primary" style="margin-right: 15px">
        <el-icon><Back /></el-icon>
        返回
      </el-button>
      <h1>KOL视频数据趋势分析</h1>
    </div>
  </el-header>
  <el-container class="statistics">
    <div class="filter-table">
      <el-table :data="filterRows" border style="width: 100%" size="small">
        <el-table-column prop="type" label="筛选类型" width="120">
          <template #default="{ row }">
            <span class="filter-label">{{ row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="videoLink" label="视频链接" width="150">
          <template #default="{ row }">
            <el-input
              v-if="row.type === 'condition'"
              v-model="filters.videoLink"
              placeholder="不限"
            />
          </template>
        </el-table-column>
        <el-table-column prop="granularity" label="统计颗粒度" width="150">
          <template #default="{ row }">
            <el-select v-if="row.type === 'condition'" v-model="filters.granularity" placeholder="请选择">
              <el-option label="天" value="day" />
              <el-option label="周" value="week" />
              <el-option label="月" value="month" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="product" label="产品" width="150">
          <template #default="{ row }">
            <el-select v-if="row.type === 'condition'" v-model="filters.product" placeholder="不限">
              <el-option label="不限" value="" />
              <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="publisher" label="视频发布者" width="150">
          <template #default="{ row }">
            <el-input
              v-if="row.type === 'condition'"
              v-model="filters.publisher"
              placeholder="不限"
            />
          </template>
        </el-table-column>
        <el-table-column prop="kol" label="KOL" width="150">
          <template #default="{ row }">
            <el-input
              v-if="row.type === 'condition'"
              v-model="filters.kol"
              placeholder="不限"
            />
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="平台" width="150">
          <template #default="{ row }">
            <el-select v-if="row.type === 'condition'" v-model="filters.platform" placeholder="不限">
              <el-option label="不限" value="" />
              <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="language" label="语言" width="150">
          <template #default="{ row }">
            <el-select v-if="row.type === 'condition'" v-model="filters.language" placeholder="不限">
              <el-option label="不限" value="" />
              <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="地区" width="150">
          <template #default="{ row }">
            <el-select v-if="row.type === 'condition'" v-model="filters.region" placeholder="不限">
              <el-option label="不限" value="" />
              <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="起始时间" width="150">
          <template #default="{ row }">
            <template v-if="row.type === 'condition'">
              <el-date-picker
                v-model="filters.startDate"
                :type="datePickerType"
                placeholder="起始时间"
                style="width: 100%"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="结束时间" width="150">
          <template #default="{ row }">
            <template v-if="row.type === 'condition'">
              <el-date-picker
                v-model="filters.endDate"
                :type="datePickerType"
                placeholder="结束时间"
                style="width: 100%"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="filter-actions">
        <div class="right-actions">
          <el-button type="primary" @click="handleSearch">获取</el-button>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { Back } from '@element-plus/icons-vue'
import { ref, computed, onMounted } from 'vue';
import type { Dictionary } from '@/api/video.type';
import { getDictionary, getVideoStatistics } from '@/api/videoapi';
import { ElMessage } from 'element-plus'

const router = useRouter();

const goBack = () => {
  console.log('toBack');
  router.push({ name: 'home' });
}

// 筛选表格数据
const filterRows = [
  { type: 'condition', label: '筛选条件' }
];

// 筛选条件
const filters = ref({
  videoLink: '',
  granularity: 'day',
  product: '',
  publisher: '',
  kol: '',
  platform: '',
  language: '',
  region: '',
  startDate: new Date(),
  endDate: new Date(),
});

// 日期选择器类型
const datePickerType = computed(() => {
  switch (filters.value.granularity) {
    case 'week':
      return 'week'
    case 'month':
      return 'month'
    default:
      return 'date'
  }
});

// 定义选项数据ref
const platformOptions = ref<Dictionary[]>([])
const productOptions = ref<Dictionary[]>([])
const languageOptions = ref<Dictionary[]>([])
const regionOptions = ref<Dictionary[]>([])

// 获取字典数据
const fetchDictionary = async () => {
  try {
    const response = await getDictionary()
    if (response.code === 0) {
      const dictionary = response.data
      // 根据 dictionaryType 分类存储
      platformOptions.value = dictionary.filter(item => item.dictionaryType === 'platform')
      productOptions.value = dictionary.filter(item => item.dictionaryType === 'product')
      languageOptions.value = dictionary.filter(item => item.dictionaryType === 'language')
      regionOptions.value = dictionary.filter(item => item.dictionaryType === 'region')
    } else {
      ElMessage.error(response.msg || '获取字典数据失败')
    }
  } catch (error) {
    console.error('获取字典数据失败:', error)
    ElMessage.error('获取字典数据失败')
  }
}

onMounted(() => {
  fetchDictionary()
})

const formatDate = (date: Date): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day} 00:00:00`;
};

const handleSearch = async () => {
  try {
    // 检查并打印所有筛选条件值
    console.log('筛选条件:', {
      videoLink: filters.value.videoLink,
      granularity: filters.value.granularity,
      product: filters.value.product,
      publisher: filters.value.publisher,
      kol: filters.value.kol,
      platform: filters.value.platform,
      language: filters.value.language,
      region: filters.value.region,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    });

    // 确保日期存在再进行转换
    const startTimeStr = filters.value.startDate ? formatDate(filters.value.startDate) : '';
    const endTimeStr = filters.value.endDate ? formatDate(filters.value.endDate) : '';

    // 处理空值，将空值转换为空字符串
    const params = {
      videoLink: filters.value.videoLink || '',
      granularity: filters.value.granularity || 'day', // 默认值为 'day'
      product: filters.value.product || '',
      publisher: filters.value.publisher || '',
      kol: filters.value.kol || '',
      platform: filters.value.platform || '',
      language: filters.value.language || '',
      region: filters.value.region || '',
      startTime: startTimeStr,
      endTime: endTimeStr
    };

    console.log('发送参数:', params);

    const response = await getVideoStatistics(
      params.videoLink,
      params.granularity,
      params.product,
      params.publisher,
      params.kol,
      params.platform,
      params.language,
      params.region,
      params.startTime,
      params.endTime
    );

    if (response.code === 0) {
      console.log('获取视频趋势分析数据:', response.data);
      ElMessage.success('获取视频趋势分析成功');
    } else {
      ElMessage.error(response.msg || '获取视频趋势分析失败');
    }
  } catch (error) {
    console.error('获取视频趋势分析失败:', error);
    ElMessage.error('获取视频趋势分析失败');
  }
}

// TODO: 在组件挂载时获取下拉选项数据
</script>

<style lang="less" scoped>
.statistics {
  padding: 20px;
}

.filter-table {
  margin-bottom: 20px;
}

.filter-label {
  font-weight: bold;
}

:deep(.el-table) {
  .el-select {
    width: 100%;
  }
}

.filter-actions {
  margin-top: 16px;
  width: 100%;

  .right-actions {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
  }
}
</style>
