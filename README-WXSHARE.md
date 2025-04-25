# 微信分享功能使用说明

## 功能简介

该功能允许用户在微信环境中分享页面内容到微信好友或朋友圈，可自定义分享标题、描述和图片。

## 文件结构

- `src/utils/wxShare.ts` - 微信分享核心工具函数
- `src/components/WxShare.vue` - 微信分享组件
- `public/assets/images/jiujiang/share_icon.jpg` - 默认分享图标（需要自行添加）

## 使用方法

### 基本用法

在需要使用微信分享的页面中引入组件：

```vue
<template>
  <div>
    <!-- 页面内容 -->
    
    <!-- 微信分享组件 -->
    <WxShare 
      title="自定义标题"
      desc="自定义描述"
      :imgUrl="分享图片URL"
    />
  </div>
</template>

<script setup>
import WxShare from '@/components/WxShare.vue';
</script>
```

### 高级用法

如果需要动态更新分享内容，可以使用组件的引用：

```vue
<template>
  <div>
    <!-- 页面内容 -->
    
    <!-- 微信分享组件 -->
    <WxShare ref="wxShareRef" />
    
    <button @click="updateShare">更新分享内容</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WxShare from '@/components/WxShare.vue';

const wxShareRef = ref(null);

const updateShare = () => {
  wxShareRef.value?.updateShare({
    title: '新的标题',
    desc: '新的描述',
    imgUrl: '新的图片URL'
  });
};
</script>
```

## 配置说明

组件支持以下配置属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '九江山水·星河文明' | 分享标题 |
| desc | String | '探索九江山水与文明的奇妙旅程' | 分享描述 |
| imgUrl | String | '' | 分享图片URL，为空时使用默认图片 |
| apiUrl | String | 环境变量或'/api/wechat/config' | 获取微信配置的API接口 |
| autoInit | Boolean | true | 是否自动初始化 |

## 后端接口需求

后端需要提供一个获取微信JSSDK配置的接口，接口格式如下：

**请求:**
```
GET /api/wechat/config?url=当前页面URL
```

**响应:**
```json
{
  "appId": "微信公众号AppID",
  "timestamp": "签名时间戳",
  "nonceStr": "签名随机串",
  "signature": "微信签名"
}
```

## 注意事项

1. 确保在微信环境中打开页面
2. 图片建议为正方形，尺寸不小于300x300像素
3. 分享链接必须在微信公众平台的安全域名中
4. 如果分享不生效，检查后端签名是否正确

## 调试方法

微信分享功能只能在微信环境中测试，调试时可以：

1. 将 `wxShare.ts` 中的 `debug` 参数设为 `true`
2. 检查控制台日志输出
3. 使用微信开发者工具进行调试

## 常见问题

1. **分享无效**: 检查签名是否正确，URL是否在安全域名列表中
2. **图片不显示**: 确保图片URL可以直接访问，且在微信安全域名中
3. **提示"签名无效"**: 检查后端签名生成算法，确保URL与签名URL一致

---

更多信息请参考[微信JS-SDK说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html) 