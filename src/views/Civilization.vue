<template>
  <div :class="[
    'civilization-container', 
    ENV.isMobile ? 'mobile' : '',
  ]">
    <BScroll
      ref="scrollRef"
      @bs="handleBs"
      @scrollProcess="handleScroll"
      @scrollStart="handleScrollStart"
      @scrollEnd="handleScrollEnd"
      :backgroundImages="bgImages"
    >
      <!-- 滚动内容 -->
      <div class="scroll-content">
        <ImageContentItem
          v-for="(image, index) in imageList"
          :key="index"
          :image="image"
        />
        <!-- <div class="path-content">
          <img src="@/assets/images/jiujiang/path.png" alt="path" />
        </div> -->
      </div>
    </BScroll>
    
    <!-- 提示组件 -->
    <div 
      class="hint-overlay"
      :class="{ 
        'visible': showHint, 
        'hidden': !showHint,
        'landscape-hint': isLandscapeHint
      }"
    >
      <div class="hint-text">{{ hintText }}</div>
      <div class="hint-arrow">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 5L21 12L14 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <!-- 背景音乐组件 -->
    <AudioControl
      ref="audioRef"
      :audioUrl="bgMusicUrl"
      :autoPlay="true"
      class="music-control"
    />
    
    <!-- 引入独立的调试组件 -->
    <!-- <DebugPanel /> -->
    
    <!-- 微信分享组件 (不可见) -->
    <WxShare 
      ref="wxShareRef"
      title="九江山水·星河文明"
      desc="探索九江山水与文明的时空长卷"
      :imgUrl="shareImgUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ENV } from "@/utils/env";
import BScroll from "@/components/BScroll.vue";
import BetterScroll from "better-scroll";
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
import { bgImages } from "@/data/data";
import { type ImageItem, imageList } from "@/data/data";
import ImageContentItem from "@components/ImageContentItem.vue";
// import DebugPanel from "@/components/DebugPanel.vue";
import WxShare from "@/components/WxShare.vue";
import AudioControl from "@/components/AudioControl.vue";
import bgmusic from "@/assets/bgmusic.mp3";

const scrollRef = ref<InstanceType<typeof BScroll>>();
const wxShareRef = ref<InstanceType<typeof WxShare>>();
const audioRef = ref<InstanceType<typeof AudioControl>>();
const bsInstance = ref<InstanceType<typeof BetterScroll>>();

// 背景音乐URL
const bgMusicUrl = ref(bgmusic); // 请确保路径正确

// 自动滚动相关状态
const isUserScrolling = ref(false);
const autoScrollTimer = ref<number | null>(null);
const autoScrollInterval = 50; // 自动滚动的间隔时间（毫秒）
const autoScrollSpeed = 1; // 自动滚动的速度（像素/间隔）
const userInactivityTimeout = 3000; // 用户停止滚动后多久开始自动滚动（毫秒）
let userInactivityTimer: number | null = null;

// 提示相关状态
const showHint = ref(false);
const hintText = ref("向右滑动查看更多");
const isLandscapeHint = ref(false); // 是否是横屏提示
const hintTimer = ref<number | null>(null);
const hasScrolled = ref(false); // 用户是否已滚动过

// 分享图标URL
const shareImgUrl = computed(() => {
  return `${window.location.origin}/assets/images/jiujiang/xxx.jpg`;
});

// 当BScroll实例准备好时
const handleBs = (bs: InstanceType<typeof BetterScroll>) => {
  bsInstance.value = bs;
  
  // 在手机竖屏模式下进行特殊处理
  if (ENV.isMobile && ENV.isPortrait) {
    bs.refresh();
  }
  
  // 检查是否需要显示横屏提示
  checkOrientation();
  
  // 初始化完成后启动自动滚动
  startAutoScrollAfterDelay();
};

// 滚动处理
const handleScroll = (pos: { x: number; y: number }) => {
  // 记录用户已滚动
  if (pos.x < -10) {
    hasScrolled.value = true;
  }
};

// 用户开始滚动
const handleScrollStart = () => {
  isUserScrolling.value = true;
  hideHint();
  stopAutoScroll();
};

// 用户停止滚动
const handleScrollEnd = () => {
  isUserScrolling.value = false;
  startAutoScrollAfterDelay();
  
  // 如果不是横屏提示模式，恢复滑动提示
  if (!isLandscapeHint.value) {
    startHintTimer();
  }
};

// 检查屏幕方向并设置相应提示
const checkOrientation = () => {
  if (ENV.isMobile) {
    // 手机端先显示横屏提示
    isLandscapeHint.value = true;
    hintText.value = "请横屏查看以获得最佳体验";
    showHint.value = true;
    
    // 3秒后切换到滑动提示
    setTimeout(() => {
      isLandscapeHint.value = false;
      hintText.value = "向右滑动查看更多";
      showHint.value = true;
      
      // 再等1秒后启动周期性提示
      setTimeout(() => {
        hideHint();
        startHintTimer();
      }, 3000);
    }, 3000);
  } else {
    // 非移动设备直接显示滑动提示
    isLandscapeHint.value = false;
    hintText.value = "向右滑动查看更多";
    showHint.value = true;
    startHintTimer();
  }
};

// 显示提示
const showSlideHint = () => {
  // 如果正在用户主动滚动或已经是横屏提示，不显示滑动提示
  if (isUserScrolling.value || isLandscapeHint.value) return;
  
  // 如果没有BScroll实例，不显示提示
  if (!bsInstance.value) return;
  
  // 如果已经滚动到最右侧，不显示提示
  if (bsInstance.value.x <= bsInstance.value.maxScrollX + 100) return;
  
  // 设置提示文本，更新滚动提示
  hintText.value = "向右滑动查看更多";
  showHint.value = true;
  
  // 提示显示3秒后自动隐藏
  setTimeout(() => {
    hideHint();
  }, 3000);
};

