<script lang="ts" setup>
const { queryInstruction } = useSiteStore()
const router = useRouter()
const instruction = ref({
  result: []
})
const { locale } = useI18n()
const lang = locale.value
await onMounted(async () => {
  const routerName = router.currentRoute.value.name
  const type = routerName.split('-')[1]
  console.log('routerName', type)
  const queryInstructionRes = await queryInstruction(lang, type)
  if (queryInstructionRes.success) {
    console.log(queryInstructionRes.data)
    instruction.value = queryInstructionRes.data
  }
})
</script>
<template>
  <div v-for="item in instruction.result" :key="item.title" class="instruction">
    <pre class="text" v-html="item.content"></pre>
  </div>
</template>

<style scoped lang="sass">
.instruction
  width: 100%
  padding: 20px
  text-align: center
  max-width: 460px
  margin: 30px auto 0 auto
  .text
    margin: 15px 0
    width: 100%
    white-space: pre-wrap
    word-wrap: break-word
    font-size: 15px
</style>
