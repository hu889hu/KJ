<template>
  <canvas ref="rainCanvas" class="rain-background"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

// 组件配置（确保可见性）
const props = defineProps({
  dropCount: { type: Number, default: 20 },
  minSpeed: { type: Number, default: 3 },
  maxSpeed: { type: Number, default: 6 },
  dropColor: { type: String, default: '#00ffff' },
  hitRatio: { type: Number, default: 0.1 },
  gradientStart: { type: String, default: '#1a8cb8' },
  gradientEnd: { type: String, default: '#080618' }
});

// 响应式状态
const rainCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null); // Canvas 上下文 ref
const canvasWidth = ref(0);
const canvasHeight = ref(0);
const raindrops = ref<any[]>([]);
let animationFrameId: number | null = null;
let resizeDebounce: number | null = null;

// 工具函数
const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

// 雨滴类（修复渐变跟随问题）
class RainDrop {
  x: number;
  y: number;
  color: string;
  vy: number;
  hit: number = 0;
  size: number;
  tailLength: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.color = props.dropColor;
    this.vy = random(props.minSpeed, props.maxSpeed);
    this.size = 2.5;
    this.tailLength = 60; // 拖尾长度
  }

  init() {
    this.x = random(0, canvasWidth.value);
    this.y = random(-canvasHeight.value, canvasHeight.value); // 从屏幕上方随机位置开始
    this.hit = -this.tailLength; // 当雨滴完全离开屏幕时重置
    this.size = 3;
  }

  // 每次绘制时创建新的渐变
  createGradient() {
    const gradient = ctx.value!.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.tailLength
    );
    gradient.addColorStop(0, props.gradientStart);
    gradient.addColorStop(1, props.gradientEnd);
    return gradient;
  }

  draw() {
    if (this.y > this.hit) {
      // 每次绘制时创建新的渐变，确保渐变跟随雨滴
      ctx.value!.fillStyle = this.createGradient();
      ctx.value!.fillRect(this.x, this.y, this.size, this.tailLength);
    }
    this.update();
  }

  update() {
    this.y -= this.vy;

    // 如果雨滴完全离开屏幕，重置位置
    if (this.y < this.hit) {
      this.init();
    }
  }
}

// 初始化雨滴动画
const initRainAnimation = () => {
  if (!rainCanvas.value || !ctx.value) return;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  rainCanvas.value.width = screenWidth;
  rainCanvas.value.height = screenHeight;
  canvasWidth.value = screenWidth;
  canvasHeight.value = screenHeight;

  raindrops.value = [];
  for (let i = 0; i < props.dropCount; i++) {
    const drop = new RainDrop();
    drop.init();
    raindrops.value.push(drop);
  }
  animate();
};

// 动画循环
const animate = () => {
  if (!ctx.value) return;
  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  raindrops.value.forEach(drop => drop.draw());
  animationFrameId = requestAnimationFrame(animate);
};

// 窗口 resize 处理
const handleResize = () => {
  if (resizeDebounce) clearTimeout(resizeDebounce);
  resizeDebounce = window.setTimeout(() => {
    if (!process.client) return;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    rainCanvas.value!.width = screenWidth;
    rainCanvas.value!.height = screenHeight;
    canvasWidth.value = screenWidth;
    canvasHeight.value = screenHeight;
    raindrops.value.forEach(drop => drop.init()); // 重置雨滴位置
  }, 100);
};

// 生命周期
onMounted(async () => {
  await nextTick();
  if (process.client) {
    ctx.value = rainCanvas.value!.getContext('2d');
    if (ctx.value) { // 确保 ctx 存在
      initRainAnimation();
      window.addEventListener('resize', handleResize);
    }
  }
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  if (resizeDebounce) clearTimeout(resizeDebounce);
});
</script>

<style scoped>
.rain-background {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50vw;
  height: 100vh;
  z-index: 99;
  pointer-events: none;
}
</style>
