<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
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
      <div class="header-container">
        <el-button @click="goBack" type="primary" style="margin-right: 15px">
          <el-icon><Back /></el-icon>
          返回
        </el-button>
        <h1>KOL数据抓取条目配置</h1>
      </div>
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
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { getVideoLinks, removeVideoLink, insertVideoLink, updateVideoLink, getDictionary } from '@/api/videoapi';
import type { VideoLink, Dictionary } from '@/api/video.type';
import { Edit, Delete, Back } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const loading = ref(false)
const tableData = ref<VideoLink[]>([])
const isEdit = ref(false)
const dialogTitle = computed(() => isEdit.value ? '编辑视频配置' : '新增视频配置')
const router = useRouter();

const goBack = () => {
  console.log('toBack');
  router.push({ name: 'home' });
}

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
  isEdit.value = true
  dialogVisible.value = true
  // 在赋值之前，确保使用正确的选项值
  const formattedRow = {
    ...row,
    // 使用字典中定义的value值，而不是label值
    language: languageOptions.value.find(opt => opt.label === row.language)?.value || row.language,
    platform: platformOptions.value.find(opt => opt.label === row.platform)?.value || row.platform,
    product: productOptions.value.find(opt => opt.label === row.product)?.value || row.product,
    region: regionOptions.value.find(opt => opt.label === row.region)?.value || row.region
  }
  formData.value = formattedRow
}

const getLabelByValue = (options: Dictionary[], value: string) => {
  return options.find(opt => opt.value === value)?.label || value
}

// 处理删除
const handleDelete = (row: VideoLink) => {
  ElMessageBox.confirm(
    `此操作将永久删除以下配置, 是否继续?
    平台：${row.platform}
    链接：${row.videoUrl}
    产品：${row.product}
    KOL: ${row.nameOfKOL}
    语言：${row.language}
    地区：${row.region}`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'delete-confirm-dialog'
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
  isEdit.value = false
  // 重置表单数据
  formData.value = {
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
  }
  dialogVisible.value = true
}

// 表单提交处理
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        let response
        if (isEdit.value) {
          // 编辑模式
          response = await updateVideoLink(formData.value)
        } else {
          // 新增模式
          response = await insertVideoLink(formData.value)
        }

        if (response && response.code === 0) {
          ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
          dialogVisible.value = false
          // 重新获取列表数据
          fetchVideoLinks()
          // 重置表单
          formEl.resetFields()
        } else {
          const errorMsg = response?.msg || `${isEdit.value ? '修改' : '添加'}失败(服务器返回异常)`
          ElMessage.error(errorMsg)
          console.error('API响应异常:', response)
        }
      } catch (error: any) {
        console.error(`${isEdit.value ? '修改' : '添加'}视频链接失败:`, error)
        const errorMsg = error?.message || `${isEdit.value ? '修改' : '添加'}失败(网络请求异常)`
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
  isEdit.value = false // 重置编辑状态
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

<style lang="less">
/* 注意：这里不能加 scoped，因为需要影响全局的 MessageBox 样式 */
.delete-confirm-dialog {
  .el-message-box__content {
    min-height: 100px; /* 设置最小高度 */
    padding: 20px;    /* 增加内边距 */
    white-space: pre-line; /* 保留换行符 */
  }
}
</style>

<style lang="less" scoped>
.setting {

  .header-container {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .el-main {
    padding: 10px;
  }

  .mb-24 {
    margin-bottom: 10px;
  }
}
</style>
