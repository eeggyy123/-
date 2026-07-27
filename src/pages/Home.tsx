import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Sparkles, Music2, MousePointer2 } from 'lucide-react';
import { movies } from '../data/movies';
import { MovieCard } from '../components/MovieCard';
import { ParallaxBackground } from '../components/ParallaxBackground';
import { AudioPlayerComponent } from '../components/AudioPlayer';
import { GestureControl } from '../components/GestureControl';
import { VideoSection } from '../components/VideoSection';
import { useAppStore } from '../store/appStore';
import { useAudioStore, audioManager } from '../store/audioStore';

export const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const { showAudioPlayer, setShowAudioPlayer, setCurrentMovie } = useAppStore();
  const { isPlaying } = useAudioStore();

  const currentMovie = movies[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    }
  };

  const handlePlayMusic = useCallback(() => {
    const movieData = {
      ...currentMovie,
      soundtrack: '/music/summer.mp3',
      soundtrackName: '那个夏天',
    };
    setCurrentMovie(movieData);
    audioManager.play('/music/summer.mp3');
    setShowAudioPlayer(true);
    setShowMusicPrompt(false);
  }, [currentMovie, setCurrentMovie, setShowAudioPlayer]);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
        sessionStorage.removeItem('scrollPosition');
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('right');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!showAudioPlayer) {
      setCurrentMovie({
        ...currentMovie,
        soundtrack: '/music/summer.mp3',
        soundtrackName: '那个夏天',
      });
    }
  }, [currentMovie, setCurrentMovie, showAudioPlayer]);

  return (
    <div className="min-h-screen relative">
      <ParallaxBackground colors={currentMovie?.colorTheme} />

      <div className="relative z-10">
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/80">
            <Sparkles className="w-5 h-5 text-ghibli-sunset" />
            <span className="font-cursive text-lg">吉卜力工作室</span>
            <Sparkles className="w-5 h-5 text-ghibli-sunset" />
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 animate-slide-up">
            宫崎骏的世界
          </h1>
          
          <p className="font-cursive text-xl md:text-2xl text-white/80 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            沉浸在久石让的旋律中，探索经典动画的奇幻之旅
          </p>

          <div className="flex items-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handlePlayMusic}
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-ghibli-sunset to-ghibli-warm text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Music2 className="w-6 h-6 group-hover:animate-pulse" />
              <span>开启音乐之旅</span>
            </button>
            
            <a
              href="#movies"
              className="flex items-center gap-2 px-6 py-4 rounded-full glass-effect text-white font-semibold hover:bg-white/20 transition-all"
            >
              <MousePointer2 className="w-5 h-5" />
              <span>浏览电影</span>
            </a>
          </div>

          {showMusicPrompt && (
            <div className="glass-effect rounded-2xl p-6 max-w-md animate-fade-in">
              <p className="text-white/90 text-sm mb-4">
                🎵 点击上方按钮开始播放久石让经典配乐，体验沉浸式浏览
              </p>
              <p className="text-white/60 text-xs">
                支持手势控制：开启摄像头后，向左/右挥手切换电影卡片
              </p>
            </div>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 -translate-y-12 flex gap-2">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </section>

        <section id="movies" className="py-20 px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              经典电影
            </h2>
            <p className="font-cursive text-lg text-white/70">拖拽卡片或使用手势切换，点击查看详情</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={`animate-fade-in ${
                  index === currentIndex ? 'scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MovieCard
                  movie={movie}
                  isActive={index === currentIndex}
                  onDrag={handleSwipe}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-4 md:px-8 lg:px-16">
          <VideoSection />
        </section>

        <footer className="py-12 px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-white/60 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="font-cursive">吉卜力工作室 · 宫崎骏 · 久石让</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-white/40 text-xs">
            本网站仅供展示和欣赏，所有电影版权归吉卜力工作室所有
          </p>
        </footer>
      </div>

      {showAudioPlayer && (
        <AudioPlayerComponent onClose={() => setShowAudioPlayer(false)} />
      )}

      <GestureControl onSwipe={handleSwipe} />
    </div>
  );
};
