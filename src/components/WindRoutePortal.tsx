import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plane, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DiscoveryId, windRouteDiscoveryIds } from '../data/journey';
import { getMovieById, Movie } from '../data/movies';
import { useJourneyStore } from '../store/journeyStore';
import { JourneyLocationState } from '../lib/journeyNavigation';

interface WindRoutePortalProps {
  movie: Movie;
}

interface RouteChapter {
  discoveryId: DiscoveryId;
  eyebrow: string;
  title: string;
  story: string;
  action: string;
  nextMovieId: string;
  previousMovieId?: string;
}

const chapters: Record<string, RouteChapter> = {
  'the-wind-rises': {
    discoveryId: 'paper-plane',
    eyebrow: '风的第一封来信',
    title: '有一架纸飞机，仍在等待起飞',
    story: '二郎没有为它写下地址。风说，亚得里亚海上有一位飞行员，也许认识这条航线。',
    action: '让纸飞机继续飞',
    nextMovieId: 'porco-rosso',
  },
  'porco-rosso': {
    discoveryId: 'scarlet-wing',
    eyebrow: '风的第二段航线',
    title: '红色机翼接住了那封信',
    story: '波鲁克看了一眼云层，把纸飞机放进驾驶舱。更高的地方，有一座被遗忘的城。',
    action: '穿过亚得里亚海的云',
    nextMovieId: 'castle-in-the-sky',
    previousMovieId: 'the-wind-rises',
  },
  'castle-in-the-sky': {
    discoveryId: 'sky-letter',
    eyebrow: '风的第三封回信',
    title: '天空之城终于收到了来信',
    story: '它没有写收件人的名字，却在云海尽头找到了归处。风把回信交给了你。',
    action: '把回信带回旅程起点',
    nextMovieId: 'the-wind-rises',
    previousMovieId: 'porco-rosso',
  },
};

export const WindRoutePortal: React.FC<WindRoutePortalProps> = ({ movie }) => {
  const navigate = useNavigate();
  const [isDeparting, setIsDeparting] = useState(false);
  const { discoveries, unlockDiscovery, completeRoute } = useJourneyStore();
  const chapter = chapters[movie.id];

  const nextMovie = useMemo(
    () => (chapter ? getMovieById(chapter.nextMovieId) : undefined),
    [chapter],
  );

  useEffect(() => {
    setIsDeparting(false);
  }, [movie.id]);

  if (!chapter) return null;

  const routeProgress = windRouteDiscoveryIds.filter((id) => discoveries.includes(id)).length;
  const isFound = discoveries.includes(chapter.discoveryId);

  const travelTo = (destinationMovieId: string, direction: 'forward' | 'backward') => {
    if (isDeparting) return;
    if (direction === 'forward') unlockDiscovery(chapter.discoveryId);
    if (movie.id === 'castle-in-the-sky' && direction === 'forward') completeRoute('wind-route');
    setIsDeparting(true);

    window.setTimeout(() => {
      navigate(`/movie/${destinationMovieId}`, {
        state: {
          scrollTo: 'wind-route',
          passage: {
            id: `wind-route-${movie.id}-${destinationMovieId}`,
            kind: 'wind-route',
            eyebrow: direction === 'forward' ? '逆风也记得来路' : '顺风仍可折返',
            title: `风把通往《${movie.title}》的航线留在身后`,
            description: '如果还想回去，纸飞机会沿着刚才的云层，把你送回上一段故事。',
            returnLabel: `返回《${movie.title}》的航线`,
            returnPath: `/movie/${movie.id}`,
            returnAnchor: 'wind-route',
          },
        } satisfies JourneyLocationState,
      });
    }, 1050);
  };

  const handleDeparture = () => travelTo(chapter.nextMovieId, 'forward');

  return (
    <section id="wind-route" className="relative isolate min-h-[72vh] scroll-mt-4 overflow-hidden border-y border-white/15" aria-label="风的航线">
      <img
        src={(nextMovie || movie).stills[0]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="absolute inset-0 wind-route-vignette" />

      <div className="relative mx-auto flex min-h-[72vh] max-w-6xl items-center px-6 py-20 md:px-10">
        <div className="max-w-2xl text-white">
          <div className="mb-5 flex items-center gap-3 text-amber-100/80">
            <Wind className="h-5 w-5" />
            <span className="text-xs tracking-[0.22em]">{chapter.eyebrow}</span>
          </div>
          <h2 className="max-w-xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{chapter.title}</h2>
          <p className="mt-6 max-w-xl font-serif text-base leading-8 text-white/72 md:text-lg">{chapter.story}</p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={handleDeparture}
              className="group inline-flex min-h-12 items-center gap-3 rounded-lg bg-amber-200 px-5 py-3 font-semibold text-slate-900 transition hover:bg-white"
            >
              {isFound ? <Check className="h-5 w-5" /> : <Plane className="h-5 w-5 transition group-hover:translate-x-1" />}
              <span>{chapter.action}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            {chapter.previousMovieId && (
              <button
                type="button"
                onClick={() => travelTo(chapter.previousMovieId!, 'backward')}
                className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-white/25 bg-slate-950/30 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>沿来时的风返回</span>
              </button>
            )}
            <span className="text-sm text-white/50">航线 {Math.max(routeProgress, isFound ? 1 : 0)} / 3</span>
          </div>
        </div>
      </div>

      {isDeparting && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#dcecf1] wind-departure">
          <div className="absolute inset-x-0 top-1/2 h-px bg-slate-700/15" />
          <Plane className="h-14 w-14 text-slate-700 wind-plane-depart" />
          <p className="absolute bottom-[18%] font-serif text-sm tracking-[0.18em] text-slate-700/70">风正在改写航线</p>
        </div>
      )}
    </section>
  );
};
