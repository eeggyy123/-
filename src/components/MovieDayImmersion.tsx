import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plane, TrainFront, Wind, X } from 'lucide-react';
import { Movie } from '../data/movies';

interface MovieDayImmersionProps {
  movie: Movie;
}

interface GrassBlade {
  x: number;
  height: number;
  width: number;
  delay: number;
  seed: boolean;
  leafSide: number;
  leafHeight: number;
}

interface GrassLayer {
  id: string;
  depth: number;
  blades: GrassBlade[];
}

const createGrassBlades = (count: number, depth: number, offset: number): GrassBlade[] => (
  Array.from({ length: count }, (_, index) => {
    const noise = Math.abs(Math.sin((index + 1) * (12.9898 + offset)) * 43758.5453) % 1;
    const secondaryNoise = Math.abs(Math.sin((index + 4) * (7.231 + offset)) * 12671.371) % 1;
    return {
      x: ((index + 0.35 + noise * 0.45) / count) * 100,
      height: 3.8 + depth * 2.6 + noise * (2.2 + depth * 1.8),
      width: 1.5 + depth * 1.15 + secondaryNoise * 1.2,
      delay: -(noise * 2.8 + index * 0.018),
      seed: (index + offset) % (depth > 0.7 ? 8 : 11) === 0,
      leafSide: index % 2 === 0 ? -1 : 1,
      leafHeight: 36 + secondaryNoise * 32,
    };
  })
);

const grassLayers: GrassLayer[] = [
  { id: 'back', depth: 0.35, blades: createGrassBlades(108, 0.35, 2) },
  { id: 'middle', depth: 0.66, blades: createGrassBlades(116, 0.66, 5) },
  { id: 'front', depth: 1, blades: createGrassBlades(124, 1, 9) },
];

