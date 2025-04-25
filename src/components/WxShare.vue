<template>
  <!-- 微信分享组件不需要UI界面 -->
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { initWxConfig, setWxShare } from '@/utils/wxShare';

// 定义props
const props = defineProps({
  title: {
    type: String,
    default: '九江山水·星河文明'
  },
  desc: {
    type: String,
    default: '探索九江山水与文明的奇妙旅程'
  },
  imgUrl: {
    type: String,
    default: ''
  },
  apiUrl: {
    type: String,
    default: import.meta.env.VITE_WX_API_URL || '/api/wechat/config'
  },
  autoInit: {
    type: Boolean,
    default: true
  }
});

// 获取当前路由
const route = useRoute();
const isConfigReady = ref(false);

// 配置微信分享
const configWxShare = async () => {
  try {
    if (!isConfigReady.value) {
      // 如果配置尚未就绪，先初始化微信SDK
      const initialized = await initWxConfig(props.apiUrl);
      isConfigReady.value = initialized;
    }

    // 设置分享信息
    const shareLink = window.location.href.split('#')[0];
    const shareImgUrl = props.imgUrl || `${window.location.origin}/assets/images/share_icon.jpg`;
    
    setWxShare({
      title: props.title,
      desc: props.desc,
      link: shareLink,
      imgUrl: shareImgUrl
    });
  } catch (error) {
    console.error('配置微信分享失败:', error);
  }
};

// 监听路由变化，更新分享信息
watch(() => route.path, () => {
  if (isConfigReady.value) {
    configWxShare();
  }
});

// 暴露方法给父组件
defineExpose({
  initShare: async () => {
    await configWxShare();
    return isConfigReady.value;
  },
  updateShare: (options: any) => {
    if (isConfigReady.value) {
      setWxShare(options);
    }
  }
});

// 组件挂载时初始化
onMounted(() => {
  if (props.autoInit) {
    configWxShare();
  }
});
</script> 