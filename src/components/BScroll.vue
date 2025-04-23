<template>
  <div class="scroll">
    <div class="scroll_wrapper" ref="scrollRef">
      <div class="scroll_content">
        <div class="scroll_item">
          <!-- bg -->
          <div class="bg_img">
            <!-- 单图模式 -->
            <template v-if="!backgroundImages || backgroundImages.length === 0">
              <img
                draggable="false"
                :src="backgroundImage"
                alt=""
                :style="{ height: ENV.isMobile ? '100vw' : '100vh' }"
                @load="initScroll"
                loading="eager"
              />
            </template>
            
            <!-- 多图模式 -->
            <template v-else>
              <img
                v-for="(img, index) in backgroundImages"
                :key="index"
                draggable="false"
                :src="img"
                alt=""
                :style="{ height: ENV.isMobile ? '100vw' : '100vh' }"
                @load="onImageLoad(index)"
                loading="eager"
              />
            </template>
          </div>

          <!-- 滚动内容 -->
          <div class="main">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, onUnmounted, defineExpose } from 'vue';
import BScroll from 'better-scroll';
import { ENV } from '@/utils/env';

let bs: InstanceType<typeof BScroll>;
const scrollRef = ref();
const imagesLoaded = ref<boolean[]>([]); // 记录每张图片的加载状态
const bsInitialized = ref(false); // 记录BScroll是否已初始化

defineOptions({ name: 'BScroll' });

const props = defineProps({
  backgroundImage: {
    type: String,
    default: '',
  },
  backgroundImages: {
    type: Array<string>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: 'bs', payload: InstanceType<typeof BScroll>): void;
  (e: 'scrollStart'): void;
  (e: 'scrollProcess', payload: { x: number; y: number }): void;
  (e: 'scrollEnd'): void;
}>();

// 处理图片加载
const onImageLoad = (index: number) => {
  // 记录图片已加载
  if (imagesLoaded.value.length <= index) {
    // 扩展数组以容纳当前索引
    imagesLoaded.value = [...imagesLoaded.value, ...Array(index + 1 - imagesLoaded.value.length).fill(false)];
  }
  imagesLoaded.value[index] = true;
  
  // 如果是第一张图片，初始化BScroll
  if (index === 0 && !bsInitialized.value) {
    initScroll();
  } 
  // 如果不是第一张图片且BScroll已初始化，则刷新
  else if (bsInitialized.value) {
    refreshScroll();
  }
};

// 刷新滚动区域
const refreshScroll = async () => {
  if (!bs) return;
  
  await nextTick();
  console.log('刷新滚动区域');
  bs.refresh();
};

// 初始化 better-scroll
const initScroll = async () => {
  await nextTick();

  bs = new BScroll(scrollRef.value, {
    scrollX: true, // 横向滚动
    click: true, // 允许点击
    preventDefault: true, // 阻止默认事件
    bounce: false, // 回弹
    probeType: 3, // 滚动事件
    mouseWheel: true, // 启用鼠标滚轮
  });

  if (ENV.isMobile) {
    bs.options.quadrant = 2; // 滚动区域为横向
  }

  bs.on('beforeScrollStart', () => {
    emit('scrollStart');
  });

  bs.on('scroll', (pos: { x: number; y: number }) => {
    emit('scrollProcess', pos);
  });

  bs.on('scrollEnd', () => {
    emit('scrollEnd');
  });

  bsInitialized.value = true;
  emit('bs', bs);
};

/**
 * 滚动到指定位置
 * @param x 横向位置
 * @param y 纵向位置
 * @param duration 动画持续时间(ms)
 */
const scrollTo = (x: number, y: number, duration: number = 300) => {
  if (!bs || !bsInitialized.value) return;
  bs.scrollTo(x, y, duration);
};

/**
 * 滚动到指定图片
 * @param index 图片索引
 * @param duration 动画持续时间(ms)
 */
const scrollToImage = (index: number, duration: number = 300) => {
  if (!bs || !bsInitialized.value) return;
  
  if (props.backgroundImages.length === 0) {
    console.warn('没有背景图片，无法滚动到指定图片');
    return;
  }
  
  // 获取所有图片元素
  const images = document.querySelectorAll('.bg_img img');
  if (!images || images.length <= index) {
    console.warn(`图片索引越界: ${index}, 总数: ${images.length}`);
    return;
  }
  
  // 计算目标位置 - 图片宽度 * 索引
  const targetX = -index * images[0].clientWidth;
  bs.scrollTo(targetX, 0, duration);
};

/**
 * 滚动到指定元素
 * @param element 目标元素或选择器
 * @param duration 动画持续时间(ms)
 * @param offsetX 额外的X轴偏移量
 */
const scrollToElement = (element: string | HTMLElement, duration: number = 300, offsetX: number = 0) => {
  if (!bs || !bsInitialized.value) return false;
  
  // 元素在根滚动容器中的定位
  const rootEl = scrollRef.value;
  if (!rootEl) return false;
  
  // 获取目标元素
  let targetEl: HTMLElement | null = null;
  if (typeof element === 'string') {
    targetEl = rootEl.querySelector(element);
  } else if (element instanceof HTMLElement) {
    targetEl = element;
  }
  
  if (!targetEl) {
    console.warn('未找到目标元素');
    return false;
  }
  
  // 计算目标元素相对于滚动容器的位置
  const mainEl = rootEl.querySelector('.main');
  const rect = targetEl.getBoundingClientRect();
  const containerRect = rootEl.getBoundingClientRect();
  
  // 计算滚动位置，注意这里考虑到元素可能在main内部且有绝对定位
  let targetX: number;
  
  if (mainEl && mainEl.contains(targetEl)) {
    // 如果目标元素是main内的元素（通常有绝对定位），使用left属性
    const targetLeft = parseFloat(getComputedStyle(targetEl).left);
    targetX = -targetLeft + offsetX;
  } else {
    // 否则使用元素的相对位置
    targetX = -(rect.left - containerRect.left) + offsetX;
  }
  
  // 滚动到目标位置
  bs.scrollTo(targetX, 0, duration);
  return true;
};

// 监听窗口大小变化，调整滚动区域
const handleResize = () => {
  if (bsInitialized.value) {
    refreshScroll();
  }
};

// 组件挂载和卸载
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 暴露方法给父组件使用
defineExpose({
  refresh: refreshScroll,
  scrollTo,
  scrollToImage,
  scrollToElement
});
</script>

<style lang="scss" scoped>
.scroll {
  overflow: hidden;
  height: 100%;
  width: 100%;
  cursor: grab;

  .scroll_wrapper {
    height: 100%;
    width: 100%;
    touch-action: pan-y;

    .scroll_content {
      display: inline-flex;

      .scroll_item {
        position: relative;
        top: 0;
        left: 0;

        .bg_img {
          user-select: none;
          pointer-events: none;
          display: flex;
          flex-direction: row;
          
          img {
            display: block;
            flex-shrink: 0; // 防止图片被压缩
            object-fit: cover; // 保持图片比例
          }
        }

        .main {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 999;

          .item_1 {
            user-select: none;
            cursor: pointer;
            position: absolute;
            top: 1%;
            left: 2%;
            padding: 10px;
            background-color: red;
          }
        }
      }
    }
  }
}
</style> 