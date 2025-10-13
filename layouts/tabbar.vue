<template>
  <div class="tabbar-layout">
    <slot />
    <van-tabbar v-model:active="activeTab" fixed class="dark-tabbar">
      <van-tabbar-item name="0" to="/stock/quote" replace>
        <template #icon="props">
          <van-icon
            name="chart-trending-o"
            :color="activeTab == 0 ? '#1a237e' : '#666'"
            size="22"
          />
        </template>
        <span :style="{ color: activeTab == 0 ? '#1a237e' : '#666' }"
          >行情</span
        >
      </van-tabbar-item>
      <van-tabbar-item name="1" to="/stock/news" replace>
        <template #icon="props">
          <van-icon
            name="newspaper-o"
            :color="activeTab == 1 ? '#1a237e' : '#666'"
            size="22"
          />
        </template>
        <span :style="{ color: activeTab == 1 ? '#1a237e' : '#666' }"
          >新聞</span
        >
      </van-tabbar-item>
      <van-tabbar-item name="2" to="/stock/account/transaction" replace>
        <template #icon="props">
          <van-icon
            name="orders-o"
            :color="activeTab == 2 ? '#1a237e' : '#666'"
            size="22"
          />
        </template>
        <span :style="{ color: activeTab == 2 ? '#1a237e' : '#666' }"
          >帳務</span
        >
      </van-tabbar-item>
      <van-tabbar-item name="3" to="/stock/profile" replace>
        <template #icon="props">
          <van-icon
            name="user-o"
            :color="activeTab == 3 ? '#1a237e' : '#666'"
            size="22"
          />
        </template>
        <span :style="{ color: activeTab == 3 ? '#1a237e' : '#666' }"
          >我的</span
        >
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
const route = useRoute()
const activeTab = computed(() => {
  console.log(route.path)

  switch (route.path) {
    case '/stock/quote':
      return 0
    case '/stock/news':
      return 1
    case '/stock/account/transaction':
      return 2
    case '/stock/profile':
      return 3
    default:
      return 0
  }
})
</script>

<style scoped>
.tabbar-layout {
  min-height: 100vh;
  padding-bottom: 50px;
  background-color: #000;
}

:deep(.dark-tabbar) {
  background-color: #111 !important;
  border-top: 1px solid #333 !important;
  z-index: 999 !important;
  padding-bottom: 20px !important;
}

:deep(.dark-tabbar .van-tabbar-item) {
  color: #666;
  background-color: #111;
}

:deep(.dark-tabbar .van-tabbar-item--active) {
  color: #1a237e;
}

:deep(.van-tabbar) {
  position: fixed !important;
  bottom: 0 !important;
  width: 100% !important;
}
</style>