export const MovieDayImmersion: React.FC<MovieDayImmersionProps> = ({ movie }) => {
  const [isOpen, setIsOpen] = useState(false);
  const windSceneRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({
    x: 0.52,
    y: 0.3,
    targetX: 0.52,
    targetY: 0.3,
    velocity: 0,
    previousTargetX: 0.52,
    active: false,
  });

  const isTrainDay = movie.id === 'spirited-away';
  const isWindDay = movie.id === 'the-wind-rises';

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isWindDay) return;
    const scene = windSceneRef.current;
    if (!scene) return;

    const blades = Array.from(scene.querySelectorAll<HTMLElement>('[data-grass-blade]'));
    let animationFrame = 0;

    const animateWindField = (time: number) => {
      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.16;
      pointer.y += (pointer.targetY - pointer.y) * 0.14;
      pointer.velocity *= 0.91;

      const rect = scene.getBoundingClientRect();
      const windDirection = Math.max(-1, Math.min(1, (pointer.x - 0.5) * 1.4 + pointer.velocity * 4.5));
      scene.style.setProperty('--plane-x', `${pointer.x * rect.width}px`);
      scene.style.setProperty('--plane-y', `${pointer.y * rect.height}px`);
      scene.style.setProperty('--plane-angle', `${Math.max(-18, Math.min(16, pointer.velocity * 140 - 5))}deg`);
      scene.style.setProperty('--plane-opacity', pointer.active ? '1' : '0');
      scene.style.setProperty('--cloud-near-x', `${windDirection * 2.6}vw`);
      scene.style.setProperty('--cloud-mid-x', `${windDirection * 1.4}vw`);
      scene.style.setProperty('--cloud-far-x', `${windDirection * 0.7}vw`);

      blades.forEach((blade) => {
        const bladeX = Number(blade.dataset.x || 0) / 100;
        const depth = Number(blade.dataset.depth || 0.5);
        const distance = Math.abs(bladeX - pointer.x);
        const localField = pointer.active ? Math.max(0, 1 - distance / (0.14 + depth * 0.08)) : 0;
        const isWake = pointer.velocity >= 0 ? bladeX < pointer.x : bladeX > pointer.x;
        const wake = isWake ? Math.max(0, 1 - distance / 0.3) : localField * 0.25;
        const ambient = Math.sin(time * 0.0014 + bladeX * 16) * (1.1 + depth * 1.4);
        const ripple = Math.sin(distance * 42 - time * 0.01) * wake * (4.5 + depth * 5.5);
        const passingWind = localField * windDirection * (8 + depth * 10);
        const bend = ambient + ripple + passingWind;
        blade.style.setProperty('--blade-bend', `${bend}deg`);
        blade.style.setProperty('--blade-lift', `${localField * depth * -5}px`);
        blade.style.setProperty('--blade-light', `${0.82 + localField * 0.32}`);
      });

      animationFrame = window.requestAnimationFrame(animateWindField);
    };

    animationFrame = window.requestAnimationFrame(animateWindField);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isOpen, isWindDay]);

  if (!isTrainDay && !isWindDay) return null;

  const moveThroughWind = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = Math.max(0.03, Math.min(0.97, (event.clientX - rect.left) / rect.width));
    const nextY = Math.max(0.06, Math.min(0.78, (event.clientY - rect.top) / rect.height));
    const pointer = pointerRef.current;
    pointer.velocity = pointer.velocity * 0.45 + (nextX - pointer.previousTargetX) * 0.55;
    pointer.previousTargetX = nextX;
    pointer.targetX = nextX;
    pointer.targetY = nextY;
    pointer.active = true;
  };

  const leaveWind = () => {
    pointerRef.current.active = false;
    pointerRef.current.velocity *= 0.35;
  };

  return (
    <>
      <section className={`movie-day-entry ${isTrainDay ? 'movie-day-entry-train' : 'movie-day-entry-wind'}`} aria-label={`进入《${movie.title}》的一天`}>
        <img
          src={isTrainDay ? '/images/home-water-train-horizon.png' : '/images/local/起风了/图片8.png'}
          alt=""
          className="movie-day-entry-image"
        />
        <div className="movie-day-entry-wash" />
        <div className="movie-day-entry-copy">
          <p className="movie-day-eyebrow">电影里的某一天</p>
          <h2>{isTrainDay ? '坐到水上列车的窗边' : '到有风经过的草坡上去'}</h2>
          <p>
            {isTrainDay
              ? '第六站台以后，黄昏会在玻璃上停很久。'
              : '云很低，草浪正替一架纸飞机寻找方向。'}
          </p>
          <button type="button" onClick={() => setIsOpen(true)}>
            {isTrainDay ? <TrainFront className="h-5 w-5" /> : <Wind className="h-5 w-5" />}
            <span>{isTrainDay ? '坐到窗边' : '走进这阵风'}</span>
          </button>
        </div>
      </section>

      {isOpen && isTrainDay && createPortal((
        <div className="movie-day-overlay train-window-day" role="dialog" aria-modal="true" aria-label="水上列车窗边">
          <button type="button" className="movie-day-close" onClick={() => setIsOpen(false)} aria-label="离开水上列车窗边" title="离开沉浸场景">
            <X className="h-5 w-5" />
          </button>

          <div className="train-cabin-ceiling" aria-hidden="true" />
          <div className="train-window-shell">
            <div className="train-window-view">
              <div className="train-moving-world" />
              <div className="train-water-light train-water-light-one" />
              <div className="train-water-light train-water-light-two" />
              <div className="train-distant-lamp train-distant-lamp-one" />
              <div className="train-distant-lamp train-distant-lamp-two" />
              <div className="train-glass-reflection" />
              <p className="train-window-whisper">有些路很远，却一直通向记得你的人。</p>
            </div>
            <div className="train-window-divider" aria-hidden="true" />
          </div>
          <div className="train-cabin-seat" aria-hidden="true" />
          <div className="train-cabin-table" aria-hidden="true">
            <span className="train-ticket-shadow" />
          </div>
        </div>
      ), document.body)}

      {isOpen && isWindDay && createPortal((
        <div
          ref={windSceneRef}
          className="movie-day-overlay wind-hill-day"
          role="dialog"
          aria-modal="true"
          aria-label="起风了的草坡"
          onPointerMove={moveThroughWind}
          onPointerLeave={leaveWind}
        >
          <button type="button" className="movie-day-close" onClick={() => setIsOpen(false)} aria-label="离开草坡" title="离开沉浸场景">
            <X className="h-5 w-5" />
          </button>

          <div className="wind-hill-sky" aria-hidden="true" />
          <div className="wind-day-cloud-bank wind-day-cloud-bank-far" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
          <div className="wind-day-cloud-bank wind-day-cloud-bank-middle" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>
          <div className="wind-day-cloud-bank wind-day-cloud-bank-near" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
          <div className="wind-hill-haze" aria-hidden="true" />
          <div className="wind-paper-plane" aria-hidden="true">
            <Plane />
            <span />
          </div>
          <p className="wind-hill-whisper">起风了，唯有努力生存。</p>
          <div className="wind-grass-field" aria-hidden="true">
            {grassLayers.map((layer) => (
              <div key={layer.id} className={`wind-grass-layer wind-grass-layer-${layer.id}`}>
                {layer.blades.map((blade, index) => (
                  <span
                    key={`${layer.id}-${index}`}
                    className={`wind-grass-blade ${blade.seed ? 'has-seed' : ''}`}
                    data-grass-blade
                    data-x={blade.x}
                    data-depth={layer.depth}
                    style={{
                      left: `${blade.x}%`,
                      '--blade-height': `${blade.height}rem`,
                      '--blade-width': `${blade.width}px`,
                      '--blade-delay': `${blade.delay}s`,
                      '--leaf-side': blade.leafSide,
                      '--leaf-height': `${blade.leafHeight}%`,
                    } as React.CSSProperties}
                  >
                    {blade.seed && <i className="wind-grass-seed" />}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ), document.body)}
    </>
  );
};
