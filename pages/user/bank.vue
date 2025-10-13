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
      navigateTo('/user/withdraw')
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
  if (bankInfo.value.image[0] === '') {
    return ElMessage.error('請上傳身分證正面')
  }
  if (bankInfo.value.image[1] === '') {
    return ElMessage.error('請上傳身分證反面')
  }
  if (bankInfo.value.image[2] === '') {
    return ElMessage.error('請上傳存摺')
  }
  if (bankInfo.value.image[3] === '') {
    return ElMessage.error('請上傳手持網銀自拍照')
  }
  const bankApplyRes = await bankApply(bankInfo.value)
  if (bankApplyRes) {
    setTimeout(async () => {
      const res = await playerStore.fetchInfo()
      if (res.success) {
        if (playerStore.playerInfo.bankInfo.status === 1) {
          navigateTo('/user/withdraw')
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
  <div>
    <div class="sec-title">
      <span>{{ $lang('請新增銀行帳戶') }}</span>
      <i class="fas fa-money-check"></i>
    </div>
    <div class="bank_form">
      <div
        v-if="
          playerStore.playerInfo.bankInfo === null ||
          Object.keys(playerStore.playerInfo.bankInfo).length === 0
        "
        class="form-bg"
      >
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
        <div v-if="pageType === 'bank'" class="formSection">
          <div class="input-classic">
            <span class="input-title">{{ $lang('銀行') }}</span>
            <select v-model="bankInfo.bankName" name="bName">
              <option
                v-for="item in siteStore.siteData.depositOptions.bank"
                :key="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('分行') }}</span>
            <input
              v-model="bankInfo.branch"
              v-trim-input
              name="bBranch"
              type="text"
            />
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('銀行帳號') }}</span>
            <input
              v-model="bankInfo.accountNo"
              v-trim-input
              name="bAccount"
              type="text"
              required
            />
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('戶名') }}</span>
            <input
              v-model="bankInfo.account"
              v-trim-input
              name="baName"
              type="text"
              required
            />
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
          <div class="input-classic">
            <span class="input-title">{{ $lang('身分證正面') }}</span>
            <pureImgUploader
              :limit="1"
              :index="0"
              @update-image="updateImage"
            ></pureImgUploader>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('身分證反面') }}</span>
            <pureImgUploader
              :limit="1"
              :index="1"
              @update-image="updateImage"
            ></pureImgUploader>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('存摺封面照') }}</span>
            <pureImgUploader
              :limit="1"
              :index="2"
              @update-image="updateImage"
            ></pureImgUploader>
          </div>
          <div class="input-classic">
            <span class="input-title">{{ $lang('手持網銀自拍照') }}</span>
            <pureImgUploader
              :limit="1"
              :index="3"
              @update-image="updateImage"
            ></pureImgUploader>
            <div class="sampleimg">
              範本:
              <img src="@/assets/images/sample.png" />
            </div>
          </div>
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
          <button
            type="button"
            class="submit btn-submit"
            data-loading-text="<i class='fa fa-circle-notch fa-spin'></i> Loading..."
            @click="submitBankApply"
          >
            {{ $lang('送出') }}
          </button>
        </div>
      </div>
      <div v-else class="form-bg">
        <div class="input-classic">
          <span class="input-title">{{ $lang('銀行資訊狀態') }}</span>
          <div class="input-text text-center">
            {{ $lang('資料上傳中') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="sass">
@import '@/assets/sass/user/model2/coin2.scss'
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
  .input-classic
    .input-title
      margin: 0 10px 0 0
      width: 80px
.sampleimg
  width: 50%
  display: flex
  img
    width: 80%
    margin-left: 8px
</style>
