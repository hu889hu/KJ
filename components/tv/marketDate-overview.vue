<template>
  <!-- TradingView Widget BEGIN -->
  <div id="market-data" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
  </div>
  <!-- TradingView Widget END -->
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

onMounted(() => {
  nextTick(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
    script.innerHTML = `
      {
        "colorTheme": "light",
        "dateRange": "12M",
        "showChart": false,
        "locale": "zh_TW",
        "width": "100%",
        "height": "100%",
        "largeChartUrl": "",
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
        "plotLineColorFalling": "rgba(41, 98, 255, 1)",
        "gridLineColor": "rgba(42, 46, 57, 0)",
        "scaleFontColor": "rgba(19, 23, 34, 1)",
        "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
        "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
        "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
        "tabs": [
          {
            "title": "${t('受歡迎的')}",
            "symbols": [
            {
              "s": "BITSTAMP:BTCUSD"
            },
              { "s": "FX:AUDUSD" },
              { "s": "FX:USDJPY" },
              { "s": "FX:GBPUSD" },
              { "s": "CAPITALCOM:US500" },
              { "s": "OANDA:JP225USD" },
              { "s": "FXOPEN:XAUUSD" }
            ]
          },
          {
            "title": "${t('外匯')}",
            "symbols": [
              { "s": "FX:EURUSD" },
              { "s": "FX:GBPUSD" },
              { "s": "FX:USDJPY" },
              { "s": "OANDA:USDCHF" },
              { "s": "FX:AUDUSD" },
              { "s": "OANDA:USDCAD" }
            ]
          },
          {
            "title": "${t('指數')}",
            "symbols": [
              { "s": "CAPITALCOM:US500" },
              { "s": "PEPPERSTONE:FRA40" },
              { "s": "BLACKBULL:US30" },
              { "s": "TVC:UKX" },
              { "s": "OANDA:JP225USD" }
            ]
          },
          {
            "title": "${t('股票')}",
            "symbols": [
              { "s": "NASDAQ:MSFT" },
              { "s": "NASDAQ:AAPL" },
              { "s": "NASDAQ:META" },
              { "s": "NASDAQ:TSLA" },
              { "s": "OTC:GLGDF" }
            ]
          },
          {
            "title": "${t('商品')}",
            "symbols": [
              { "s": "CAPITALCOM:USCOTTON" },
              { "s": "FXOPEN:XAUUSD" },
              { "s": "TVC:UKOIL" },
              { "s": "BLACKBULL:USCOFFEE.F" },
              { "s": "CAPITALCOM:COPPER" }
            ]
          }
        ]
      }
    `
    document.querySelector('#market-data').appendChild(script)
  })
})
</script>

<style></style>
