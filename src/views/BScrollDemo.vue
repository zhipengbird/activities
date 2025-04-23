<template>
  <div :class="['bscroll-demo', ENV.isMobile ? 'mobile' : '']">
    <BScroll :backgroundImage="backgroundImage" @scrollProcess="handleScroll">
      <!-- 在这里添加滚动内容元素 -->
      <div class="item_1" @click="handleClick">点击我</div>
      <div class="item_2">测试项目2</div>
    </BScroll>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BScroll from '@/components/BScroll.vue';
import bgImage from '@/assets/images/city_bg.jpg';
import { ENV } from '@/utils/env';

// 背景图片
const backgroundImage = ref(bgImage);

// 滚动处理
const handleScroll = (pos: { x: number; y: number }) => {
  console.log('滚动位置:', pos);
};

// 点击处理
const handleClick = () => {
  console.log('元素被点击');
};
</script>

<style lang="scss" scoped>
.bscroll-demo {
  width: 100%;
  height: 100vh;

  .item_2 {
    position: absolute;
    top: 20%;
    right: 10%;
    padding: 15px;
    background-color: blue;
    color: white;
    cursor: pointer;
    user-select: none;
  }
}
</style> 