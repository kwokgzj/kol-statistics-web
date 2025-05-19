<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增视频配置"
    width="50%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="video-form"
    >
      <el-form-item label="视频链接" prop="videoUrl">
        <el-input
          v-model="formData.videoUrl"
          placeholder="请输入视频链接"
          @input="handleVideoUrlChange"
        />
      </el-form-item>

      <el-form-item label="视频id" prop="platformVideoId">
        <el-input v-model="formData.platformVideoId" placeholder="请输入视频id" />
      </el-form-item>

      <el-form-item label="KOL名称" prop="nameOfKOL">
        <el-input v-model="formData.nameOfKOL" placeholder="请输入KOL名称" />
      </el-form-item>

      <el-form-item label="平台" prop="platform">
        <el-select v-model="formData.platform" placeholder="请选择平台" style="width: 100%">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="产品" prop="product">
        <el-select v-model="formData.product" placeholder="请选择产品" style="width: 100%">
          <el-option
            v-for="item in productOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="语言" prop="language">
        <el-select v-model="formData.language" placeholder="请选择语言" style="width: 100%">
          <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="地区" prop="region">
        <el-select v-model="formData.region" placeholder="请选择地区" style="width: 100%">
          <el-option
            v-for="item in regionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否抓取" prop="isActive">
        <el-switch v-model="formData.isActive" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel(formRef)">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-container class="setting">
    <el-header>
      <h1>KOL数据抓取条目配置</h1>
    </el-header>
    <el-main>
      <!-- 新增条目按钮容器 -->
      <el-row :gutter="24" class="mb-24">
        <el-col :span="1.5">
          <el-button type="primary" @click="addVideoLink">新增条目</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" border v-loading="loading">
        <el-table-column prop="videoLinkId" v-if="false" />
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
          <el-table-column prop="isActive" label="状态" width="180" sortable>
            <template #default="scope">
              <el-tag :type="scope.row.isActive ? 'success' : 'danger'" size="small">
                {{ scope.row.isActive ? '抓取中' : '暂停抓取' }}
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
import { getVideoLinks, removeVideoLink, insertVideoLink, getDictionary } from '@/api/videoapi';
import type { VideoLink, Dictionary } from '@/api/video.type';
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const tableData = ref<VideoLink[]>([])

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

// 页面加载时获取数据
onMounted(() => {
  fetchVideoLinks()
  fetchDictionary()
})

// 获取视频配置数据
const fetchVideoLinks = async () => {
  loading.value = true
  try {
    const response = await getVideoLinks()
    if (response.code === 0) {
      console.log('API返回数据:', response.data)
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
    链接：${row.videoUrl}`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      console.log('删除', row)
      removeVideoLink(row.videoLinkId)
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

// 对话框显示控制
const dialogVisible = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref<VideoLink>({
  videoLinkId: '',
  videoUrl: '',
  platformVideoId: '',
  nameOfKOL: '',
  platform: '',
  product: '',
  language: '',
  region: '',
  createdAt: '',
  isActive: true
})

// 表单验证规则
const rules = ref<FormRules>({
  videoUrl: [
    { required: true, message: '请输入视频链接', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  platformVideoId: [
    { required: true, message: '请输入视频id名称', trigger: 'blur' }
  ],
  nameOfKOL: [
    { required: true, message: '请输入KOL名称', trigger: 'blur' }
  ],
  platform: [
    { required: true, message: '请选择平台', trigger: 'change' }
  ],
  product: [
    { required: true, message: '请选择产品', trigger: 'change' }
  ],
  language: [
    { required: true, message: '请选择语言', trigger: 'change' }
  ],
  region: [
    { required: true, message: '请选择地区', trigger: 'change' }
  ]
})


// 新增按钮点击处理
const addVideoLink = () => {
  dialogVisible.value = true
}

// 表单提交处理
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const response = await insertVideoLink(formData.value)
        // 添加空值检查
        if (response && response.code === 0) {
          ElMessage.success('添加成功')
          dialogVisible.value = false
          // 重新获取列表数据
          fetchVideoLinks()
          // 重置表单
          formEl.resetFields()
        } else {
          // 更详细的错误信息
          const errorMsg = response?.msg || '添加失败(服务器返回异常)'
          ElMessage.error(errorMsg)
          console.error('API响应异常:', response)
        }
      } catch (error: any) {
        // 更详细的错误处理
        console.error('添加视频链接失败:', error)
        const errorMsg = error?.message || '添加失败(网络请求异常)'
        ElMessage.error(errorMsg)
      }
    } else {
      console.log('表单验证失败:', fields)
    }
  })
}

// 取消处理
const handleCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}

const extractVideoId = (url: string): string => {
  // YouTube 格式
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu.be\/)([^&?/]+)/i
  // Instagram 格式
  const instagramRegex = /instagram\.com\/p\/([^/?]+)/i

  let match = url.match(youtubeRegex)
  if (match) return match[1]

  match = url.match(instagramRegex)
  if (match) return match[1]

  return ''
}

const handleVideoUrlChange = (url: string) => {
  const videoId = extractVideoId(url)
  if (videoId) {
    formData.value.platformVideoId = videoId
  }
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
