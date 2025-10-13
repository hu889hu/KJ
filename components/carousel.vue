<template>
  <div style="width: 100%" ref="entrance">
    <el-carousel
      v-bind="$attrs"
      ref="carousel"
      style="width: 100%"
      indicator-position="outside"
      height="250px"
      arrow="never"
    >
      <slot> </slot
    ></el-carousel>
  </div>
</template>

<script setup="" name="Carousel">
import { ElCarousel, ElCarouselItem, ElButton } from 'element-plus'
import { onMounted, ref, watch, defineOptions } from 'vue'

defineOptions({
  inheritAttrs: false
})

const entrance = ref(null)
const lbDom = ref(null)
const carousel = ref(null)
onMounted(() => {
  lbDom.value = entrance.value
})

watch(
  () => lbDom.value,
  (n) => {
    slide(n)
  }
)

function prev() {
  carousel.value.prev()
}
function next() {
  carousel.value.next()
}

function slide(i) {
  var flag
  var downX
  i.addEventListener('mousedown', function (event) {
    flag = true
    // 获取到点击的x下标
    downX = event.clientX
  })
  i.addEventListener('mousemove', function (event) {
    if (flag) {
      // 判断是否是鼠标按下滚动元素区域
      // 获取移动的x轴
      var moveX = event.clientX
      // 当前移动的x轴下标减去刚点击下去的x轴下标得到鼠标滑动距离
      // 我这里就是根据这个值去判断是否切换的
      var scrollX = moveX - downX
      // 左滑
      if (scrollX < 0) {
        if (scrollX < -150) {
          // 调用切换的方法
          next()
          // 切换完后 取消事件
          flag = false
        }
      }
      if (scrollX > 0) {
        if (scrollX > 150) {
          prev()
          flag = false
        }
      }
    }
  })
  // 鼠标抬起停止拖动
  i.addEventListener('mouseup', function () {
    flag = false
  })
  // 鼠标离开元素停止拖动
  i.addEventListener('mouseleave', function (event) {
    flag = false
  })
}
</script>
