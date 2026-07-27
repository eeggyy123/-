import React, { useEffect, useState } from 'react';
import {
  Bot,
  Check,
  CloudRain,
  Disc3,
  Feather,
  Flame,
  Flower2,
  Leaf,
  Mail,
  Origami,
  Plane,
  Sparkles,
  Ticket,
  Trees,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { Movie } from '../data/movies';
import { getWorldEcho, WorldEchoIcon } from '../data/worldEchoes';
import { useJourneyStore } from '../store/journeyStore';

const echoIcons: Record<WorldEchoIcon, LucideIcon> = {
  leaf: Leaf,
  robot: Bot,
  rain: CloudRain,
  mail: Mail,
  plane: Plane,
  forest: Trees,
  ticket: Ticket,
  flame: Flame,
  waves: Waves,
  origami: Origami,
  flower: Flower2,
  record: Disc3,
  feather: Feather,
};

interface WorldEchoProps {
  movie: Movie;
}

export const WorldEcho: React.FC<WorldEchoProps> = ({ movie }) => {
  const echo = getWorldEcho(movie.id);
  const { worldEchoes, collectWorldEcho, unlockDiscovery } = useJourneyStore();
  const collected = worldEchoes.includes(movie.id);
  const [isAwake, setIsAwake] = useState(collected);

  useEffect(() => {
    setIsAwake(collected);
  }, [collected, movie.id]);

  if (!echo) return null;

  const EchoIcon = echoIcons[echo.icon];
  const handleCollect = () => {
    collectWorldEcho(movie.id);
    if (worldEchoes.length >= 2) unlockDiscovery('three-world-echoes');
  };

  return (
    <section
      id="world-echo"
      className={`world-echo relative isolate min-h-[72vh] scroll-mt-4 overflow-hidden border-y border-white/15 ${isAwake ? 'is-awake' : ''} ${collected ? 'is-collected' : ''}`}
      style={{ '--echo-accent': echo.accent, '--echo-glow': echo.glow } as React.CSSProperties}
      aria-label={`${movie.title}的世界回声`}
    >
      <img src={movie.stills[2] || movie.stills[0] || movie.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="world-echo-wash absolute inset-0" />
      <div className="world-echo-particles absolute inset-0" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <span key={index} style={{ '--echo-index': index } as React.CSSProperties} />
        ))}
      </div>

      <div className="relative mx-auto grid min-h-[72vh] max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.25fr_0.75fr] md:px-10">
        <div className="max-w-2xl text-white">
          <div className="mb-5 flex items-center gap-3" style={{ color: echo.accent }}>
            <Sparkles className="h-4 w-4" />
            <span className="text-xs tracking-[0.22em]">{echo.eyebrow}</span>
          </div>
          <h2 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">{echo.title}</h2>
          <p className="mt-6 max-w-xl font-serif text-base leading-8 text-white/68 md:text-lg">
            {isAwake ? echo.response : echo.invitation}
          </p>

          {!isAwake ? (
            <button
              type="button"
              onClick={() => setIsAwake(true)}
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
              style={{ backgroundColor: echo.accent }}
            >
              <EchoIcon className="h-5 w-5" />
              <span>{echo.awakenAction}</span>
            </button>
          ) : !collected ? (
            <button
              type="button"
              onClick={handleCollect}
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-slate-950"
            >
              <Sparkles className="h-5 w-5" />
              <span>把“{echo.keepsake}”收进手册</span>
            </button>
          ) : (
            <div className="mt-8 border-l-2 pl-5" style={{ borderColor: echo.accent }}>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: echo.accent }}>
                <Check className="h-4 w-4" />
                <span>已收进手册 · {echo.keepsake}</span>
              </div>
              <p className="mt-2 max-w-xl font-serif text-sm leading-6 text-white/55">{echo.keepsakeStory}</p>
            </div>
          )}
        </div>

        <div className="world-echo-object-stage" aria-hidden="true">
          <span className="world-echo-orbit" />
          <span className="world-echo-orbit world-echo-orbit-two" />
          <EchoIcon className="world-echo-object" />
          <span className="world-echo-object-label">{isAwake ? echo.keepsake : '尚未听见的东西'}</span>
        </div>
      </div>
    </section>
  );
};
