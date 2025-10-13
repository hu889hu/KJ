<template>
  <div style="width: 100%;height: 72px;">
    <!-- TradingView Widget BEGIN -->
    <div id="market-data-ticket" class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
    </div>
    <!-- TradingView Widget END -->
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js'
    script.innerHTML = `
      {
        "symbols": [
          {
            "description": "",
            "proName": "OANDA:GBPUSD"
          },
          {
            "description": "",
            "proName": "OANDA:EURUSD"
          },
          {
            "description": "",
            "proName": "FX_IDC:USDAUD"
          },
          {
            "description": "",
            "proName": "COINBASE:ETHUSD"
          },
          {
            "description": "",
            "proName": "BITSTAMP:BTCUSD"
          }
        ],
        "isTransparent": false,
        "showSymbolLogo": true,
        "colorTheme": "light",
        "locale": "en"
      }
    `
    this.$nextTick(() => {
      document.querySelector('#market-data-ticket').appendChild(script)
    })
  }
}
</script>

<style>
.tradingview-widget-container {
  width: 100% !important;
  height: 100% !important;
}
</style>
