import { create } from 'zustand';
import { Howl } from 'howler';

interface AudioStore {
  sound: Howl | null;
  currentUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  setSound: (sound: Howl | null) => void;
  setCurrentUrl: (url: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  sound: null,
  currentUrl: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  setSound: (sound) => set({ sound }),
  setCurrentUrl: (url) => set({ currentUrl: url }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
}));

let soundInstance: Howl | null = null;
let progressInterval: number | null = null;

const clearProgressInterval = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
};

export const audioManager = {
  play: (url: string, volume?: number) => {
    const store = useAudioStore.getState();
    const vol = volume ?? store.volume;

    if (soundInstance) {
      soundInstance.stop();
      soundInstance.unload();
    }
    clearProgressInterval();

    const nextSound = new Howl({
      src: [url],
      html5: true,
      volume: vol,
      onplay: () => {
        if (soundInstance !== nextSound) return;
        useAudioStore.getState().setIsPlaying(true);
        useAudioStore.getState().setCurrentUrl(url);
        useAudioStore.getState().setDuration(nextSound.duration() || 0);
        clearProgressInterval();
        
        progressInterval = window.setInterval(() => {
          if (soundInstance === nextSound && nextSound.playing()) {
            useAudioStore.getState().setCurrentTime(nextSound.seek() as number);
          }
        }, 100);
      },
      onplayerror: () => {
        if (soundInstance !== nextSound) return;
        useAudioStore.getState().setIsPlaying(false);
        nextSound.once('unlock', () => {
          if (soundInstance === nextSound && !nextSound.playing()) {
            nextSound.play();
          }
        });
      },
      onpause: () => {
        useAudioStore.getState().setIsPlaying(false);
        clearProgressInterval();
      },
      onstop: () => {
        useAudioStore.getState().setIsPlaying(false);
        useAudioStore.getState().setCurrentTime(0);
        clearProgressInterval();
      },
      onend: () => {
        useAudioStore.getState().setIsPlaying(false);
        useAudioStore.getState().setCurrentTime(0);
        clearProgressInterval();
      },
      onload: () => {
        if (soundInstance === nextSound) {
          useAudioStore.getState().setDuration(nextSound.duration() || 0);
        }
      },
    });

    soundInstance = nextSound;
    useAudioStore.getState().setSound(nextSound);
    nextSound.play();
  },

  pause: () => {
    if (soundInstance) {
      soundInstance.pause();
    }
  },

  resume: () => {
    if (soundInstance) {
      soundInstance.play();
    }
  },

  stop: () => {
    if (soundInstance) {
      soundInstance.stop();
    }
    clearProgressInterval();
  },

  fadeOut: (duration: number) => {
    if (!soundInstance) return;
    const fadingSound = soundInstance;
    const startVolume = fadingSound.volume() as number;
    const startTime = Date.now();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newVolume = startVolume * (1 - progress);

      fadingSound.volume(newVolume);

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        fadingSound.stop();
        fadingSound.volume(startVolume);
      }
    };

    fade();
  },

  fadeIn: (duration: number) => {
    if (!soundInstance) return;
    const store = useAudioStore.getState();
    const targetVolume = store.volume;
    const startTime = Date.now();

    soundInstance.volume(0);
    soundInstance.play();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newVolume = targetVolume * progress;

      soundInstance?.volume(newVolume);

      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    };

    fade();
  },

  setVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    useAudioStore.getState().setVolume(clampedVolume);
    if (soundInstance) {
      soundInstance.volume(clampedVolume);
    }
  },

  seek: (time: number) => {
    if (soundInstance) {
      soundInstance.seek(time);
      useAudioStore.getState().setCurrentTime(time);
    }
  },
};
