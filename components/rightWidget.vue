<template>
  <div>
    <div class="right-widget">
      <div class="item">
        <div class="cover"></div>
        <!-- <a href="#0" target="_blank" class="auth"></a> -->
        <!-- TradingView Widget BEGIN -->
        <div id="widget_1" ref="widget1" class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
        </div>
        <!-- TradingView Widget END -->
      </div>
      <div class="item">
        <div class="cover"></div>
        <!-- <a href="#0" target="_blank" class="auth"></a> -->
        <!-- TradingView Widget BEGIN -->
        <div id="widget_2" ref="widget2" class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
        </div>
        <!-- TradingView Widget END -->
      </div>
      <div class="item">
        <div class="cover"></div>
        <!-- <a href="#0" target="_blank" class="auth"></a> -->
        <!-- TradingView Widget BEGIN -->
        <div id="widget_3" ref="widget3" class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
        </div>
        <!-- TradingView Widget END -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // document.title = "首頁";
    this.$nextTick(() => {
      this.loadWidgets()
    })
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale
    },
    loadWidgets() {
      this.loadWidget('widget1', 'COINBASE:USDTUSD')
      this.loadWidget('widget2', 'BITSTAMP:USDCUSD')
      this.loadWidget('widget3', 'CRYPTO:BUSDUSD')
      this.loadWidget('widget4', 'CRYPTO:WBNBUSD')
      this.loadWidget('widget5', 'OSMOSIS:WETHUSD')
      this.loadWidget('widget6', 'COINBASE:OSMOUSD')
      // this.loadTradingViewWidget()
    },
    loadWidget(widgetId, symbol) {
      const widget = this.$refs[widgetId]
      if (widget) {
        widget.innerHTML = '' // 清空 placeholder
        const script = document.createElement('script')
        script.src =
          'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
        script.async = true
        script.innerHTML = JSON.stringify({
          symbol,
          width: '100%',
          height: '100%',
          locale: this.lang, // 从Vue实例获取语言
          dateRange: '1M',
          colorTheme: 'light',
          trendLineColor: '#37a6ef',
          underLineColor: '#E3F2FD',
          isTransparent: false,
          autosize: true,
          largeChartUrl: ''
        })
        widget.appendChild(script)
      }
    },
    loadTradingViewWidget() {
      const widget_7 = this.$refs.widget_7 // 获取小部件容器的引用
      widget_7.innerHTML = '' // 清空容器

      // 创建并设置script元素
      const scriptElement = document.createElement('script')
      scriptElement.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js'
      scriptElement.async = true
      scriptElement.innerHTML = `{"symbols": [{"proName": "FX:GBPUSD","title": "GBP/USD"},{"proName": "FX:EURUSD","title": "EUR/USD"},{"proName": "FX_IDC:USDAUD","title": "USD/AUD"},{"proName": "BITSTAMP:ETHUSD","title": "ETH/USD"},{"proName": "BITSTAMP:BTCUSD","title": "BTC/USD"},{"proName": "FX:USDCAD","title": "USD/CAD"}],"colorTheme": "light","isTransparent": false,"showSymbolLogo": true,"locale": "${this.lang}"}`

      // 将script元素添加到小部件容器中
      widget_7.appendChild(scriptElement)
    }
  }
}
</script>

<style>
.right-widget {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* max-width: 590px; */
  margin: 0 auto;
  padding: 20px 0;
  & .item {
    width: 30%;
    /* margin: 20px; */
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
  background: #0000
  border-radius: 5px
  z-index: 10
.item
    @media (max-width:768px)
        width: 100%
        margin-bottom: 30px
</style>
