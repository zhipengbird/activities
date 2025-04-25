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
        <!-- <div class="path-content">
          <img src="@/assets/images/jiujiang/path.png" alt="path" />
        </div> -->
      </div>
    </BScroll>
    
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
import { ref, onMounted, computed } from "vue";
import { bgImages } from "@/data/data";
import { type ImageItem, imageList } from "@/data/data";
import ImageContentItem from "@components/ImageContentItem.vue";
import DebugPanel from "@/components/DebugPanel.vue";
import WxShare from "@/components/WxShare.vue";

const scrollRef = ref<InstanceType<typeof BScroll>>();
const wxShareRef = ref<InstanceType<typeof WxShare>>();

// 分享图标URL
const shareImgUrl = computed(() => {
  return `${window.location.origin}/assets/images/jiujiang/xxx.jpg`;
});

const handleBs = (bs: InstanceType<typeof BetterScroll>) => {
  console.log(bs);
  
  // 在手机竖屏模式下进行特殊处理
  if (ENV.isMobile && ENV.isPortrait) {
    bs.refresh();
  }
};

// 滚动处理
const handleScroll = (pos: { x: number; y: number }) => {
  // 这里可以添加滚动相关逻辑
};

// 手动更新分享信息
const updateShareInfo = (title: string, desc: string, imgUrl?: string) => {
  if (wxShareRef.value) {
    wxShareRef.value.updateShare({
      title,
      desc,
      imgUrl: imgUrl || shareImgUrl.value
    });
  }
};

onMounted(() => {
  // 在这里可以根据需要添加其他初始化逻辑
  
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
});

// 对外暴露方法
defineExpose({
  updateShareInfo
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
</style>
