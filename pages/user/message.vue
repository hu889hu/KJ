<script lang="ts" setup>
const { t } = useI18n()
const store = useTicketStore()
const router = useRouter()
const { queryTicket, createTicket, read, reply } = store
// methods
const sendMessage = ref({
  title: '',
  content: ''
})
const sendReply = ref('')
const pageType = ref('message')
await useAsyncData(async () => {
  await queryTicket()
  console.log('queryTicket', store.tickets)
})
const sendTicket = async () => {
  if (!sendMessage.value.title || !sendMessage.value.content) {
    ElNotification({
      title: `${t('請填寫標題與內容')}`,
      type: 'error',
      duration: 1000,
      showClose: false
    })
    return
  }
  const res = await createTicket({
    title: sendMessage.value.title,
    content: sendMessage.value.content
  })
  if (res) {
    ElNotification({
      title: `${t('訊息已送出')}`,
      type: 'success',
      duration: 1000
    })
    sendMessage.value.title = ''
    sendMessage.value.content = ''
    await queryTicket()
    pageType.value = 'message'
  }
}

const sendReplyTicket = async (id: number) => {
  if (!sendReply.value) {
    ElNotification({
      title: `${t('請填寫回覆內容')}`,
      type: 'error',
      duration: 1000,
      showClose: false
    })
    return
  }
  const res = await reply({
    id,
    content: sendReply.value
  })
  if (res) {
    ElNotification({
      title: `${t('回覆已送出')}`,
      type: 'success',
      duration: 1000
    })
    sendReply.value = ''
  }
}

