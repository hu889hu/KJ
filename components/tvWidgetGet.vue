<template>
  <!-- TradingView Widget BEGIN -->
  <div ref="widget1" class="tradingview-widget-container">
    <div id="tradingview_a45bd"></div>
  </div>
  <!-- TradingView Widget END -->
</template>

<script>
export default {
  name: 'App',
  props: {
    symbol: String
  },
  watch: {
    symbol: function (newVal, oldVal) {
      console.log('symbol change:', newVal, oldVal)
      this.loadWidgets()
    }
  },
  mounted() {
    // document.title = "首頁";
    this.$nextTick(() => {
      this.loadWidgets()
    })
  },
  methods: {
    tradingviewSymbol(value) {
      // switch (value) {
      //   case 'BTCUSDT':
      //     return `BINANCE:BTCUSDT.P`
      // }
      console.log('symbol', this.symbol)
      return this.symbol
    },
    loadWidgets() {
      console.log(this.symbol, this.tradingviewSymbol(this.symbol))
      this.loadWidget('widget1', this.tradingviewSymbol(this.symbol))
      // this.loadTradingViewWidget()
    },
    loadWidget(widgetId, symbol) {
      const widget = this.$refs[widgetId]
      if (widget) {
        widget.innerHTML = '' // 清空 placeholder
        const script = document.createElement('script')
        script.src =
          'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
        script.async = true
        script.innerHTML = JSON.stringify({
          autosize: true,
          symbol,
          interval: '60',
          timezone: 'Asia/Taipei',
          theme: 'dark',
          style: '1',
          locale: 'en',

          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          toolbar_bg: '#14171a', // 工具栏背景
          hide_legend: true,
          allow_symbol_change: false,
          save_image: false,
          calendar: false,
          overrides: {
            // ========== 背景与网格 ==========
            'paneProperties.background': ' #14171a', // 纯黑背景
            'paneProperties.vertGridProperties.color': '#1a1a1a', // 深灰网格线
            'paneProperties.horzGridProperties.color': '#1a1a1a', // 深灰网格线
            'paneProperties.crossHairProperties.color': '#333333', // 十字线颜色

            // ========== 价格刻度 ==========
            'scalesProperties.textColor': '#cccccc', // 刻度文字颜色
            'scalesProperties.lineColor': '#1a1a1a', // 刻度线颜色

            // ========== K线/蜡烛图 ==========
            'mainSeriesProperties.candleStyle.upColor': '#00C176', // 阳线绿色
            'mainSeriesProperties.candleStyle.downColor': '#FF3824', // 阴线红色
            'mainSeriesProperties.candleStyle.borderUpColor': '#00C176',
            'mainSeriesProperties.candleStyle.borderDownColor': '#FF3824',
            'mainSeriesProperties.candleStyle.wickUpColor': '#00C176',
            'mainSeriesProperties.candleStyle.wickDownColor': '#FF3824',

            // ========== 工具栏 ==========
            'toolbar.background.color': ' #14171a', // 纯黑工具栏
            'toolbar.separator.color': '#1a1a1a', // 分隔线颜色
            'toolbar.buttonsBackgroundColor': ' #14171a',
            'toolbar.buttonsBorderColor': '#1a1a1a',

            // ========== 状态栏 ==========
            'statusBarStyle.background.upColor': ' #14171a',
            'statusBarStyle.background.downColor': ' #14171a',
            'statusBarStyle.textColor': '#ffffff',

            // ========== 其他元素 ==========
            'legend.background.color': ' #14171a', // 图例背景
            'legend.textColor': '#ffffff', // 图例文字
            'volume.volume.color.0': '#FF3824', // 成交量阴线
            'volume.volume.color.1': '#00C176', // 成交量阳线
            'symbolWatermarkProperties.color': '#333333' // 水印颜色
          }
        })
        script.onload = {
          overrides: {
            'paneProperties.background': ' #14171a' // 纯黑背景
          }
        }
        widget.appendChild(script)
      }
    }
  }
}
</script>

<style>
.right-widget {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 590px;
  margin: 0 auto;
  padding: 20px 0;
  & .item {
    width: calc(50% - 20px);
    margin: 10px;
    border-radius: 5px;
    position: relative;
    & > a {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
    & * {
      width: 100%;
    }
  }
}
</style>
<style scoped lang="sass">
.cover
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  background: #00000000
  border-radius: 5px
  z-index: 10
</style>
