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
    
    // 根据图片ID决定浮动类型
    const lastDigit = props.image.name.charAt(props.image.name.length - 1);
    const floatType = ['0', '3', '6', '9'].includes(lastDigit) 
        ? 'float-up-down' 
        : ['1', '4', '7'].includes(lastDigit) 
            ? 'float-left-right' 
            : 'float-scale';
    
    // 延迟基于图片ID
    const delayIndex = parseInt(lastDigit) || 0;
    
    return {
        [floatType]: true,
        [`delay-${delayIndex}`]: true
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
        const continousAnimations = animationClasses.filter(cls => 
            cls.includes('pulse') || cls.includes('bounce') || cls.includes('flash'));
        const entranceAnimations = animationClasses.filter(cls => 
            !continousAnimations.includes(cls));
        
        // 如果完成了入场动画，不再应用持续性动画
        const finalAnimations = animationCompleted.value 
            ? entranceAnimations 
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
                    cls.includes('jackInTheBox') || cls.includes('lightSpeed'));
                
                // 根据动画类型决定等待时间
                const waitTime = hasSlow 
                    ? 2200 
                    : hasComplex 
                        ? 2000 
                        : 1600;
                
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

// 浮动动画关键帧
@keyframes float-up-down {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-7px);
    }
}

@keyframes float-left-right {
    0%, 100% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(5px);
    }
}

@keyframes float-scale {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
    }
}

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
        
        // 浮动动画类
        &.float-up-down {
            animation: float-up-down 5s ease-in-out infinite;
        }
        
        &.float-left-right {
            animation: float-left-right 6s ease-in-out infinite;
        }
        
        &.float-scale {
            animation: float-scale 7s ease-in-out infinite;
        }
        
        // 延迟类
        @for $i from 0 through 9 {
            &.delay-#{$i} {
                animation-delay: #{$i * 0.3}s;
            }
        }
    }
}
</style>