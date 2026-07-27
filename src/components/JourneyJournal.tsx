import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Compass, DoorOpen, LockKeyhole, Map, RotateCcw, Sparkles, Ticket, Wind, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { journeyDiscoveries, magicDoorDestinations, windRouteDiscoveryIds } from '../data/journey';
import { getMovieById } from '../data/movies';
import { useJourneyStore } from '../store/journeyStore';
import { JourneyLocationState } from '../lib/journeyNavigation';
import { navigateWithWind } from '../lib/viewTransition';

export const JourneyJournal: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMoviePage = location.pathname.startsWith('/movie/');
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const {
    visitCount,
    visitedMovies,
    discoveries,
    completedRoutes,
    lastMovieId,
    openedDoors,
    trainTickets,
    returnedPassages,
    beginVisit,
  } = useJourneyStore();

  useEffect(() => {
    if (sessionStorage.getItem('ghibli-journey-visit-started')) return;
    sessionStorage.setItem('ghibli-journey-visit-started', 'true');
    beginVisit();
  }, [beginVisit]);

  useEffect(() => {
    if (visitCount < 2) return;
    setShowWelcome(true);
    const timer = window.setTimeout(() => setShowWelcome(false), 5200);
    return () => window.clearTimeout(timer);
  }, [visitCount]);

  const routeProgress = windRouteDiscoveryIds.filter((id) => discoveries.includes(id)).length;
  const lastMovie = useMemo(
    () => (lastMovieId ? getMovieById(lastMovieId) : undefined),
    [lastMovieId],
  );

  const openAtlas = () => {
    const currentMovieId = isMoviePage ? location.pathname.split('/').pop() : null;
    const currentMovie = currentMovieId ? getMovieById(currentMovieId) : undefined;
    setIsOpen(false);
    navigateWithWind(() => navigate('/', {
      state: {
        scrollTo: 'world-atlas',
        passage: currentMovie
          ? {
              id: `world-map-from-${currentMovie.id}`,
              kind: 'world-map',
              eyebrow: '手册在星图上夹了一枚书签',
              title: `《${currentMovie.title}》仍在等待你沿坐标返回`,
              description: '看看各个世界之间新出现的光线，再沿书签回到刚才那一页。',
              returnLabel: `返回《${currentMovie.title}》`,
              returnPath: `/movie/${currentMovie.id}`,
              returnAnchor: 'top',
            }
          : undefined,
      } satisfies JourneyLocationState,
    }));
  };

  return (
    <>
      {showWelcome && (
        <div className="fixed top-5 left-1/2 z-[180] w-[min(90vw,34rem)] -translate-x-1/2 border border-white/20 bg-slate-950/70 px-5 py-4 text-center text-white shadow-2xl backdrop-blur-xl animate-journal-arrive">
          <p className="font-serif text-sm md:text-base">
            风记得你。{lastMovie ? `你上次停在《${lastMovie.title}》的天空下。` : '有一页旅程仍为你留着。'}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`journey-journal-toggle fixed z-[120] flex h-12 w-12 items-center justify-center rounded-lg border border-white/25 bg-slate-950/35 text-white shadow-xl backdrop-blur-xl transition hover:bg-slate-950/55 ${isMoviePage ? 'left-[5.25rem] top-5' : 'left-5 top-5'}`}
        aria-label="打开风之手册"
        title="风之手册"
      >
        <BookOpen className="h-5 w-5" />
        {discoveries.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-[10px] font-bold text-slate-900">
            {discoveries.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[210] bg-slate-950/45 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <aside
            className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto border-r border-white/15 bg-[#13252b]/95 px-6 py-6 text-white shadow-2xl animate-journal-open"
            onClick={(event) => event.stopPropagation()}
            aria-label="风之手册"
          >
            <div className="mb-8 flex items-start justify-between border-b border-white/15 pb-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-amber-200/80">
                  <Wind className="h-4 w-4" />
                  <span className="text-xs tracking-[0.2em]">THE WIND JOURNAL</span>
                </div>
                <h2 className="font-serif text-3xl">风之手册</h2>
                <p className="mt-2 text-sm text-white/55">第 {visitCount || 1} 次与风重逢</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="关闭风之手册"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <section className="mb-8 border-b border-white/15 pb-7">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-serif text-lg">
                  <Map className="h-4 w-4 text-amber-200" />
                  风的航线
                </h3>
                <span className="text-xs text-white/50">{routeProgress} / 3</span>
              </div>
              <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-amber-200 transition-all duration-700"
                  style={{ width: `${(routeProgress / 3) * 100}%` }}
                />
              </div>
              <p className="text-sm leading-6 text-white/60">
                {completedRoutes.includes('wind-route')
                  ? '纸飞机已经越过海面与云层，天空回信了。'
                  : '一封没有地址的信，正在三个世界之间寻找方向。'}
              </p>
              <button
                type="button"
                onClick={openAtlas}
                className="mt-5 inline-flex min-h-10 w-full items-center justify-between gap-3 rounded-lg border border-amber-100/20 bg-amber-100/8 px-3 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-100 hover:text-slate-900"
              >
                <span className="flex items-center gap-2"><Map className="h-4 w-4" />展开风之星图</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>

            <section className="mb-8 border-b border-white/15 pb-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-serif text-lg">
                  <DoorOpen className="h-4 w-4 text-amber-200" />
                  隐秘入口
                </h3>
                <span className="text-xs text-white/50">{openedDoors.length + Math.min(trainTickets, 1) + Math.min(returnedPassages.length, 1)} / 6</span>
              </div>
              <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-sky-200 transition-all duration-700"
                  style={{ width: `${((openedDoors.length + Math.min(trainTickets, 1) + Math.min(returnedPassages.length, 1)) / 6) * 100}%` }}
                />
              </div>
              <div className="space-y-4 text-sm text-white/60">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><DoorOpen className="h-4 w-4 text-sky-200" />哈尔的四色门</span>
                  <span>{openedDoors.length} / {magicDoorDestinations.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Ticket className="h-4 w-4 text-sky-200" />水上列车</span>
                  <span>{trainTickets > 0 ? '已收下车票' : '远处有一声汽笛'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-sky-200" />返程印记</span>
                  <span>{returnedPassages.length > 0 ? `${returnedPassages.length} 条来路` : '尚未沿来路返回'}</span>
                </div>
              </div>
            </section>

            <section className="mb-8 border-b border-white/15 pb-7">
              <h3 className="mb-4 flex items-center gap-2 font-serif text-lg">
                <Sparkles className="h-4 w-4 text-amber-200" />
                风带回来的东西
              </h3>
              <div className="space-y-5">
                {journeyDiscoveries.map((discovery) => {
                  const unlocked = discoveries.includes(discovery.id);
                  return (
                    <div key={discovery.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${unlocked ? 'bg-amber-200 text-slate-900' : 'bg-white/10 text-white/35'}`}>
                        {unlocked ? <Check className="h-4 w-4" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <h4 className={`font-serif text-sm ${unlocked ? 'text-white' : 'text-white/55'}`}>{discovery.name}</h4>
                        <p className="mt-1 text-xs leading-5 text-white/45">
                          {unlocked ? discovery.description : discovery.hint}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex items-center justify-between text-sm text-white/50">
              <span className="flex items-center gap-2"><Compass className="h-4 w-4" />到访世界</span>
              <span className="font-serif text-lg text-white">{visitedMovies.length} / 13</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
