<template>
    <div ref="imageRef" :id="image.name" class="image-content" :class="animationClasses">
        <img :src="image.src" mode="widthFix" />
    </div>
</template>

<script setup lang="ts">
import { type ImageItem } from '@/data/data';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
    image: ImageItem;
}>();

const imageRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

// 计算要应用的CSS类
const animationClasses = computed(() => {
    // 获取基础类名（非动画类）
    const baseClasses = props.image.className.filter(cls => !cls.startsWith('animate__'));
    
    // 如果元素可见，添加animate__animated和所有动画类
    if (isVisible.value) {
        const animationClasses = props.image.className.filter(cls => cls.startsWith('animate__'));
        return [...baseClasses, 'animate__animated', ...animationClasses];
    }
    
    // 如果不可见，只返回基础类
    return baseClasses;
});

onMounted(() => {
    // 创建Intersection Observer
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口
                isVisible.value = true;
                
                // 一旦可见，延迟一段时间再停止观察，允许动画完成
                setTimeout(() => {
                    if (observer && imageRef.value) {
                        observer.unobserve(imageRef.value);
                    }
                }, 1000); // 等待1秒，让动画有足够时间启动
            }
        });
    }, {
        // 配置选项
        threshold: 0.3, // 当30%的元素可见时触发
        rootMargin: '0px 0px 50px 0px' // 提前50px触发
    });

    // 开始观察
    if (imageRef.value) {
        observer.observe(imageRef.value);
    }
});

onUnmounted(() => {
    // 清理observer
    if (observer && imageRef.value) {
        observer.unobserve(imageRef.value);
        observer.disconnect();
    }
});
</script>

<style lang="scss" scoped>
@use '@/data/style.scss';

.image-content {
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 2;
    will-change: opacity, transform;
    
    // 当添加了动画类时，恢复完全不透明
    &.animate__animated {
        opacity: 1;
    }
    
    img {
        transform-origin: center;
        will-change: transform;
    }
}
</style>