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
        <div class="path-content">
          <img src="@/assets/images/jiujiang/path.png" alt="path" />
        </div>
      </div>

    </BScroll>
    
    <!-- 引入独立的调试组件 -->
    <DebugPanel />
  </div>
</template>

<script setup lang="ts">
import { ENV } from "@/utils/env";
import BScroll from "@/components/BScroll.vue";
import BetterScroll from "better-scroll";
import { ref, onMounted } from "vue";
import { bgImages } from "@/data/data";
import { type ImageItem, imageList } from "@/data/data";
import ImageContentItem from "@components/ImageContentItem.vue";
import DebugPanel from "@/components/DebugPanel.vue";

const scrollRef = ref<InstanceType<typeof BScroll>>();

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

  .path-content {
    position: absolute;
    bottom: rem(20);
    left: rem(2120);
    width:auto;
    height: rem(307);
    img {
      width: 100%;
      height: 100%;
      // object-fit: cover;
    }
    z-index: 0;
  }
}
</style>
