<template>
    <div 
        ref="imageRef" 
        :id="image.name" 
        class="image-content" 
        :class="baseAndAnimationClasses"
    >
        <img :src="image.src" mode="widthFix" class="image" :class="floatingClass" />
    </div>
</template>

<script setup lang="ts">
import { type ImageItem } from '@/data/data';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import '@/assets/styles/animations.scss';

const props = defineProps<{
    image: ImageItem;
}>();

const imageRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const animationCompleted = ref(false);
let observer: IntersectionObserver | null = null;

// 计算浮动类名
const floatingClass = computed(() => {
    // 只在入场动画完成后启用浮动
    if (!isVisible.value || !animationCompleted.value) {
        return {};
    }
    
    // 获取图片ID部分用于决定动画类型
    const nameSegments = props.image.name.split('-');
    const groupId = parseInt(nameSegments[0]) || 0;
    const itemId = parseInt(nameSegments[1]) || 0;
    
    // 根据组ID和项目ID组合决定使用哪种浮动动画
    // 这样相邻的图像可以有一定的连贯性
    const floatTypes = [
        'float-up-down', 
        'float-left-right', 
        'float-scale', 
        'custom-float-diagonal', 
        'custom-float-rotate', 
        'custom-float-pulse-glow',
        'custom-float-wave',
        'custom-float-shadow'
    ];
    
    // 基于组ID选择动画类型基础索引，同一组的图像有相似动画
    const baseIndex = groupId % floatTypes.length;
    // 在基础索引上有小变化，但保持相邻效果的连贯性
    const animationIndex = (baseIndex + (itemId % 3)) % floatTypes.length;
    const floatType = floatTypes[animationIndex];
    
    // 延迟基于图片ID，使同组图像有交错效果
    const delayIndex = itemId % 10;
    
    // 为自定义动画使用自定义延迟类
    const delayClass = floatType.startsWith('custom-') 
        ? `delay-custom-${delayIndex}` 
        : `delay-${delayIndex}`;
    
    return {
        [floatType]: true,
        [delayClass]: true
    };
});

// 计算基础类和动画类
const baseAndAnimationClasses = computed(() => {
    // 获取基础类名（非动画类）
    const baseClasses = props.image.className.filter(cls => !cls.startsWith('animate__'));
    
    // 如果元素可见，添加动画类
    if (isVisible.value) {
        // 所有动画类
        const animationClasses = props.image.className.filter(cls => cls.startsWith('animate__'));
        
        // 分离持续性动画（如pulse）和入场动画
        const continuousAnimations = animationClasses.filter(cls => 
            cls.includes('pulse') || cls.includes('bounce') || cls.includes('flash'));
        const entranceAnimations = animationClasses.filter(cls => 
            !continuousAnimations.includes(cls));
        
        // 如果完成了入场动画，不再应用持续性动画
        const finalAnimations = animationCompleted.value 
            ? [] // 入场动画完成后不应用animate.css动画，改为自定义浮动
            : animationClasses;
            
        return [...baseClasses, 'animate__animated', ...finalAnimations];
    }
    
    // 如果不可见，只返回基础类
    return baseClasses;
});

onMounted(() => {
    // 预先加载图片
    const preloadImage = new Image();
    preloadImage.src = props.image.src;
    
    // 创建Intersection Observer
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口
                isVisible.value = true;
                
                // 计算适当的等待时间
                const hasSlow = props.image.className.some(cls => cls.includes('slow'));
                const hasComplex = props.image.className.some(cls => 
                    cls.includes('jackInTheBox') || 
                    cls.includes('lightSpeed') || 
                    cls.includes('bounceIn') ||
                    cls.includes('zoomIn'));
                
                // 根据动画类型决定等待时间
                const waitTime = hasSlow 
                    ? 2400 
                    : hasComplex 
                        ? 2200 
                        : 1800;
                
                // 等待入场动画完成后启用浮动
                setTimeout(() => {
                    animationCompleted.value = true;
                    
                    // 停止观察
                    if (observer && imageRef.value) {
                        observer.unobserve(imageRef.value);
                    }
                }, waitTime);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px'
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
    transition: opacity 0.6s ease;
    z-index: 2;
    position: relative;
    
    // 当添加了动画类时，恢复完全不透明
    &.animate__animated {
        opacity: 1;
    }
    
    .image {
        display: block;
        transform-origin: center;
    }
}
</style>