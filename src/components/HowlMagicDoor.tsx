import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Castle, Check, Cog, DoorOpen, Gift, KeyRound, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { magicDoorDestinations } from '../data/journey';
import { getMovieById, Movie } from '../data/movies';
import { useJourneyStore } from '../store/journeyStore';
import { JourneyLocationState } from '../lib/journeyNavigation';

interface HowlMagicDoorProps {
  movie: Movie;
}

const doors = [
  {
    id: 'meadow',
    label: '原野',
    color: '#5f9872',
    destinationId: 'my-neighbor-totoro',
    title: '树梢后的风正在等你',
    story: '门外没有城镇，只有刚下过雨的森林。远处有一把伞，似乎被谁忘在站台。',
    keepsake: '一颗带着雨气的橡果',
    returnStory: '门从森林那侧轻轻合上，苔藓的气味却留在了城堡里。',
  },
  {
    id: 'tide',
    label: '潮汐',
    color: '#4b8fa8',
    destinationId: 'ponyo',
    title: '海水漫过了门槛',
    story: '浪花把一只红色的小鱼送到门边。她说，悬崖上的灯还亮着。',
    keepsake: '一枚会听潮声的贝壳',
    returnStory: '门槛上的水迹慢慢退去，贝壳里仍藏着宗介家的灯火。',
  },
  {
    id: 'scarlet',
    label: '红翼',
    color: '#a9584e',
    destinationId: 'porco-rosso',
    title: '亚得里亚海吹来热风',
    story: '门后传来旧引擎的声音。一架红色飞机正在海面上寻找新的航线。',
    keepsake: '一片被海风磨亮的红羽',
    returnStory: '旧引擎的回声停在门外，红羽替那段航线留住了余温。',
  },
  {
    id: 'midnight',
    label: '星夜',
    color: '#4e4d68',
    destinationId: 'the-boy-and-the-heron',
    title: '苍鹭在塔楼前回头',
    story: '这扇门没有地图。只有月光、石塔，以及一句还没被回答的问题。',
    keepsake: '一根落过月光的灰羽',
    returnStory: '塔楼沉入门后的夜色，灰羽却把那个未回答的问题带了回来。',
  },
] as const;

type MagicDoorId = (typeof doors)[number]['id'];

