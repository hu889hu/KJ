<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
    default: 'imgUploaders'
  },
  imgsrc: {
    type: [String, Array],
    default: ''
  },
  limit: Number,
  showAlert: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['updateImage'])

const imageList: any = ref([])
const openImage = ref('')

const checkLimit = (newValue: any) => {
  const imgUploader: any = document.querySelector(
    `#${props.id} > div > ul > .el-upload--picture-card`
  )
  // console.log(`#${props.id} imgUploader :`, imgUploader, newValue, props.limit)
  if (!imgUploader) return
  if (newValue === props.limit) {
    imgUploader.style.display = 'none'
  } else {
    imgUploader.style.display = 'block'
  }
}
// Methods
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

  checkLimit(props.limit)
}

watch(
  () => props.imgsrc,
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
    imageList.value = imageList.value.filter((f) => f.name !== file.name)
    setImageBack()
  }
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
    const response = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    const data = await response.json()
    console.log(`uploadTelegraph data:`, data)
    return `https://telegra.ph${data[0].src}`
  } catch (error) {
    console.error('Error uploading image to telegraph :', error)
    return false
  }
}

const imageChange = async (file: any) => {
  if (file.raw.size / 1024 / 1024 > 5) {
    ElMessage.error('檔案大小不可超過 5MB')
    console.log(123, imageList.value)
    return
  }
  const base64Image = await uploadTelegraph(file)
  console.log(456, base64Image)
  if (!base64Image) {
    ElMessage.error('上傳失敗')
    return
  }
  imageList.value.push({ name: file.name, url: base64Image })
  console.log(789)
  setImageBack()
}

const setImageBack = () => {
  if (typeof props.imgsrc === 'string') {
    // props.imgsrc = imageList.value[0].url
    console.log(`setImageBack imageList.value[0].url:`, imageList.value[0])
    if (!imageList?.value[0]) return
    emit('updateImage', imageList.value[0].url)
  } else if (Array.isArray(props.imgsrc)) {
    // props.imgsrc = imageList.value.map((f: any) => f.url)
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
    checkLimit(newValue)
  },
  {
    deep: true,
    immediate: true
  }
)
const uploading = ref(false)
const beforeUpload = async (file: any) => {
  if (uploading.value) {
    ElMessage.warning('上傳中，請稍後')
    return false
  }
  uploading.value = true
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('檔案大小不可超過 5MB')
    return false
  }
  // const url = await uploadTelegraph(file)
  // if (!url) {
  //   ElMessage.error('上傳失敗')
  //   return false
  // }
  return file
}

const uploadSuccess = (response: any, file: any) => {
  console.log('uploadSuccess response:', response[0], file)
  if (response.error) {
    ElMessage.error('上傳錯誤')
  } else {
    imageList.value.push({
      name: file.name,
      url: `https://telegra.ph${response[0].src}`
    })
    setImageBack()
  }
  uploading.value = false
}

const uploadError = (err: any, file: any) => {
  console.error('uploadError err:', err, file)
  uploading.value = false
}
</script>

<template>
  <div :id="props.id" class="imgUploader">
    <el-upload
      v-loading="uploading"
      :file-list="imageList"
      :method="'POST'"
      :headers="{ 'Access-Control-Allow-Origin': '*' }"
      action="https://telegra.ph/upload"
      :limit="limit"
      multiple
      :drag="true"
      list-type="picture-card"
      :auto-upload="true"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
    >
      <i class="fas fa-plus"></i>
      <template #file="{ file }">
        <div class="imageContainer">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span v-if="!uploading" class="el-upload-list__item-actions">
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
