<script lang="ts" setup>
const { isLogin } = useAuthStore()
const props = defineProps({
  content: [Array]
})
const show = ref(true)

const togglePopup = () => {
  show.value = !show.value
}

// login
const { signin } = useAuthStore()
const fetchSigninApi = ref({
  account: 'qwe0000',
  password: '123456'
})
const setLogin = async () => {
  const res = await signin(fetchSigninApi.value)
  console.log('login successful', res)
}
const clickNavigateTo = (value: any) => {
  show.value = false
  navigateTo(value)
}

const homeList = ref([
  {
    id: 1,
    link: 'https://bu-v2.pages.dev',
    site: 'BU'
  },
  {
    id: 2,
    link: 'https://ccv2-cdr.pages.dev',
    site: 'CC'
  },
  {
    id: 3,
    link: 'https://ch-6cl.pages.dev',
    site: 'CH'
  },
  {
    id: 4,
    link: 'https://kb-6f9.pages.dev',
    site: 'KB'
  },
  {
    id: 5,
    link: 'https://sh-ees.pages.dev/',
    site: 'SH'
  },
  {
    id: 6,
    link: 'https://fx-5et.pages.dev/',
    site: 'FX'
  },
  {
    id: 7,
    link: 'https://rn-4ft.pages.dev',
    site: 'RN'
  },
  {
    id: 8,
    link: 'https://si-5ui.pages.dev/',
    site: 'SI'
  },
  {
    id: 9,
    link: 'https://rn-as.pages.dev',
    site: 'KA'
  },
  {
    id: 10,
    link: 'https://ai-f8n.pages.dev/',
    site: 'AI'
  },
  {
    id: 11,
    link: 'https://bu-9vd.pages.dev/',
    site: 'BU'
  },
  {
    id: 12,
    link: 'https://zw-1wc.pages.dev/',
    site: 'ZW'
  },
  {
    id: 13,
    link: 'https://gf-6yh.pages.dev',
    site: 'GF'
  },
  {
    id: 14,
    link: 'https://mo-9uo.pages.dev',
    site: 'MO'
  },
  {
    id: 15,
    link: 'https://ssv2.pages.dev',
    site: 'SS'
  },
  {
    id: 16,
    link: 'https://lo-4sq.pages.dev/',
    site: 'LO'
  },
  {
    id: 17,
    link: 'https://rc-897.pages.dev',
    site: 'RC'
  },
  {
    id: 18,
    link: 'https://ol-gne.pages.dev',
    site: 'OL'
  },
  {
    id: 19,
    link: 'https://fy-3ay.pages.dev',
    site: 'FY'
  },
  {
    id: 20,
    link: 'https://bt-6ek.pages.dev',
    site: 'BT'
  },
  {
    id: 21,
    link: 'https://ge-bv4.pages.dev',
    site: 'GE'
  },
  {
    id: 22,
    link: 'https://fa-6ua.pages.dev',
    site: 'FA'
  },
  {
    id: 23,
    link: 'https://an-1hu.pages.dev',
    site: 'AN'
  },
  {
    id: 24,
    link: 'https://bu-n1.pages.dev',
    site: 'SN'
  },
  {
    id: 25,
    link: 'https://gl-50z.pages.dev',
    site: 'GL'
  },
  {
    id: 26,
    link: 'https://wi-4pe.pages.dev',
    site: 'WI'
  }
])
const emit = defineEmits(['changeiframe'])
const changeiframe = (item: any) => {
  navigateTo('/')
  emit('changeiframe', item)
  show.value = false
}

await onMounted(async () => {
  if (!isLogin()) {
    await setLogin()
  }
})
</script>

<template>
  <div class="popupIcon">
    <div class="icon" @click="togglePopup">
      <i class="fa-solid fa-laptop-code"></i>
    </div>
    <div v-if="show" class="content">
      <!-- pageItem -->
      <div class="pageItem">
        <div class="title">H</div>
        <div class="pageSection">
          <div
            v-for="(item, index) in homeList"
            :key="index"
            class="pageStyleItem"
            @click="changeiframe(item)"
          >
            {{ item.id }}
            <span style="display: none">{{ item.site }}</span>
          </div>
        </div>
      </div>
      <!-- pageItem -->
      <div class="pageItem">
        <div class="title">R</div>
        <div class="styleItem" @click="clickNavigateTo('/register/model1')">
          1
        </div>
        <div class="styleItem" @click="clickNavigateTo('/register/model2')">
          2
        </div>
        <div class="styleItem" @click="clickNavigateTo('/register/model3')">
          3
        </div>
        <div class="styleItem" @click="clickNavigateTo('/register/model4')">
          4
        </div>
        <div class="styleItem" @click="clickNavigateTo('/register/model5')">
          5
        </div>
        <div class="styleItem" @click="clickNavigateTo('/register/model6')">
          6
        </div>
        <div class="styleItem" @click="clickNavigateTo('/register/model7')">
          7
        </div>
        <div class="styleItem" @click="clickNavigateTo('/register/model8')">
          8
        </div>
      </div>
      <!-- pageItem -->
      <div class="pageItem">
        <div class="title">L</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model1')">1</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model2')">2</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model3')">3</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model4')">4</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model5')">5</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model6')">6</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model7')">7</div>
        <div class="styleItem" @click="clickNavigateTo('/login/model8')">8</div>
      </div>
      <!-- pageItem -->
      <div class="pageItem">
        <div class="title">U</div>
        <div class="styleItem" @click="clickNavigateTo('/user/model1')">1</div>
        <div class="styleItem" @click="clickNavigateTo('/user/model2/info')">
          2
        </div>
        <div class="styleItem" @click="clickNavigateTo('/user/model3')">3</div>
        <div
          class="styleItem"
          @click="clickNavigateTo('/user/model4/dashboard')"
        >
          4
        </div>
        <div class="styleItem" @click="clickNavigateTo('/user/model5')">5</div>
        <div class="styleItem" @click="clickNavigateTo('/user/model6')">6</div>
        <div class="styleItem" @click="clickNavigateTo('/user/model7/info')">
          7
        </div>
        <div class="styleItem" @click="clickNavigateTo('/user/model8')">8</div>
      </div>
      <!-- pageItem -->
      <div class="pageItem">
        <div class="title">G</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model1')">1</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model2')">2</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model3')">3</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model4')">4</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model5')">5</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model6')">6</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model7')">7</div>
        <div class="styleItem" @click="clickNavigateTo('/game/model8')">8</div>
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
  color: black
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
  @media screen and (max-width: 768px)
    width: 100dvw
    height: 90dvh
    right: -20px
</style>

<style scoped lang="sass">
.pageItem
  margin: 20px 0
  .title
    font-size: 20px
    margin: 0 0 10px 0
    color: #000
  .styleItem
    cursor: pointer
    font-size: 18px
    margin: 10px 0
    padding: 5px 10px
    background-color: #f1f1f1
    text-align: center
    border-radius: 5px
    color: #000
</style>

<style scoped lang="sass">
.pageSection
  max-height: 400px
  overflow-y: auto
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  width: 100%
  .pageStyleItem
    width: 20%
    cursor: pointer
    font-size: 18px
    margin: 10px 0
    padding: 5px 10px
    background-color: #f1f1f1
    text-align: center
    border-radius: 5px
    margin: 0 10px 10px 0
    color: #000
</style>