export const HowlMagicDoor: React.FC<HowlMagicDoorProps> = ({ movie }) => {
  const navigate = useNavigate();
  const {
    openedDoors,
    returnedPassages,
    lastReturnedPassageId,
    unlockDiscovery,
    openMagicDoor,
    completeRoute,
  } = useJourneyStore();
  const lastReturnedDoorId = lastReturnedPassageId?.startsWith('magic-door-')
    ? lastReturnedPassageId.replace('magic-door-', '')
    : [...returnedPassages]
      .reverse()
      .find((passageId) => passageId.startsWith('magic-door-'))
      ?.replace('magic-door-', '');
  const [selectedDoorId, setSelectedDoorId] = useState<MagicDoorId>(() => (
    doors.some((door) => door.id === lastReturnedDoorId)
      ? lastReturnedDoorId as MagicDoorId
      : 'meadow'
  ));
  const [isOpening, setIsOpening] = useState(false);
  const [isSkyCrossing, setIsSkyCrossing] = useState(false);

  const selectedDoor = doors.find((door) => door.id === selectedDoorId) || doors[0];
  const destination = useMemo(
    () => getMovieById(selectedDoor.destinationId),
    [selectedDoor.destinationId],
  );
  const skyCastle = useMemo(() => getMovieById('castle-in-the-sky'), []);
  const hasReturnedThroughSelectedDoor = returnedPassages.includes(`magic-door-${selectedDoor.id}`);

  if (movie.id !== 'howls-moving-castle' || !destination) return null;

  const handleOpenDoor = () => {
    if (isOpening || isSkyCrossing) return;

    const nextOpenedDoors = new Set([...openedDoors, selectedDoor.id]);
    openMagicDoor(selectedDoor.id);
    unlockDiscovery('moving-door');
    if (nextOpenedDoors.size === magicDoorDestinations.length) completeRoute('howl-doors');
    setIsOpening(true);

    window.setTimeout(() => navigate(`/movie/${selectedDoor.destinationId}`, {
      state: {
        scrollTo: 'top',
        passage: {
          id: `magic-door-${selectedDoor.id}`,
          kind: 'magic-door',
          eyebrow: `${selectedDoor.label}色门仍在身后`,
          title: '门没有关上，它在等你回到移动城堡',
          description: '轻轻转动另一侧的把手，就能回到哈尔的四色门前，继续选择下一种颜色。',
          returnLabel: '回到哈尔的四色门',
          returnPath: '/movie/howls-moving-castle',
          returnAnchor: 'magic-door',
        },
      } satisfies JourneyLocationState,
    }), 1250);
  };

  const handleOpenSkyPath = () => {
    if (isOpening || isSkyCrossing || !skyCastle) return;
    completeRoute('howl-sky-gears');
    setIsSkyCrossing(true);

    window.setTimeout(() => navigate('/movie/castle-in-the-sky', {
      state: {
        scrollTo: 'top',
        passage: {
          id: 'magic-door-sky-gears',
          kind: 'magic-door',
          eyebrow: '云上的齿轮仍在缓慢转动',
          title: '漂浮岛屿之间，还留着返回移动城堡的路',
          description: '当云层再次合拢，散开的齿轮会重新拼成哈尔门后的入口。',
          returnLabel: '沿云上齿轮返回哈尔',
          returnPath: '/movie/howls-moving-castle',
          returnAnchor: 'top',
        },
      } satisfies JourneyLocationState,
    }), 3100);
  };

  return (
    <section id="magic-door" className="relative isolate min-h-[82vh] scroll-mt-4 overflow-hidden border-y border-white/15" aria-label="哈尔的四色魔法门">
      <img src={destination.stills[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-slate-950/65" />
      <div className="absolute inset-0 magic-door-vignette" />

      <div className="relative mx-auto grid min-h-[82vh] max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_0.78fr] lg:px-10">
        <div className="max-w-2xl text-white">
          <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.22em] text-amber-100/80">
            <Sparkles className="h-4 w-4" />
            城堡里没有固定的地址
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">门把手转动时，世界会改变颜色</h2>
          <p className="mt-6 max-w-xl font-serif text-base leading-8 text-white/70 md:text-lg">
            {selectedDoor.story}
          </p>

          {hasReturnedThroughSelectedDoor && (
            <div className="mt-6 flex max-w-xl items-start gap-4 border-l-2 border-amber-200/55 pl-4 text-white">
              <Gift className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
              <div>
                <p className="text-xs tracking-[0.18em] text-amber-100/65">门的回声 · 你从另一侧带回</p>
                <h3 className="mt-1 font-serif text-lg font-semibold">{selectedDoor.keepsake}</h3>
                <p className="mt-1 font-serif text-sm leading-6 text-white/55">{selectedDoor.returnStory}</p>
              </div>
            </div>
          )}

          <div className="mt-8 inline-flex max-w-full overflow-x-auto rounded-lg border border-white/20 bg-slate-950/35 p-1 backdrop-blur-md" aria-label="选择魔法门颜色">
            {doors.map((door) => {
              const selected = selectedDoor.id === door.id;
              const opened = openedDoors.includes(door.id);
              const returned = returnedPassages.includes(`magic-door-${door.id}`);
              return (
                <button
                  key={door.id}
                  type="button"
                  onClick={() => setSelectedDoorId(door.id)}
                  className={`flex min-w-[4.8rem] items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition ${selected ? 'bg-white text-slate-900' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}
                  aria-pressed={selected}
                >
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: door.color }} />
                  <span>{door.label}</span>
                  {returned ? <Sparkles className="h-3.5 w-3.5" /> : opened && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleOpenDoor}
              className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-amber-200 px-5 py-3 font-semibold text-slate-900 transition hover:bg-white"
            >
              <KeyRound className="h-5 w-5" />
              <span>打开通往《{destination.title}》的门</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-sm text-white/50">已经打开 {openedDoors.length} / 4 种颜色</span>
          </div>

          <button
            type="button"
            onClick={handleOpenSkyPath}
            className="howl-sky-path mt-5 inline-flex min-h-11 items-center gap-3 border border-amber-100/25 bg-slate-950/35 px-4 py-2.5 font-serif text-sm text-amber-50 transition hover:border-amber-100/55 hover:bg-white/10"
          >
            <Cog className="h-5 w-5" />
            <span>门轴里还藏着一条通往《天空之城》的路</span>
          </button>
        </div>

        <div className="magic-door-stage" aria-hidden="true">
          <div className="magic-door-world" style={{ backgroundImage: `url("${destination.stills[0]}")` }} />
          <div className={`magic-door-panel ${isOpening ? 'is-opening' : ''}`} style={{ backgroundColor: selectedDoor.color }}>
            <div className="magic-door-inlay" />
            <span className="magic-door-knob" />
          </div>
          <div className="magic-door-threshold" />
          <p className="absolute -bottom-12 left-1/2 w-full -translate-x-1/2 text-center font-serif text-sm text-white/60">
            {selectedDoor.title}
          </p>
        </div>
      </div>

      {isOpening && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/65 magic-door-crossing">
          <DoorOpen className="h-20 w-20 text-amber-100" />
          <p className="absolute bottom-[18%] font-serif text-sm tracking-[0.18em] text-white/65">门后的风景正在靠近</p>
        </div>
      )}

      {isSkyCrossing && skyCastle && createPortal((
        <div className="howl-sky-crossing fixed inset-0 z-[320] overflow-hidden" aria-live="polite">
          <div className="howl-sky-reveal" style={{ backgroundImage: 'url("/images/stills/castle-in-the-sky-3.jpg")' }} />
          <div className="howl-sky-clouds" aria-hidden="true" />
          <div className="howl-sky-doorframe" aria-hidden="true" />

          {[0, 1, 2, 3, 4, 5, 6].map((gear) => (
            <Cog key={gear} className={`howl-scattering-gear howl-scattering-gear-${gear + 1}`} aria-hidden="true" />
          ))}

          <div className="howl-floating-island howl-floating-island-one" aria-hidden="true" />
          <div className="howl-floating-island howl-floating-island-two" aria-hidden="true" />
          <div className="howl-floating-island howl-floating-island-three" aria-hidden="true" />

          <div className="howl-sky-crossing-copy">
            <Castle className="h-8 w-8" />
            <p>齿轮散开以后，云替城堡显出了轮廓</p>
          </div>
        </div>
      ), document.body)}
    </section>
  );
};
