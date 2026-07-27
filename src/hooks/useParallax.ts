import { useEffect, useState } from 'react';

interface UseParallaxReturn {
  offsetX: number;
  offsetY: number;
  intensity: number;
}

export const useParallax = (baseIntensity: number = 0.02): UseParallaxReturn => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      setOffsetX(mouseX * baseIntensity);
      setOffsetY(mouseY * baseIntensity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [baseIntensity]);

  return {
    offsetX,
    offsetY,
    intensity: baseIntensity,
  };
};
