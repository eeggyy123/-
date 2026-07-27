import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, LockKeyhole, Map, Sparkles, Wind } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import { JourneyLocationState } from '../lib/journeyNavigation';
import { navigateWithWind } from '../lib/viewTransition';
import { useJourneyStore } from '../store/journeyStore';

interface AtlasPoint {
  id: string;
  x: number;
  y: number;
  mobileX: number;
  mobileY: number;
}

const atlasPoints: AtlasPoint[] = [
  { id: 'the-wind-rises', x: 12, y: 22, mobileX: 17, mobileY: 9 },
  { id: 'porco-rosso', x: 31, y: 13, mobileX: 50, mobileY: 6 },
  { id: 'castle-in-the-sky', x: 50, y: 9, mobileX: 83, mobileY: 9 },
  { id: 'howls-moving-castle', x: 70, y: 18, mobileX: 16, mobileY: 27 },
  { id: 'the-boy-and-the-heron', x: 90, y: 11, mobileX: 84, mobileY: 27 },
  { id: 'my-neighbor-totoro', x: 10, y: 56, mobileX: 15, mobileY: 45 },
  { id: 'kiki-delivery-service', x: 28, y: 42, mobileX: 85, mobileY: 45 },
  { id: 'spirited-away', x: 51, y: 70, mobileX: 16, mobileY: 64 },
  { id: 'ponyo', x: 72, y: 66, mobileX: 84, mobileY: 64 },
  { id: 'whisper-of-the-heart', x: 91, y: 54, mobileX: 16, mobileY: 83 },
  { id: 'nausicaa', x: 23, y: 82, mobileX: 50, mobileY: 91 },
  { id: 'princess-mononoke', x: 38, y: 91, mobileX: 84, mobileY: 83 },
  { id: 'only-yesterday', x: 86, y: 90, mobileX: 50, mobileY: 29 },
];

const pointById = Object.fromEntries(atlasPoints.map((point) => [point.id, point]));

const atlasLinks = [
  ['the-wind-rises', 'porco-rosso', 'wind'],
  ['porco-rosso', 'castle-in-the-sky', 'wind'],
  ['howls-moving-castle', 'my-neighbor-totoro', 'door'],
  ['howls-moving-castle', 'ponyo', 'door'],
  ['howls-moving-castle', 'porco-rosso', 'door'],
  ['howls-moving-castle', 'the-boy-and-the-heron', 'door'],
  ['spirited-away', 'whisper-of-the-heart', 'train'],
] as const;

