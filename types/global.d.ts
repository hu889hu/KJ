// types/global.d.ts
export {}

declare global {
  interface Window {
    UIkit: {
      slideshow: (element: HTMLElement, options?: object) => any
      // 添加其他你需要的方法
      [key: string]: any
    }
  }
}
