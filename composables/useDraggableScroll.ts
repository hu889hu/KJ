import { onMounted, onUnmounted, ref } from 'vue'

export function useDraggableScroll(containerRef: any) {
  const isDragging = ref(false)
  const startX = ref(0)
  const scrollLeft = ref(0)

  const onMouseDown = (e: any) => {
    isDragging.value = true
    startX.value = e.pageX - containerRef.value.offsetLeft
    scrollLeft.value = containerRef.value.scrollLeft
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: any) => {
    if (!isDragging.value) return
    const x = e.pageX - containerRef.value.offsetLeft
    const walk = (x - startX.value) * 2 // 調整滑動速度
    containerRef.value.scrollLeft = scrollLeft.value - walk
  }

  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('mousedown', onMouseDown)
    }
  })

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('mousedown', onMouseDown)
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return {
    isDragging
  }
}


/**
 * 
 * 使用方式 
 * 
 * 1. 對應page 引入
    const scrollRef = ref(null)
    const { isDragging } = useDraggableScroll(scrollRef)
   2. div 加上 ref="scrollRef"
   3. 內部item class 加上 :class="{ dragging: isDragging }" , 這樣就可以在拖曳時改變樣式 若有原本則可以參照[]
   4. :class="[
        { dragging: isDragging },
        categoryIdLevel1 === item._id ? 'bg-pink' : ''
      ]"
 */
