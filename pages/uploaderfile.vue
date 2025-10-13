<script lang="ts" setup>
const fileLink = ref('')
const updateImage = (data: any) => {
  console.log(data)
  fileLink.value = data.url[0].url
}
const copyToClipboard = (event) => {
  const textToCopy = event.target.innerText
  navigator.clipboard
    .writeText(fileLink.value)
    .then(() => {
      console.log('Text copied to clipboard')
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err)
    })
}
</script>

<template>
  <div class="pages">
    <tgFileUploader
      :limit="1"
      :index="2"
      :tool-name="'uploadThree'"
      @update-image="updateImage"
    ></tgFileUploader>

    <div style="color: #fff" @click="copyToClipboard">
      {{ fileLink }}
    </div>
  </div>
</template>

<style scoped lang="sass">
.pages
  padding: 20px
  @media screen and (max-width: 768px)
    padding: 10px
</style>
