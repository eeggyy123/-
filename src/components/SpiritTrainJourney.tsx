import React, { useState } from 'react';
import { ArrowRight, Ticket, TrainFront } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMovieById, Movie } from '../data/movies';
import { useJourneyStore } from '../store/journeyStore';
import { JourneyLocationState } from '../lib/journeyNavigation';

interface SpiritTrainJourneyProps {
  movie: Movie;
}

export const SpiritTrainJourney: React.FC<SpiritTrainJourneyProps> = ({ movie }) => {
  const navigate = useNavigate();
  const [isDeparting, setIsDeparting] = useState(false);
  const { trainTickets, unlockDiscovery, collectTrainTicket, completeRoute } = useJourneyStore();
  const destination = getMovieById('only-yesterday');

  if (movie.id !== 'spirited-away' || !destination) return null;

  const handleBoardTrain = () => {
    if (isDeparting) return;
    if (trainTickets === 0) collectTrainTicket();
    unlockDiscovery('water-rail-ticket');
    completeRoute('water-train');
    setIsDeparting(true);
    window.setTimeout(() => navigate('/movie/only-yesterday', {
      state: {
        scrollTo: 'top',
        passage: {
          id: 'water-train-return',
          kind: 'water-train',
          eyebrow: '返程车票 · 仍然有效',
          title: '水面上的铁轨，也通向来时的站台',
          description: '妙子的回忆不会把你困住。返程列车会送你回到汤屋外的第六站台。',
          returnLabel: '返回千寻的第六站台',
          returnPath: '/movie/spirited-away',
          returnAnchor: 'top',
        },
      } satisfies JourneyLocationState,
    }), 1500);
  };

  return (
    <section id="water-train" className="relative isolate min-h-[76vh] scroll-mt-4 overflow-hidden border-y border-white/15" aria-label="千与千寻水上列车">
      <img src={movie.stills[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#173348]/65" />
      <div className="absolute inset-0 water-rail-reflection" />

      <div className="relative mx-auto flex min-h-[76vh] max-w-6xl items-center px-6 py-20 md:px-10">
        <div className="max-w-2xl text-white">
          <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.22em] text-sky-100/80">
            <TrainFront className="h-4 w-4" />
            第六站台 · 单程票
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">列车穿过水面，开往记忆深处</h2>
          <p className="mt-6 max-w-xl font-serif text-base leading-8 text-white/70 md:text-lg">
            车票没有写终点。窗外的灯一盏一盏退后，最后停在一个女孩回望童年的夏天。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={handleBoardTrain}
              className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-sky-100 px-5 py-3 font-semibold text-slate-900 transition hover:bg-white"
            >
              <Ticket className="h-5 w-5" />
              <span>{trainTickets > 0 ? '再次登上水上列车' : '收下车票，登上列车'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-sm text-white/50">下一站：《{destination.title}》</span>
          </div>
        </div>
      </div>

      <div className="water-rail-line" aria-hidden="true">
        <span className="water-rail-light water-rail-light-one" />
        <span className="water-rail-light water-rail-light-two" />
        <span className="water-rail-light water-rail-light-three" />
      </div>

      {isDeparting && (
        <div className="fixed inset-0 z-[300] overflow-hidden bg-[#102b3c] train-departure">
          <div className="train-horizon" />
          <div className="train-silhouette">
            <TrainFront className="h-14 w-14 text-sky-100" />
          </div>
          <p className="absolute bottom-[18%] left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-sm tracking-[0.18em] text-sky-100/70">请保管好没有终点的车票</p>
        </div>
      )}
    </section>
  );
};
