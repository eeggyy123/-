import React, { useEffect, useRef, useState } from 'react';
import { Rainbow } from 'lucide-react';

const rainbowColors = ['#ff6b78', '#ffad5a', '#ffe56b', '#75d889', '#62cce8', '#7697ef', '#b685e8'];
const fireworkPositions = [
  { x: 18, y: 32, delay: 0 },
  { x: 48, y: 18, delay: 0.18 },
  { x: 76, y: 35, delay: 0.34 },
  { x: 33, y: 58, delay: 0.46 },
  { x: 68, y: 64, delay: 0.58 },
];

export const EasterEggs: React.FC = () => {
  const [rainbowClicks, setRainbowClicks] = useState(0);
  const [waveId, setWaveId] = useState(0);
  const [fireworkId, setFireworkId] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworkTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (fireworkTimer.current) window.clearTimeout(fireworkTimer.current);
  }, []);

  const handleRainbowClick = () => {
    setWaveId((value) => value + 1);
    const nextCount = rainbowClicks + 1;

    if (nextCount < 5) {
      setRainbowClicks(nextCount);
      return;
    }

    setRainbowClicks(0);
    setFireworkId((value) => value + 1);
    setShowFireworks(true);
    if (fireworkTimer.current) window.clearTimeout(fireworkTimer.current);
    fireworkTimer.current = window.setTimeout(() => setShowFireworks(false), 2200);
  };

  return (
    <>
      {waveId > 0 && (
        <div key={waveId} className="rainbow-click-wave" aria-hidden="true">
          {rainbowColors.map((color, index) => (
            <span key={color} style={{ '--rainbow-color': color, '--rainbow-index': index } as React.CSSProperties} />
          ))}
        </div>
      )}

      {showFireworks && (
        <div key={fireworkId} className="rainbow-fireworks" aria-hidden="true">
          {fireworkPositions.map((firework, fireworkIndex) => (
            <span
              key={`${firework.x}-${firework.y}`}
              className="rainbow-firework"
              style={{
                '--firework-x': `${firework.x}%`,
                '--firework-y': `${firework.y}%`,
                '--firework-delay': `${firework.delay}s`,
              } as React.CSSProperties}
            >
              {Array.from({ length: 14 }, (_, sparkIndex) => (
                <i
                  key={sparkIndex}
                  style={{
                    '--spark-angle': `${(360 / 14) * sparkIndex}deg`,
                    '--spark-color': rainbowColors[(sparkIndex + fireworkIndex) % rainbowColors.length],
                  } as React.CSSProperties}
                />
              ))}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleRainbowClick}
        className={`rainbow-wish-button fixed bottom-32 left-6 z-[190] flex h-11 w-11 items-center justify-center rounded-full glass-effect transition-transform hover:scale-110 ${rainbowClicks > 0 ? 'is-awake' : ''}`}
        title={`唤起彩虹 ${rainbowClicks}/5`}
        aria-label="唤起彩虹"
      >
        <Rainbow className="h-5 w-5" />
        {rainbowClicks > 0 && <span>{rainbowClicks}</span>}
      </button>
    </>
  );
};
