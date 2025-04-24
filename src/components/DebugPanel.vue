<template>
  <div>
    <div class="debug-indicator" :style="indicatorStyle"></div>
    <div class="media-debug" v-if="showDebug">
      <div class="media-info">
        <p>屏幕宽度: {{ ENV.viewportWidth }}px</p>
        <p>屏幕高度: {{ ENV.viewportHeight }}px</p>
        <p>方向: {{ ENV.isPortrait ? '竖屏' : '横屏' }}</p>
        <p>设备像素比: {{ devicePixelRatio }}</p>
        <p>UserAgent: {{ userAgent }}</p>
        <div class="media-matches">
          <p>媒体查询匹配:</p>
          <div class="section-title">iPhone:</div>
          <p :class="{ 'matched': mediaMatches.iphone375 }">iPhone 375px: {{ mediaMatches.iphone375 ? '✓' : '✗' }}</p>
          <p :class="{ 'matched': mediaMatches.iphone390 }">iPhone 390px: {{ mediaMatches.iphone390 ? '✓' : '✗' }}</p>
          
          <div class="section-title">iPad:</div>
          <p :class="{ 'matched': mediaMatches.ipadAll }">所有iPad: {{ mediaMatches.ipadAll ? '✓' : '✗' }}</p>
          <p :class="{ 'matched': mediaMatches.ipadMini }">iPad Mini: {{ mediaMatches.ipadMini ? '✓' : '✗' }}</p>
          <p :class="{ 'matched': mediaMatches.ipadStandard }">标准iPad: {{ mediaMatches.ipadStandard ? '✓' : '✗' }}</p>
          <p :class="{ 'matched': mediaMatches.ipadAir }">iPad Air: {{ mediaMatches.ipadAir ? '✓' : '✗' }}</p>
          <p :class="{ 'matched': mediaMatches.ipadPro12 }">iPad Pro 12.9: {{ mediaMatches.ipadPro12 ? '✓' : '✗' }}</p>
          <p :class="{ 'matched': mediaMatches.ipadPortrait }">iPad 竖屏: {{ mediaMatches.ipadPortrait ? '✓' : '✗' }}</p>
          <p :class="{ 'matched': mediaMatches.ipadLandscape }">iPad 横屏: {{ mediaMatches.ipadLandscape ? '✓' : '✗' }}</p>
        </div>
      </div>
      <button @click="showDebug = false">关闭</button>
    </div>
    <div class="debug-toggle" @click="showDebug = !showDebug">
      调试
    </div>
  </div>
</template>

<script setup lang="ts">
import { ENV } from "@/utils/env";
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';

const showDebug = ref(false);
const mediaMatches = reactive({
  iphone375: false,
  iphone390: false,
  ipadAll: false,
  ipadMini: false,
  ipadStandard: false,
  ipadAir: false,
  ipadPro12: false,
  ipadPortrait: false,
  ipadLandscape: false
});

// 全局变量
const devicePixelRatio = ref(window.devicePixelRatio);
const userAgent = ref(navigator.userAgent);

// 调试指示器的样式计算
const indicatorStyle = computed(() => {
  let backgroundColor = 'black'; // 默认颜色
  let size = '20px';  // 默认大小
  
  const width = ENV.viewportWidth;
  
  // 根据视口宽度设置不同颜色
  if (width <= 320) {
    backgroundColor = 'red'; // xs
  } else if (width <= 360) {
    backgroundColor = 'orange'; // sm
  } else if (width <= 375) {
    backgroundColor = 'yellow'; // iPhone 375px
  } else if (width <= 390) {
    backgroundColor = 'greenyellow'; // iPhone 390px
  } else if (width <= 393) {
    backgroundColor = 'yellow'; // md
  } else if (width <= 414) {
    backgroundColor = 'green'; // lg
  } else if (width <= 768) {
    backgroundColor = 'blue'; // tablet
  } else if (width <= 1024) {
    backgroundColor = 'indigo'; // desktop
  } else {
    backgroundColor = 'violet'; // wide
  }
  
  // 在iPad设备上增加指示器大小
  if (mediaMatches.ipadAll) {
    size = '24px';
  }
  
  return { 
    backgroundColor, 
    width: size, 
    height: size,
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.5)' 
  };
});

// 检查媒体查询匹配状态
const checkMediaMatches = () => {
  // iPhone断点
  mediaMatches.iphone375 = window.matchMedia('screen and (min-width: 375px) and (max-width: 389px)').matches;
  mediaMatches.iphone390 = window.matchMedia('screen and (min-width: 390px) and (max-width: 392px)').matches;
  
  // iPad断点
  mediaMatches.ipadAll = window.matchMedia('screen and (min-width: 768px) and (max-width: 1366px)').matches;
  mediaMatches.ipadMini = window.matchMedia('screen and (min-width: 768px) and (max-width: 800px)').matches;
  mediaMatches.ipadStandard = window.matchMedia('screen and (min-width: 810px) and (max-width: 820px)').matches;
  mediaMatches.ipadAir = window.matchMedia('screen and (min-width: 834px) and (max-width: 840px)').matches;
  mediaMatches.ipadPro12 = window.matchMedia('screen and (min-width: 1024px) and (max-width: 1366px)').matches;
  mediaMatches.ipadPortrait = window.matchMedia('screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait)').matches;
  mediaMatches.ipadLandscape = window.matchMedia('screen and (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape)').matches;
  
  console.log('媒体查询匹配状态:', mediaMatches);
};

const handleResize = () => {
  checkMediaMatches();
  devicePixelRatio.value = window.devicePixelRatio;
};

onMounted(() => {
  checkMediaMatches();
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('orientationchange', handleResize);
});
</script>

<style lang="scss" scoped>

// 调试指示器
.debug-indicator {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  z-index: 9999;
  border-radius: 50%;
}

// 媒体查询调试面板
.media-debug {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 9999;
  max-width: 90%;
  max-height: 80%;
  overflow: auto;
  
  .media-info {
    margin-bottom: 10px;
    
    p {
      margin: 5px 0;
    }
    
    .media-matches {
      margin-top: 10px;
      
      .section-title {
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 5px;
        border-bottom: 1px solid rgba(255,255,255,0.3);
      }
      
      .matched {
        color: #4caf50;
        font-weight: bold;
      }
    }
  }
  
  button {
    padding: 5px 10px;
    background-color: #333;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #555;
    }
  }
}

.debug-toggle {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  z-index: 9999;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
</style> 