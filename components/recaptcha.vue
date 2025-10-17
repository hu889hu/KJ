<template>
  <div>
    <canvas id="auth-code" ref="captchaCanvas" @click="changeImage"></canvas>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'RecaptchaTool',
  props: {
    msg: String
  },
  data() {
    return {
      inputText: '',
      helper: null
    }
  },
  mounted() {
    this.initCaptcha()
  },
  methods: {
    initCaptcha() {
      const options = {
        canvasId: 'auth-code',
        txt: this.randomNum(1000, 9999).toString(),
        height: 50,
        width: 200,
        fontColor1: 0,
        fontColor2: 50,
        bgColor1: 180,
        bgColor2: 255,
        fontStyle: '40px SimHei'
      }

      this.helper = this.writeAuthCode(options)
      this.$emit('checkHepler', this.helper)
    },
    changeImage() {
      const options = {
        canvasId: 'auth-code',
        txt: this.randomNum(1000, 9999).toString(),
        height: 50,
        width: 200,
        fontColor1: 0,
        fontColor2: 50,
        bgColor1: 180,
        bgColor2: 255,
        fontStyle: '24px SimHei'
      }

      this.helper = this.writeAuthCode(options)
      this.inputText = ''
      this.$emit('checkHepler', this.helper)
    },
    validateInput() {
      if (this.helper.validate(this.inputText)) {
        document.getElementById('verify_code').innerHTML =
          '驗證碼<span>*</span>'
        $('#verify_code').css('color', '#393939')
        console.log('驗證碼輸入正確')
      } else {
        document.getElementById('verify_code').innerHTML = '驗證碼錯誤'
        $('#verify_code').css('color', '#FF435E')
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    randomColor(min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    writeAuthCode(options) {
      const canvas = this.$refs.captchaCanvas
      canvas.width = options.width || 300
      canvas.height = options.height || 150
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'middle'
      ctx.fillStyle = this.randomColor(options.bgColor1, options.bgColor2)
      ctx.fillRect(0, 0, options.width, options.height)
      for (let i = 0; i < options.txt.length; i++) {
        const txt = options.txt.charAt(i)
        ctx.font = options.fontStyle
        ctx.fillStyle = this.randomColor(options.fontColor1, options.fontColor2)
        ctx.shadowOffsetY = this.randomNum(-3, 3)
        ctx.shadowBlur = this.randomNum(-3, 3)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        const x = (options.width / (options.txt.length + 1)) * (i + 1)
        const y = options.height / 2
        const deg = this.randomNum(-30, 30)
        ctx.translate(x, y)
        ctx.rotate((deg * Math.PI) / 180)
        ctx.fillText(txt, 0, 0)
        ctx.rotate((-deg * Math.PI) / 180)
        ctx.translate(-x, -y)
      }
      for (let i = 0; i < this.randomNum(1, 4); i++) {
        ctx.strokeStyle = this.randomColor(40, 180)
        ctx.beginPath()
        ctx.moveTo(
          this.randomNum(0, options.width),
          this.randomNum(0, options.height)
        )
        ctx.lineTo(
          this.randomNum(0, options.width),
          this.randomNum(0, options.height)
        )
        ctx.stroke()
      }
      for (let i = 0; i < options.width / 6; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(
          this.randomNum(0, options.width),
          this.randomNum(0, options.height),
          1,
          0,
          2 * Math.PI
        )
        ctx.fill()
      }
      return {
        validate: function (code) {
          return options.txt == code
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  cursor: pointer;
  height: 38px;
  width: 110px;
}
</style>
