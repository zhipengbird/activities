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

// iPad检测（更精确）
const detectIPad = (): boolean => {
  // 传统的iPad检测
  const isIpad = /iPad/i.test(navigator.userAgent);
  
  // 新版iPad Pro/Air在iOS 13+上伪装成Mac
  const isMacButHasTouchScreen = 
    /Macintosh/i.test(navigator.userAgent) && 
    navigator.maxTouchPoints > 1;
  
  return isIpad || isMacButHasTouchScreen;
};

// 屏幕方向检测
const detectPortrait = (): boolean => {
  return window.innerHeight > window.innerWidth;
};

// 环境变量
export const ENV = {
  // 设备类型
  isMobile: detectMobile(),
  isIOS: detectIOS(),
  isAndroid: detectAndroid(),
  isTouchDevice: detectTouchDevice(),
  isIPad: detectIPad(),  // 添加iPad标志
  
  // 运行环境
  isWechat: detectWechat(),
  isApp: detectApp(),
  isH5: detectH5(),
  
  // 视口信息
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  
  // 屏幕方向
  isPortrait: detectPortrait(),
  
  // 更新视口和方向信息的方法
  updateViewport: () => {
    ENV.viewportWidth = window.innerWidth;
    ENV.viewportHeight = window.innerHeight;
    ENV.isPortrait = detectPortrait();
    return ENV; // 返回更新后的ENV便于链式调用
  },
  
  // 其他环境变量，可以在这里扩展
  // ...
};

// 监听窗口大小变化，更新视口信息
window.addEventListener('resize', () => {
  ENV.updateViewport();

  console.log('当前窗口宽度:', ENV.viewportWidth);
  console.log('是否为iPad:', ENV.isIPad);
  console.log('屏幕方向:', ENV.isPortrait ? '竖屏' : '横屏');
  
  // 检测命中了哪个断点
  if (ENV.viewportWidth <= 320) console.log('命中断点: xs');
  else if (ENV.viewportWidth  <= 360) console.log('命中断点: sm');
  else if (ENV.viewportWidth  <= 393) console.log('命中断点: md');
  else if (ENV.viewportWidth  <= 414) console.log('命中断点: lg');
  else if (ENV.viewportWidth  <= 768) console.log('命中断点: tablet');
  else if (ENV.viewportWidth  <= 1024) console.log('命中断点: desktop');
  else console.log('命中断点: wide');
  
  // 输出设备信息以便调试
  console.log('设备信息:', {
    userAgent: navigator.userAgent,
    touchPoints: navigator.maxTouchPoints,
    deviceMemory: (navigator as any).deviceMemory,
    devicePixelRatio: window.devicePixelRatio
  });
});

// 监听屏幕方向变化
window.addEventListener('orientationchange', () => {
  ENV.updateViewport();
  console.log('屏幕方向变化:', ENV.isPortrait ? '竖屏' : '横屏');
});

// 初始化时也输出一次日志
console.log('初始化视口宽度:', ENV.viewportWidth);
console.log('是否为iPad:', ENV.isIPad);
console.log('设备UserAgent:', navigator.userAgent);
console.log('初始屏幕方向:', ENV.isPortrait ? '竖屏' : '横屏');

export default ENV; 