export const WorldAtlas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stationMessage, setStationMessage] = useState(false);
  const {
    visitedMovies,
    discoveries,
    completedRoutes,
    openedDoors,
    trainTickets,
    lastMovieId,
    unlockDiscovery,
    markPassageReturned,
  } = useJourneyStore();
  const navigationState = location.state as JourneyLocationState | null;
  const returnPassage = navigationState?.passage?.kind === 'world-map' ? navigationState.passage : null;

  const seals = [
    { label: '云上来信', complete: completedRoutes.includes('wind-route') },
    { label: '两色门印', complete: openedDoors.length >= 2 },
    { label: '无终点车票', complete: trainTickets > 0 },
  ];
  const completedSeals = seals.filter((seal) => seal.complete).length;
  const stationReady = completedSeals === seals.length;
  const stationAwake = discoveries.includes('crosswind-station');

  const nextUnvisitedMovie = useMemo(
    () => movies.find((movie) => !visitedMovies.includes(movie.id))
      || movies.find((movie) => movie.id === lastMovieId)
      || movies[0],
    [lastMovieId, visitedMovies],
  );

  const travelToMovie = (movieId: string, fromStation = false) => {
    const destination = movies.find((movie) => movie.id === movieId);
    if (!destination) return;
    sessionStorage.removeItem('scrollPosition');
    navigateWithWind(() => navigate(`/movie/${movieId}`, {
      state: {
        scrollTo: 'top',
        passage: {
          id: `world-map-${movieId}`,
          kind: 'world-map',
          eyebrow: fromStation ? '中转站替风做了选择' : '星图仍亮着来时的坐标',
          title: `《${destination.title}》与风之星图之间，多了一条路`,
          description: '看完这一页故事，沿着发光的坐标就能回到十三个世界之间。',
          returnLabel: '返回风之星图',
          returnPath: '/',
          returnAnchor: 'world-atlas',
        },
      } satisfies JourneyLocationState,
    }));
  };

  const handleStation = () => {
    if (!stationReady) return;
    if (!stationAwake) {
      unlockDiscovery('crosswind-station');
      setStationMessage(true);
      return;
    }
    travelToMovie(nextUnvisitedMovie.id, true);
  };

  const handleReturn = () => {
    if (!returnPassage) return;
    markPassageReturned(returnPassage.id);
    navigateWithWind(() => navigate(returnPassage.returnPath, {
      state: { scrollTo: returnPassage.returnAnchor } satisfies JourneyLocationState,
    }));
  };

  return (
    <section id="world-atlas" className="world-atlas relative isolate overflow-hidden border-y border-white/15 bg-[#101d25] px-4 py-20 text-white md:px-8" aria-label="风之星图">
      <div className="world-atlas-sky" aria-hidden="true" />
      <div className="relative mx-auto max-w-[90rem]">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-amber-100/75">
            <Map className="h-4 w-4" />
            <span className="text-xs tracking-[0.22em]">THE ATLAS REMEMBERS</span>
          </div>
          <h2 className="font-serif text-4xl font-semibold md:text-6xl">风之星图</h2>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-base leading-8 text-white/60 md:text-lg">
            到访过的世界会留下光，走通过的道路会变成线。地图中央还有一个从未印在时刻表上的地方。
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/50">
            <span>{visitedMovies.length} / {movies.length} 个世界亮起</span>
            {seals.map((seal) => (
              <span key={seal.label} className={`inline-flex items-center gap-1.5 ${seal.complete ? 'text-amber-100/80' : ''}`}>
                {seal.complete ? <Check className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                {seal.label}
              </span>
            ))}
          </div>
          {returnPassage && (
            <button
              type="button"
              onClick={handleReturn}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/25 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{returnPassage.returnLabel}</span>
            </button>
          )}
        </header>

        <div className="world-atlas-canvas" aria-label="十三个电影世界的星图">
          <svg className="world-atlas-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {atlasLinks.map(([fromId, toId, kind]) => {
              const from = pointById[fromId];
              const to = pointById[toId];
              const active = visitedMovies.includes(fromId) && visitedMovies.includes(toId);
              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={`world-atlas-line world-atlas-line-${kind} ${active ? 'is-active' : ''}`}
                />
              );
            })}
          </svg>

          {atlasPoints.map((point) => {
            const movie = movies.find((candidate) => candidate.id === point.id);
            if (!movie) return null;
            const visited = visitedMovies.includes(movie.id);
            const isLast = lastMovieId === movie.id;
            const style = {
              '--atlas-x': `${point.x}%`,
              '--atlas-y': `${point.y}%`,
              '--atlas-mobile-x': `${point.mobileX}%`,
              '--atlas-mobile-y': `${point.mobileY}%`,
            } as React.CSSProperties;
            return (
              <button
                key={movie.id}
                type="button"
                onClick={() => travelToMovie(movie.id)}
                className={`world-atlas-node ${visited ? 'is-visited' : ''} ${isLast ? 'is-last' : ''}`}
                style={style}
                aria-label={`${visited ? '重返' : '探索'}《${movie.title}》`}
              >
                <span className="world-atlas-node-image">
                  <img src={movie.cover} alt="" />
                  {visited ? <Sparkles className="world-atlas-node-mark" /> : <span className="world-atlas-node-dim" />}
                </span>
                <span className="world-atlas-node-title">{movie.title}</span>
                <span className="world-atlas-node-status">{visited ? '风记得这里' : '尚未抵达'}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleStation}
            disabled={!stationReady}
            className={`crosswind-station ${stationReady ? 'is-ready' : ''} ${stationAwake ? 'is-awake' : ''}`}
            aria-label={stationReady ? (stationAwake ? `让风选择下一站《${nextUnvisitedMovie.title}》` : '唤醒没有时刻表的中转站') : `中转站尚缺 ${3 - completedSeals} 枚印记`}
          >
            <span className="crosswind-station-ring" aria-hidden="true" />
            {stationReady ? <Compass className="h-7 w-7" /> : <LockKeyhole className="h-6 w-6" />}
            <span className="mt-2 font-serif text-sm font-semibold">
              {stationAwake ? '风的中转站' : stationReady ? '三种来路已经汇合' : `${completedSeals} / 3 枚印记`}
            </span>
            <span className="mt-1 text-[10px] text-white/48">
              {stationAwake ? `下一阵风：${nextUnvisitedMovie.title}` : stationReady ? '轻触，让地图翻到背面' : '继续沿隐秘通道旅行'}
            </span>
          </button>
        </div>

        {stationMessage && (
          <div className="crosswind-message mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 border-y border-amber-100/20 py-6 text-center">
            <Wind className="h-5 w-5 text-amber-200" />
            <p className="font-serif text-lg leading-8 text-white/75">
              地图从中央折了一次。没有第十四个世界，只有一座替所有世界保管来路的中转站。
            </p>
            <button
              type="button"
              onClick={() => travelToMovie(nextUnvisitedMovie.id, true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-200 px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-white"
            >
              <span>让风选择《{nextUnvisitedMovie.title}》</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
