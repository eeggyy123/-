import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

interface UseAudioPlayerReturn {
  play: (url: string) => void;
  pause: () => void;
  stop: () => void;
  fadeOut: (duration: number) => void;
  fadeIn: (duration: number) => void;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  setVolume: (volume: number) => void;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    let interval: number | undefined;
    if (soundRef.current && isPlaying) {
      interval = window.setInterval(() => {
        const seek = soundRef.current?.seek() || 0;
        setCurrentTime(seek);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const play = useCallback((url: string) => {
    if (soundRef.current) {
      soundRef.current.stop();
    }

    soundRef.current = new Howl({
      src: [url],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(soundRef.current?.duration() || 0);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
    });

    soundRef.current.play();
  }, [volume]);

  const pause = useCallback(() => {
    soundRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    soundRef.current?.stop();
  }, []);

  const fadeOut = useCallback((duration: number) => {
    if (!soundRef.current) return;
    const startVolume = volume;
    const startTime = Date.now();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newVolume = startVolume * (1 - progress);

      soundRef.current?.volume(newVolume);

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        soundRef.current?.stop();
        soundRef.current?.volume(volume);
      }
    };

    fade();
  }, [volume]);

  const fadeIn = useCallback((duration: number) => {
    if (!soundRef.current) return;
    const targetVolume = volume;
    const startTime = Date.now();

    soundRef.current.volume(0);
    soundRef.current.play();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newVolume = targetVolume * progress;

      soundRef.current?.volume(newVolume);

      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    };

    fade();
  }, [volume]);

  const setVolumeHandler = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    soundRef.current?.volume(clampedVolume);
  }, []);

  return {
    play,
    pause,
    stop,
    fadeOut,
    fadeIn,
    currentTime,
    duration,
    isPlaying,
    volume,
    setVolume: setVolumeHandler,
  };
};
