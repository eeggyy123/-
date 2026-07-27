import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, ChevronLeft, ChevronRight, Calendar, User, Music, Star } from 'lucide-react';
import { getMovieById } from '../data/movies';
import { ParallaxBackground } from '../components/ParallaxBackground';
import { MovieInteractiveContent } from '../components/MovieInteractiveContent';
import { VideoSection } from '../components/VideoSection';
import { useAudioStore, audioManager } from '../store/audioStore';
import { useAppStore } from '../store/appStore';

export const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStillIndex, setCurrentStillIndex] = useState(0);
  const { isPlaying, currentTime, duration, volume } = useAudioStore();
  const { setCurrentMovie, setShowAudioPlayer } = useAppStore();

  const movie = getMovieById(id || '');

  useEffect(() => {
    if (!movie) {
      navigate('/');
    }
  }, [movie, navigate]);

  useEffect(() => {
    if (movie && movie.soundtrack) {
      setCurrentMovie(movie);
      setShowAudioPlayer(true);
      audioManager.play(movie.soundtrack);
      
      const visitCount = parseInt(sessionStorage.getItem('movieVisitCount') || '0');
      sessionStorage.setItem('movieVisitCount', (visitCount + 1).toString());
    }
    
    return () => {
      audioManager.fadeOut(500);
    };
  }, [movie, setCurrentMovie, setShowAudioPlayer]);

  if (!movie) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioManager.pause();
    } else {
      audioManager.resume();
    }
  };

  const nextStill = () => {
    setCurrentStillIndex((prev) => (prev + 1) % movie.stills.length);
  };

  const prevStill = () => {
    setCurrentStillIndex((prev) => (prev - 1 + movie.stills.length) % movie.stills.length);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleBack = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigate('/');
  };

  return (
    <div className="min-h-screen relative">
      <ParallaxBackground colors={movie.colorTheme} />

      <div className="relative z-10">
        <button
          onClick={handleBack}
          className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={movie.stills[currentStillIndex] || movie.cover}
            alt={movie.title}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
            <button
              onClick={prevStill}
              className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextStill}
              className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              {movie.colorTheme.map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            <p className="font-cursive text-xl md:text-2xl text-white/70 mb-4">
              {movie.titleEn}
            </p>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-serif">{movie.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-serif">{movie.director}</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                <span className="font-serif">{movie.composer}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 md:right-10 flex gap-2">
            {movie.stills.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStillIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStillIndex
                    ? 'bg-white w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </section>

        <section className="py-12 px-4 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-effect rounded-3xl p-6 md:p-8">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-ghibli-sunset" />
                  剧情简介
                </h2>
                <p className="text-white/90 text-lg leading-relaxed font-serif">
                  {movie.synopsis}
                </p>
              </div>

              <MovieInteractiveContent movie={movie} />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {movie.stills.map((still, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setCurrentStillIndex(index)}
                  >
                    <img
                      src={still}
                      alt={`剧照 ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        剧照 {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <VideoSection movie={movie} />
            </div>

            <div className="space-y-6">
              <div className="glass-effect rounded-3xl p-6">
                <img
                  src={movie.cover}
                  alt={movie.title}
                  className="w-full aspect-[3/4] object-cover rounded-2xl mb-6"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-white">
                      {movie.soundtrackName}
                    </h3>
                    <p className="text-white/60 text-sm font-cursive">
                      {movie.composer}
                    </p>
                  </div>
                  <button
                    onClick={handleTogglePlay}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                      isPlaying
                        ? 'bg-ghibli-sunset text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7" />
                    ) : (
                      <Play className="w-7 h-7 ml-1" />
                    )}
                  </button>
                </div>
              </div>

              <div className="glass-effect rounded-3xl p-6">
                <h4 className="font-serif text-lg font-semibold text-white mb-4">
                  配乐播放
                </h4>
                <div className="space-y-4">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ghibli-sunset to-ghibli-warm rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-white/60" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => audioManager.setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:shadow-md"
                    />
                  </div>
                  <div className="flex items-end justify-center gap-1 h-6">
                    {[...Array(15)].map((_, i) => (
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

              <div className="glass-effect rounded-3xl p-6">
                <h4 className="font-serif text-lg font-semibold text-white mb-4">
                  电影信息
                </h4>
                <div className="space-y-3 text-white/80">
                  <div className="flex justify-between">
                    <span className="text-white/60">导演</span>
                    <span className="font-serif">{movie.director}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">配乐</span>
                    <span className="font-serif">{movie.composer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">年份</span>
                    <span className="font-serif">{movie.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 text-center">
          <p className="text-white/40 text-xs">
            返回首页继续探索其他电影
          </p>
        </footer>
      </div>
    </div>
  );
};
