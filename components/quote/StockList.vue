<template>
  <div class="stock-list">
    <div 
      v-for="stock in stocks" 
      :key="stock.symbol"
      class="stock-item"
    >
      <div class="stock-info">
        <div class="stock-name">{{ stock.name }}</div>
        <div class="stock-symbol">{{ stock.symbol }}</div>
      </div>
      <div class="stock-price" :class="{ 'red': isPositive(stock.change), 'green': !isPositive(stock.change) }">
        <div class="current-price">{{ stock.price }}</div>
        <div class="price-change">
          <span class="change-arrow">{{ isPositive(stock.change) ? '▲' : '▼' }}</span>
          {{ stock.change }}
          <span class="change-percent">({{ stock.changePercent }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stocks: {
    type: Array,
    required: true
  }
})

const isPositive = (change) => {
  return parseFloat(change) >= 0
}
</script>

<style scoped>
.stock-list {
  padding: 0 16px;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #333;
}

.stock-info {
  flex: 1;
}

.stock-name {
  color: #fff;
  font-size: 16px;
  margin-bottom: 4px;
}

.stock-symbol {
  color: #666;
  font-size: 12px;
}

.stock-price {
  text-align: right;
}

.current-price {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.price-change {
  font-size: 12px;
}

.change-arrow {
  margin-right: 4px;
}

.change-percent {
  margin-left: 4px;
}

.red {
  color: #ff4d4f;
}

.green {
  color: #52c41a;
}
</style>