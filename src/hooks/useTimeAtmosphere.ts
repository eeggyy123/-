import { useEffect, useMemo, useState } from 'react';

export type TimePhase = 'morning' | 'day' | 'evening' | 'night';

const getPhase = (hour: number): TimePhase => {
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const atmosphereCopy: Record<TimePhase, { label: string; greeting: string }> = {
  morning: { label: '晨风刚刚醒来', greeting: '清晨的世界，总会多一条没有走过的路。' },
  day: { label: '风正越过原野', greeting: '去更远的地方吧，云会替你记住方向。' },
  evening: { label: '黄昏正在写信', greeting: '所有温柔的告别，都会在晚风里重逢。' },
  night: { label: '月光落进森林', greeting: '夜晚会让那些白天沉睡的秘密醒来。' },
};

export const useTimeAtmosphere = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const phase = getPhase(now.getHours());
    return { phase, ...atmosphereCopy[phase] };
  }, [now]);
};

