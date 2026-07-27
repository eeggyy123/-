import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUp, ChevronDown, Compass, DoorOpen, Music2, Sparkles, TrainFront, Wind } from 'lucide-react';
import { movies } from '../data/movies';
import { MovieCard } from '../components/MovieCard';
import { ParallaxBackground } from '../components/ParallaxBackground';
import { AudioPlayerComponent } from '../components/AudioPlayer';
import { GestureControl } from '../components/GestureControl';
import { VideoSection } from '../components/VideoSection';
import { useAppStore } from '../store/appStore';
import { audioManager } from '../store/audioStore';
import { useJourneyStore } from '../store/journeyStore';
import { useTimeAtmosphere } from '../hooks/useTimeAtmosphere';
import { navigateWithWind } from '../lib/viewTransition';
import { JourneyLocationState } from '../lib/journeyNavigation';
import { WorldAtlas } from '../components/WorldAtlas';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { showAudioPlayer, setShowAudioPlayer, setCurrentMovie } = useAppStore();
  const { visitCount, lastMovieId, discoveries, unlockDiscovery } = useJourneyStore();
  const { phase, label: atmosphereLabel, greeting } = useTimeAtmosphere();
  const navigationState = location.state as JourneyLocationState | null;

  const currentMovie = movies[currentIndex];
  const windMovie = useMemo(() => movies.find((movie) => movie.id === 'the-wind-rises') || movies[0], []);
  const howlMovie = useMemo(() => movies.find((movie) => movie.id === 'howls-moving-castle') || movies[0], []);
  const spiritMovie = useMemo(() => movies.find((movie) => movie.id === 'spirited-away') || movies[0], []);
  const lastMovie = useMemo(
    () => movies.find((movie) => movie.id === lastMovieId),
    [lastMovieId],
  );

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((previous) => (previous + 1) % movies.length);
    } else {
      setCurrentIndex((previous) => (previous - 1 + movies.length) % movies.length);
    }
  }, []);

  const handlePlayMusic = useCallback(() => {
    const movieData = {
      ...currentMovie,
      soundtrack: '/music/summer.mp3',
      soundtrackName: '那个夏天',
    };
    setCurrentMovie(movieData);
    audioManager.play('/music/summer.mp3');
    setShowAudioPlayer(true);
    unlockDiscovery('first-breeze');
  }, [currentMovie, setCurrentMovie, setShowAudioPlayer, unlockDiscovery]);

  const enterMovieWorld = (movieId: string) => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigateWithWind(() => navigate(`/movie/${movieId}`, {
      state: { scrollTo: 'top' } satisfies JourneyLocationState,
    }));
  };

  const enterWindRoute = () => enterMovieWorld('the-wind-rises');

  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    const destination = navigationState?.scrollTo;
    const scrollToDestination = () => {
      if (destination && destination !== 'top') {
        const target = document.getElementById(destination);
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
          return;
        }
      }
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
        return;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    scrollToDestination();
    const frame = window.requestAnimationFrame(scrollToDestination);
    const timer = window.setTimeout(scrollToDestination, 100);
    sessionStorage.removeItem('scrollPosition');
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [location.key, navigationState?.scrollTo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') handleSwipe('right');
      if (event.key === 'ArrowRight') handleSwipe('left');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  useEffect(() => {
    if (showAudioPlayer) return;
    setCurrentMovie({
      ...currentMovie,
      soundtrack: '/music/summer.mp3',
      soundtrackName: '那个夏天',
    });
  }, [currentMovie, setCurrentMovie, showAudioPlayer]);

  return (
    <div className="relative min-h-screen text-white">
      <ParallaxBackground
        colors={currentMovie.colorTheme}
        image={currentMovie.stills[0] || currentMovie.cover}
        timePhase={phase}
      />

      <div className="relative z-10">
        <section id="home-top" className="hero-stage relative flex min-h-[86svh] scroll-mt-0 flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-24 text-center">
          <div className="absolute left-1/2 top-7 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap text-white/75">
            <Sparkles className="h-4 w-4 text-amber-200" />
            <span className="font-serif text-sm tracking-[0.22em]">STUDIO GHIBLI</span>
            <Sparkles className="h-4 w-4 text-amber-200" />
          </div>

          <div className="hero-copy max-w-5xl">
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-white/70">
              <Wind className="h-4 w-4" />
              <span>{atmosphereLabel}</span>
            </div>

            <h1 className="font-serif text-5xl font-semibold leading-[1.08] md:text-7xl lg:text-8xl">
              宫崎骏的世界
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-8 text-white/78 md:text-xl">
              {visitCount > 1 && lastMovie
                ? `风记得你。上次，你停在《${lastMovie.title}》的天空下。`
                : greeting}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePlayMusic}
                className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-amber-200 px-6 py-3 font-semibold text-slate-900 shadow-xl transition hover:bg-white"
              >
                <Music2 className="h-5 w-5" />
                <span>{discoveries.includes('first-breeze') ? '让旋律再次响起' : '听见第一阵风'}</span>
              </button>

              <a
                href="#movies"
                className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-white/30 bg-slate-950/25 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-slate-950/45"
              >
                <Compass className="h-5 w-5" />
                <span>进入电影世界</span>
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4">
            <p className="font-serif text-sm text-white/60">
              此刻的风来自《{currentMovie.title}》
            </p>
            <div className="flex max-w-[80vw] items-center gap-2">
              {movies.map((movie, index) => (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${index === currentIndex ? 'w-9 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'}`}
                  aria-label={`让风景切换到《${movie.title}》`}
                />
              ))}
            </div>
          </div>

          <ChevronDown className="absolute bottom-2 h-5 w-5 animate-bounce text-white/45" />
        </section>

        <section className="relative isolate min-h-[62vh] overflow-hidden border-y border-white/15" aria-label="风的第一封来信">
          <img src={windMovie.stills[1]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 wind-route-vignette" />
          <div className="relative mx-auto flex min-h-[62vh] max-w-6xl items-center px-6 py-16 md:px-10">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.22em] text-amber-100/80">
                <Wind className="h-4 w-4" />
                风的第一封来信
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">一架纸飞机，正在寻找没有写下的地址</h2>
              <p className="mt-6 max-w-xl font-serif text-base leading-8 text-white/70 md:text-lg">
                它会越过三部电影、海面和云层。旅程从《起风了》开始，而回信最终会落进你的手册。
              </p>
              <button
                type="button"
                onClick={enterWindRoute}
                className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-amber-100"
              >
                <span>{discoveries.includes('paper-plane') ? '回到纸飞机起飞的地方' : '阅读这封来信'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="relative isolate min-h-[58vh] overflow-hidden border-b border-white/15" aria-label="哈尔的移动城堡隐藏入口">
          <img src={howlMovie.stills[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/45" />
          <div className="absolute inset-0 secret-door-entry-vignette" />
          <div className="secret-door-glow" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[58vh] max-w-6xl items-center justify-end px-6 py-16 md:px-10">
            <div className="max-w-xl text-left">
              <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.22em] text-amber-100/80">
                <DoorOpen className="h-4 w-4" />
                城堡今晚停在地图之外
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">有一扇门，每次打开都不是同一个世界</h2>
              <p className="mt-6 max-w-lg font-serif text-base leading-8 text-white/70 md:text-lg">
                门把手藏着四种颜色。森林、潮汐、红翼与星夜，都在等待一次选择。
              </p>
              <button
                type="button"
                onClick={() => enterMovieWorld('howls-moving-castle')}
                className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg border border-amber-100/40 bg-slate-950/35 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-amber-100 hover:text-slate-900"
              >
                <span>{discoveries.includes('moving-door') ? '再次寻找移动的门' : '跟随城堡的脚步'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="relative isolate min-h-[58vh] overflow-hidden border-b border-white/15" aria-label="千与千寻水上列车隐藏入口">
          <img src={spiritMovie.stills[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#102b3c]/55" />
          <div className="absolute inset-0 water-entry-vignette" />
          <div className="water-entry-track" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="relative mx-auto flex min-h-[58vh] max-w-6xl items-center px-6 py-16 md:px-10">
            <div className="max-w-xl text-left">
              <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.22em] text-sky-100/80">
                <TrainFront className="h-4 w-4" />
                水面尽头传来第六站台的汽笛
              </p>
              <h2 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">有些列车不问终点，只问你想起了谁</h2>
              <p className="mt-6 max-w-lg font-serif text-base leading-8 text-white/70 md:text-lg">
                黄昏落进铁轨以后，一张没有日期的单程票会在汤屋外出现。
              </p>
              <button
                type="button"
                onClick={() => enterMovieWorld('spirited-away')}
                className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-sky-100 px-5 py-3 font-semibold text-slate-900 transition hover:bg-white"
              >
                <span>{discoveries.includes('water-rail-ticket') ? '回到水上列车' : '去听远处的汽笛'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <WorldAtlas />

        <section id="movies" className="px-4 py-20 md:px-8 lg:px-16">
          <div className="mx-auto mb-14 max-w-6xl border-b border-white/15 pb-8 text-left">
            <p className="mb-3 text-xs tracking-[0.2em] text-white/50">THIRTEEN WORLDS</p>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-serif text-4xl font-semibold md:text-5xl">十三个等待被记住的世界</h2>
              <div className="flex max-w-md flex-col items-start gap-4 md:items-end">
                <p className="font-serif text-sm leading-6 text-white/60">每一次停留，都会被风之手册记住。某些道路只有在第二次经过时才会出现。</p>
                <a
                  href="#home-top"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white hover:text-slate-900"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>回到风起处</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-[96rem] grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={`animate-fade-in ${index === currentIndex ? 'scale-[1.025]' : ''}`}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <MovieCard movie={movie} isActive={index === currentIndex} onDrag={handleSwipe} />
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 md:px-8 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <VideoSection />
          </div>
        </section>

        <footer className="border-t border-white/10 px-4 py-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-white/55">
            <Wind className="h-4 w-4" />
            <span className="font-serif text-sm">愿你在自己的风里，也能找到想去的地方</span>
          </div>
          <p className="text-xs text-white/35">本网站仅供展示和欣赏，所有电影版权归吉卜力工作室所有</p>
        </footer>
      </div>

      {showAudioPlayer && <AudioPlayerComponent onClose={() => setShowAudioPlayer(false)} />}
      <GestureControl onSwipe={handleSwipe} />
    </div>
  );
};
