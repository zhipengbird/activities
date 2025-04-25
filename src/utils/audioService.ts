import { ref } from 'vue';
import { audioConfig } from './audioConfig';

// 用于本地存储的key
const AUDIO_STATE_KEY = 'puzzle_audio_state';

// 音频事件类型
export type AudioEventType = 'play' | 'pause' | 'volumechange' | 'mute' | 'unmute';

// 事件回调函数类型
export type AudioEventCallback = (state: AudioState) => void;

// 音频状态接口
export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  audioUrl: string;
}

// 单例音频服务类
export class AudioService {
  private static instance: AudioService;
  private audio: HTMLAudioElement | null = null;
  
  // 状态管理
  private _isPlaying = ref(false);
  private _isMuted = ref(false);
  private _volume = ref(0.8);
  private _audioUrl = ref(audioConfig.background);
  
  // 事件监听器
  private eventListeners: Record<AudioEventType, Set<AudioEventCallback>> = {
    play: new Set(),
    pause: new Set(),
    volumechange: new Set(),
    mute: new Set(),
    unmute: new Set()
  };
  
  private constructor() {
    this.initAudio();
    // 监听存储变化，实现多页面同步
    window.addEventListener('storage', this.handleStorageChange);
  }
  
  // 获取单例实例
  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      console.log('[AudioService] 创建新的音频服务实例');
      AudioService.instance = new AudioService();
    } else {
      console.log('[AudioService] 返回已存在的音频服务实例');
    }
    return AudioService.instance;
  }
  
  // 初始化音频元素
  private initAudio() {
    // 如果已经初始化过，则跳过
    if (this.audio) {
      console.log('[AudioService] 音频服务已初始化，跳过初始化过程');
      return;
    }
    
    console.log('[AudioService] 开始初始化音频服务');
    
    // 停止所有其他音频
    AudioService.stopAllAudio();
    
    // 加载之前保存的音频状态
    this.loadAudioState();
    
    // 创建新的音频元素
    console.log('[AudioService] 创建新的音频元素');
    this.audio = new Audio(this._audioUrl.value);
    this.audio.loop = true;
    
    // 错误处理
    this.audio.onerror = (error) => {
      console.error('[AudioService] 音频加载出错:', error);
      // 如果加载出错，设置为不播放状态
      this._isPlaying.value = false;
      this.saveAudioState();
    };
    
    // 应用设置
    if (this.audio) {
      console.log('[AudioService] 应用音频设置');
      this.audio.muted = this._isMuted.value;
      this.audio.volume = this._volume.value;
      
      // 根据加载的状态决定是否播放
      if (this._isPlaying.value) {
        console.log('[AudioService] 根据存储状态开始播放');
        // 保存当前状态为false，因为自动播放可能失败
        const originalState = this._isPlaying.value;
        this._isPlaying.value = false;
        
        // 尝试播放，但不进行状态更新
        this.audio.play().then(() => {
          // 播放成功，恢复原始状态
          this._isPlaying.value = originalState;
          this.notifyListeners('play');
        }).catch(error => {
          console.warn('[AudioService] 初始化时播放失败:', error);
          // 保持为false，并保存状态
          this._isPlaying.value = false;
          this.saveAudioState();
        });
      } else {
        console.log('[AudioService] 根据存储状态保持暂停');
      }
    }
    
    console.log('[AudioService] 音频服务初始化完成');
  }
  
  // 从本地存储加载音频状态
  private loadAudioState() {
    try {
      // 从localStorage获取之前保存的状态
      const audioStateJSON = localStorage.getItem(AUDIO_STATE_KEY);
      console.log('[AudioService] 加载音频状态:', audioStateJSON);
      
      if (audioStateJSON) {
        const audioState = JSON.parse(audioStateJSON);
        
        // 应用已保存的状态
        if (typeof audioState.isPlaying === 'boolean') {
          this._isPlaying.value = audioState.isPlaying;
        }
        
        if (typeof audioState.isMuted === 'boolean') {
          this._isMuted.value = audioState.isMuted;
        }
        
        if (typeof audioState.volume === 'number' && audioState.volume >= 0 && audioState.volume <= 1) {
          this._volume.value = audioState.volume;
        }
        
        // 应用音频URL
        if (audioState.audioUrl) {
          this._audioUrl.value = audioState.audioUrl;
        }
        
        console.log('[AudioService] 已加载音频状态:', this.getAudioState());
      } else {
        // 首次加载时默认设置为播放状态
        console.log('[AudioService] 未找到存储的音频状态，使用默认值，首次加载设置为播放状态');
        this._isPlaying.value = true;
      }
    } catch (error) {
      console.error('[AudioService] 加载音频状态失败:', error);
    }
  }
  
  // 保存音频状态到本地存储
  private saveAudioState() {
    try {
      // 构建要保存的状态对象
      const audioState = {
        isPlaying: this._isPlaying.value,
        isMuted: this._isMuted.value,
        volume: this._volume.value,
        audioUrl: this._audioUrl.value
      };
      
      const audioStateJSON = JSON.stringify(audioState);
      localStorage.setItem(AUDIO_STATE_KEY, audioStateJSON);
      console.log('[AudioService] 保存音频状态:', audioStateJSON);
    } catch (error) {
      console.error('[AudioService] 保存音频状态失败:', error);
    }
  }
  
  // 处理存储变化事件，用于跨页面同步
  private handleStorageChange = (event: StorageEvent) => {
    if (event.key !== AUDIO_STATE_KEY || !event.newValue) return;
    
    try {
      console.log('[AudioService] 检测到存储变化:', event.newValue);
      const newState = JSON.parse(event.newValue) as AudioState;
      
      // 应用新状态，但不保存（避免循环保存）
      if (this._isPlaying.value !== newState.isPlaying) {
        // 播放状态变化
        if (newState.isPlaying) {
          this.playWithoutSave();
        } else {
          this.pauseWithoutSave();
        }
      }
      
      // 应用静音状态
      if (this._isMuted.value !== newState.isMuted) {
        this.setMuteWithoutSave(newState.isMuted);
      }
      
      // 应用音量
      if (this._volume.value !== newState.volume) {
        this.setVolumeWithoutSave(newState.volume);
      }
      
      // 应用音频URL
      if (this._audioUrl.value !== newState.audioUrl && newState.audioUrl) {
        this.setAudioUrl(newState.audioUrl, false);
      }
    } catch (error) {
      console.error('[AudioService] 处理存储变化失败:', error);
    }
  };
  
  // 停止页面中的所有音频
  public static stopAllAudio() {
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
    });
  }
  
  // 获取当前音频状态
  public getAudioState(): AudioState {
    return {
      isPlaying: this._isPlaying.value,
      isMuted: this._isMuted.value,
      volume: this._volume.value,
      audioUrl: this._audioUrl.value
    };
  }
  
  // 播放音频
  public play(): Promise<void> {
    if (!this.audio) {
      this.initAudio();
    }
    
    console.log('[AudioService] 播放音频');
    
    // 只有当前没有播放时才尝试播放
    if (!this._isPlaying.value && this.audio) {
      return this.audio.play()
        .then(() => {
          this._isPlaying.value = true;
          this.notifyListeners('play');
          this.saveAudioState();
        })
        .catch(error => {
          console.error('[AudioService] 播放失败:', error);
          throw error; // 重新抛出错误，让调用者知道播放失败
        });
    }
    
    // 如果已经在播放，返回一个已解决的Promise
    return Promise.resolve();
  }
  
  // 不保存状态的播放（用于同步）
  private playWithoutSave() {
    if (!this.audio) {
      this.initAudio();
    }
    
    console.log('[AudioService] 播放音频（不保存状态）');
    
    if (this.audio) {
      this.audio.play().then(() => {
        this._isPlaying.value = true;
        this.notifyListeners('play');
      }).catch(error => {
        console.error('[AudioService] 播放失败:', error);
      });
    }
  }
  
  // 暂停音频
  public pause() {
    console.log('[AudioService] 暂停音频');
    
    if (this.audio && this._isPlaying.value) {
      this.audio.pause();
      this._isPlaying.value = false;
      this.notifyListeners('pause');
      this.saveAudioState();
    }
  }
  
  // 不保存状态的暂停（用于同步）
  private pauseWithoutSave() {
    console.log('[AudioService] 暂停音频（不保存状态）');
    
    if (this.audio) {
      this.audio.pause();
      this._isPlaying.value = false;
      this.notifyListeners('pause');
    }
  }
  
  // 切换播放/暂停
  public toggle() {
    if (this._isPlaying.value) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  // 设置音频URL
  public setAudioUrl(url: string, save: boolean = true) {
    if (this._audioUrl.value !== url) {
      console.log(`[AudioService] 设置音频URL: ${url}`);
      
      // 保存当前的播放状态
      const wasPlaying = this._isPlaying.value;
      
      // 暂停当前播放
      if (this.audio) {
        this.audio.pause();
      }
      
      // 更新URL
      this._audioUrl.value = url;
      
      // 重新创建音频元素
      if (this.audio) {
        this.audio.src = url;
        this.audio.load();
        
        // 设置音量和静音状态
        this.audio.volume = this._volume.value;
        this.audio.muted = this._isMuted.value;
        
        // 如果之前在播放，则继续播放
        if (wasPlaying) {
          this.audio.play().catch(error => {
            console.error('[AudioService] 更换音频后播放失败:', error);
            this._isPlaying.value = false;
          });
        }
      }
      
      if (save) {
        this.saveAudioState();
      }
    }
  }
  
  // 设置音量
  public setVolume(volume: number) {
    // 确保音量在有效范围内
    const validVolume = Math.max(0, Math.min(1, volume));
    
    if (this._volume.value !== validVolume) {
      console.log(`[AudioService] 设置音量: ${validVolume}`);
      this._volume.value = validVolume;
      
      if (this.audio) {
        this.audio.volume = validVolume;
      }
      
      this.notifyListeners('volumechange');
      this.saveAudioState();
    }
  }
  
  // 不保存状态的设置音量（用于同步）
  private setVolumeWithoutSave(volume: number) {
    const validVolume = Math.max(0, Math.min(1, volume));
    
    if (this._volume.value !== validVolume) {
      console.log(`[AudioService] 设置音量（不保存状态）: ${validVolume}`);
      this._volume.value = validVolume;
      
      if (this.audio) {
        this.audio.volume = validVolume;
      }
      
      this.notifyListeners('volumechange');
    }
  }
  
  // 设置静音
  public setMute(muted: boolean) {
    if (this._isMuted.value !== muted) {
      console.log(`[AudioService] 设置静音: ${muted}`);
      this._isMuted.value = muted;
      
      if (this.audio) {
        this.audio.muted = muted;
      }
      
      this.notifyListeners(muted ? 'mute' : 'unmute');
      this.saveAudioState();
    }
  }
  
  // 不保存状态的设置静音（用于同步）
  private setMuteWithoutSave(muted: boolean) {
    if (this._isMuted.value !== muted) {
      console.log(`[AudioService] 设置静音（不保存状态）: ${muted}`);
      this._isMuted.value = muted;
      
      if (this.audio) {
        this.audio.muted = muted;
      }
      
      this.notifyListeners(muted ? 'mute' : 'unmute');
    }
  }
  
  // 切换静音状态
  public toggleMute() {
    this.setMute(!this._isMuted.value);
  }
  
  // 添加事件监听器
  public addEventListener(type: AudioEventType, callback: AudioEventCallback) {
    this.eventListeners[type].add(callback);
    return () => this.removeEventListener(type, callback);
  }
  
  // 移除事件监听器
  public removeEventListener(type: AudioEventType, callback: AudioEventCallback) {
    this.eventListeners[type].delete(callback);
  }
  
  // 通知所有监听器
  private notifyListeners(type: AudioEventType) {
    const currentState = this.getAudioState();
    this.eventListeners[type].forEach(callback => {
      try {
        callback(currentState);
      } catch (error) {
        console.error(`[AudioService] 调用${type}事件监听器出错:`, error);
      }
    });
  }
  
  // 获取属性
  get isPlaying() {
    return this._isPlaying.value;
  }
  
  get isMuted() {
    return this._isMuted.value;
  }
  
  get volume() {
    return this._volume.value;
  }
  
  get audioUrl() {
    return this._audioUrl.value;
  }
  
  // 清理资源
  public dispose() {
    console.log('[AudioService] 清理音频服务');
    
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.remove();
      this.audio = null;
    }
    
    window.removeEventListener('storage', this.handleStorageChange);
    
    // 清空所有事件监听器
    Object.keys(this.eventListeners).forEach(key => {
      this.eventListeners[key as AudioEventType].clear();
    });
  }
}

// 创建音频服务组合函数，便于在Vue组件中使用
export function useAudioService() {
  const audioService = AudioService.getInstance();
  
  return {
    audioService,
    play: () => audioService.play(),
    pause: () => audioService.pause(),
    toggle: () => audioService.toggle(),
    setMute: (muted: boolean) => audioService.setMute(muted),
    toggleMute: () => audioService.toggleMute(),
    setVolume: (volume: number) => audioService.setVolume(volume),
    setAudioUrl: (url: string) => audioService.setAudioUrl(url),
    isPlaying: audioService.isPlaying,
    isMuted: audioService.isMuted,
    volume: audioService.volume,
    audioUrl: audioService.audioUrl,
    getAudioState: () => audioService.getAudioState()
  };
}

// 创建默认实例
const defaultAudioService = AudioService.getInstance();
export default defaultAudioService; 