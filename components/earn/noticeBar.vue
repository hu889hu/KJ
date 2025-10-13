<script lang="ts" setup>
const { t } = useI18n()
</script>
<template>
  <div class="noticeBar">
    <van-notice-bar left-icon="volume-o" :scrollable="false" mode="link">
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :touchable="false"
        :show-indicators="false"
      >
        <van-swipe-item>明月直入，无心可猜。</van-swipe-item>
        <van-swipe-item>仙人抚我顶，结发受长生。</van-swipe-item>
        <van-swipe-item>今人不见古时月，今月曾经照古人。</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </div>
</template>

<style scoped lang="sass">
.van-notice-bar
  background: #fff
  color: #000

.notice-swipe
  height: 40px
  line-height: 40px

.noticeBar
  width: 100%
  padding: 6px 24px
  background: #fff
  border-radius: 12px
  margin: 0 0 24px 0
  overflow: hidden
  color: #121214
</style>
