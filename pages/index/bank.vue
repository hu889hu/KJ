<script lang="ts" setup>
const router = useRouter()
const playerStore = usePlayerStore()
const siteStore = useSiteStore()
const { bankApply } = usePlayerStore()
const pageType = ref('bank')
const bankInfo = ref({
  bankName: siteStore.siteData.depositOptions.bank[0],
  branch: '',
  account: '',
  accountNo: '',
  image: ['', '', '', '']
})
await useAsyncData(() => {
  if (playerStore.playerInfo.bankInfo !== null) {
    if (playerStore.playerInfo.bankInfo.status === 1) {
      navigateTo('/withdraw')
    }
  }
})
// methods
const submitBankApply = async () => {
  console.log(bankInfo)
  if (bankInfo.value.branch === '') {
    return ElMessage.error('請填寫分行')
  }
  if (bankInfo.value.account === '') {
    return ElMessage.error('請填寫戶名')
  }
  if (bankInfo.value.accountNo === '') {
    return ElMessage.error('請填寫帳號')
  }
  // if (bankInfo.value.image[0] === '') {
  //   return ElMessage.error('請上傳身分證正面')
  // }
  // if (bankInfo.value.image[1] === '') {
  //   return ElMessage.error('請上傳身分證反面')
  // }
  if (bankInfo.value.image[2] === '') {
    return ElMessage.error('請上傳存摺')
  }
  // if (bankInfo.value.image[3] === '') {
  //   return ElMessage.error('請上傳手持網銀自拍照')
  // }
  const bankApplyRes = await bankApply(bankInfo.value)
  if (bankApplyRes) {
    setTimeout(async () => {
      const res = await playerStore.fetchInfo()
      if (res.success) {
        if (playerStore.playerInfo.bankInfo.status === 1) {
          navigateTo('/withdraw')
        }
      }
    }, 1000)
  }
}
const changeType = async (type) => {
  pageType.value = type
  switch (type) {
    case 'bank':
      bankInfo.value = {
        bankName: siteStore.siteData.depositOptions.bank[0],
        branch: '',
        account: '',
        accountNo: '',
        image: ['', '', '']
      }
      break
    case 'address':
      bankInfo.value = {
        bankName: siteStore.siteData.depositOptions.crypto[0],
        branch: '',
        account: '',
        accountNo: '',
        image: []
      }
      break
  }
}
const updateImage = (data) => {
  // console.log(data)
  if (data.url[0]) {
    bankInfo.value.image[data.index] = data.url[0].url
  } else {
    bankInfo.value.image[data.index] = ''
    console.log(bankInfo.value.image)
  }
}
</script>
<template>
  <div class="page">
    <div class="sec-title" v-if="playerStore.playerInfo.bankInfo === null ||
      Object.keys(playerStore.playerInfo.bankInfo).length === 0">
      <h2>{{ $lang('財務申請') }}</h2>
      <p>{{ $lang('請新增銀行賬戶信息') }}</p>
    </div>
    <div class="bank_form">
      <div v-if="
        playerStore.playerInfo.bankInfo === null ||
        Object.keys(playerStore.playerInfo.bankInfo).length === 0
      " class="form-bg">
        <!-- <div class="form-bg link-btn-row">
          <a
            class="btn-form-link"
            :class="type === 'bank' ? 'active' : ''"
            @click="changeType('bank')"
            >{{ $lang('銀行') }}</a
          >
          <a
            class="btn-form-link"
            :class="type === 'address' ? 'active' : ''"
            @click="changeType('address')"
            >{{ $lang('錢包地址') }}</a
          >
        </div> -->
        <div class="title">
          <h2>{{ $lang('提供申請') }}</h2>
          <p>{{ $lang('請新增一個銀行賬戶') }}</p>
        </div>
        <div v-if="pageType === 'bank'" class="formSection">
          <div class="input-classic">
            <span class="input-title">{{ $lang('銀行') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <select v-model="bankInfo.bankName" name="bName">
                <option v-for="item in siteStore.siteData.depositOptions.bank" :key="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('分行') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <input v-model="bankInfo.branch" v-trim-input name="bBranch" type="text" />
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('銀行帳號') }}</span>
            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <input v-model="bankInfo.accountNo" v-trim-input name="bAccount" type="text" required />
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('戶名') }}</span>

            <div class="input-field">
              <div class="inp-icon">
                <img src="@/assets/images/elele.svg" alt="">
              </div>
              <input v-model="bankInfo.account" v-trim-input name="baName" type="text" required />
            </div>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('上傳檔案') }}</span>
            <!-- <input
              id="file"
              type="file"
              onchange="app.checkImg(this)"
              accept="image/png, image/jpeg, image/jpg"
              multiple
            /> -->
          </div>
          <!-- <div class="input-classic">
            <span class="input-title">{{ $lang('身分證正面') }}</span>
            <pureImgUploader :limit="1" :index="0" @update-image="updateImage"></pureImgUploader>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('身分證反面') }}</span>
            <pureImgUploader :limit="1" :index="1" @update-image="updateImage"></pureImgUploader>
          </div> -->
          <div class="input-classic">
            <span class="input-title">{{ $lang('存摺封面照') }}</span>
            <pureImgUploader :limit="1" :index="2" @update-image="updateImage"></pureImgUploader>
          </div>
          <p style="color: #fff;margin-bottom: 40px;">請上傳身分證(其他證件亦可)與存摺照片，證件+存摺務必同名，請勿修圖後製，請耐心等待審核並開通</p>
        </div>
        <!-- <div v-if="type === 'address'">
          <div class="input-classic">
            <span class="input-title">{{ $lang('幣種') }}</span>
            <select name="bName" v-model="bankInfo.bankName">
              <option
                v-for="item in siteStore.siteData.depositOptions.crypto"
                :key="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('地址') }}</span>
            <input name="bBranch" type="text" v-model="bankInfo.accountNo" />
          </div>
        </div> -->
        <instruction />
        <div class="button-row">
          <button type="button" class="submit btn-submit"
            data-loading-text="<i class='fa fa-circle-notch fa-spin'></i> Loading..." @click="submitBankApply">
            {{ $lang('確認送出') }}
          </button>
        </div>
      </div>
      <div v-else class="sec-title vh-100">
        <div class="cont">
          <h1>已送出</h1>
          <p>已收到您申請的資訊</p>
          <p>請耐心等待審核</p>
          <p>有任何問題請聯繫客服</p>
          <img src="@/assets/images/okk.png" alt="">
          <div class="btn" @click="navigateTo('/')">
            返回首頁
          </div>
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
    .cont
      text-align: center
      h1
        font-weight: 600
        margin-bottom: 30px
        font-size: 50px
      img
        width: 200px
        margin: 30px
      .btn
        background-color: #7497B5
        transition: background-color 0.5s ease
        color: #fff
        display: inline-flex
        column-gap: 10px
        align-items: center
        padding: 12px 35px
        font-weight: 700
        text-transform: uppercase
        cursor: pointer
        border: none
        &:hover
          background-color: #6685a1
  .bank_form
    overflow: hidden
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
    .form-bg
      max-width: 1200px
      margin: 80px auto
      background-color: #2a4560
      padding: 60px 70px
      @media (max-width: 992px)
        padding: 30px 35px
        margin: 40px 20px

      .title
        margin-bottom: 0
        h2
          font-size: 16px
        h4,h2
          color: #fff !important
      .w-full
        margin-top: 20px
      .formSection
        .btn
          font-weight: 600
          display: inline-block
          padding: 16px 35px
          font-size: 18px
          transition: background-color 0.5s ease
          background: #7497b5
          color: #fff
          &:hover
            background: #6685a1
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
