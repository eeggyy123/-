import React, { useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Music2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAudioStore, audioManager } from '../store/audioStore';

interface AudioPlayerProps {
  onClose: () => void;
}

export const AudioPlayerComponent: React.FC<AudioPlayerProps> = ({ onClose }) => {
  const { currentMovie } = useAppStore();
  const { isPlaying, currentTime, duration, volume } = useAudioStore();

  const handleTogglePlay = useCallback(() => {
    if (!currentMovie?.soundtrack) return;
    
    if (isPlaying) {
      audioManager.pause();
    } else {
      audioManager.resume();
    }
  }, [isPlaying, currentMovie]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentMovie) return null;

  const isBackgroundMusic = currentMovie.soundtrack === '/music/summer.mp3';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="glass-effect rounded-3xl p-4 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-16 rounded-xl shadow-lg bg-gradient-to-br from-ghibli-sunset to-ghibli-warm flex items-center justify-center">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-serif text-white font-semibold text-sm">
                {isBackgroundMusic ? '宫崎骏的世界' : currentMovie.title}
              </h4>
              <p className="text-white/70 text-xs font-cursive">
                {currentMovie.soundtrackName} - 久石让
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="text-white" size={24} />
            ) : (
              <Play className="text-white" size={24} />
            )}
          </button>

          <div className="flex-1">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-ghibli-sunset to-ghibli-warm rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {volume > 0 ? (
              <Volume2 className="text-white/60" size={18} />
            ) : (
              <VolumeX className="text-white/60" size={18} />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => audioManager.setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>
        </div>

        <div className="flex items-end justify-center gap-1 mt-4 h-8">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-white/40 rounded-full music-wave-bar"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                animationDelay: `${i * 0.05}s`,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
