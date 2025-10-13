<template>
  <div ref="noticeBarRef" class="notice-bar">
    <div ref="contentRef" class="notice-bar-content" :style="contentStyle">
      <!-- <slot></slot> -->
      <!-- 如果开启动画 内容循环 -->
      <template v-if="animateFlag">
        <span class="content-headway" :style="{ width: `${headway}px` }"></span>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeBar',
  // 父组件传递数据
  props: {
    // 进步 每秒移动像素值
    speed: {
      type: Number,
      default: 50
    },
    // 首尾间距
    headway: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      contentStyle: {
        transitionDuration: '0s',
        transform: 'translateX(0px)'
      },
      contentWidth: 0,
      time: 0,
      timer: undefined,
      animateFlag: false
    }
  },
  // 生命周期 - 页面完成（可以访问当前dom实例）
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init() {
      // 容器宽度
      const barWidth = this.$refs.noticeBarRef.offsetWidth
      // 内容宽度
      const contentWidth = this.$refs.contentRef.offsetWidth
      console.log('contentWidth', contentWidth)
      console.log('barWidth', barWidth)
      if (contentWidth >= barWidth) {
        // 内容宽度 + 间距
        this.contentWidth = contentWidth + this.headway
        this.animateFlag = true
        this.openCycle()
      } else {
        this.contentWidth = barWidth * 1.3
        this.animateFlag = true
        this.openCycle()
      }
    },
    // 开启循环
    openCycle() {
      // 内容宽度 / 进步数值 = 动画时长
      this.time = this.contentWidth / this.speed
      this.startAnimate()
      // 循环
      this.timer = setInterval(() => {
        this.startAnimate()
      }, this.time * 1000)
      // 消除定时器
      // this.$once('hook:beforeDestroy', () => {
      //   clearInterval(this.timer)
      //   this.timer = null
      // })
    },
    // 开启动画
    startAnimate() {
      // 动画初始状态
      this.contentStyle = {
        transitionDuration: '0s',
        transform: 'translateX(0px)'
      }
      // 动画开启 time 动画时间 contentWidth 动画长度
      setTimeout(() => {
        this.contentStyle = {
          transitionDuration: `${this.time}s`,
          transform: `translateX(-${this.contentWidth}px)`
        }
        console.log('this.contentStyle', this.contentStyle)
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-bar {
  position: relative;
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  overflow: hidden;
  padding: 0 10px;
  &::after {
    content: '';
    width: 30px;
    height: 100%;
    position: absolute;
    right: 0;
    background: linear-gradient(
      270deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .notice-bar-content {
    position: absolute;
    white-space: nowrap;
    transition-timing-function: linear;
    .content-headway {
      display: inline-block;
    }
  }
}
</style>
