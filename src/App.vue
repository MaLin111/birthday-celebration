<template>
  <div class="birthday-container">
    <!-- 背景粒子效果 -->
    <div class="particles">
      <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 主内容 -->
    <div class="content">
      <!-- 标题 -->
      <h1 class="title">
        <span v-for="(char, index) in titleText" :key="index" class="char" :style="{ animationDelay: `${index * 0.1}s` }">
          {{ char }}
        </span>
      </h1>

      <!-- 副标题 -->
      <div class="subtitle">
        <span class="glow-text">{{ currentYear }}</span>
      </div>

      <!-- 装饰线条 -->
      <div class="lines">
        <div class="line line-1"></div>
        <div class="line line-2"></div>
      </div>

      <!-- 蛋糕图标 -->
      <div class="cake-icon">🎂</div>

      <!-- 祝福语 -->
      <p class="message">
        <span v-for="(char, index) in messageText" :key="index" class="message-char" :style="{ animationDelay: `${1 + index * 0.05}s` }">
          {{ char === ' ' ? ' ' : char }}
        </span>
      </p>

      <!-- 按钮 -->
      <button class="celebrate-btn" @click="celebrate">
        <span class="btn-text">点击庆祝</span>
        <span class="btn-glow"></span>
      </button>
    </div>

    <!-- 烟花效果 -->
    <div class="fireworks" v-if="showFireworks">
      <div v-for="i in 20" :key="i" class="firework" :style="getFireworkStyle(i)"></div>
    </div>

    <!-- 扫描线效果 -->
    <div class="scanline"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const titleText = '生日快乐'
const messageText = '愿你的每一天都充满惊喜与欢乐'
const currentYear = new Date().getFullYear()
const showFireworks = ref(false)

const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 1
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
  const left = Math.random() * 100

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

const getFireworkStyle = (index) => {
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 0.5

  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`
  }
}

const celebrate = () => {
  showFireworks.value = true
  setTimeout(() => {
    showFireworks.value = false
  }, 3000)
}
</script>

<style scoped>
.birthday-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 粒子效果 */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(138, 43, 226, 0.6);
  border-radius: 50%;
  animation: float linear infinite;
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.8);
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 主内容 */
.content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
}

/* 标题 */
.title {
  font-size: 6rem;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.char {
  display: inline-block;
  background: linear-gradient(45deg, #00f5ff, #ff00ff, #00f5ff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite, bounce 1s ease-out;
  text-shadow: 0 0 30px rgba(0, 245, 255, 0.5);
  filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.5));
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 副标题 */
.subtitle {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.glow-text {
  color: #00f5ff;
  text-shadow:
    0 0 10px #00f5ff,
    0 0 20px #00f5ff,
    0 0 30px #00f5ff,
    0 0 40px #00f5ff;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 装饰线条 */
.lines {
  position: relative;
  width: 300px;
  height: 2px;
  margin: 2rem auto;
}

.line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f5ff, transparent);
  animation: scan 2s linear infinite;
}

.line-1 {
  width: 100%;
  left: 0;
}

.line-2 {
  width: 100%;
  left: 0;
  animation-delay: 1s;
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 蛋糕图标 */
.cake-icon {
  font-size: 5rem;
  margin: 2rem 0;
  animation: rotate 3s linear infinite;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
}

@keyframes rotate {
  0%, 100% {
    transform: rotate(-10deg) scale(1);
  }
  50% {
    transform: rotate(10deg) scale(1.1);
  }
}

/* 祝福语 */
.message {
  font-size: 1.5rem;
  color: #fff;
  margin: 2rem 0;
  letter-spacing: 2px;
}

.message-char {
  display: inline-block;
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 按钮 */
.celebrate-btn {
  position: relative;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  background: transparent;
  border: 2px solid #00f5ff;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.celebrate-btn:hover {
  transform: scale(1.05);
  box-shadow:
    0 0 20px #00f5ff,
    0 0 40px #00f5ff,
    inset 0 0 20px rgba(0, 245, 255, 0.2);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.5), transparent);
  transition: left 0.5s ease;
}

.celebrate-btn:hover .btn-glow {
  left: 100%;
}

/* 烟花效果 */
.fireworks {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.firework {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: explode 1s ease-out forwards;
}

@keyframes explode {
  0% {
    box-shadow:
      0 0 0 0 #ff00ff,
      0 0 0 0 #00f5ff,
      0 0 0 0 #ffff00,
      0 0 0 0 #00ff00;
    opacity: 1;
  }
  100% {
    box-shadow:
      0 -100px 20px 10px transparent,
      100px 0 20px 10px transparent,
      0 100px 20px 10px transparent,
      -100px 0 20px 10px transparent,
      70px -70px 20px 10px transparent,
      70px 70px 20px 10px transparent,
      -70px 70px 20px 10px transparent,
      -70px -70px 20px 10px transparent;
    opacity: 0;
  }
}

/* 扫描线效果 */
.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 245, 255, 0.05) 50%,
    transparent 100%
  );
  animation: scanline 8s linear infinite;
  pointer-events: none;
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .cake-icon {
    font-size: 3rem;
  }

  .message {
    font-size: 1rem;
  }

  .celebrate-btn {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
}
</style>
