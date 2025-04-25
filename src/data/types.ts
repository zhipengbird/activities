// 定义背景图片项接口，与BScroll.vue中的定义保持一致
export interface BackgroundImageItem {
  url: string;
  opacity?: number;
  parallaxFactor?: number;
  zIndex?: number;
}

// 创建一个空的背景图片数组，实际使用时需要填充
export const bgImages: BackgroundImageItem[] = [];

// 图片项接口定义
export interface ImageItem {
  src: string;
  name: string;
  className: string[];
}

// 创建一个空的图片列表数组，实际使用时需要填充
export const imageList: ImageItem[] = [];














