import axios from 'axios';

// 微信分享配置接口
interface WxShareConfig {
  title: string;       // 分享标题
  desc: string;        // 分享描述
  link: string;        // 分享链接，通常是当前页面链接
  imgUrl: string;      // 分享图标
  success?: () => void;// 分享成功回调
  cancel?: () => void; // 分享取消回调
}

// 默认分享配置
const defaultConfig: WxShareConfig = {
  title: '九江山水·星河文明',
  desc: '探索九江山水与文明的奇妙旅程',
  link: window.location.href.split('#')[0],
  imgUrl: `${window.location.origin}/assets/images/share_icon.jpg`,
  success: () => console.log('分享成功'),
  cancel: () => console.log('取消分享')
};

/**
 * 初始化微信JSSDK
 * @param apiUrl 获取微信配置的接口地址
 */
export const initWxConfig = async (apiUrl: string | undefined) => {
  try {
    // 如果apiUrl未定义，使用默认值
    if (!apiUrl) {
      console.error('微信配置接口URL未提供');
      return false;
    }

    // 动态加载微信JS-SDK
    await loadWxSdk();
    
    // 获取当前URL，注意微信签名需要使用不包含hash的URL
    const currentUrl = window.location.href.split('#')[0];
    
    // 从后端获取微信配置(签名等信息)
    const response = await axios.get(apiUrl, {
      params: { url: currentUrl }
    });
    
    const wxConfig = response.data;
    
    // 配置微信JSSDK
    window.wx.config({
      debug: false,                  // 开发时可以设为true，会在微信客户端alert出签名信息
      appId: wxConfig.appId,         // 公众号的appId
      timestamp: wxConfig.timestamp, // 签名时间戳
      nonceStr: wxConfig.nonceStr,   // 签名随机串
      signature: wxConfig.signature, // 签名
      jsApiList: [                   // 需要使用的JS接口列表
        'updateAppMessageShareData',  // 分享给朋友
        'updateTimelineShareData',    // 分享到朋友圈
        'onMenuShareTimeline',        // 兼容旧版分享到朋友圈
        'onMenuShareAppMessage'       // 兼容旧版分享给朋友
      ]
    });
    
    // 注册微信JS-SDK准备就绪事件
    window.wx.ready(() => {
      console.log('微信JSSDK准备就绪');
    });
    
    // 注册微信JS-SDK错误事件
    window.wx.error((err: any) => {
      console.error('微信JSSDK配置失败:', err);
    });
    
    return true;
  } catch (error) {
    console.error('初始化微信配置失败:', error);
    return false;
  }
};

/**
 * 动态加载微信JSSDK
 */
const loadWxSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 如果已经加载过，直接返回
    if (window.wx) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

/**
 * 设置微信分享
 * @param config 分享配置
 */
export const setWxShare = (config: Partial<WxShareConfig> = {}) => {
  // 合并默认配置与传入的配置
  const shareConfig: WxShareConfig = { ...defaultConfig, ...config };
  
  try {
    if (!window.wx) {
      console.error('微信JSSDK未加载');
      return false;
    }
    
    // 使用新版接口
    window.wx.updateAppMessageShareData({
      title: shareConfig.title,
      desc: shareConfig.desc,
      link: shareConfig.link, 
      imgUrl: shareConfig.imgUrl,
      success: shareConfig.success,
      cancel: shareConfig.cancel
    });
    
    window.wx.updateTimelineShareData({
      title: shareConfig.title,
      link: shareConfig.link,
      imgUrl: shareConfig.imgUrl,
      success: shareConfig.success,
      cancel: shareConfig.cancel
    });
    
    // 兼容旧版接口
    if (window.wx.onMenuShareTimeline) {
      window.wx.onMenuShareTimeline({
        title: shareConfig.title,
        link: shareConfig.link,
        imgUrl: shareConfig.imgUrl,
        success: shareConfig.success,
        cancel: shareConfig.cancel
      });
    }
    
    if (window.wx.onMenuShareAppMessage) {
      window.wx.onMenuShareAppMessage({
        title: shareConfig.title,
        desc: shareConfig.desc,
        link: shareConfig.link,
        imgUrl: shareConfig.imgUrl,
        success: shareConfig.success,
        cancel: shareConfig.cancel
      });
    }
    
    return true;
  } catch (error) {
    console.error('设置微信分享失败:', error);
    return false;
  }
};

// 声明全局变量window.wx
declare global {
  interface Window {
    wx: any;
  }
}

// 导出默认配置，方便调用者根据需要修改
export const defaultShareConfig = defaultConfig; 