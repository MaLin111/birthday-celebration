<template>
  <div class="birthday-page">
    <!-- Canvas 粒子背景 -->
    <canvas ref="canvasRef" class="particle-canvas"></canvas>

    <!-- 主内容 -->
    <div class="main-content" :class="{ 'show': showContent }">
      <h1 class="title">Happy Birthday</h1>
      <div class="name">W_JK</div>
      <p class="message">愿你的每一天都充满惊喜与欢乐</p>
    </div>

    <!-- 祝福语 -->
    <div class="blessing-message" :class="{ 'show': showBlessing }">
      愿你的每一天都充满惊喜与欢乐
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
const showContent = ref(false)
const showBlessing = ref(false)
let animationId = null
let particles = []
let startTime = null

class Particle {
  constructor(x, y, targetX, targetY, color) {
    // 初始位置（随机分散）
    const angle = Math.random() * Math.PI * 2
    const radius = 200 + Math.random() * 300
    this.x = x + Math.cos(angle) * radius
    this.y = y + Math.sin(angle) * radius

    // 目标位置
    this.targetX = targetX
    this.targetY = targetY

    // 速度
    this.vx = (Math.random() - 0.5) * 4
    this.vy = (Math.random() - 0.5) * 4

    // 颜色
    this.color = color

    // 大小
    this.size = 2 + Math.random() * 2

    // 透明度
    this.alpha = 0.8

    // 是否到达目标
    this.arrived = false

    // 是否开始聚合
    this.startGathering = false

    // 随机运动的角度和速度
    this.randomAngle = Math.random() * Math.PI * 2
    this.randomSpeed = 1 + Math.random() * 2
  }

  startGather() {
    this.startGathering = true
  }

  update() {
    if (!this.startGathering) {
      // 初始2秒：无序运动
      this.randomAngle += (Math.random() - 0.5) * 0.1
      this.x += Math.cos(this.randomAngle) * this.randomSpeed
      this.y += Math.sin(this.randomAngle) * this.randomSpeed

      // 边界反弹
      if (this.x < 0 || this.x > window.innerWidth) {
        this.randomAngle = Math.PI - this.randomAngle
      }
      if (this.y < 0 || this.y > window.innerHeight) {
        this.randomAngle = -this.randomAngle
      }

      // 透明度轻微变化
      this.alpha = 0.6 + Math.sin(Date.now() * 0.003 + this.x) * 0.3
    } else if (!this.arrived) {
      // 聚合阶段
      // 计算到目标的距离
      const dx = this.targetX - this.x
      const dy = this.targetY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 1) {
        this.arrived = true
        this.alpha = 1
      } else {
        // 使用缓动效果（减慢速度）
        const ease = 0.03
        this.vx += dx * ease * 0.05
        this.vy += dy * ease * 0.05

        // 添加阻尼
        this.vx *= 0.92
        this.vy *= 0.92

        this.x += this.vx
        this.y += this.vy

        // 逐渐显示（减慢透明度变化）
        this.alpha = Math.min(1, this.alpha + 0.01)
      }
    } else {
      // 到达后轻微漂浮，带透明度变化（减小漂浮幅度）
      const time = Date.now() * 0.0005
      this.y += Math.sin(time + this.x * 0.01) * 0.1

      // 透明度轻微变化
      this.alpha = 0.8 + Math.sin(time + this.x * 0.02) * 0.2
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const createTextParticles = (canvas, text, x, y, fontSize, color) => {
  const ctx = canvas.getContext('2d')
  ctx.font = `bold ${fontSize}px 'Varela Round', 'HarmonyOS Sans', sans-serif`
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 绘制文字到临时 canvas
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  const metrics = ctx.measureText(text)
  const textWidth = metrics.width
  const textHeight = fontSize

  tempCanvas.width = textWidth + 20
  tempCanvas.height = textHeight + 20

  tempCtx.font = ctx.font
  tempCtx.fillStyle = '#000'
  tempCtx.textAlign = 'center'
  tempCtx.textBaseline = 'middle'
  tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2)

  // 获取像素数据
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
  const pixels = imageData.data

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const particleArray = []
  // 根据屏幕大小调整粒子间隔
  const gap = canvas.width < 768 ? 4 : 3

  for (let py = 0; py < tempCanvas.height; py += gap) {
    for (let px = 0; px < tempCanvas.width; px += gap) {
      const index = (py * tempCanvas.width + px) * 4
      const alpha = pixels[index + 3]

      if (alpha > 128) {
        const targetX = x + px - tempCanvas.width / 2
        const targetY = y + py - tempCanvas.height / 2
        particleArray.push(new Particle(centerX, centerY, targetX, targetY, color))
      }
    }
  }

  return particleArray
}

const initParticles = (canvas) => {
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  particles = []

  // 创建 "Happy Birthday" 粒子（灰白色）
  const fontSize1 = canvas.width < 768 ? 50 : 80
  const happyParticles = createTextParticles(
    canvas,
    'Happy Birthday',
    centerX,
    centerY - (canvas.width < 768 ? 40 : 60),
    fontSize1,
    '#E8E8E8'
  )

  // 创建 "W_JK" 粒子（灰蓝色）
  const fontSize2 = canvas.width < 768 ? 40 : 60
  const nameParticles = createTextParticles(
    canvas,
    'W_JK',
    centerX,
    centerY + (canvas.width < 768 ? 40 : 60),
    fontSize2,
    '#6B8CAE'
  )

  particles = [...happyParticles, ...nameParticles]
}

const animate = (canvas) => {
  const ctx = canvas.getContext('2d')

  // 初始化开始时间
  if (!startTime) {
    startTime = Date.now()
  }

  const elapsedTime = Date.now() - startTime

  // 2秒后开始聚合
  if (elapsedTime > 2000 && particles.length > 0 && !particles[0].startGathering) {
    particles.forEach(particle => particle.startGather())
  }

  // 清空画布
  ctx.fillStyle = 'rgba(26, 26, 46, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 更新和绘制粒子
  let allArrived = true
  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
    if (!particle.arrived) allArrived = false
  })

  // 所有粒子到达后显示祝福语
  if (allArrived && !showBlessing.value && particles[0]?.startGathering) {
    showBlessing.value = true
  }

  animationId = requestAnimationFrame(() => animate(canvas))
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // 重新初始化粒子
  initParticles(canvas)

  // 重置开始时间
  startTime = Date.now()
  showContent.value = false
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // 初始化粒子
  initParticles(canvas)

  // 开始动画
  animate(canvas)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.birthday-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.main-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.5s ease-out;
  pointer-events: none;
}

