/**
 * 检测设备类型
 * @returns boolean - 是否为移动设备
 */
export const detectDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 全局设备检测结果，可在应用启动时初始化
export const IS_MOBILE = detectDevice(); 