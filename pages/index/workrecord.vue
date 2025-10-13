<script lang="ts" setup>
const playerStore = usePlayerStore()
const { t } = useI18n()
const { getListenkey } = playerStore
const socket: any = ref(null)
const socketConnected = ref(false)
const isFirstGet = ref(false)
const ordertList = ref([])
const isloading = ref(false)
// game socket
const reconnected = ref(true)
const closeWebSocket = async () => {
  if (socket.value) {
    socket.value.close()
  }
}
const sendMessage = (msg: any) => {
  // send message to server
  socket.value.send(JSON.stringify(msg))
}

// 連接 socket
const startConnectWebSocket = async () => {
  const getListenkeyRes = await getListenkey()
  console.log('getListenkeyRes', getListenkeyRes)
  if (getListenkeyRes.success) {
    const runtimeConfig = useRuntimeConfig()
    const { POWERSOCKETURL } = runtimeConfig.public
    socket.value = new WebSocket(
      `${POWERSOCKETURL}/${getListenkeyRes.data.listenkey}`
    )
    socket.value.onopen = (event) => {
      console.log('Connected to socket', event)
      socketConnected.value = true
      sendMessage({
        op: 'subscribe',
        channel: ['product', 'order', 'round']
      })
    }
    socket.value.onmessage = async (e) => {
      const message = JSON.parse(e.data)
      // console.log('收到來自 socket 的訊息', message)
      const { event, data } = message
      switch (event) {
        case 'ORDER_UPDATE': {
          isloading.value = true
          ordertList.value = data.result.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          })
          break
        }
        default:
          break
      }
    }
    socket.value.onclose = async () => {
      console.log('Disconnected from socket')
      isFirstGet.value = true
      socketConnected.value = false
      if (reconnected) {
        setTimeout(async () => {
          // await startConnectWebSocket()
          console.log('reconnected to socket')
        }, 3000)
      }
    }

    socket.value.onerror = (error) => {
      socketConnected.value = false
      console.error('WebSocket error:', error)
    }
  }
}


onMounted(async () => {
  await startConnectWebSocket()
})

onBeforeUnmount(() => {
  reconnected.value = false
  closeWebSocket()
})
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>

