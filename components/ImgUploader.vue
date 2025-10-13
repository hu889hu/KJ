<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
const props = defineProps({
  imgSrc: [String, Array],
  limit: Number,
  showAlert: {
    type: Boolean,
    default: false
  },
  index: Number,
  toolName: String
})
const emit = defineEmits(['updateImage'])

const imageList: any = ref([])
const openImage = ref('')

// Methods
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log('beforeAvatarUpload....')
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const setImageToImageList = (image: any) => {
  if (typeof image === 'string') {
    if (image === '') {
      imageList.value = []
    } else {
      imageList.value = [{ name: 'cover', url: image }]
    }
  } else if (Array.isArray(image)) {
    imageList.value = image.map((url, index) => ({ name: `${index}`, url }))
  }
}

watch(
  () => props.imgSrc,
  (newValue) => {
    setImageToImageList(newValue)
  },
  { immediate: true, deep: true }
)
const handlePictureCardPreview = (file: any) => {
  openImage.value = file.url
}

const handleDownload = (file: any) => {
  if (file && file.url) {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    console.error('File data is missing')
  }
}

const handleRemove = (file: any) => {
  const index = imageList.value.findIndex((f) => f.name === file.name)
  if (index !== -1) {
    imageList.value.splice(index, 1)
    if (imageList.value.length === 0) {
      imageList.value = []
    }
    setImageBack()
  }
  console.log('handleRemove', imageList.value, index)
}

const convertToBase64 = (file: any) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const uploadTelegraph = async (file: any) => {
  try {
    const formData = new FormData()
    formData.append('file', file.raw)
    const response = await fetch(
      'https://tguploader.excelone523.workers.dev/',
      {
        method: 'POST',
        body: formData
      }
    )
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Error uploading image to telegraph :', error)
    return false
  }
}

const imageChange = async (file: any) => {
  if (file.raw.size / 1024 / 1024 > 5) {
    ElMessage.error('檔案大小不可超過 5MB')
    return false
  }
  const base64Image = await uploadTelegraph(file)
  if (!base64Image) {
    ElMessage.error('上傳失敗')
    return false
  }
  imageList.value.push({ name: file.name, url: base64Image })
  setImageBack()
}

const setImageBack = () => {
  // console.log('setImageBack', imageList.value)
  emit('updateImage', { url: imageList.value, index: props.index })
  if (typeof props.imgSrc === 'string') {
    // props.imgSrc = imageList.value[0].url
    emit('updateImage', imageList.value[0].url)
  } else if (Array.isArray(props.imgSrc)) {
    // props.imgSrc = imageList.value.map((f: any) => f.url)
    emit(
      'updateImage',
      imageList.value.map((f: any) => f.url)
    )
  }
}

// watch imageList.value.length === limit, set imgUploader >>> .el-upload--picture-card { display: none; }
watch(
  () => imageList.value.length,
  (newValue) => {
    setTimeout(() => {
      const className = `.${props.toolName}`
      const imgUploaders: NodeListOf<Element> =
        document.querySelectorAll('.imgUploader')
      imgUploaders.forEach((imgUploader) => {
        if (newValue === props.limit) {
          if (imgUploader.querySelector(`${className}`)) {
            imgUploader.querySelector(
              '.el-upload--picture-card'
            ).style.display = 'none'
          }
        } else if (imgUploader.querySelector(`${className}`)) {
          imgUploader.querySelector('.el-upload--picture-card').style.display =
            'block'
        }
      })
    }, 1000)
  }
)
</script>

<template>
  <div class="imgUploader">
    <el-upload
      :file-list="imageList"
      :show-file-list="imageList.length > 0"
      :on-change="imageChange"
      action="#"
      :limit="limit"
      multiple
      :drag="true"
      list-type="picture-card"
      :auto-upload="false"
      :class="`${toolName}`"
    >
      <i class="fas fa-plus"></i>
      <template #file="{ file }">
        <div class="imageContainer">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="fas fa-eye"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="fas fa-download"></i>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="fas fa-trash"></i>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-dialog v-if="openImage">
      <img w-full :src="openImage" alt="Preview Image" />
    </el-dialog>
    <el-alert
      v-if="showAlert"
      title="尺寸建議 : 1920x500"
      type="warning"
      show-icon
      :closable="false"
    />
  </div>
</template>

<style>
.el-upload-list__item div {
  width: 100% !important;
}
</style>
