# 九江山水·星河文明 项目

一个展示九江山水与文明的交互式Web长卷应用。

## 项目简介

本项目是一个基于Vue 3和TypeScript构建的横向滚动长卷应用，用于展示九江的山水、文化和文明演进。通过精美图片、动画效果和互动元素，为用户提供沉浸式的视觉体验。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **滚动库**: BetterScroll
- **动画**: Animate.css
- **状态管理**: Pinia
- **其他**: 微信分享功能、图片优化

## 主要功能

- **横向滚动长卷**: 通过BetterScroll实现流畅的横向滚动体验
- **动画效果**: 基于Animate.css和Vue的元素出现动画
- **响应式设计**: 自适应不同尺寸的设备和屏幕方向
- **微信分享**: 支持微信环境中的分享功能
- **图片优化**: 自动压缩和优化图片资源

## 项目结构

```
Activities/
├── public/                 # 静态资源
│   └── assets/             # 资源文件
│       └── images/         # 图片资源
├── src/                    # 源代码
│   ├── assets/             # 项目资源
│   ├── components/         # 通用组件
│   │   ├── BScroll.vue     # 滚动组件
│   │   ├── ImageContentItem.vue   # 图片内容组件
│   │   └── WxShare.vue     # 微信分享组件
│   ├── data/               # 数据文件
│   │   └── data.ts         # 图片和背景数据
│   ├── utils/              # 工具函数
│   │   ├── env.ts          # 环境检测
│   │   └── wxShare.ts      # 微信分享工具
│   ├── views/              # 页面视图
│   │   └── Civilization.vue # 主视图
│   ├── App.vue             # 应用入口组件
│   └── main.ts             # 主入口文件
├── vite.config.ts          # Vite配置
├── README.md               # 项目说明文档
└── README-WXSHARE.md       # 微信分享功能说明
```

## 安装与运行

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

构建后的文件将生成在 `Civilization` 目录中。

## 自定义配置

### 图片资源

- 背景图片: 在 `src/data/data.ts` 中的 `bgImages` 数组中配置
- 内容图片: 在 `src/data/data.ts` 中的 `imageList` 数组中配置

### 微信分享

微信分享功能的配置详见 [README-WXSHARE.md](./README-WXSHARE.md)

## 设备兼容性

- 支持现代浏览器和移动设备
- 针对iOS和Android设备进行了特别优化
- 支持在微信环境中打开

## 性能优化

- 使用图片懒加载提高加载速度
- 通过 `will-change` 属性优化动画性能
- 图片资源自动压缩减小体积（约60%的压缩率）

## 注意事项

1. 项目需要在HTTP服务器环境下运行，不支持直接打开HTML文件
2. 微信分享功能需要后端提供签名接口
3. 在移动设备上测试时，建议使用真机而非模拟器

## 团队

- 开发团队: [您的团队名称]
- 设计团队: [设计团队名称]
- 内容团队: [内容团队名称]

## 版权信息

© 2023 [您的公司/组织名称] 版权所有
