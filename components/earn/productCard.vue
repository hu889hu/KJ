<script lang="ts" setup>
const { t } = useI18n()
const PlayerStore = usePlayerStore()
</script>

<template>
  <div>
    <!-- webDevice -->
    <div>
      <div class="recommendProductListCard">
        <div
          class="cardItem"
          v-for="(item, index) in PlayerStore.playerInfo?.availablePairs"
        >
          <div class="infoItem">
            <div class="cryptoInfo">
              <div class="icon">
                <img :src="item.icon" />
              </div>
              <div class="info">
                <div class="name">
                  {{ item.label || item.name || item.symbol }}
                </div>
                <div class="type">{{ $t('活期理財 | 保本型') }}</div>
              </div>
            </div>
          </div>
          <div class="infoItem marginStyle">
            <div class="toolTitle">{{ $t('年化收益') }}</div>
            <div class="toolTitle">{{ $t('投資期') }}</div>
          </div>
          <div class="infoItem">
            <div class="profitInfo">22.38 % ~ 108.13 %</div>
            <div class="profitTime">5 天</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.recommendProductListCard
  display: flex
  justify-content: space-around
  align-items: flex-start
  flex-wrap: wrap
  .cardItem
    width: 32%
    background: #fff
    border-radius: 16px
    display: block
    color: #121214
    border: 1px solid #f5f7fa
    transition: all .17s cubic-bezier(.52,.07,.45,2.35)
    cursor: pointer
    margin: 0 0 24px 0
    padding: 24px
    .infoItem
      display: flex
      justify-content: space-between
      .cryptoInfo
        display: flex
        justify-content: flex-start
        align-items: center
        .icon
          margin: 0 8px 0 0
          img
            width: 24px
            height: 24px
        .info
          .name
            font-weight: 600
            font-size: 16px
            line-height: 24px
          .type
            font-weight: 400
            font-size: 14px
            line-height: 18px
            color: #adb1b8
            margin: 3px 0 0 0
      .toolTitle
          font-weight: 400
          font-size: 12px
          line-height: 18px
          color: #adb1b8
          margin: 3px 0 0 0
      .profitInfo
        font-weight: 600
        font-size: 18px
        line-height: 26px
        color: #20b26c
      .profitTime
        font-weight: 600
        font-size: 18px
        line-height: 26px
        color: #000
    .marginStyle
      margin: 24px 0 0 0
  .cardItem:hover
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1)
    transform: translateY(-4px)
</style>
