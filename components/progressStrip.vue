<template>
  <div ref="chartRef" class="pictorial-bar-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

// 定义组件接收的 props
const props = defineProps({
  val: { type: Number, default: 85 },   // 当前值（如活跃率 85）
  con: { type: String, default: '' },   // 标签文字（如“活跃率”）
  max: { type: Number, default: 100 },   // 最大值（如 100）
  color: { type: String, default: '#09c4ca' } // 图标颜色
})

const chartRef = ref<HTMLElement | null>(null) // 绑定图表容器的 ref
let chartInstance: echarts.ECharts | null = null // 存储 ECharts 实例


// 初始化/更新图表配置
const updateChart = () => {
  if (!chartRef.value) return // 容错：DOM 未挂载时不执行

  const { val, con, max, color } = props

  const option = {
    grid: {
      left: '20%',
      top: 0,
      right: '20%',
      bottom: 0
    },
    xAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'category',
        inverse: false,
        data: [],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false }
      }
    ],
    series: [
      // 前置图标（如活跃率进度条）
      {
        type: 'pictorialBar',
        data: [val],
        itemStyle: { color },
        symbolRepeat: 'fixed',
        symbolClip: true,
        symbolSize: [10, 20], // 修正原代码中未定义的 `w`，这里设为宽度 10、高度 20
        symbol: 'roundRect',
        label: {
          show: true,
          position: 'left',
          formatter: () => con,
          color: '#fff',
          fontSize: 12 // 原 0.7*w → 假设 w=20 时字体大小 14
        },
        z: 1000
      },
      // 背景图标（如最大值容器）
      {
        type: 'pictorialBar',
        data: [max],
        itemStyle: { color: '#193040' },
        animationDuration: 0,
        symbolRepeat: 'fixed',
        symbol: 'roundRect',
        symbolSize: [10, 20],
        label: {
          show: true,
          position: 'right',
          formatter: () => `${Math.floor((val / max) * 100)}%`,
          color: '#fff',
          fontSize: 12
        }
      }
    ]
  }

  chartInstance?.setOption(option) // 应用配置
}


// 生命周期：组件挂载后初始化 ECharts
onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    updateChart()
  }
})

// 生命周期：组件卸载前销毁 ECharts 实例（避免内存泄漏）
onUnmounted(() => {
  chartInstance?.dispose()
  chartInstance = null
})

// 监听 props 变化，自动更新图表
watch(
  () => [props.val, props.con, props.max, props.color],
  () => updateChart(),
  { deep: true }
)
</script>

<style scoped>
.pictorial-bar-chart {
  width: 100%;
  height: 20px;
}
</style>
