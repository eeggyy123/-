import React from 'react';
import { TimePhase } from '../hooks/useTimeAtmosphere';
import { useParallax } from '../hooks/useParallax';

interface ParallaxBackgroundProps {
  colors?: string[];
  image?: string;
  timePhase?: TimePhase;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  colors = ['#87CEEB', '#98D8C8', '#F7DC6F'],
  image,
  timePhase = 'day',
}) => {
  const { offsetX, offsetY } = useParallax(0.012);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none atmosphere-${timePhase}`}>
      <div
        className="absolute -inset-5 transition-[transform,opacity] duration-1000 ease-out"
        style={{
          backgroundColor: colors[0],
          backgroundImage: image
            ? `url("${image}")`
            : `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]}, ${colors[2] || colors[0]})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          transform: `translate(${offsetX * 0.55}px, ${offsetY * 0.55}px) scale(1.05)`,
        }}
      />

      <div className="absolute inset-0 atmosphere-color-wash" />
      <div className="absolute inset-0 atmosphere-depth" />

      <div
        className="wind-cloud-bank wind-cloud-bank-one"
        style={{ transform: `translate3d(${offsetX * 1.4}px, ${offsetY * 0.45}px, 0)` }}
      />
      <div
        className="wind-cloud-bank wind-cloud-bank-two"
        style={{ transform: `translate3d(${offsetX * 0.9}px, ${offsetY * 0.3}px, 0)` }}
      />

      <div className="absolute inset-0 wind-grain" />

      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="wind-mote"
          style={{
            left: `${14 + index * 23}%`,
            animationDelay: `${index * -3.7}s`,
            animationDuration: `${13 + index * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