const sandRead = async (item: any) => {
  if (
    item.thread.find((message) => message.role !== 0 && message.read === null)
  ) {
    await read({ id: item.id })
    await queryTicket()
  }
}
const checkNewMessage = (item: any) => {
  return item.thread.find(
    (message) => message.role !== 0 && message.read === null
  )
}
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
  <div class="pages">
    <div class="sec-title">
      <span>{{ $lang('站內訊息') }}</span>
      <i class="far fa-comments"></i>
    </div>
    <div class="formSection">
      <div class="formContent">
        <div class="changeType">
          <button
            type="button"
            class="buttonWhite"
            :class="pageType === 'message' ? 'active' : ''"
            @click="pageType = 'message'"
          >
            {{ $lang('站內訊息') }}
          </button>
          <button
            type="button"
            class="buttonWhite"
            :class="pageType === 'send' ? 'active' : ''"
            @click="pageType = 'send'"
          >
            {{ $lang('發送訊息') }}
          </button>
        </div>
        <div v-if="pageType === 'message'" class="messageBox">
          <table>
            <tr class="message-title">
              <th>{{ $lang('建立日期') }}</th>
              <th>{{ $lang('內容') }}</th>
            </tr>
            <tr
              v-for="(item, index) in store.tickets"
              :key="index"
              class="message-toggle"
            >
              <td class="msg-th">
                <div class="date">
                  {{ formatDate(item.createdAt) }}
                </div>
              </td>
              <td class="msg-cont">
                <input :id="item.id" type="checkbox" />
                <label :for="item.id" @click="sandRead(item)">
                  <div class="msg">
                    <div class="info-title">
                      <span>{{ item.title }}</span>
                    </div>
                    <div class="info-msg">
                      <span>{{ $lang('訊息列表') }}: {{ item.content }}</span>
                      <span v-if="checkNewMessage(item)" class="msg-new">{{
                        $lang('新訊息')
                      }}</span>
                    </div>
                  </div>
                </label>
                <div class="msgContent">
                  <div
                    v-for="(txt, txtIndex) in item.thread"
                    :key="txtIndex"
                    class="content"
                  >
                    {{ formatDate(txt.createdAt) }}<br /><span
                      class="replyTxt"
                      >{{
                        txt.role === 0 ? $lang('用戶') : $lang('客服')
                      }}</span
                    >
                    :
                    {{ txt.content }}
                  </div>
                  <div class="replyStyle">
                    <div class="input">
                      <textarea
                        v-model="sendReply"
                        name="content"
                        rows="5"
                        cols="20"
                        class="textarea-classic"
                        required
                      ></textarea>
                    </div>
                    <div class="replyBtn">
                      <button
                        type="button"
                        class="submitBtn"
                        data-loading-text="<i class='fa fa-circle-notch fa-spin'></i> Loading..."
                        @click="sendReplyTicket(item.id)"
                      >
                        {{ $lang('回覆') }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div v-else>
          <div class="form-bg">
            <div class="input-classic">
              <span class="input-title">{{ $lang('主旨') }}</span>
              <input
                v-trim-input
                v-model="sendMessage.title"
                type="text"
                name="title"
                required
              />
            </div>
            <div class="input-classic">
              <span class="input-title">{{ $lang('內容') }}</span>
              <textarea
                v-model="sendMessage.content"
                name="content"
                rows="5"
                cols="20"
                class="textarea-classic"
                required
              ></textarea>
            </div>
          </div>
          <button type="button" class="buttonWhGreen" @click="sendTicket">
            {{ $lang('送出') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
.pages
  @media screen and (max-width: 768px)
    padding: 10px
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
  height: 58vh
  position: relative
  border-radius: 5px
  font-size: 16px
  border: 1px solid #fff
  overflow-y: auto
  @media screen and (max-width: 768px)
    height: 48vh
  .formContent
    width: 100%
</style>

<style scoped lang="sass">
.buttonWhGreen
  margin: 30px 0
  width: 240px
  height: 40px
  background-color: #31a759
  border-radius: 5px
  text-align: center
  line-height: 40px
  cursor: pointer
  font-size: 16px
  color: #fff
  display: flex
  justify-content: center
  position: absolute
  left: 50%
  transform: translateX(-50%)
  &:hover
    background-color: #40b768
  @media screen and (max-width: 768px)
    position: relative
    width: 135px
    bottom: 10px
    margin: 30px auto
    right: 0
  svg
    padding: 0 10px 0 0
.buttonWhite
  margin: 30px 0 0 30px
  width: 100px
  height: 40px
  background-color: #dcdcdc
  border-radius: 5px
  text-align: center
  line-height: 40px
  cursor: pointer
  font-size: 16px
  color: #000
  @media screen and (max-width: 768px)
    width: 135px
.active
  background-color: #31a759
  color: #fff
</style>

<style scoped lang="sass">
.form_input
  width: 100%
  border-radius: 5px
  margin: 20px auto
  font-size: 16px
  overflow: hidden
  position: relative
  display: block
  display: flex
  justify-content: center
  align-items: flex-start
  flex-wrap: wrap
  .inputTitle
    background-color: #fff
    border-radius: 5px
    width: 30%
    display: block
    text-align: center
    margin: 0 10px 0 0
    font-size: 16px
    padding: 5px 0
    @media screen and (max-width: 768px)
      width: 90%
      font-size: 14px
      margin: 0 0 10px  0
  .empty
    background-color: #fff0
  .inputIten
    border-radius: 5px
    position: relative
    width: 60%
    background-color: #e2efff
    padding: 5px 15px
    @media screen and (max-width: 768px)
      width: 90%
    .input_text
      display: flex
      justify-content: flex-start
      align-items: center
      .textNormal
        padding: 0 10px 0
    .input_style
      border-radius: 5px
      border: none
      background-color: #e2efff
      height: 100%
      width: 100%
    input
      width: 100%
      height: 100%
      border: none
      background-color: #e2efff
      font-size: 16px
      outline: none
      &::placeholder
        color: #000
      @media screen and (max-width: 768px)
        font-size: 14px
    textarea
      height: 200px
      width: 100%
      border: none
      background-color: #e2efff
      font-size: 16px
      outline: none
      &::placeholder
        color: #000
      @media screen and (max-width: 768px)
        font-size: 14px
    select
      width: 100%
      border: none
      background-color: #e2efff
      outline: none
    .eyes
      position: absolute
      right: 5px
      top: 50%
      transform: translateY(-50%)
      z-index: 99
      cursor: pointer
    .imgUploader
      display: flex
      justify-content: center
  .noBackground
    background-color: #fff0
  .padding_Right_more
    padding: 5px 25px 5px 15px
  .flexStyle
    display: flex
    justify-content: flex-start
    align-items: center
    input
      margin: 5px 0 5px 10px
  .tipsLeft
    width: 30%
    @media screen and (max-width: 768px)
      width: 32%
  .tipsRight
    width: 60%
    display: block
    text-align: center
    font-size: 12px
    padding: 2px 0
    color: #cf0000
    text-align: right
    @media screen and (max-width: 768px)
      width: 60%
      font-size: 10px
  .fullFlex
    width: 100%
  .inputCheck
    width: 5%
    @media screen and (max-width: 768px)
     width: 10%
  .text
    width: 85%
    @media screen and (max-width: 768px)
     width: 80%
     font-size: 12px
</style>

<style scoped lang="sass">
.changeType
  display: flex
  justify-content: flex-start
  align-items: center
</style>

<style scoped lang="sass">
.messageBox
  width: 100%
  padding: 20px 30px
  @media screen and (max-width: 768px)
    padding: 20px 5px 10px 5px
  table
    width: 100%
    border-collapse: separate
    border-spacing: 3px
  .message-title
    background-color: #fff
    color: #000
    font-size: 16px
    th
      padding: 5px
      font-size: 15px
      font-weight: bold
      background-color: rgba(0, 0, 0, 0.2)
    th:nth-of-type(1)
      width: 30%
    th:nth-of-type(2)
      width: 70%
  .message-toggle
    padding: 5px 0
    td
      padding: 5px
      font-size: 15px
      font-weight: bold
      background-color: #e5e5e5
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
  background-color: #31a759
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

<style scoped>
.msg-new {
  font-size: 12px;
  color: #fff;
  border-radius: 5px;
  padding: 2px 5px;
  background-color: rgb(206, 38, 38);
  margin-left: 5px;
  font-weight: bold;
}
</style>
