<template>
  <div class="audio-control">
    <button @click="togglePlay" class="audio-button">
      <img :src="isPlaying ? playIcon : pauseIcon" :class="{ 'rotating': isPlaying }" alt="播放/暂停">
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useAudioService } from '@/utils/audioService';
import playIconDefault from '@/assets/images/jiujiang/music_on.png';
import pauseIconDefault from '@/assets/images/jiujiang/music_off.png';

const props = defineProps({
  playIcon: {
    type: String,
    default: playIconDefault,
  },
  pauseIcon: {
    type: String,
    default: pauseIconDefault,
  },
  audioUrl: {
    type: String,
    default: '',
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
});

// 从音频服务获取状态和方法
const { 
  audioService, 
  play: servicePlay,
  pause, 
  toggle,
  setAudioUrl,
  isPlaying: serviceIsPlaying,
  isMuted: serviceIsMuted 
} = useAudioService();

// 本地组件状态，跟踪音频服务的状态
const isPlaying = ref(serviceIsPlaying);
const isMuted = ref(serviceIsMuted);

// 添加一个状态来记录用户是否主动关闭了音乐
// 首次加载时不应该认为用户已经关闭音乐
const userMutedAudio = ref(false);

// 从localStorage中检查是否首次加载
const isFirstVisit = ref(localStorage.getItem('puzzle_audio_first_visit') === null);

// 监听音频服务状态变化，同步到本地状态
const unlistenPlay = audioService.addEventListener('play', () => {
  isPlaying.value = true;
  userMutedAudio.value = false; // 用户主动开启了音乐
});

const unlistenPause = audioService.addEventListener('pause', () => {
  isPlaying.value = false;
  userMutedAudio.value = true; // 用户主动关闭了音乐
});

const unlistenMute = audioService.addEventListener('mute', () => {
  isMuted.value = true;
});

const unlistenUnmute = audioService.addEventListener('unmute', () => {
  isMuted.value = false;
});

// 封装播放方法，确保返回Promise
const play = (): Promise<void> => {
  return servicePlay();
};

// 切换播放/暂停
const togglePlay = () => {
  toggle();
  // 用户主动切换了音乐状态
  userMutedAudio.value = !isPlaying.value;
};

// 如果提供了音频URL，则设置
watch(() => props.audioUrl, (newUrl) => {
  if (newUrl && newUrl !== audioService.audioUrl) {
    setAudioUrl(newUrl);
  }
}, { immediate: true });

// 第一次用户交互后尝试播放音频（处理自动播放策略）
const handleFirstInteraction = () => {
  console.log('用户首次交互', props.autoPlay, serviceIsPlaying, isPlaying.value, userMutedAudio.value, isFirstVisit.value);
  
  // 如果是首次访问，或者配置了自动播放且用户没有主动关闭音乐
  if ((isFirstVisit.value || props.autoPlay) && !serviceIsPlaying && !isPlaying.value && !userMutedAudio.value) {
    // 尝试播放音频，只有在成功后才移除事件监听
    play()
      .then(() => {
        console.log('音频播放成功，移除事件监听');
        
        // 标记不再是首次访问
        if (isFirstVisit.value) {
          localStorage.setItem('puzzle_audio_first_visit', 'false');
          isFirstVisit.value = false;
        }
        
        // 成功播放后移除事件监听
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      })
      .catch((error: unknown) => {
        console.error('音频播放失败，保留事件监听:', error);
        // 播放失败，保留事件监听，下次交互时再尝试
      });
  } else {
    // 不需要播放音频，直接移除事件监听
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
  }
};

onMounted(() => {
  console.log('组件挂载', props.autoPlay, serviceIsPlaying, isPlaying.value, userMutedAudio.value, isFirstVisit.value);
  
  // 总是添加用户交互监听，让首次交互时决定是否播放
  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
  
  // 不要在挂载时尝试播放，等待用户交互
});

onBeforeUnmount(() => {
  // 清理事件监听
  unlistenPlay();
  unlistenPause();
  unlistenMute();
  unlistenUnmute();
  document.removeEventListener('click', handleFirstInteraction);
  document.removeEventListener('touchstart', handleFirstInteraction);
});

// 对外暴露方法
defineExpose({
  play,
  pause,
  toggle: togglePlay,
  isPlaying: computed(() => isPlaying.value)
});
</script>

<style lang="scss" scoped>
.audio-control {
  display: flex;
  align-items: center;
}

.audio-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0;
  
  img {
    width: rem(42);
    height: rem(42);
    aspect-ratio: 1/1;
    transition: transform 0.3s;
    
    &.rotating {
      animation: rotate 5s linear infinite;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 