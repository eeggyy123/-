import React, { useEffect } from 'react';
import { Hand, Camera, CameraOff } from 'lucide-react';
import { useGestureControl } from '../hooks/useGestureControl';

interface GestureControlProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export const GestureControl: React.FC<GestureControlProps> = ({ onSwipe }) => {
  const { isEnabled, toggleGesture, direction, videoRef } = useGestureControl();

  useEffect(() => {
    if (direction) {
      onSwipe(direction);
    }
  }, [direction, onSwipe]);

  return (
    <div className="relative">
      {isEnabled && (
        <video
          ref={videoRef}
          className="absolute bottom-4 right-4 w-32 h-24 rounded-xl object-cover opacity-30 border-2 border-white/30"
          playsInline
        />
      )}

      <button
        onClick={toggleGesture}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isEnabled
            ? 'bg-ghibli-sunset text-white scale-110'
            : 'glass-effect text-white/80 hover:bg-white/20'
        }`}
      >
        {isEnabled ? (
          <Camera className="size-6" />
        ) : (
          <CameraOff className="size-6" />
        )}
      </button>

      {isEnabled && (
        <div className="fixed bottom-28 right-8 z-50 glass-effect rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 text-white mb-2">
            <Hand className="size-5 text-ghibli-sunset" />
            <span className="text-sm font-serif">手势控制已开启</span>
          </div>
          <p className="text-white/70 text-xs">
            向左或向右挥手切换电影卡片
          </p>
        </div>
      )}

      {direction && (
        <div
          className={`fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none ${
            direction === 'left' ? 'left-8' : 'right-8'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              direction === 'left'
                ? 'bg-ghibli-grass animate-slide-in-right'
                : 'bg-ghibli-sunset animate-slide-in-left'
            }`}
          >
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {direction === 'left' ? (
                <path d="M15 18l-6-6 6-6" />
              ) : (
                <path d="M9 18l6-6-6-6" />
              )}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