.main-content.show {
  opacity: 0;
}

.title {
  font-size: 5rem;
  font-weight: 700;
  font-family: 'Varela Round', 'HarmonyOS Sans', sans-serif;
  color: #FFFFFF;
  text-shadow:
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(255, 255, 255, 0.5),
    0 0 60px rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
  letter-spacing: 3px;
}

.name {
  font-size: 3.5rem;
  font-weight: 600;
  font-family: 'Varela Round', 'HarmonyOS Sans', sans-serif;
  color: #4A90E2;
  text-shadow:
    0 0 20px rgba(74, 144, 226, 0.8),
    0 0 40px rgba(74, 144, 226, 0.5),
    0 0 60px rgba(74, 144, 226, 0.3);
  margin-bottom: 2rem;
  letter-spacing: 8px;
}

.message {
  font-size: 1.5rem;
  font-family: 'HarmonyOS Sans', 'Microsoft YaHei', sans-serif;
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  letter-spacing: 2px;
  animation: glow 2s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6);
  }
}

/* 祝福语 */
.blessing-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 180px;
  text-align: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 1.5s ease-out;
  font-size: 1.8rem;
  font-weight: 500;
  font-family: 'Varela Round', 'HarmonyOS Sans', 'Microsoft YaHei', sans-serif;
  color: #FFD700;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.6),
    0 0 30px rgba(255, 215, 0, 0.4),
    0 0 40px rgba(255, 215, 0, 0.2);
  letter-spacing: 2px;
  animation: blessingGlow 2s ease-in-out infinite;
  padding: 0 2rem;
  max-width: 90%;
}

.blessing-message.show {
  opacity: 1;
}

@keyframes blessingGlow {
  0%, 100% {
    text-shadow:
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 30px rgba(255, 215, 0, 0.4),
      0 0 40px rgba(255, 215, 0, 0.2);
  }
  50% {
    text-shadow:
      0 0 15px rgba(255, 215, 0, 1),
      0 0 30px rgba(255, 215, 0, 0.8),
      0 0 45px rgba(255, 215, 0, 0.6),
      0 0 60px rgba(255, 215, 0, 0.4);
  }
}
@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }

  .name {
    font-size: 2.5rem;
    letter-spacing: 4px;
  }

  .message {
    font-size: 1.2rem;
  }

  .blessing-message {
    font-size: 1.4rem;
    margin-top: 120px;
    letter-spacing: 1px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2.5rem;
  }

  .name {
    font-size: 2rem;
    letter-spacing: 3px;
  }

  .message {
    font-size: 1rem;
  }

  .blessing-message {
    font-size: 1.1rem;
    margin-top: 100px;
    letter-spacing: 0.5px;
  }
}

@media (max-width: 375px) {
  .blessing-message {
    font-size: 1rem;
    margin-top: 90px;
  }
}
</style>
