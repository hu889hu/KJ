import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAsyncData } from '#app' // 確保這個導入是正確的
export default function useDevice(): { isWebDevice: Ref<boolean> } {
  const isWebDevice = ref<boolean>(true)
  const innerWidth = ref<number>(0)

  const updateDevice = (): void => {
    isWebDevice.value = window.innerWidth >= 1026
    innerWidth.value = window.innerWidth
  }

  if (process.client) {
    useAsyncData(async () => {
      updateDevice()
    })

    onMounted(() => {
      window.addEventListener('resize', updateDevice)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateDevice)
    })
  }

  return {
    isWebDevice,
    innerWidth
  }
}
