import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { House, Play, Pause, Volume2, ChevronLeft, ChevronRight, Calendar, User, Music, Star } from 'lucide-react';
import { getMovieById, Movie } from '../data/movies';
import { ParallaxBackground } from '../components/ParallaxBackground';
import { MovieInteractiveContent } from '../components/MovieInteractiveContent';
import { VideoSection } from '../components/VideoSection';
import { WindRoutePortal } from '../components/WindRoutePortal';
import { HowlMagicDoor } from '../components/HowlMagicDoor';
import { SpiritTrainJourney } from '../components/SpiritTrainJourney';
import { ReturnPassage } from '../components/ReturnPassage';
import { MovieDayImmersion } from '../components/MovieDayImmersion';
import { MovieQuotes } from '../components/MovieQuotes';
import { useAudioStore, audioManager } from '../store/audioStore';
import { useAppStore } from '../store/appStore';
import { useJourneyStore } from '../store/journeyStore';
import { useTimeAtmosphere } from '../hooks/useTimeAtmosphere';
import { navigateWithWind } from '../lib/viewTransition';
import { JourneyLocationState, JourneyPassage } from '../lib/journeyNavigation';

const getDefaultReturnPassage = (movie: Movie): JourneyPassage => {
  const routeTargets: Record<string, Pick<JourneyPassage, 'kind' | 'returnAnchor' | 'returnLabel' | 'returnPath'>> = {
    'the-wind-rises': {
      kind: 'home',
      returnPath: '/',
      returnAnchor: 'wind-letter',
      returnLabel: '回到纸飞机起飞处',
    },
    'porco-rosso': {
      kind: 'wind-route',
      returnPath: '/movie/the-wind-rises',
      returnAnchor: 'top',
      returnLabel: '返回《起风了》的航线',
    },
    'castle-in-the-sky': {
      kind: 'wind-route',
      returnPath: '/movie/porco-rosso',
      returnAnchor: 'top',
      returnLabel: '返回《红猪》的航线',
    },
    'howls-moving-castle': {
      kind: 'home',
      returnPath: '/',
      returnAnchor: 'howl-door-entry',
      returnLabel: '回到移动城堡入口',
    },
    'spirited-away': {
      kind: 'home',
      returnPath: '/',
      returnAnchor: 'water-train-entry',
      returnLabel: '回到第六站台入口',
    },
    'only-yesterday': {
      kind: 'water-train',
      returnPath: '/movie/spirited-away',
      returnAnchor: 'top',
      returnLabel: '返回千寻的第六站台',
    },
  };
  const target = routeTargets[movie.id] || {
    kind: 'home' as const,
    returnPath: '/',
    returnAnchor: 'movies',
    returnLabel: '回到十三个电影世界',
  };

  return {
    id: `default-return-${movie.id}`,
    kind: target.kind,
    eyebrow: '旅程的上一页仍替你保留',
    title: `看完《${movie.title}》，沿来路继续未完成的探索`,
    description: '返程入口留在页面最下方。浏览完这一页，再回到刚才经过的电影或主页入口。',
    returnLabel: target.returnLabel,
    returnPath: target.returnPath,
    returnAnchor: target.returnAnchor,
  };
};

