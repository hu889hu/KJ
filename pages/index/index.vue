<script lang="ts" setup>
const { t } = useI18n()
const siteStore = useSiteStore()
const router = useRouter()
const scrollTop = ref(0)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)
const windowHeight = ref(0)


import swiper1 from '@/assets/images/swiper1.jfif'
import swiper2 from '@/assets/images/swiper2.jfif'
import swiper3 from '@/assets/images/swiper3.jfif'
import swiper4 from '@/assets/images/swiper4.jfif'
import swiper5 from '@/assets/images/swiper5.jfif'

const slides = ref([
  {
    id: '1',
    toptitle: '一個孩子可以更早得到診斷的機會',
    title: '讓醫療平權 <br/> 讓生命被守護',
    subtitle: '在全球各地，許多偏鄉與資源不足的地區，醫療院所普遍面臨設備老舊、檢測能力有限、缺乏專業醫療器材的困境。<br/> 國際大型醫院正快速導入智慧醫療、AI 診斷與高端設備時，偏鄉醫院卻仍在努力維持最基本的醫療服務。這種差距，正是需要被彌補的地方。',
    img: swiper1,
    link: '/game/warrants'
  },
  {
    id: '2',
    toptitle: '一個家庭能減少失去親人的痛苦',
    title: '不只是技術投資 <br/> 更是公益行動',
    subtitle: '「醫療設備升級」不只是技術投資，更是一種 公益行動。每一台更新的檢測儀器、每一項智慧晶片的導入，背後代表的都是:<br/>一個孩子可以更早得到診斷的機會<br/>一位長者能夠避免延誤治療的風險<br/>一個家庭能減少失去親人的痛苦<br/>讓醫療平權、讓生命被守護。這份努力，不該只侷限於城市，更要走進偏鄉、跨越國界，把科技的光亮帶到最需要的角落。',
    img: swiper2,
    link: '/game/warrants'
  },
  {
    id: '3',
    toptitle: '提供最有價值的操作系統與決策',
    title: '綜合服務<br/>與堅強實力',
    subtitle: '全球領先的金融服務公司為全球100多個國家和地區的重要公司、政府和機構提供解決方案',
    img: swiper3,
    link: '/game/warrants'
  },
  {
    id: '4',
    toptitle: '最專業的團隊最精算的程式',
    title: '實現全球業務<br/>的發展與服務',
    subtitle: '憑藉多年的經驗總結出最有效率與報酬的系統',
    img: swiper4,
    link: '/game/warrants'
  },
  {
    id: '5',
    toptitle: '擁有多方脈動以便快速決策與計算',
    title: '領先的業務實力<br/>強大的全球網路',
    subtitle: '已獲得多方團隊肯定與支持',
    img: swiper5,
    link: '/game/warrants'
  }
])
const container = ref(null)
const items = ref([])

const prev = () => {
  if (container.value) {
    container.value.scrollBy({
      left: -300,
      behavior: 'smooth'
    })
  }
}

const next = () => {
  if (container.value) {
    container.value.scrollBy({
      left: 300,
      behavior: 'smooth'
    })
  }
}

