import {
  registerOverlay, registerIndicator,
} from '@/style/js/index.esm-98';

export default {
  components: {
  },
  data() {
    return {
      icons: [
        {
          id: 'visible',
          position: 'left',
          marginLeft: 8,
          marginTop: 7,
          marginRight: 0,
          marginBottom: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: '\ue903',
          fontFamily: 'icomoon',
          size: 14,
          color: '#929AA5',
          activeColor: '#929AA5',
          backgroundColor: 'transparent',
          activeBackgroundColor: 'rgba(22, 119, 255, 0.15)',
        },
        {
          id: 'invisible',
          position: 'left',
          marginLeft: 8,
          marginTop: 7,
          marginRight: 0,
          marginBottom: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: '\ue901',
          fontFamily: 'icomoon',
          size: 14,
          color: '#929AA5',
          activeColor: '#929AA5',
          backgroundColor: 'transparent',
          activeBackgroundColor: 'rgba(22, 119, 255, 0.15)',
        },
        {
          id: 'setting',
          position: 'left',
          marginLeft: 6,
          marginTop: 7,
          marginBottom: 0,
          marginRight: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: '\ue902',
          fontFamily: 'icomoon',
          size: 14,
          color: '#929AA5',
          activeColor: '#929AA5',
          backgroundColor: 'transparent',
          activeBackgroundColor: 'rgba(22, 119, 255, 0.15)',
        },
        {
          // left、middle、right,
          id: 'close',
          position: 'left',
          marginLeft: 6,
          marginTop: 7,
          marginRight: 0,
          marginBottom: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: '\ue900',
          fontFamily: 'icomoon',
          size: 14,
          color: '#929AA5',
          activeColor: '#929AA5',
          backgroundColor: 'transparent',
          activeBackgroundColor: 'rgba(22, 119, 255, 0.15)',
        },
      ],
    };
  },
  methods: {
    setMainIndicator(name) { // 技術指標開關
      const isOpen = this.chart.getIndicatorByPaneId('candle_pane', name);
      if (isOpen) {
        this.chart.removeIndicator('candle_pane', name);
      } else {
        this.chart.createIndicator({
          name,
        }, true, { id: 'candle_pane' });
      }
    },
    setSubIndicator(name) { // 副圖技術指標開關
      const isOpen = this.chart.getIndicatorByPaneId(name, name);
      if (isOpen) {
        this.chart.removeIndicator(name);
      } else {
        this.chart.createIndicator(name, false, { id: name });
      }
    },
    registerNewIndicator() { // 註冊自定義指標
      // 結算一體成形
      registerOverlay({
        name: 'checkoutBlock',
        totalStep: 0,
        needDefaultPointFigure: false,
        isExclusionGetList: true,
        createPointFigures: ({
          coordinates, bounding, overlay, barSpace,
        }) => {
          const outRange = 20; // 上下外推範圍(移除上下 border)
          const startX = coordinates[0].x;
          const startY = coordinates[0].y - (outRange / 2);
          const w = 10 * barSpace.bar; // 取 10 秒
          const h = bounding.height + outRange;
          return [
            {
              type: 'rect',
              attrs: {
                x: startX,
                y: startY,
                width: w,
                height: h,
              },
              styles: { style: 'fill', color: 'rgba(255, 0, 0, 0.3)' },
              ignoreEvent: true,
            },
            {
              type: 'line',
              attrs: {
                coordinates: [
                  { x: startX + w, y: 0 },
                  { x: startX + w, y: bounding.height },
                ],
              },
              ignoreEvent: true,
            },
            {
              type: 'text',
              attrs: {
                x: startX,
                y: 40,
                align: 'center',
                baseline: 'bottom',
                text: overlay.extendData[0],
              },
              ignoreEvent: true,
            },
            {
              type: 'text',
              attrs: {
                x: startX + w,
                y: 40,
                align: 'center',
                baseline: 'bottom',
                text: overlay.extendData[1],
              },
              ignoreEvent: true,
            },
          ];
        },
        onRightClick() {
          return false;
        },
      });

      // 圓形
      registerOverlay({
        name: 'circle',
        needDefaultPointFigure: true,
        needDefaultXAxisFigure: true,
        needDefaultYAxisFigure: true,
        lock: true,
        totalStep: 3,
        createPointFigures: ({ coordinates }) => {
          if (coordinates.length === 2) {
            const xDis = Math.abs(coordinates[0].x - coordinates[1].x);
            const yDis = Math.abs(coordinates[0].y - coordinates[1].y);
            const radius = Math.sqrt(xDis * xDis + yDis * yDis);
            return {
              key: 'circle',
              type: 'circle',
              attrs: {
                ...coordinates[0],
                r: radius,
              },
              styles: {
                style: 'stroke_fill',
                // color: 'red',
                backgroundColor: 'blue',
              },
            };
          }
          return [];
        },
      });

      // MA 2
      registerIndicator({
        name: 'MA2',
        shortName: 'MA2',
        calcParams: [5, 10],
        figures: [
          { key: 'ma1', title: 'MA5: ', type: 'line' },
          { key: 'ma2', title: 'MA10: ', type: 'line' },
        ],
        // 当计算参数改变时，希望提示的和参数一样，即title的值需要改变
        styles: {
          lines: [
            {
            // 'solid' | 'dashed'
              style: 'solid',
              smooth: false,
              size: 3,
              dashedValue: [2, 2],
              color: '#4f9952',
            },
            {
            // 'solid' | 'dashed'
              style: 'solid',
              smooth: false,
              size: 1,
              dashedValue: [2, 2],
              color: '#e91e63',
            },
          ],
        },
        regenerateFigures: (params) => params.map((p, i) => ({
          key: `ma${i + 1}`,
          title: `MA${p}: `,
          type: 'line',
        })),
        // 计算结果
        calc: (kLineDataList, { calcParams, figures }) => {
        // 注意：返回数据个数需要和kLineDataList的数据个数一致，如果无值，用{}代替即可。
        // 计算参数最好取回调参数calcParams，如果不是，后续计算参数发生变化的时候，这里计算不能及时响应
          const closeSums = [];
          return kLineDataList.map((kLineData, i) => {
            const ma = {};
            const { close } = kLineData;
            calcParams.forEach((param, j) => {
              closeSums[j] = (closeSums[j] || 0) + close;
              if (i >= param - 1) {
                ma[figures[j].key] = closeSums[j] / param;
                closeSums[j] -= kLineDataList[i - (param - 1)].close;
              }
            });
            // 如果有值的情况下，这里每一项的数据格式应该是 { ma1: xxx, ma2: xxx }
            // 每个key需要和figures中的子项key对应的值一致
            return ma;
          });
        },
      });
    },
    setTheme() { // 設定主題背景(淺色、深色)
      const theme = this.chartTheme !== 'light' ? 'light' : 'dark';
      if (theme === 'light') {
        document.getElementById('k-line-chart').style.backgroundColor = '#ffffff';
      } else if (theme === 'dark') {
        document.getElementById('k-line-chart').style.backgroundColor = '#1b1b1f';
      }
      this.chart.setTheme('color', theme);
    },
    setCandlestick() { // 設定 K 棒顏色
      const theme = this.chartCandlestick === 'candlestickColor'
        ? 'candlestickColorReverse' : 'candlestickColor';
      this.chart.setTheme('candlestick', theme);
    },
    lineSwitch() { // 隱藏 / 顯示單一線
      const data = this.lineList.find((item) => item.id === this.lineId * 1);
      if (data) {
        data.visible = !data.visible;
        const { id, name, visible } = data;
        this.chart.overrideOverlay({ id, name, visible });
      }
    },
    // allLineSwitch() { // 顯示/關閉畫的線
    //   this.lineIsVisible = !this.lineIsVisible;
    //   this.useLine.forEach((item) => {
    //     const { id, name } = item;
    //     this.chart.overrideOverlay({ id, name, visible: this.lineIsVisible });
    //   });
    // },
  },
};
