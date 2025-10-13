<script lang="ts" setup>
const { t } = useI18n()
const PlayerStore = usePlayerStore()
</script>

<template>
  <div class="balanceHeader">
    <img src="@/assets/sass/earn/model1/headerSvg1.svg" />
    <div class="content">
      <img class="middleIcon" src="@/assets/sass/earn/model1/headerSvg3.svg" />
      <div class="decriptionSection">
        <div class="title">
          {{ $t('理財') }}
        </div>
        <div class="subTitle">
          {{ $t('與其長期持有，不如以智能方式讓加密貨幣資產穩健增值。') }}
        </div>
      </div>
      <div class="infoCard">
        <div class="infoContentItem">
          <div class="balanceTitle">
            {{ $t('總淨值（理財）') }}
          </div>
          <div class="balanceTitle">
            {{ $t('每日收益') }}
          </div>
        </div>
        <div class="infoContentItem">
          <div class="playerBalance">
            $
            {{
              new Intl.NumberFormat('zh-TW').format(
                PlayerStore.playerInfo?.balance
              )
            }}
          </div>
          <div class="playerProfit">+ 100%</div>
        </div>
        <div class="infoContentItem">
          <div class="playerProfitBtn">
            {{ $t('我的收益') }}
          </div>
          <div class="playerHistoryBtn">{{ $t('訂單歷史') }}</div>
        </div>
      </div>
    </div>
    <img src="@/assets/sass/earn/model1/headerSvg2.svg" />
  </div>
</template>

<style scoped lang="sass">
.balanceHeader
  height: 220px
  background-color: #121214
  width: 100dvw
  position: relative
  margin-bottom: 24px
  display: flex
  justify-content: center
  .content
    position: relative
    width: 85%
    max-width: 1240px
    height: 100%
    .middleIcon
      position: absolute
      top: 50%
      left: 60%
      transform: translate(-50%, -50%)
</style>

<style scoped lang="sass">
.decriptionSection
  padding-left: 12px
  color: #fff
  position: absolute
  top: 50%
  transform: translateY(-50%)
  display: flex
  flex-direction: column
  .title
    font-weight: 700
    font-size: 32px
    line-height: 40px
    color: #fff
    margin-bottom: 8px
  .subTitle
    color: #adb1b8
    font-weight: 500
    font-size: 16px
    line-height: 24px
</style>

<style scoped lang="sass">
.infoCard
  right: 8px
  position: absolute
  top: 50%
  transform: translateY(-50%)
  width: 424px
  min-height: 142px
  background: rgba(1, 3, 5, .8)
  backdrop-filter: blur(6px)
  border-radius: 16px
  color: #f0f8ff
  padding: 24px
  .infoContentItem
    display: flex
    justify-content: space-between
    .balanceTitle
      font-weight: 400
      font-size: 12px
      line-height: 18px
      color: #adb1b8
    .playerBalance
      font-weight: 600
      font-size: 18px
      line-height: 26px
    .playerProfit
      font-weight: 600
      font-size: 18px
      line-height: 26px
      color: #20b26c
    .playerProfitBtn
      border: none
      cursor: pointer
      border-radius: 8px
      background: #ffb11a
      color: #000
      display: flex
      justify-content: center
      align-items: center
      position: relative
      width: 47%
      height: 32px
      font-weight: 600
      font-size: 12px
      line-height: 18px
      padding: 0 16px
      margin: 12px 0 0 0
    .playerHistoryBtn
      border: 1px solid #595d61
      cursor: pointer
      border-radius: 8px
      background: #00000000
      color: #fff
      display: flex
      justify-content: center
      align-items: center
      position: relative
      width: 47%
      height: 32px
      font-weight: 600
      font-size: 12px
      line-height: 18px
      padding: 0 16px
      margin: 12px 0 0 0
</style>