onMounted(async () => {
  document.documentElement.scrollTop = 0
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }
  windowHeight.value = window.innerHeight
  window.addEventListener('resize', () => {
    windowHeight.value = window.innerHeight
  })
  if (container.value) {
    items.value = container.value.querySelectorAll('.item')
    console.log('找到項目數量:', items.value.length)
  }
})
const handleScroll = () => {
  scrollTop.value = window.scrollY
  let scrollTrue = scrollTop.value + windowHeight.value
  console.log('offsetTop', section1.value?.offsetTop)
  console.log('scrollTop', window.scrollY)
  console.log('scrollTrue', scrollTrue)

  console.log(scrollTrue >= section1.value?.offsetTop - 100)

  if (scrollTrue >= section1.value?.offsetTop - 100) {
    section1.value?.classList.add('section-attain')
  } else {
    section1.value?.classList.remove('section-attain')
  }
  if (scrollTrue >= section2.value?.offsetTop - 100) {
    section2.value?.classList.add('section-scale')
  } else {
    section2.value?.classList.remove('section-scale')
  }
  if (scrollTrue >= section3.value?.offsetTop - 100) {
    section3.value?.classList.add('section-attain')
  } else {
    section3.value?.classList.remove('section-attain')
  }
  if (scrollTrue >= section4.value?.offsetTop - 100) {
    section4.value?.classList.add('section-scale')
  } else {
    section4.value?.classList.remove('section-scale')
  }
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="pages">
    <div class="page-main main1">
      <section class="banner-wrap">
        <client-only>
          <UkSlideshow :options="{ autoplay: false }" :slides="slides" />
        </client-only>
      </section>
      <div div class=" section section2" ref="section2">
        <div class="section-card">
          <div class="card-col">
            <div class="card-item border-right">
              <h2>104</h2>
              <h5>年歷史成就</h5>
            </div>
            <div class="card-item border-right">
              <h2>17</h2>
              <h5>組的亞太配合國家</h5>
            </div>
            <div class="card-item border-right">
              <h2>121</h2>
              <h5>組全球重要夥伴</h5>
            </div>
            <div class="card-item">
              <h2>586</h2>
              <h5>起服務回饋</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="section section3" ref="section3">
        <div class="section-card">
          <div class="card-col">
            <div class=" about-left">
              <img src="@/assets/images/works-8.jpg" alt="">
            </div>
            <div class="card-item">
              <h4>
                關於我們
              </h4>
              <h1>
                本地知識，環球資源!
              </h1>
              <p>為客戶提供廣泛的金融服務，涵蓋投資和企業銀行、環球企業支付、市場業務、銷售和研究、證券服務、商業銀行以及資產管理等領域。</p>
              <div class="about-item" @click="navigateTo('/workrecord')">
                <div class="about-icon">
                  <img src="@/assets/images/about_icon_1.svg" alt=""></img>
                </div>
                <div class="about-text">
                  查看您的工作紀錄
                </div>
              </div>
              <div class="about-item" @click="navigateTo('/info')">
                <div class="about-icon">
                  <img src="@/assets/images/about_icon_2.svg" alt=""></img>
                </div>
                <div class="about-text">
                  修改或查閱個人訊息
                </div>
              </div>
              <div class="about-item" @click="navigateTo('/record')">
                <div class="about-icon">
                  <img src="@/assets/images/about_icon_3.svg" alt=""></img>
                </div>
                <div class="about-text">
                  查閱您的財務紀錄
                </div>
              </div>
              <div class="about-btn" @click="navigateTo('/game/warrants')">
                進入系統
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="marquee-wrap">
        <div class="marquee-row marquee-forward">
          <div class="marquee-item" data-text="Localexpertise">Localexpertise</div>
          <div class="marquee-item" data-text="Globalresources">Globalresources</div>
          <div class="marquee-item" data-text="Successful">Successful</div>
          <div class="marquee-item" data-text="Prosperous">Prosperous</div>
          <div class="marquee-item" data-text="Seriously">Seriously</div>
          <div class="marquee-item" data-text="Responsible">Responsible</div>
          <div class="marquee-item" data-text="Professional">Professional</div>
          <div class="marquee-item" data-text="EconomicsMajor">EconomicsMajor</div>
          <div class="marquee-item" data-text="Efficiency">Efficiency</div>
        </div>
      </section>
    </div>
  </div>
</template>
<style></style>

<style scoped lang="sass">
.pages
  display: block
  .section
    .section-card
      max-width: 1200px
      margin: 0 auto
      padding: 0 20px
  .section2
    background-color: #2a4560
    color: #fff
    .section-card
      .card-col
        display: flex
        flex-wrap: wrap
        .border-right
          border-right: 1px solid  rgba(255, 255, 255, .6)
        .card-item
          width: 25%
          margin: 30px 0
          text-align: center
          h2
            font-size: 40px
            line-height: 2
            font-weight: 700
          h5
            font-size: 16px
  .section3
    padding: 80px 0
    .card-col
      display: flex
      justify-content: center
      flex-wrap: wrap
      gap: 70px
      .about-left
        width: 400px
        height: 500px
        overflow: hidden
        border: 1px solid #7497B5
        img
          width: 100%
          height: 100%
          object-fit: cover
      .card-item
        max-width: 570px
        h4
          font-size: 20px
          color: #7497B5
        h1
          font-size: 42px
          color: #242222
          margin-bottom: 16px
        p
          font-size: 16px
          margin-bottom: 16px
        .about-item
          display: flex
          align-items: center
          gap: 10px
          margin-bottom: 16px
          .about-icon
            padding: 10px
            border: 1px solid #7497B5
            img
              width: 30px
              height: 30px
          .about-text
            font-size: 16px
            transition: color .3s ease
            &:hover
              color: #7497B5
        .about-btn
          cursor: pointer
          display: inline-block
          transition: background-color .4s ease
          padding: 12px 35px
          background-color: #7497B5
          border: none
          color: #fff
          margin-top: 36px
          &:hover
            background-color: #6685a1
  .marquee-wrap
    background-color: #f6f6f6
    border-top: 1px solid #dad7d7
    padding: 40px 0
    overflow: hidden
    .marquee-row 
      display: flex
      align-items: center
      column-gap: 40px
    
    .marquee-row:hover 
        animation-play-state: paused
    
    .marquee-forward 
        animation: marqueeForward 15s linear infinite
    
    @keyframes marqueeForward 
      0% 
        transform: translateX(0)
      100% 
        transform: translateX(-100%)
    .marquee-item 
      font-family: sans-serif
      font-size: 56px
      text-transform: uppercase
      font-weight: 700
      color: transparent
      -webkit-text-stroke: 1px black
      -webkit-text-fill: black
      display: flex
      align-items: center
      transition: 0.5s ease
      position: relative
      &:hover 
        -webkit-text-stroke: 1px #fff
    
      &::before 
        content: attr(data-text)
        position: absolute
        top: 0
        left: 50%
        transform: translateX(-50%)
        width: 100%
        height: 0
        overflow: hidden
        white-space: nowrap
        transition: height .8s cubic-bezier(.22, .61, .36, 1)
        -webkit-text-fill-color: black
        -webkit-text-stroke: transparent
    
    .marquee-item:hover::before 
        height: 100%
    
    .marquee-item::after 
        content: '*'
        line-height: 1
        margin-left: 40px
        vertical-align: middle
        font-size: 70px
        padding-top: 20px
        transition: 0.3s ease
    
    .marquee-item:hover::after 
        -webkit-text-fill-color: black
        -webkit-text-stroke: transparent
    

</style>
