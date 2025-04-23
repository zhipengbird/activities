<template>
  <div :class="['multi-bg-demo', ENV.isMobile ? 'mobile' : '']">
    <BScroll 
      ref="bsRef"
      :backgroundImages="bgImages" 
      @scrollProcess="handleScroll"
      @bs="handleBs"
    >
      <!-- 在这里添加滚动内容元素 -->
      <div class="item_1" id="dot1" @click="handleClick">第一张图</div>
      <div class="item_2" id="dot2" @click="handleSecondClick">第二张图</div>
      <div class="item_3" id="dot3" @click="handleThirdClick">第三张图</div>
    </BScroll>
    
    <!-- 导航按钮 -->
    <div class="nav-buttons">
      <button @click="scrollToFirst">图片1</button>
      <button @click="scrollToSecond">图片2</button>
      <button @click="scrollToThird">图片3</button>
      <div class="divider"></div>
      <button @click="scrollToElementById('dot1')">元素1</button>
      <button @click="scrollToElementById('dot2')">元素2</button>
      <button @click="scrollToElementById('dot3')">元素3</button>
    </div>
    
    <!-- 调试信息 -->
    <div class="debug-info">
      <div>滚动位置: {{ scrollPos.x }}</div>
      <div>背景图数量: {{ bgImages.length }}</div>
      <div>设备类型: {{ ENV.isMobile ? '移动设备' : '桌面设备' }}</div>
      <div>视口大小: {{ ENV.viewportWidth }}x{{ ENV.viewportHeight }}</div>
      <div>运行环境: 
        {{ ENV.isWechat ? '微信' : ENV.isApp ? 'App' : 'H5' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import BScroll from '@/components/BScroll.vue';
import BetterScroll from 'better-scroll';
import cityBg1 from '@/assets/images/city_bg.jpg';
import cityBg2 from '@/assets/images/city_bg.jpg'; // 实际应使用不同图片
import { ENV } from '@/utils/env';

// BScroll组件引用
const bsRef = ref<InstanceType<typeof BScroll> | null>(null);

// 滚动位置
const scrollPos = reactive({ x: 0, y: 0 });
// better-scroll实例
const bsInstance = ref<InstanceType<typeof BetterScroll> | null>(null);

// 背景图片数组 - 直接是图片路径数组
const bgImages = ref([cityBg1, cityBg2, cityBg1]);

// 滚动处理
const handleScroll = (pos: { x: number; y: number }) => {
  scrollPos.x = pos.x;
  scrollPos.y = pos.y;
};

// 获取better-scroll实例
const handleBs = (bs: InstanceType<typeof BetterScroll>) => {
  bsInstance.value = bs;
  console.log('BScroll实例已获取', bs);
};

// 元素点击处理
const handleClick = () => {
  console.log('第一张图元素被点击');
  if (bsInstance.value) {
    bsInstance.value.scrollTo(0, 0, 500);
  }
};

const handleSecondClick = () => {
  console.log('第二张图元素被点击');
  // 滚动到第二张图
  const imgWidth = document.querySelector('.bg_img img')?.clientWidth || 0;
  if (bsInstance.value && imgWidth) {
    bsInstance.value.scrollTo(-imgWidth, 0, 500);
  }
};

const handleThirdClick = () => {
  console.log('第三张图元素被点击');
  // 滚动到第三张图
  const imgWidth = document.querySelector('.bg_img img')?.clientWidth || 0;
  if (bsInstance.value && imgWidth) {
    bsInstance.value.scrollTo(-imgWidth * 2, 0, 500);
  }
};

// 使用新增加的方法
const scrollToFirst = () => {
  if (bsRef.value) {
    bsRef.value.scrollToImage(0, 500);
  }
};

const scrollToSecond = () => {
  if (bsRef.value) {
    bsRef.value.scrollToImage(1, 500);
  }
};

const scrollToThird = () => {
  if (bsRef.value) {
    bsRef.value.scrollToImage(2, 500);
  }
};

// 根据ID滚动到指定元素
const scrollToElementById = (id: string) => {
  if (bsRef.value) {
    bsRef.value.scrollToElement(`#${id}`, 500, -100); // 偏移量-100，让元素更居中
  }
};
</script>

<style lang="scss" scoped>
.multi-bg-demo {
  width: 100%;
  height: 100vh;
  position: relative;
  
  .nav-buttons {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 1000;
    background: rgba(0,0,0,0.5);
    padding: 10px;
    border-radius: 8px;
    
    button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      background: #3498db;
      color: white;
      cursor: pointer;
      transition: background 0.3s;
      
      &:hover {
        background: #2980b9;
      }
    }
    
    .divider {
      width: 1px;
      background: rgba(255,255,255,0.3);
      margin: 0 5px;
    }
  }
  
  .debug-info {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 1000;
  }

  .item_1, .item_2, .item_3 {
    user-select: none;
    cursor: pointer;
    position: absolute;
    padding: 15px;
    color: white;
    border-radius: 4px;
  }
  
  .item_1 {
    top: 20%;
    left: 150px;
    background-color: red;
  }
  
  .item_2 {
    top: 30%;
    left: calc(100vw + 150px);
    background-color: blue;
  }
  
  .item_3 {
    top: 40%;
    left: calc(200vw + 150px);
    background-color: green;
  }
}
</style> 