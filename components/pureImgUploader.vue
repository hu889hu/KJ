<script lang="ts" setup>
import imageCompression from 'browser-image-compression'
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

const uploadTelegraph = async (file: any) => {
  try {
    const formData = new FormData()
    formData.append('file', file.raw)
    const response = await fetch(
      'https://tguploader.excelone523.workers.dev/',
      // 'https://upload.comethike.com',
      {
        method: 'POST',
        body: formData
      }
    )
    const data = await response.json()
    console.log('response data', data)
    return data.url
  } catch (error) {
    console.error('Error uploading image to telegraph :', error)
    return false
  }
}

const imageChange = async (file: any) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.6)',
    text: '圖片上傳中, 請稍後...'
  })
  const processedFile = {
    name: file.target.files[0].name,
    raw: file.target.files[0]
  }
  console.log('imageChange', file.target.files[0])
  if (file.target.files[0] && file.target.files[0].type.startsWith('image/')) {
    // The file is an image
    try {
      const options = {
        maxSizeMB: 4, // 最大文件大小
        maxWidthOrHeight: 890, // 图片最大宽度或高度
        useWebWorker: true, // 使用web worker进行压缩以避免冻结UI
        fileType: 'image/jpeg' // 输出文件类型
      }
      processedFile.raw = await imageCompression(file.target.files[0], options)
      console.log('processedFile.raw', processedFile.raw)
      let fileName = file.target.files[0].name
      if (
        processedFile.raw.type === 'image/jpeg' &&
        !fileName.endsWith('.jpeg')
      ) {
        fileName = fileName.replace(/\.[^/.]+$/, '') + '.jpeg'
        processedFile.raw.name = fileName
      }
      processedFile.name = fileName
    } catch (error) {
      ElMessage.error('檔案壓縮失敗')
      loadingInstance?.close()
      return
    }
    console.log('processedFile', processedFile)
    const base64Image = await uploadTelegraph(processedFile)
    // console.log('base64Image', base64Image)
    if (!base64Image) {
      ElMessage.error('上傳失敗')
      loadingInstance?.close()
      return
    }
    imageList.value.push({ name: processedFile.name, url: base64Image })
    loadingInstance?.close()
    setImageBack()
    console.log('Selected file is an image:', file)
  } else {
    // The file is not an image
    console.log('Selected file is not an image')
    ElMessage.error('請上傳圖片檔')
    loadingInstance?.close()
    return
  }
}

const handleRemove = (name: any) => {
  const index = imageList.value.findIndex((f) => f.name === name)
  if (index !== -1) {
    imageList.value.splice(index, 1)
    if (imageList.value.length === 0) {
      imageList.value = []
    }
    setImageBack()
  }
  // console.log('handleRemove', imageList.value, index)
}

const setImageBack = () => {
  // console.log('setImageBack', imageList.value)
  emit('updateImage', { url: imageList.value, index: props.index })
  console.log(props.imgSrc, 'props.imgSrc')

  if (typeof props.imgSrc === 'string') {
    // props.imgSrc = imageList.value[0].url
    console.log(imageList.value[0], 'imageList.value[0].url')

    // emit('updateImage', imageList.value[0].url)
  } else if (Array.isArray(props.imgSrc)) {
    // props.imgSrc = imageList.value.map((f: any) => f.url)
    emit(
      'updateImage',
      imageList.value.map((f: any) => f.url)
    )
  }
}
const checkLimit = computed(() => {
  if (imageList.value.length >= props.limit) {
    return false
  }
  return true
})
</script>
<template>
  <div>
    <div class="uploader">
      <div v-if="checkLimit" class="uploaderSection">
        <label class="upload_cover">
          <input id="fileInputId" type="file" :multiple="false" @change="imageChange" />
          <div class="upload_icon">
            <i class="fa-solid fa-plus"></i>
          </div>
        </label>
      </div>
      <div v-for="(item, index) in imageList" :key="index" class="uploaderImageList">
        <img :src="item.url" alt="" />
        <div class="imageHover">
          <div @click="handleRemove(item.name)">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.uploader
  position: relative
  display: flex
  justify-content: flex-start
  align-items: center
  margin: 0 0 20px 0
</style>
<style scoped lang="sass">
.uploaderSection
  width: 120px
  height: 120px
  margin: 0 15px 0 0
label
  text-align: center
  cursor: pointer
input
  display: none
.upload_icon
  font-weight: bold
  font-size: 18px
  position: absolute
  top: 0
  left: 0
  width: 120px
  height: 120px
  border: 1px dashed #999999a9
  border-radius: 5px
  svg
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    color: #999999a9
.uploaderImageList
  position: relative
  width: 120px
  height: 120px
  margin: 0 15px 0 0
  border: 1px solid #999999a9
  border-radius: 5px
  img
    width: 100%
    height: 100%
  .imageHover
    position: absolute
    top: 0
    left: 0
    width: 120px
    height: 120px
    background: rgba(0, 0, 0, 0.5)
    color: #fff
    justify-content: center
    align-items: center
    font-size: 20px
    cursor: pointer
    display: none
.uploaderImageList:hover
  .imageHover
    display: flex
</style>
