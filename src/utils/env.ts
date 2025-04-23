/**
 * 环境变量和全局配置
 */

// 设备类型检测
const detectMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const detectIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const detectAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

const detectTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const detectWechat = (): boolean => {
  return /MicroMessenger/i.test(navigator.userAgent);
};

const detectApp = (): boolean => {
  return /xsb/i.test(navigator.userAgent);
};

const detectH5 = (): boolean => {
  return !detectWechat() && !detectApp();
};

// 环境变量
export const ENV = {
  // 设备类型
  isMobile: detectMobile(),
  isIOS: detectIOS(),
  isAndroid: detectAndroid(),
  isTouchDevice: detectTouchDevice(),
  
  // 运行环境
  isWechat: detectWechat(),
  isApp: detectApp(),
  isH5: detectH5(),
  
  // 视口信息
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  
  // 其他环境变量，可以在这里扩展
  // ...
};

// 监听窗口大小变化，更新视口信息
window.addEventListener('resize', () => {
  ENV.viewportWidth = window.innerWidth;
  ENV.viewportHeight = window.innerHeight;
});

export default ENV; 