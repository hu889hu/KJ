<script lang="ts" setup>
const { t } = useI18n()
const PlayerStore = usePlayerStore()
const ProductListData = computed(() => {
  return Object.values(PlayerStore.playerInfo?.availablePairs)
})
</script>

<template>
  <div class="swiperSection">
    <swiperCardTool :ProductListData="ProductListData"> </swiperCardTool>
  </div>
</template>

<style scoped lang="sass">
.swiperSection
  padding: 12px
</style>
