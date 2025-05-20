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
  <el-container class="statistics" direction="vertical">
    <div class="filter-table">
      <el-table :data="filterRows" border style="width: 100%" size="small">
        <el-table-column prop="type" label="筛选类型" width="120">
          <template #default="{ row }">
            <span class="filter-label">{{ row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="videoUrl" label="视频链接" width="150">
          <template #default="{ row }">
            <el-input
              v-if="row.type === 'condition'"
              v-model="filters.videoUrl"
              placeholder="不限"
            />
          </template>
        </el-table-column>
        <el-table-column prop="statisticalGranularity" label="统计颗粒度" width="150">
          <template #default="{ row }">
            <el-select v-if="row.type === 'condition'" v-model="filters.statisticalGranularity" placeholder="请选择">
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
        <el-table-column prop="startTime" label="起始时间" width="150">
          <template #default="{ row }">
            <template v-if="row.type === 'condition'">
              <el-date-picker
                v-model="filters.startTime"
                :type="datePickerType"
                placeholder="起始时间"
                style="width: 100%"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="150">
          <template #default="{ row }">
            <template v-if="row.type === 'condition'">
              <el-date-picker
                v-model="filters.endTime"
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
    <div id="analysisChart" style="width: 100%; height: 400px;"></div>
    <div id="incrementChart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
  </el-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { Back } from '@element-plus/icons-vue'
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Dictionary, VideoAnalysis } from '@/api/video.type';
import { getDictionary, getVideoStatistics } from '@/api/videoapi';
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts';

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
  videoUrl: '',
  statisticalGranularity: 'day',
  product: '',
  publisher: '',
  kol: '',
  platform: '',
  language: '',
  region: '',
  startTime: new Date(),
  endTime: new Date(),
});

// 日期选择器类型
const datePickerType = computed(() => {
  switch (filters.value.statisticalGranularity) {
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
  fetchDictionary();
  initChart();
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
      videoLink: filters.value.videoUrl,
      granularity: filters.value.statisticalGranularity,
      product: filters.value.product,
      publisher: filters.value.publisher,
      kol: filters.value.kol,
      platform: filters.value.platform,
      language: filters.value.language,
      region: filters.value.region,
      startDate: filters.value.startTime,
      endDate: filters.value.endTime
    });

    // 确保日期存在再进行转换
    const startTimeStr = filters.value.startTime ? formatDate(filters.value.startTime) : '';
    const endTimeStr = filters.value.endTime ? formatDate(filters.value.endTime) : '';

    // 处理空值，将空值转换为空字符串
    const params = {
      videoLink: filters.value.videoUrl || '',
      granularity: filters.value.statisticalGranularity || 'day', // 默认值为 'day'
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
      // 更新图表
      updateChart(response.data);
      ElMessage.success('获取视频趋势分析成功');
    } else {
      ElMessage.error(response.msg || '获取视频趋势分析失败');
    }
  } catch (error) {
    console.error('获取视频趋势分析失败:', error);
    ElMessage.error('获取视频趋势分析失败');
  }
}

let chartInstance: echarts.ECharts | null = null;
let incrementChartInstance: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById('analysisChart');
  const incrementChartDom = document.getElementById('incrementChart');

  if (chartDom) {
    chartInstance = echarts.init(chartDom);
  }
  if (incrementChartDom) {
    incrementChartInstance = echarts.init(incrementChartDom);
  }
};

// 更新图表数据
const updateChart = (data: VideoAnalysis[]) => {
  if (!chartInstance) return;

  const timeStages = data.map(item => item.timeStage);
  const viewCounts = data.map(item => parseInt(item.viewCount));
  const commentCounts = data.map(item => parseInt(item.commentCount));
  const likeCounts = data.map(item => parseInt(item.likeCount));

  const labelOption = {
    show: false,
    position: 'top',
    distance: 15,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {}
    }
  };

  const option = {
    title: {
      text: '总量趋势图表'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['播放量', '评论数', '点赞数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: timeStages
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '播放量',
        type: 'line',  // 默认使用折线图
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: viewCounts
      },
      {
        name: '评论数',
        type: 'line',  // 默认使用折线图
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: commentCounts
      },
      {
        name: '点赞数',
        type: 'line',  // 默认使用折线图
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: likeCounts
      }
    ]
  };

  chartInstance.setOption(option);
  updateIncrementChart(data);
};

const updateIncrementChart = (data: VideoAnalysis[]) => {
  if (!incrementChartInstance) return;

  const labelOption = {
    show: false,
    position: 'insideBottom',
    distance: 15,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {}
    }
  };

  const option = {
    title: {
      text: '增量趋势图表'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['播放量增量', '评论数增量', '点赞数增量']
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: data.map(item => item.timeStage)
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '播放量增量',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => parseInt(item.incrementViewsCount))
      },
      {
        name: '评论数增量',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => parseInt(item.incrementCommentsCount))
      },
      {
        name: '点赞数增量',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => parseInt(item.incrementLikesCount))
      }
    ]
  };

  incrementChartInstance.setOption(option);
};

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
  if (incrementChartInstance) {
    incrementChartInstance.dispose();
  }
});

// 窗口大小改变时重置图表大小
window.addEventListener('resize', () => {
  if (chartInstance) {
    chartInstance.resize();
  }
  if (incrementChartInstance) {
    incrementChartInstance.resize();
  }
});

</script>

<style lang="less" scoped>
.statistics {
  padding: 20px;
  display: flex;
  flex-direction: column;
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

.el-main {
  padding: 0;
}

#analysisChart {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

#incrementChart {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

</style>
