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
    link: '/game'
  },
  {
    id: '2',
    toptitle: '一個家庭能減少失去親人的痛苦',
    title: '不只是技術投資 <br/> 更是公益行動',
    subtitle: '「醫療設備升級」不只是技術投資，更是一種 公益行動。每一台更新的檢測儀器、每一項智慧晶片的導入，背後代表的都是:<br/>一個孩子可以更早得到診斷的機會<br/>一位長者能夠避免延誤治療的風險<br/>一個家庭能減少失去親人的痛苦<br/>讓醫療平權、讓生命被守護。這份努力，不該只侷限於城市，更要走進偏鄉、跨越國界，把科技的光亮帶到最需要的角落。',
    img: swiper2,
    link: '/game'
  },
  {
    id: '3',
    toptitle: '提供最有價值的操作系統與決策',
    title: '綜合服務<br/>與堅強實力',
    subtitle: '全球領先的金融服務公司為全球100多個國家和地區的重要公司、政府和機構提供解決方案',
    img: swiper3,
    link: '/game'
  },
  {
    id: '4',
    toptitle: '最專業的團隊最精算的程式',
    title: '實現全球業務<br/>的發展與服務',
    subtitle: '憑藉多年的經驗總結出最有效率與報酬的系統',
    img: swiper4,
    link: '/game'
  },
  {
    id: '5',
    toptitle: '擁有多方脈動以便快速決策與計算',
    title: '領先的業務實力<br/>強大的全球網路',
    subtitle: '已獲得多方團隊肯定與支持',
    img: swiper5,
    link: '/game'
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

const routerName = ref()
const type = ref()
onUpdated(() => {
  console.log(router.currentRoute.value.name);
  if (router.currentRoute.value.name) {
    routerName.value = router.currentRoute.value.name
    console.log(routerName.value, 'routerName');
    type.value = routerName.value?.split('-')[1]
  }
})

onMounted(async () => {
  if (router.currentRoute.value.name) {
    routerName.value = router.currentRoute.value.name
    console.log(routerName.value, 'routerName');
    type.value = routerName.value?.split('-')[1]
  }

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

// ---------------------- 核心状态 ----------------------
const mousePos = ref({ x: 0, y: 0 }) // 鼠标实时坐标
const isHovering = ref(false)       // 是否悬停在目标元素上
const elementSize = ref(10); // 主元素默认大小

// 监听悬停，更新主元素大小
watch(isHovering, (newVal) => {
  elementSize.value = newVal ? 40 : 10;
});

// 计算样式（明确指定为 StyleValue 类型）
const followerStyle = computed<StyleValue>(() => ({
  // 主元素基础样式
  width: `${elementSize.value}px`,
  height: `${elementSize.value}px`,
  position: 'fixed',
  top: `${mousePos.value.y - elementSize.value / 2}px`,
  left: `${mousePos.value.x - elementSize.value / 2}px`,
  zIndex: 9999,
  transition: 'transform 0.25s ease-out, width 0.25s ease-out, height 0.25s ease-out',

  // 自定义 CSS 变量（驱动伪元素）

  '--before-margin-left': isHovering.value ? `0px` : '-15px',
  '--before-opacity': isHovering.value ? '1' : '0',
  '--after-width': isHovering.value ? '60px' : '30px',
  '--after-height': isHovering.value ? '60px' : '30px'
}));
// ---------------------- 事件委托：检测悬停 ----------------------
const handleMouseOver = (e) => {
  // 检查目标或其祖先是否是悬停对象（.hover-target）
  if (e.target.closest('.hover-target')) {
    isHovering.value = true
  }
}

const handleMouseOut = (e) => {
  const target = e.target.closest('.hover-target')
  if (target) {
    // 确保鼠标**真正离开**目标元素（而非进入其子元素）
    if (!target.contains(e.relatedTarget)) {
      isHovering.value = false
    }
  }
}
const { isLogin } = useAuthStore()
// 添加事件監聽
onMounted(() => {
  if (!isLogin()) {
    navigateTo('/login')
  }
  console.log('window', window.innerWidth);

  // 监听鼠标移动（仅更新坐标）
  window.addEventListener('mousemove', (e) => {
    mousePos.value = { x: e.clientX, y: e.clientY }
  })
  // 事件委托到document（覆盖所有动态元素，包括router-view内）
  document.addEventListener('mouseover', handleMouseOver)
  document.addEventListener('mouseout', handleMouseOut)
})

// 清理事件監聽
onUnmounted(() => {
  // 清理事件（避免内存泄漏）
  window.removeEventListener('mousemove', () => { })
  document.removeEventListener('mouseover', handleMouseOver)
  document.removeEventListener('mouseout', handleMouseOut)
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="pages">
    <client-only>
      <div class="cursor-follower" :style="followerStyle"></div>
      <headerTop :header="type == 'conversion'" />
      <router-view></router-view>
    </client-only>
  </div>
</template>
<style>
.cursor-follower {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100000;
  width: 20px;
  height: 20px;
  background-color: #FBAB04;
  background-repeat: no-repeat;
  background-size: 25px 25px;
  background-position: center center;
  display: block;
  user-select: none;
  pointer-events: none;
  border-radius: 100px;
  border: 1px solid #FBAB04;
  transition: all 0.5s ease;
}

@media (max-width: 992px) {
  .cursor-follower {
    display: none;
  }
}

.cursor-follower::before {
  content: '';
  display: block;
  background-image: url(@/assets/images/arrow-white.svg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  width: 20px;
  height: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: var(--before-opacity);
  margin-left: var(--before-margin-left);
  transition: 0.3s ease;
}

.cursor-follower::after {
  content: '';
  position: absolute;
  width: var(--after-width);
  height: var(--after-height);
  border: 1px solid #FBAB04;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  transition: width 0.5s ease, height 0.5s ease;
}
</style>

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
