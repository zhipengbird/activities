<template>
    <div :class="image.className" :id="image.name" >
        <img :src="image.src"  mode="widthFix" />
    </div>
</template>

<script setup lang="ts">
import { type ImageItem } from '@/data/data';
// 添加rem函数供模板使用
function rem(px: number): string {
  return `${px / 16}rem`;
}
const props = defineProps<{
    image: ImageItem;
}>();

console.log('className:', props.image.className);

</script>
    

<style lang="scss" scoped>
@use '@/assets/styles/responsive.scss' as *;
@use '@/data/style.scss';
.image-content-item {
    display: inline-block;
    // img {
    //     width: 100%;
    //     height: 100%;
    //     object-fit: cover;
    //     user-select: none;
    // }
}



</style>