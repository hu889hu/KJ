<script lang="ts" setup>
const props = defineProps({
  content: [Array]
})
const show = ref(true)

const togglePopup = () => {
  show.value = !show.value
}
const showDocument = () => {
  return window.location.origin.indexOf('localhost') > -1
}
</script>

<template>
  <div class="popupIcon" v-if="showDocument">
    <div @click="togglePopup" class="icon">
      <i class="fa-solid fa-file-word"></i>
    </div>
    <div class="content" v-if="show">
      <div class="item" v-for="(item, index) in props.content" :key="index">
        <div class="title">{{ item.title }}</div>
        <div class="tips" v-for="tipsItem in item.tips" :key="tipsItem">
          - {{ tipsItem }}
        </div>
        <div class="api" v-if="item.api.length > 0">
          <div class="toolTitle">action:</div>
          <div v-for="apiItem in item.api" :key="apiItem">
            {{ apiItem }}
          </div>
        </div>
        <div class="useValue" v-if="item.useValue">
          <div class="toolTitle">useValue:</div>
          <div>{{ item.useValue }}</div>
        </div>
        <div class="toolTitle" v-if="item.srcList.length > 0">screenShot:</div>
        <div class="image" v-if="item.srcList.length > 0">
          <div
            v-for="(srcListItem, srcListIndex) in item.srcList"
            :key="srcListIndex"
          >
            <el-image
              style="width: 200px; height: 200px"
              :src="srcListItem"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="item.srcList"
              :initial-index="4"
              fit="cover"
            />
          </div>
        </div>
        <div class="clickRouter" v-if="item?.clickRouter">
          <div
            v-for="(clickRouterItem, clickRouterIndex) in item.clickRouter"
            :key="clickRouterIndex"
          >
            <div
              class="clickRouterTitle"
              @click="navigateTo(clickRouterItem.router)"
            >
              <i class="fa-solid fa-right-long"></i> {{ clickRouterItem.title }}
            </div>
            <div class="image" v-if="clickRouterItem.srcList.length > 0">
              <div
                v-for="(srcListItem, srcListIndex) in clickRouterItem.srcList"
                :key="srcListIndex"
              >
                <el-image
                  style="width: 200px; height: 200px"
                  :src="srcListItem"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="clickRouterItem.srcList"
                  :initial-index="4"
                  fit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.popupIcon
  position: fixed
  bottom: 20px
  right: 20px
  background-color: #fff
  height: 40px
  width: 40px
  border-radius: 50%
  font-size: 24px
  cursor: pointer
  z-index: 999
  .icon
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>

<style scoped lang="sass">
.content
  position: absolute
  height: 90dvh
  background-color: #fff
  width: 400px
  top: -90.5dvh
  right: 0
  padding: 20px
  overflow-y: auto
  border-radius: 10px
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)
  user-select: text
  -moz-user-select: text
  -webkit-user-select: text
  -ms-user-select: text
</style>

<style scoped lang="sass">
.item
  margin: 15px 0
  border-bottom: 1px solid #000000
  padding: 0 0 20px 0
  .title
    margin: 10px 0
    font-size: 18px
    font-weight: 600
  .tips
    margin: 5px 0 25px 0
    font-size: 14px
  .api
    margin: 10px 0 15px 0
    font-size: 14px
  .useValue
    margin: 10px 0
    font-size: 14px
  .toolTitle
    font-size: 16px
    font-weight: 600
    margin: 0 0 10px 0
  .clickRouter
    font-size: 16px
    font-weight: 600
    margin: 0 0 10px 0
    .clickRouterTitle
      margin: 15px 0 0 0
      cursor: pointer
      color: blue
</style>
