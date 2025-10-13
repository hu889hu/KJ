<template>
  <div class="product-ipo-list">
    <van-list>
      <div
        v-for="(item, index) in list"
        :key="item.name"
        class="product-ipo-cell"
        @click="navigateTo(`/stock/ipo/${item.symbol}`)"
      >
        <!-- 圓環進度 -->
        <van-circle
          v-model:current-rate="item.premium"
          :rate="item.premium"
          :speed="100"
          layer-color="#4E5262"
          :size="87"
          :stroke-width="100"
        >
          <div class="product-ipo-cell__circle">
            <div class="product-ipo-cell__circle-label">溢價差</div>
            <div class="product-ipo-cell__circle-value">
              {{ item.premium }}%
            </div>
          </div>
        </van-circle>

        <!-- 詳細資訊 -->
        <div class="product-ipo-cell__details">
          <div class="product-ipo-cell__name">{{ item.name }}</div>
          <div class="product-ipo-cell__prices">
            <div class="product-ipo-cell__prices-item">
              <div class="product-ipo-cell__prices-label">承銷價</div>
              <div class="product-ipo-cell__prices-value">{{ item.price }}</div>
            </div>
            <div class="product-ipo-cell__prices-item">
              <div class="product-ipo-cell__prices-label">昨收價</div>
              <div class="product-ipo-cell__prices-value">
                {{ item.lastPrice }}
              </div>
            </div>
            <div class="product-ipo-cell__prices-item">
              <div class="product-ipo-cell__prices-label">開始日</div>
              <div class="product-ipo-cell__prices-value">
                <!-- {{ item.startDate }} -->
                {{
                  new Intl.DateTimeFormat('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  }).format(new Date(item.startDate))
                }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            class="product-ipo-cell__status"
            :class="[`product-ipo-cell__status--${item.status}`]"
          >
            {{ item.status === 'inactive' ? '已結束' : '進行中' }}
          </div>
          <van-icon name="arrow" class="product-ipo-cell__icon" />
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  list: []
}>()
</script>

<style>
:root {
  --list-background: #f7f8fa;
  --list-background-2: #f2f3f5;
  --list-background-3: #ffffff00;
  --list-text-color: #323233;
  --list-text-color-2: #969799;
  --list-border-color: #ebedf0;
  --list-gray-6: #969799;
}
</style>

<style scoped>
.product-ipo-list {
  padding: 0 16px;
}

.product-ipo-cell {
  display: flex;
  padding: 16px 0;
  align-items: center;
  border-bottom: 1px solid #111;
}

.product-ipo-cell__circle {
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}

.product-ipo-cell__circle-label {
  font-size: 12px;
  /* color: var(--list-text-color-2); */
  color: #fff;
}

.product-ipo-cell__circle-value {
  font-size: 14px;
  /* color: var(--list-text-color); */
  font-weight: bold;
  color: #fff;
}

.product-ipo-cell__details {
  flex: 1;
  margin-left: 16px;
}

.product-ipo-cell__name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.product-ipo-cell__prices {
  /* display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px; */
}
.product-ipo-cell__prices-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.product-ipo-cell__prices-label {
  font-size: 12px;
  /* color: var(--list-text-color-2); */
  color: #fff;
  margin: 0 5px 0 0;
}

.product-ipo-cell__prices-value {
  font-size: 14px;
  color: #fff;
  /* color: var(--list-text-color); */
}

.product-ipo-cell__icon {
  margin: 20px 8px 0 8px;
  font-size: 16px;
  color: var(--list-gray-6);
}

.product-ipo-cell__status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 2px;
}

.product-ipo-cell__status--inactive {
  color: var(--list-gray-6);
  border: 1px solid var(--list-gray-6);
  background: var(--list-background-3);
}
</style>
