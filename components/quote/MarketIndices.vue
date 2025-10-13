<template>
  <div class="indices-container">
    <div class="index-box">
      <div class="index-title">加權指數</div>
      <div class="index-value red">{{ listedIndex.value.toLocaleString() }}</div>
      <div class="index-change red">
        <span>▲ {{ listedIndex.change }}</span>
        <span>{{ listedIndex.changePercent }}</span>
      </div>
    </div>
    <div class="index-box">
      <div class="index-title">櫃買指數</div>
      <div class="index-value red">{{ otcIndex.value.toLocaleString() }}</div>
      <div class="index-change red">
        <span>▲ {{ otcIndex.change }}</span>
        <span>{{ otcIndex.changePercent }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  listedIndex: {
    type: Object,
    required: true
  },
  otcIndex: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.indices-container {
  display: flex;
  padding: 8px;
  gap: 8px;
  background-color: #000;
}

.index-box {
  flex: 1;
  background-color: #111;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  padding: 12px;
}

.index-title {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.index-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.index-change {
  font-size: 14px;
  display: flex;
  gap: 8px;
}

.red {
  color: #ff4d4f;
}

.green {
  color: #52c41a;
}
</style>