export const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStillIndex, setCurrentStillIndex] = useState(0);
  const { isPlaying, currentTime, duration, volume } = useAudioStore();
  const { setCurrentMovie, setShowAudioPlayer } = useAppStore();
  const { markMovieVisited } = useJourneyStore();
  const { phase } = useTimeAtmosphere();

  const movie = getMovieById(id || '');
  const navigationState = location.state as JourneyLocationState | null;

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (!movie) return;

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    const scrollToDestination = () => {
      const requestedDestination = navigationState?.scrollTo;
      const shouldStartAtTop = !requestedDestination
        || requestedDestination === 'top'
        || ['wind-route', 'water-train'].includes(requestedDestination);

      if (!shouldStartAtTop && requestedDestination) {
        const target = document.getElementById(requestedDestination);
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    scrollToDestination();
    const frame = window.requestAnimationFrame(scrollToDestination);
    let lateFrame = 0;
    const settledFrame = window.requestAnimationFrame(() => {
      lateFrame = window.requestAnimationFrame(scrollToDestination);
    });
    const settleTimer = window.setTimeout(() => {
      scrollToDestination();
      root.style.scrollBehavior = previousScrollBehavior;
    }, 100);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settledFrame);
      window.cancelAnimationFrame(lateFrame);
      window.clearTimeout(settleTimer);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [location.key, movie, navigationState?.scrollTo]);

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
      markMovieVisited(movie.id);
      
      const visitCount = parseInt(sessionStorage.getItem('movieVisitCount') || '0');
      sessionStorage.setItem('movieVisitCount', (visitCount + 1).toString());
    }
    
    return () => {
      audioManager.fadeOut(500);
    };
  }, [markMovieVisited, movie, setCurrentMovie, setShowAudioPlayer]);

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
  const fallbackPassage = getDefaultReturnPassage(movie);
  const detailBackgroundImage = movie.id === 'spirited-away'
    ? movie.stills[currentStillIndex] || movie.cover
    : movie.background || movie.stills[currentStillIndex] || movie.cover;

  const handleHome = () => {
    navigateWithWind(() => navigate('/'));
  };

  return (
    <div className="min-h-screen relative page-cinematic-enter">
      <ParallaxBackground
        colors={movie.colorTheme}
        image={detailBackgroundImage}
        timePhase={phase}
      />

      <div className="relative z-10">
        <nav className="fixed left-5 top-5 z-[150] flex items-center gap-2" aria-label="电影世界导航">
          <button
            type="button"
            onClick={handleHome}
            className="glass-effect flex h-12 w-12 items-center justify-center rounded-lg text-white transition-all hover:scale-105 hover:bg-white/20"
            aria-label="返回主页"
            title="返回主页"
          >
            <House className="h-5 w-5" />
          </button>
        </nav>

        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={movie.stills[currentStillIndex] || movie.cover}
            alt={movie.title}
            className="w-full h-full object-cover transition-all duration-700"
            style={{ viewTransitionName: 'movie-poster' }}
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

        <section id="movie-details" className="scroll-mt-4 py-12 px-4 md:px-10 lg:px-20">
          <div className="mx-auto max-w-6xl space-y-8">
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

              <MovieQuotes movie={movie} />

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

              <div className="mx-auto max-w-2xl space-y-5">
                <figure className="glass-effect relative overflow-hidden rounded-3xl p-4 md:p-6" aria-label={`${movie.title}电影海报`}>
                  <div className="relative mx-auto overflow-hidden rounded-2xl">
                    <img
                      src={movie.cover}
                      alt={`${movie.title}海报`}
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <figcaption className="absolute bottom-5 left-5 right-24 text-white md:bottom-7 md:left-7">
                      <p className="mb-2 text-xs text-white/55">原声留声机</p>
                      <h3 className="font-serif text-2xl font-semibold md:text-3xl">{movie.soundtrackName}</h3>
                      <p className="mt-1 font-cursive text-sm text-white/65">{movie.composer}</p>
                    </figcaption>
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? '暂停电影配乐' : '播放电影配乐'}
                    className={`absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-110 md:bottom-7 md:right-7 md:h-16 md:w-16 ${
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
                </figure>

                <section className="glass-effect rounded-3xl p-6 md:p-8" aria-labelledby="soundtrack-progress-title">
                  <h4 id="soundtrack-progress-title" className="font-serif text-lg font-semibold text-white mb-4">
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
                        aria-label="配乐音量"
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
                            height: `${22 + ((i * 37) % 68)}%`,
                            animationDelay: `${i * 0.05}s`,
                            animationPlayState: isPlaying ? 'running' : 'paused',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                <section className="glass-effect rounded-3xl p-6 md:p-8" aria-labelledby="movie-information-title">
                  <h4 id="movie-information-title" className="font-serif text-lg font-semibold text-white mb-5">
                    电影信息
                  </h4>
                  <div className="grid gap-5 text-white/80 sm:grid-cols-3">
                    <div className="flex justify-between gap-4 sm:block">
                      <span className="text-white/60">导演</span>
                      <p className="font-serif sm:mt-2">{movie.director}</p>
                    </div>
                    <div className="flex justify-between gap-4 sm:block">
                      <span className="text-white/60">配乐</span>
                      <p className="font-serif sm:mt-2">{movie.composer}</p>
                    </div>
                    <div className="flex justify-between gap-4 sm:block">
                      <span className="text-white/60">年份</span>
                      <p className="font-serif sm:mt-2">{movie.year}</p>
                    </div>
                  </div>
                </section>
                </div>

              <VideoSection movie={movie} />
          </div>
        </section>

        <MovieDayImmersion movie={movie} />

        <WindRoutePortal key={`wind-route-${movie.id}`} movie={movie} />
        <HowlMagicDoor key={`magic-door-${movie.id}`} movie={movie} />
        <SpiritTrainJourney key={`water-train-${movie.id}`} movie={movie} />

        <ReturnPassage fallbackPassage={fallbackPassage} />

        <footer className="py-8 px-4 text-center">
          <p className="text-white/40 text-xs">
            返回首页继续探索其他电影
          </p>
        </footer>
      </div>
    </div>
  );
};