// 隐藏提示
const hideHint = () => {
  showHint.value = false;
};

// 清除提示定时器
const clearHintTimer = () => {
  if (hintTimer.value !== null) {
    clearInterval(hintTimer.value);
    hintTimer.value = null;
  }
};

// 启动提示定时器
const startHintTimer = () => {
  // 先清除可能存在的定时器
  clearHintTimer();
  
  // 设置新的定时器
  hintTimer.value = window.setInterval(() => {
    showSlideHint();
  }, 8000); // 每8秒显示一次提示
};

// 开始自动滚动
const startAutoScroll = () => {
  if (autoScrollTimer.value !== null || isUserScrolling.value || !bsInstance.value) {
    return;
  }
  
  autoScrollTimer.value = window.setInterval(() => {
    if (!bsInstance.value) return;
    
    const currentPos = bsInstance.value.x;
    const maxScrollX = bsInstance.value.maxScrollX;
    
    // 如果已经滚动到最右侧，停止自动滚动
    if (currentPos <= maxScrollX) {
      stopAutoScroll();
      return;
    }
    
    // 使用BetterScroll的scrollBy方法进行平滑滚动
    bsInstance.value.scrollBy(-autoScrollSpeed, 0, 0);
  }, autoScrollInterval);
};

// 停止自动滚动
const stopAutoScroll = () => {
  if (autoScrollTimer.value !== null) {
    clearInterval(autoScrollTimer.value);
    autoScrollTimer.value = null;
  }
  
  // 清除用户不活动计时器
  if (userInactivityTimer !== null) {
    clearTimeout(userInactivityTimer);
    userInactivityTimer = null;
  }
};

// 用户停止交互后开始自动滚动
const startAutoScrollAfterDelay = () => {
  if (userInactivityTimer !== null) {
    clearTimeout(userInactivityTimer);
  }
  
  userInactivityTimer = window.setTimeout(() => {
    startAutoScroll();
  }, userInactivityTimeout);
};

// 处理用户交互
const handleUserInteraction = () => {
  isUserScrolling.value = true;
  hideHint();
  stopAutoScroll();
  
  // 用户交互结束后一段时间再恢复自动滚动
  startAutoScrollAfterDelay();
};

onMounted(() => {
  // 确保微信分享配置正确初始化
  if (wxShareRef.value && ENV.isWechat) {
    wxShareRef.value.initShare().then(success => {
      if (success) {
        console.log('微信分享初始化成功');
      } else {
        console.warn('微信分享初始化失败');
      }
    });
  }
  
  // 监听用户触摸/鼠标事件以检测用户活动
  document.addEventListener('touchstart', handleUserInteraction);
  document.addEventListener('mousedown', handleUserInteraction);
  
  // 初始化时显示提示
  checkOrientation();
});

onUnmounted(() => {
  // 清理定时器
  stopAutoScroll();
  clearHintTimer();
  
  // 移除事件监听器
  document.removeEventListener('touchstart', handleUserInteraction);
  document.removeEventListener('mousedown', handleUserInteraction);
});

// 对外暴露方法
defineExpose({
  // updateShareInfo,
  startAutoScroll,
  stopAutoScroll
});

// // 手动更新分享信息
// const updateShareInfo = (title: string, desc: string, imgUrl?: string) => {
//   if (wxShareRef.value) {
//     wxShareRef.value.updateShare({
//       title,
//       desc,
//       imgUrl: imgUrl || shareImgUrl.value
//     });
//   }
// };
</script>

<style lang="scss" scoped>
@use '@/assets/styles/responsive.scss' as *;

.civilization-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.scroll-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .path-content {
    position: absolute;
    bottom: rem(20);
    left: rem(2120);
    width: auto;
    height: rem(307);
    img {
      width: 100%;
      height: 100%;
    }
    z-index: 0;
  }
}

// 提示样式
.hint-overlay {
  position: fixed;
  bottom: rem(30);
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: rem(8) rem(16);
  border-radius: rem(20);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s, transform 0.3s;
  box-shadow: 0 rem(2) rem(10) rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  
  &.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  
  &.hidden {
    opacity: 0;
    transform: translateX(-50%) translateY(rem(20));
    pointer-events: none;
  }
  
  // 横屏提示样式
  &.landscape-hint {
    background-color: rgba(0, 0, 0, 0.7);
    padding: rem(10) rem(16);
    bottom: 50%;
    transform: translateX(-50%) translateY(50%);
    
    &.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(50%);
    }
    
    &.hidden {
      opacity: 0;
      transform: translateX(-50%) translateY(60%);
    }
  }
  
  .hint-text {
    font-size: rem(16);
    margin-right: rem(8);
  }
  
  .hint-arrow {
    animation: swipe-right 1.5s infinite;
    display: flex;
    align-items: center;
    
    svg {
      width: rem(24);
      height: rem(24);
    }
  }
  
  @keyframes swipe-right {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(rem(5));
    }
  }
}

// 移动设备上的特殊调整
.mobile {
  .hint-overlay {
    bottom: rem(50);
    padding: rem(6) rem(12);
    
    &:not(.landscape-hint) {
      .hint-text {
        font-size: rem(12);
      }
      
      .hint-arrow svg {
        width: rem(18);
        height: rem(18);
      }
    }
  }
}

// 背景音乐控制按钮样式
.music-control {
  position: fixed;
  top: rem(20);
  right: rem(20);
  z-index: 1000;
}
</style>
