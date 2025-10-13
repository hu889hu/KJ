<template>
  <!-- TradingView Widget BEGIN -->
  <div class="tradingview-widget-container" ref="widget1">
    <div id="tradingview_a45bd"></div>
  </div>
  <!-- TradingView Widget END -->
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
  props: {
    symbol: String
  },
  methods: {
    tradingviewSymbol(value) {
      switch (value) {
        case 'COZCA0':
          return 'CBOT:ZC1!'
        case 'COZSA0':
          return 'CBOT:ZS1!'
        case 'COZWA0':
          return 'CBOT:ZW1!'
        case 'LEAHD3M':
          return 'LME:AH1!'
        case 'LECAD3M':
          return 'COMEX:HG1!'
        case 'LENID3M':
          return 'MCX:NICKEL1!'
        case 'LEPBD3M':
          return 'COMEX:LED1!'
        case 'LESND3M':
          return 'TSXV:LME'
        case 'LEZSD3M':
          return 'COMEX:ZNC1!'
        case 'NECLA0':
          return 'NYMEX:CL1!'
        case 'NEHOA0':
          return 'NYMEX:RBB1!'
        case 'NENGA0':
          return 'NYMEX:NG1!'
        case 'NENGA0':
          return 'NYMEX:NG1!'
        case 'WFAUDUSD':
          return 'FX_IDC:USDAUD'
        case 'WFEURGBP':
          return 'OANDA:EURGBP'
        case 'WFEURUSD':
          return 'FX:EURUSD'
        case 'WFGBPJPY':
          return 'OANDA:GBPJPY'
        case 'WFGBPUSD':
          return 'FX:GBPUSD'
        case 'WFUSDCAD':
          return 'FX:USDCAD'
        case 'WFUSDCNY':
          return 'FX_IDC:USDCNY'
        case 'WFUSDHKD':
          return 'FX:USDHKD'
        case 'WFUSDJPY':
          return 'FX:USDJPY'
        case 'WFUSDTWD':
          return 'FX_IDC:USDTWD'
        default:
          return 'BITSTAMP:BTCUSD'
      }
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
          symbol: symbol,
          interval: 'D',
          timezone: 'Asia/Taipei',
          theme: 'light',
          style: '1',
          locale: 'en_US',
          toolbar_bg: '#e9edf0',
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_legend: true,
          save_image: false,
          container_id: 'tradingview_a45bd'
        })
        widget.appendChild(script)
      }
    }
  },
  watch: {
    symbol: function (newVal, oldVal) {
      console.log('symbol change:', newVal, oldVal)
      this.loadWidgets()
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
  background: #0000
  border-radius: 5px
  z-index: 10
</style>
