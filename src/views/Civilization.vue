<template>
  <div :class="[
    'civilization-container', 
    ENV.isMobile ? 'mobile' : '',
  ]">
    <BScroll
      ref="scrollRef"
      @bs="handleBs"
      @scrollProcess="handleScroll"
      :backgroundImages="bgImages"
    >
      <!-- 滚动内容 -->
      <div class="scroll-content">

        <ImageContentItem
          v-for="(image, index) in imageList"
          :key="index"
          :image="image"
        />
      </div>
    </BScroll>
    <div class="debug-indicator"></div>
    <div class="media-debug" v-if="showMediaDebug">
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
      <button @click="showMediaDebug = false">关闭</button>
    </div>
    <div class="debug-toggle" @click="showMediaDebug = !showMediaDebug">
      调试
    </div>
  </div>
</template>

<script setup lang="ts">
import { ENV } from "@/utils/env";
import BScroll from "@/components/BScroll.vue";
import BetterScroll from "better-scroll";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { bgImages } from "@/data/data";
import { type ImageItem, imageList } from "@/data/data";
import ImageContentItem from "@components/ImageContentItem.vue";

const scrollRef = ref<InstanceType<typeof BScroll>>();
const showMediaDebug = ref(false);
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

// 为模板使用的全局变量
const devicePixelRatio = ref(window.devicePixelRatio);
const userAgent = ref(navigator.userAgent);

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
  // 更新其他信息
  devicePixelRatio.value = window.devicePixelRatio;
};

const handleBs = (bs: InstanceType<typeof BetterScroll>) => {
  console.log(bs);
  
  // 在手机竖屏模式下进行特殊处理
  if (ENV.isMobile && ENV.isPortrait) {
    // 例如设置旋转相关的选项
    // bs.options.rotate = 90; // 假设BetterScroll支持这个选项
    bs.refresh();
  }
};

// 滚动处理
const handleScroll = (pos: { x: number; y: number }) => {
  //   scrollPos.x = pos.x;
  //   scrollPos.y = pos.y;
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
@use '@/assets/styles/responsive.scss' as *;

.civilization-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
.scroll-content {
  // wdth: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
// 调试指示器
.debug-indicator {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  z-index: 9999;
  background-color: black; // 默认颜色
  
  // 不同断点下改变颜色
  @media screen and (max-width: 320px) {
    background-color: red; // xs
  }
  @media screen and (max-width: 360px) and (min-width: 321px) {
    background-color: orange; // sm
  }
  @media screen and (max-width: 375px) and (min-width: 361px) {
    background-color: yellow; // iPhone 375px
  }
  @media screen and (max-width: 390px) and (min-width: 376px) {
    background-color: greenyellow; // iPhone 390px
  }
  @media screen and (max-width: 393px) and (min-width: 391px) {
    background-color: yellow; // md
  }
  @media screen and (max-width: 414px) and (min-width: 394px) {
    background-color: green; // lg
  }
  @media screen and (max-width: 768px) and (min-width: 415px) {
    background-color: blue; // tablet
  }
  @media screen and (max-width: 1024px) and (min-width: 769px) {
    background-color: indigo; // desktop
  }
  @media screen and (min-width: 1025px) {
    background-color: violet; // wide
  }
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
