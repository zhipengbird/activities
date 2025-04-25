<template>
    <div class="background-music">
      <audio ref="audio" :src="musicUrl" loop ></audio>
      <button @click="toggleMusic">
        <img :src="isPlaying ? playIcon : pauseIcon" :class="{ 'rotating': isPlaying }" alt="播放/暂停">
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import playIconDefault from '@/assets/images/jiujiang/music_on.png';
  import pauseIconDefault from '@/assets/images/jiujiang/music_off.png';
  
  const { musicUrl, playIcon = playIconDefault, pauseIcon = pauseIconDefault } = defineProps({
    musicUrl: {
      type: String,
      required: true
    },
    playIcon: {
      type: String,
      default: playIconDefault,
    },
    pauseIcon: {
      type: String,
      default: pauseIconDefault,
    }
  });
  
  const isPlaying = ref(false);
  const audio = ref<HTMLAudioElement | null>(null);
  
  const toggleMusic = () => {
    if (audio.value) {
      if (isPlaying.value) {
        pause();
      } else {
        play();
      }
      isPlaying.value = !isPlaying.value;
    }
  };
  
  const play = () => {
    if (audio.value) {
      audio.value.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };
  
  const pause = () => {
    if (audio.value) {
      audio.value.pause();
    }
  };
  
  onMounted(() => {
    if (isPlaying.value && audio.value) {
     play();
    }
  });
  
  onBeforeUnmount(() => {
    if (audio.value) {
      audio.value.pause();
    }
  });

defineExpose({
    play,
    pause,
    toggleMusic,
    isPlaying
  });
  </script>
  
  <style lang="scss" scoped>
  .background-music {
    display: flex;
    align-items: center;
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    img {
      width: rem(42);
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