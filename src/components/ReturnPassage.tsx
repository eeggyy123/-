import React from 'react';
import { ArrowLeft, Compass, DoorOpen, House, Map, Plane, TrainFront } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JourneyLocationState, JourneyPassage, PassageKind } from '../lib/journeyNavigation';
import { navigateWithWind } from '../lib/viewTransition';
import { useJourneyStore } from '../store/journeyStore';

const passageIcons: Record<PassageKind, React.ReactNode> = {
  home: <House className="h-5 w-5" />,
  'magic-door': <DoorOpen className="h-5 w-5" />,
  'wind-route': <Plane className="h-5 w-5" />,
  'water-train': <TrainFront className="h-5 w-5" />,
  recommendation: <Compass className="h-5 w-5" />,
  'world-map': <Map className="h-5 w-5" />,
};

interface ReturnPassageProps {
  fallbackPassage?: JourneyPassage;
}

export const ReturnPassage: React.FC<ReturnPassageProps> = ({ fallbackPassage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unlockDiscovery, markPassageReturned } = useJourneyStore();
  const navigationState = location.state as JourneyLocationState | null;
  const passage = navigationState?.passage || fallbackPassage;

  if (!passage) return null;

  const handleReturn = () => {
    markPassageReturned(passage.id);
    unlockDiscovery('return-thread');
    const returnAnchor = ['wind-route', 'water-train'].includes(passage.returnAnchor)
      ? 'top'
      : passage.returnAnchor;
    navigateWithWind(() => navigate(passage.returnPath, {
      state: { scrollTo: returnAnchor } satisfies JourneyLocationState,
    }));
  };

  return (
    <section className={`return-passage return-passage-${passage.kind}`} aria-label="返程通道">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 py-7 md:flex-row md:items-center md:px-10">
        <div className="flex max-w-3xl items-start gap-4 text-white">
          <div className="return-passage-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            {passageIcons[passage.kind]}
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-white/50">{passage.eyebrow}</p>
            <h2 className="mt-1 font-serif text-xl font-semibold md:text-2xl">{passage.title}</h2>
            <p className="mt-2 font-serif text-sm leading-6 text-white/58">{passage.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReturn}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{passage.returnLabel}</span>
        </button>
      </div>
    </section>
  );
};
