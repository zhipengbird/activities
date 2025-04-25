<template>
    <div 
        ref="imageRef" 
        :id="image.name" 
        class="image-content" 
        :class="baseAndAnimationClasses"
    >
        <!-- 添加一个包装器，用于浮动动画 -->
        <div 
            class="floating-wrapper"
            :class="{'enable-float': isVisible && animationCompleted}"
        >
            <img :src="image.src" mode="widthFix" />
        </div>
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

// 计算基础类和动画类
const baseAndAnimationClasses = computed(() => {
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

// 获取浮动动画类型
const getFloatType = (name: string) => {
    const lastDigit = name.charAt(name.length - 1);
    if (['0', '3', '6', '9'].includes(lastDigit)) {
        return 'float-up-down';
    } else if (['1', '4', '7'].includes(lastDigit)) {
        return 'float-left-right';
    } else {
        return 'float-scale';
    }
};

// 获取延迟值
const getAnimationDelay = (name: string) => {
    const lastDigit = name.charAt(name.length - 1);
    return (parseInt(lastDigit) || 0) * 0.3;
};

onMounted(() => {
    // 预先加载图片，减少闪烁
    const preloadImage = new Image();
    preloadImage.src = props.image.src;
    
    // 创建Intersection Observer
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口
                isVisible.value = true;
                
                // 等待入场动画完成后再开始浮动效果
                const animationClass = props.image.className.find(cls => cls.startsWith('animate__'));
                
                // 根据动画类型确定延迟时间
                let animationDuration = 1500; // 默认1.5秒
                
                // 对于特定的动画，可能需要更长的时间
                if (animationClass?.includes('slow')) {
                    animationDuration = 2000; // 慢速动画等待2秒
                } else if (animationClass?.includes('jackInTheBox')) {
                    animationDuration = 2000; // 某些复杂动画需要等待更长时间
                }
                
                setTimeout(() => {
                    // 标记动画完成，启用浮动效果
                    animationCompleted.value = true;
                    
                    // 应用浮动动画的类型和延迟
                    if (imageRef.value) {
                        const floatWrapper = imageRef.value.querySelector('.floating-wrapper');
                        if (floatWrapper) {
                            // 设置浮动类型
                            floatWrapper.classList.add(getFloatType(props.image.name));
                            
                            // 设置延迟
                            const delay = getAnimationDelay(props.image.name);
                            (floatWrapper as HTMLElement).style.animationDelay = `${delay}s`;
                        }
                    }
                    
                    // 停止观察
                    if (observer && imageRef.value) {
                        observer.unobserve(imageRef.value);
                    }
                }, animationDuration);
            }
        });
    }, {
        // 配置选项
        threshold: 0.1, // 当10%的元素可见时触发，提前开始动画准备
        rootMargin: '0px 0px 100px 0px' // 提前100px触发，给动画预留更多准备时间
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
    transition: opacity 0.8s ease;
    z-index: 2;
    position: relative;
    backface-visibility: hidden; /* 减少闪烁 */
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    perspective: 1000;
    
    // 当添加了动画类时，恢复完全不透明
    &.animate__animated {
        opacity: 1;
    }
    
    // 浮动包装器
    .floating-wrapper {
        position: relative;
        display: inline-block; // 使其尺寸适应内容
        backface-visibility: hidden; /* 减少闪烁 */
        -webkit-backface-visibility: hidden;
        transform: translateZ(0); /* 强制启用GPU加速 */
        -webkit-transform: translateZ(0);
        
        &.enable-float {
            will-change: transform;
            animation-play-state: running;
            
            &.float-up-down {
                animation: float-up-down 5s ease-in-out infinite;
            }
            
            &.float-left-right {
                animation: float-left-right 6s ease-in-out infinite;
            }
            
            &.float-scale {
                animation: float-scale 7s ease-in-out infinite;
            }
        }
    }
    
    img {
        display: block;
        transform-origin: center;
        backface-visibility: hidden; /* 减少闪烁 */
        -webkit-backface-visibility: hidden;
    }
}
</style>