// 默认音频资源
import bgmUrl from '@/assets/bgmusic.mp3';

// 音频资源配置
export const audioConfig = {
  // 背景音乐
  background: bgmUrl,
  
  // 效果音
  effects: {
    // 游戏完成音效
    complete: bgmUrl,
    // 点击音效
    click: bgmUrl,
    // 提示音效
    hint: bgmUrl
  }
};

// 获取音频资源URL
export function getAudioUrl(key: string): string {
  if (key.includes('.')) {
    // 处理类似 'effects.click' 的嵌套键
    const parts = key.split('.');
    let current: any = audioConfig;
    
    for (const part of parts) {
      if (current[part] === undefined) {
        console.warn(`[AudioConfig] 找不到音频资源: ${key}`);
        return '';
      }
      current = current[part];
    }
    
    return current;
  }
  
  // 处理顶级键
  if (audioConfig[key as keyof typeof audioConfig]) {
    return audioConfig[key as keyof typeof audioConfig] as string;
  }
  
  console.warn(`[AudioConfig] 找不到音频资源: ${key}`);
  return '';
}

export default audioConfig; 