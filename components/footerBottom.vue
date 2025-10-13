<script lang="ts" setup>
const siteStore = useSiteStore()
const { isLogin, signout } = useAuthStore()
</script>
<template>
  <footer>
    <div class="footer-bottom">
      <div class="introduce">
        <div class="footer-logo">
          <img :src="siteStore.siteData?.logo" alt=""></img>
        </div>
        <div class="footer-info">
          紅杉資本（ Sequoia Capital ）創始於 1972 年，共有 18 只基金，擁有超過 40 億美元總管理資本。
        </div>
      </div>
      <div class="links">
        <dl>
          <dt>快速連結</dt>
          <dd>
            <a href="javascript:void(0)" @click="navigateTo('/')">OKX</a>
          </dd>
          <dd>
            <a href="javascript:void(0)" @click="navigateTo('/')">HTX</a>
          </dd>
          <dd>
            <a href="javascript:void(0)" @click="navigateTo('/')">Binance</a>
          </dd>
          <dd>
            <a href="javascript:void(0)" @click="navigateTo('/')">maicoin</a>
          </dd>
          <dd>
            <a href="javascript:void(0)" @click="navigateTo('/')">BitoEX</a>
          </dd>
        </dl>
      </div>
      <div class="connect">
        <dl>
          <dt>聯絡我們</dt>
          <dd>
            <svg t="1746192296536" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8698" width="200" height="200"><path d="M835.6 756H260c-57.4 0-104.1-46.7-104.1-104.2V274.2c0-57.4 46.7-104.1 104.1-104.1h575.6c57.4 0 104.2 46.7 104.2 104.1v377.6c0 57.5-46.8 104.2-104.2 104.2zM260 218.3c-30.8 0-55.8 25-55.8 55.8v377.6c0 30.8 25 55.9 55.8 55.9h575.6c30.8 0 55.9-25.1 55.9-55.9V274.2c0-30.8-25.1-55.8-55.9-55.8H260z" fill="#828282" p-id="8699"></path><path d="M547.8 476.1c-14.6 0-29.1-4.4-41.3-13.3L193 234.1l28.5-39L535 423.8c7.3 5.4 18.3 5.3 25.6 0L874.2 195l28.5 39-313.6 228.8c-12.2 8.9-26.7 13.3-41.3 13.3z" p-id="8700"></path></svg>info@example.com
          </dd>
          <dd>
            <svg t="1746192169195" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7490"><path d="M512 64C306.4 64 140 230.4 140 436c0 101.6 40.8 194.4 107.2 261.6L512 960l264-263.2c66.4-67.2 107.2-159.2 107.2-261.6C884 230.4 717.6 64 512 64z m128 331.2c-4.8 62.4-54.4 112-116.8 116.8-75.2 6.4-138.4-53.6-138.4-127.2 0-70.4 57.6-128 128-128 73.6 0 133.6 63.2 127.2 138.4z" p-id="7491"></path></svg>香港 金钟道68 号太古广场1 座3613
          </dd>
        </dl>
      </div>
    </div>
  </footer>
</template>
<style scoped lang="sass">
footer
  background: #fff
  background: #000b22
  padding-top: 100px
  padding-bottom: 60px
  color: #b6b6b6
  @media (max-width:768px)
    padding-top: 40px
    padding-bottom: 30px
  .footer-bottom
    width: 1200px
    margin: 0 auto
    display: flex
    flex-wrap: wrap
    @media (max-width: 1200px)
      width: 100%
      padding: 0 20px
    @media (max-width: 768px)
    .introduce
      max-width: 25%
      padding-inline: 14px
      margin-bottom: 20px
      @media (max-width: 768px)
        max-width: 100%
      .footer-logo
        height: 55px
        margin-bottom: 30px
        img
          height: 100%
      .footer-info
        font-size: 14px
    .links,.connect
      padding-inline: 14px
      max-width: 25%
      @media (max-width: 768px)
        max-width: 50% !important
      dl
        dt
          font-size: 18px
          color: #fff
          margin-bottom: 8px
        dd
          font-size: 14px
          margin-bottom: 8px
          .icon
            fill: #b6b6b6
            margin-right: 8px
            width: 16px
            height: 16px
            display: inline-block
          a
            transition: color .3s ease
            &:hover
              color: #fff
</style>
