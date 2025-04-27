<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import BetterScroll from 'better-scroll';

interface Props {
  scrollInstance: InstanceType<typeof BetterScroll> | null | undefined;
  interval?: number; // 滚动间隔时间
  speed?: number; // 滚动速度
  inactivityTimeout?: number; // 用户不活动超时时间
  enabled?: boolean; // 是否启用自动滚动
}

const props = withDefaults(defineProps<Props>(), {
  interval: 50,
  speed: 2,
  inactivityTimeout: 3000,
  enabled: true
});

const emit = defineEmits<{
  (e: 'scrollStateChange', isScrolling: boolean): void;
}>();

// 内部状态
const isScrolling = ref(false);
const autoScrollTimer = ref<number | null>(null);
let userInactivityTimer: number | null = null;

// 开始自动滚动
const startAutoScroll = () => {
  if (autoScrollTimer.value !== null || !props.scrollInstance || !props.enabled) {
    return;
  }
  
  isScrolling.value = true;
  emit('scrollStateChange', true);
  
  autoScrollTimer.value = window.setInterval(() => {
    if (!props.scrollInstance) return;
    
    const currentPos = props.scrollInstance.x;
    const maxScrollX = props.scrollInstance.maxScrollX;
    
    // 如果已经滚动到最右侧，停止自动滚动
    if (currentPos <= maxScrollX) {
      stopAutoScroll();
      return;
    }
    
    // 平滑滚动
    props.scrollInstance.scrollBy(-props.speed, 0, 0);
  }, props.interval);
};

// 停止自动滚动
const stopAutoScroll = () => {
  if (autoScrollTimer.value !== null) {
    clearInterval(autoScrollTimer.value);
    autoScrollTimer.value = null;
  }
  
  isScrolling.value = false;
  emit('scrollStateChange', false);
  
  clearUserInactivityTimer();
};

// 清除用户不活动计时器
const clearUserInactivityTimer = () => {
  if (userInactivityTimer !== null) {
    clearTimeout(userInactivityTimer);
    userInactivityTimer = null;
  }
};

// 用户交互后延时恢复自动滚动
const startAutoScrollAfterDelay = () => {
  clearUserInactivityTimer();
  
  userInactivityTimer = window.setTimeout(() => {
    startAutoScroll();
  }, props.inactivityTimeout);
};

// 处理用户交互
const handleUserInteraction = () => {
  stopAutoScroll();
  startAutoScrollAfterDelay();
};

// 监听props变化
watch(() => props.enabled, (newVal) => {
  if (newVal) {
    startAutoScrollAfterDelay();
  } else {
    stopAutoScroll();
    clearUserInactivityTimer();
  }
});

watch(() => props.scrollInstance, (newVal) => {
  if (newVal && props.enabled) {
    startAutoScrollAfterDelay();
  }
});

onMounted(() => {
  if (props.enabled && props.scrollInstance) {
    startAutoScrollAfterDelay();
  }
  
  document.addEventListener('touchstart', handleUserInteraction);
  document.addEventListener('mousedown', handleUserInteraction);
});

onUnmounted(() => {
  stopAutoScroll();
  clearUserInactivityTimer();
  
  document.removeEventListener('touchstart', handleUserInteraction);
  document.removeEventListener('mousedown', handleUserInteraction);
});

// 对外暴露方法
defineExpose({
  startAutoScroll,
  stopAutoScroll,
  startAutoScrollAfterDelay,
  isScrolling
});
</script>

<template>
  <!-- 无渲染内容，纯逻辑组件 -->
</template> 