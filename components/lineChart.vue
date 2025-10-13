<template>
  <!-- 用 client-only 包裹，避免 SSR 渲染 ECharts -->
  <client-only>
    <div ref="chartContainer" class="line-chart-container"></div>
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

// -------------------------- 组件配置（可自定义） --------------------------
const props = defineProps({
  /** X 轴数据长度（默认 29 个点，1~29） */
  dataLength: { type: Number, default: 29 },
  /** Y 轴最大值（默认 25） */
  maxValue: { type: Number, default: 25 },
  /** 折线/面积颜色（默认 #34a39a） */
  lineColor: { type: String, default: '#34a39a' },
  /** Tooltip 触发方式（默认 'item'） */
  tooltipTrigger: { type: String, default: 'item' },
  /** X 轴标签格式化函数（可选） */
  xAxisLabelFormatter: { type: Function, default: (value: number) => value },
  /** Y 轴名称（默认 '立方米'） */
  yAxisName: { type: String, default: '立方米' },
  /** 渐变区域颜色（默认蓝黑渐变） */
  areaGradient: {
    type: Array, default: () => [
      { offset: 0, color: '#08808b' },
      { offset: 1, color: 'rgba(0,0,0,0.2)' }
    ]
  }
});

// -------------------------- 响应式状态 --------------------------
const chartContainer = ref<HTMLElement | null>(null); // 图表容器 ref
let chartInstance: echarts.ECharts | null = null; // ECharts 实例
let timer: number | null = null; // 定时器（循环 tooltip）
const tipIndex = ref(0); // 当前 tooltip 下标


// -------------------------- 工具函数 --------------------------
/** 生成随机数据和配置 */
const generateChartData = () => {
  const xdata: number[] = [];
  const dataArr: number[] = [];

  // 生成 X 轴数据（1 ~ dataLength）和随机 Y 值（5 ~ 24）
  for (let i = 1; i <= props.dataLength; i++) {
    xdata.push(i);
    dataArr.push(Math.floor(Math.random() * 20) + 5);
  }

  return { xdata, dataArr, max: Math.max(...dataArr) };
};

/** 初始化/更新图表 */
const initOrUpdateChart = () => {
  if (!chartContainer.value || !process.client) return; // SSR 跳过

  // 初始化图表实例
  if (!chartInstance) {
    chartInstance = echarts.init(chartContainer.value);
  }

  // 生成最新数据
  const { xdata, dataArr, max } = generateChartData();

  // 构建 ECharts 配置
  const option: echarts.EChartsOption = {
    grid: {
      left: "5%",
      bottom: "5%",
      top: "15%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: xdata,
      axisLabel: {
        show: true,
        textStyle: { color: "#fff", fontSize: 10 },
        formatter: props.xAxisLabelFormatter // 自定义 X 轴标签
      },
      axisLine: { lineStyle: { color: 'transparent', width: 2 } }
    },
    tooltip: {
      show: true, trigger: props.tooltipTrigger,
      backgroundColor: 'rgba(25, 48, 64, 0.9)', // 深色背景（匹配原图）
      borderColor: '#00c9a7', // 边框颜色（青色）
      borderWidth: 1, // 边框宽度
      textStyle: {
        color: '#fff', // 文字颜色（白色）
        fontSize: 12, // 字号
        fontWeight: 'bold' // 加粗
      }
    },
    yAxis: [{
      type: 'value',
      name: props.yAxisName,
      min: 0,
      max: props.maxValue,
      axisLabel: {
        formatter: '{value}k',
        textStyle: { color: '#fff', fontSize: 10 }
      },
      axisLine: { lineStyle: { color: 'transparent', width: 2 } },
      axisTick: { show: false },
      splitLine: { show: false }
    }],
    series: [{
      name: '',
      type: 'line',
      stack: '总量',
      symbol: 'none',
      smooth: false,
      symbol: "circle",
      itemStyle: {
        normal: {
          color: props.lineColor,
          lineStyle: { color: props.lineColor, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, props.areaGradient)
          }
        }
      },
      data: dataArr
    }]
  };

  // 应用配置
  chartInstance.setOption(option);

  // 启动/重启 tooltip 定时器
  restartTooltipTimer();
};


/** 启动/重启 tooltip 循环提示 */
const restartTooltipTimer = () => {
  // 清除旧定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  // 启动新定时器（每 1.5 秒切换提示）
  tipIndex.value = 0;
  timer = setInterval(() => {
    chartInstance?.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: tipIndex.value
    });
    tipIndex.value++;
    if (tipIndex.value >= generateChartData().xdata.length) {
      tipIndex.value = 0;
    }
  }, 1500);
};


// -------------------------- 生命周期钩子 --------------------------
onMounted(async () => {
  await nextTick(); // 等待 DOM 渲染完成
  initOrUpdateChart();

  // 监听窗口 resize，调整图表大小
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 清理资源：定时器 + 图表实例 + resize 监听
  if (timer) clearInterval(timer);
  if (chartInstance) chartInstance.dispose();
  window.removeEventListener('resize', handleResize);
});


// -------------------------- 监听配置变化 --------------------------
watch(() => [
  props.dataLength,
  props.maxValue,
  props.lineColor,
  props.xAxisLabelFormatter,
  props.yAxisName,
  props.areaGradient
], () => {
  initOrUpdateChart(); // 配置变化时更新图表
}, { deep: true });


// -------------------------- 窗口 resize 处理 --------------------------
const handleResize = () => {
  chartInstance?.resize(); // 图表自适应容器大小
};
</script>

<style scoped>
.line-chart-container {
  position: absolute;
  right: 0;
  width: 140%;
  height: 100%;
  /* 可根据需求调整高度 */
  background-color: #19304000;
  /* 匹配原图深色背景 */
}
</style>
