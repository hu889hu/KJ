<script lang="ts" setup>
const emit = defineEmits(['download-url-updated'])
const props = defineProps({
  downloadUrl: String
})
console.log(`props : `, props)
const { uploadFile } = useFirebaseStorage()
const fileName = ref('')
const fileSrc = ref('')

const handleFileUpload = async (e: any) => {
  const file = e.target.files[0]
  console.log(`click handleFileUpload : `, file)
  if (file) {
    fileName.value = file.name
    fileSrc.value = URL.createObjectURL(file)
    const {
      snapshot,
      downloadUrl: url,
      metadata
    } = await uploadFile(`/test/${file.name}`, file)
    props.downloadUrl = url
    emit('download-url-updated', url)
  }
}
const isImage = computed(() => {
  return true
  return (
    fileName.value.match(/\.(jpg|jpeg|png|gif)$/i) ||
    props.downloadUrl.match(/\.(jpg|jpeg|png|gif)(\?.*)?$/i)
  )
})

const handleFileDrop = async (e: any) => {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  await handleFileUpload({ target: { files: [file] } })
}

const deleteFile = () => {
  console.log(`click deleteFile`)
  fileName.value = ''
  fileSrc.value = ''
  emit('download-url-updated', '')
}
</script>

<template>
  <div class="uploaderContainer" @dragover.prevent @drop="handleFileDrop">
    <input
      id="fileInput"
      type="file"
      style="display: none"
      @change="handleFileUpload"
    />
    <div v-if="props.downloadUrl" class="delete-icon" @click="deleteFile">
      <i class="fa fa-times"></i>
    </div>
    <label for="fileInput" class="drop-area">
      <div v-if="!props.downloadUrl">
        Drop file here or
        <span class="upload-link">click to upload</span>
      </div>
      <div v-else class="file-display">
        <img v-if="isImage" :src="props.downloadUrl" class="uploaded-image" />
        <div v-else class="file-icon">
          <i class="fa fa-file"></i>
          <span>{{ fileName }}</span>
        </div>
      </div>
    </label>
    <!-- <div v-if="props.downloadUrl" class="downloadLink">
      <a :href="props.downloadUrl">Download</a>
    </div> -->
  </div>
</template>

<style scoped lang="sass">
.uploaderContainer
  width: 100%
  height: 200px // Adjust the height as needed
  border: 2px dashed #ccc
  border-radius: 8px
  margin: 20px 0
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  position: relative
  .delete-icon
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    opacity: 0.4
    position: absolute
    top: 0
    left: 0
    z-index: 100
    cursor: pointer
    color : #dedede
    font-size: 48px // Size of the delete icon
    transition: all 0.3s ease
    &:hover
      opacity: 1
  .drop-area
    width: 100%
    height: 100%
    cursor: pointer
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
  .upload-link
    color: #409eff
    cursor: pointer
    text-decoration: underline
  .file-display
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    border-radius: 8px

    .uploaded-image
      width: 100%
      height: 100%
      max-width: 100%
      max-height: auto
      object-fit: contain
      border-radius: 8px
    .file-icon
      font-size: 16px
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      color: #409eff
      svg
        font-size: 48px
        margin-right: 10px
</style>
