// copy plugin
import { ElNotification } from 'element-plus'
export const useCopy = () => {
  return {
    copy: (value: string) => {
      navigator.clipboard.writeText(value)
      ElNotification({
        title: '複製',
        message: value,
        type: 'success',
        showClose: false
      })
    }
  }
}
