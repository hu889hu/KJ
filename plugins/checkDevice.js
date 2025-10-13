import { ref, onMounted, onBeforeUnmount } from 'vue'

export default defineNuxtPlugin(() => {
  const webDevice = ref(true) // Default to true, you can adjust based on your preference

  const updateDevice = () => {
    webDevice.value = window.innerWidth >= 1026
    console.log('webDevice', webDevice)
  }

  onMounted(() => {
    console.log('Mounted and setting up resize listener')
    updateDevice() // Set initial value
    window.addEventListener('resize', updateDevice)
  })

  onBeforeUnmount(() => {
    console.log('Unmounting and removing resize listener')
    window.removeEventListener('resize', updateDevice)
  })

  return {
    provide: {
      checkDevice: webDevice
    }
  }
})