<template>
  <div class="page">
    <div class="sec-title">
      <h2>{{ $lang('系統工作紀錄') }}</h2>
    </div>
    <div class="formSection">
      <div class="formContent">
        <div class="recordBox" v-if="isloading">
          <table>
            <thead>
              <tr class="recordBox-title">
                <th>{{ $lang('時間') }}</th>
                <th>{{ $lang('商碼') }}</th>
                <th>{{ $lang('内容') }}</th>
                <th>{{ $lang('數量') }}</th>
                <th>{{ $lang('結果') }}</th>
                <th>{{ $lang('種類') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in ordertList" :key="index" class="recordBox-toggle">
                <th>{{ formatDate(item.createdAt) }}</th>
                <th class="content">{{ item.roundNo }}</th>
                <th>{{ item.option.type }}</th>
                <th>{{ item.amount }}</th>
                <th>
                  <div v-if="item.status === 0" class="state false">
                    {{ $lang('等待驗證') }}
                  </div>
                  <div v-else>
                    <div v-if="item.profit > 0" class="state true">
                      {{ $lang('成功') }}
                    </div>
                    <div v-else class="state false">{{ $lang('失敗') }}</div>
                  </div>
                </th>
                <th>
                  {{ item.productName }}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text">
          數據加載中...
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="sass">
.page
  overflow: hidden
  .sec-title
    display: flex
    justify-content: center
    flex-direction: column
    align-items: center
    background-color: #233950
    padding: 80px 0
    color: #fff
    &::before
      content: ''
      background-image: url(@/assets/images/layer1.png)
      background-repeat: no-repeat
      background-size: 100% 100%
      position: absolute
      top: 0
      left: 0
      display: block
      width: 263px
      height: 275px
    &::after 
      content: ''
      background-image: url(@/assets/images/layer1.png)
      background-repeat: no-repeat
      background-size: 100% 100%
      position: absolute
      bottom: 0
      right: 0
      display: block
      width: 263px
      height: 275px
      transform: scale(-1)
    @media (max-width: 992px)
      padding: 40px auto
    h4
      font-size: 20px
    h2
      font-size: 50px
      margin-bottom: 16px
    p
      font-size: 16px
  .bank_form
    overflow: hidden
    position: relative
    &::before
      content: ''
      display: block
      background-image: url(@/assets/images/geometry-3.png)
      position: absolute
      top: 0
      right: -43px
      width: 670px
      height: 678px
      z-index: -1
    &::after 
      content: ''
      display: block
      background-image: url(@/assets/images/geometry-3.png)
      position: absolute
      bottom: 0
      left: 0
      width: 670px
      height: 678px
      z-index: -1
      transform: rotate(180deg)
    .link-btn-row
      position: absolute
      top: 0
      left: 50%
      width: 100%
      max-width: 1200px
      transform: translate(-50%,-100%)
      z-index: 1
      @media (max-width: 992px)
        padding-inline: 20px
        .buttonWhite
          width: 50%
      .buttonWhite
        padding: 16px 70px
        background-color: #7497b5
        color: #fff
        &:nth-child(1)
          border-inline-end: 1px solid #fff
    .form-bg
      max-width: 1200px
      margin: 80px auto
      background-color: #2a4560
      padding: 60px 70px
      @media (max-width: 992px)
        padding: 30px 35px
        margin: 80px 20px

      .title
        margin-bottom: 0
        h2
          font-size: 16px
        h4,h2
          color: #fff !important
     
      .input-classic
        width: 100%
        margin-bottom: 20px
        .input-field
          position: relative
          
        .input-title
          color: #fff
        .inp-icon
          position: absolute
          left: 0
          top: 50%
          transform: translateY(-50%)
          display: inline-block
          img
            width: 20px
            height: 10px
            object-fit: cover
        select option
          color: #000

        input,select
          background: none
          border: none
          color: #fff
          font-size: 16px
          border-bottom: 1px solid #fff
          padding: 0 0 0 40px
          margin: 0
          width: 100%
          display: block
          outline: none
          height: 46px
    .sampleimg
      width: 200px
    .btn-submit
      background: #7497b5
      color: #fff
      padding: 16px 35px
      transition: background-color 0.5s ease
      &:hover
        background: #6685a1
</style>

<style scoped lang="sass">
.router
  width: 100%
  height: 35px
  position: relative
  border-radius: 5px
  font-size: 16px
  background-color: #afafaf
  color: #fff
  display: flex
  align-items: center
  justify-content: flex-start
  border: 1px solid #fff
  svg
    padding: 0 20px 0 10px
  .home
    cursor: pointer
</style>

<style scoped lang="sass">
.formSection
  margin: 20px 0 0 0
  width: 100%
  // height: 58vh
  position: relative
  // border-radius: 5px
  font-size: 16px
  // border: 1px solid #fff
  overflow-y: auto
  @media screen and (max-width: 768px)
    height: 48vh
  color: #fff
  .formContent
    width: 100%
    .changeType
      padding: 0 20px 30px 
    .buttonWhite
      max-width: 50%
      padding: 16px 35px
      background-color: #2a4560
      transition: background-color 0.5s ease
      font-weight: bold
      &:nth-child(1)
        margin-right: 3px
        background-color: #fbab04 !important
        color: #000
        &:hover
          background-color: #fbab0400 !important
      &:hover
        background-color: #6685a1
      &.active
        background-color: #6685a1
</style>
<style scoped lang="sass">
.recordBox
  width: 100%
  padding: 0 0 20px
  @media screen and (max-width: 768px)
    padding: 0 0px 10px 0px
  table
    width: 100%
    // border-collapse: separate
    // border-spacing: 3px
  .recordBox-title
    background-color: #2a4560
    font-size: 16px
    th
      color: #fff

  th
    color: #242222
    padding: 15px
    font-size: 15px
    font-weight: bold
    text-align: center
    border-bottom: 1px solid #ddd
  th:nth-of-type(1)
    width: 15%
    vertical-align: middle
  th:nth-of-type(2)
    width: 10%
    vertical-align: middle
  th:nth-of-type(3)
    width: 20%
    vertical-align: middle
  th:nth-of-type(4)
    width: 10%
    vertical-align: middle
  th:nth-of-type(5)
    width: 10%
    vertical-align: middle
  th:nth-of-type(6)
    width: 20%
    vertical-align: middle
  .recordBox-toggle
    padding: 5px 0
    background-color: #fff
    &:hover
      background-color: #d7f7ff
    td
      padding: 5px
      font-size: 15px
      font-weight: bold
      transition: all ease 0.3s
      word-break: break-word
</style>

<style scoped lang="sass">
.msg-th
  padding: 2px 5px
  .date
    font-size: 14px
    color: #000
    font-weight: bold
.msg-cont
  .msg
    .info-title
      font-size: 16px
      font-weight: bold
      color: #000
      margin: 0 0 5px 0
    .info-msg
      font-size: 16px
      font-weight: bold
      color: #000
      margin: 0 0 5px 0
  .msgContent
    .content
      margin-top: 3px
      padding: 2px 5px
      background-color: rgba(0, 0, 0, 0.1)
      font-size: 14px
      font-weight: bold
      .replyTxt
        color: #fff
        border-radius: 5px
        font-size: 12px
        padding: 2px 5px
        background-color: rgba(179, 33, 28, 0.795)
.msg-cont input[type="checkbox"]
  display: none
.msg-cont .msgContent
  display: none
.msg-cont label
  width: 100%
.msg-cont input[type="checkbox"]:checked ~ .msgContent
  display: block
.replyStyle
  display: flex
  margin: 5px 0 0 0
  justify-content: flex-end
  flex-wrap: wrap
.replyStyle .input
  width: 100%
.replyStyle textarea
  width: 100%
.submitBtn
  width: 100px
  height: 30px
  background-color: #0849aabd
  border-radius: 5px
  text-align: center
  line-height: 30px
  cursor: pointer
  font-size: 12px
  color: #fff
  display: flex
  justify-content: center
  &:hover
    background-color: #40b768
  @media screen and (max-width: 768px)
    width: 60px
    height: 30px
    font-size: 12px
    line-height: 30px
    padding: 0
    margin: 0
    .fa
      font-size: 12px
      padding: 0
</style>

<style scoped lang="sass">
.pages-user-info__form-item
  display: flex
  justify-content: flex-start
  align-items: center
  margin: 10px 0
  color: #101010
  border-bottom: 1px solid #000
  padding: 5px 30px
  .input-title
    width: 100px
    font-size: 16px
    font-weight: bold
    color: #000
    margin: 0 10px 0 0
  .selectStyle
    width: 100%
    height: 40px
    border-radius: 5px
    font-size: 16px
    padding: 0 10px
    border: 1px solid #000
    outline: none
    cursor: pointer
    @media screen and (max-width: 768px)
      font-size: 14px
.text
  text-align: center
  font-size: 20px
  color: #000
  margin-top: 50px
</style>
