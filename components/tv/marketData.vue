<template>
  <div style="height: 500px; width: 100%">
    <!-- TradingView Widget BEGIN -->
    <div id="market-data" class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
    </div>
    <!-- TradingView Widget END -->
  </div>
</template>

<script>
import { nextTick } from 'vue'

export default {
  mounted() {
    nextTick(() => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
      script.innerHTML = `
         {
  "width": "100%",
  "height": "500",
  "defaultColumn": "overview",
  "screener_type": "crypto_mkt",
  "displayCurrency": "USD",
  "colorTheme": "light",
  "locale": "zh_TW"
}
      `
      document.querySelector('#market-data').appendChild(script)
    })
  }
}
</script>

<style></style>
