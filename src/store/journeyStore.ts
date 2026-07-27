import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiscoveryId } from '../data/journey';

interface JourneyState {
  visitCount: number;
  visitedMovies: string[];
  discoveries: DiscoveryId[];
  completedRoutes: string[];
  openedDoors: string[];
  trainTickets: number;
  returnedPassages: string[];
  worldEchoes: string[];
  lastReturnedPassageId: string | null;
  lastMovieId: string | null;
  beginVisit: () => void;
  markMovieVisited: (movieId: string) => void;
  unlockDiscovery: (discoveryId: DiscoveryId) => void;
  completeRoute: (routeId: string) => void;
  openMagicDoor: (doorId: string) => void;
  collectTrainTicket: () => void;
  markPassageReturned: (passageId: string) => void;
  collectWorldEcho: (movieId: string) => void;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      visitCount: 0,
      visitedMovies: [],
      discoveries: [],
      completedRoutes: [],
      openedDoors: [],
      trainTickets: 0,
      returnedPassages: [],
      worldEchoes: [],
      lastReturnedPassageId: null,
      lastMovieId: null,
      beginVisit: () => set((state) => ({ visitCount: state.visitCount + 1 })),
      markMovieVisited: (movieId) => set((state) => ({
        lastMovieId: movieId,
        visitedMovies: state.visitedMovies.includes(movieId)
          ? state.visitedMovies
          : [...state.visitedMovies, movieId],
      })),
      unlockDiscovery: (discoveryId) => set((state) => ({
        discoveries: state.discoveries.includes(discoveryId)
          ? state.discoveries
          : [...state.discoveries, discoveryId],
      })),
      completeRoute: (routeId) => set((state) => ({
        completedRoutes: state.completedRoutes.includes(routeId)
          ? state.completedRoutes
          : [...state.completedRoutes, routeId],
      })),
      openMagicDoor: (doorId) => set((state) => ({
        openedDoors: state.openedDoors.includes(doorId)
          ? state.openedDoors
          : [...state.openedDoors, doorId],
      })),
      collectTrainTicket: () => set((state) => ({ trainTickets: state.trainTickets + 1 })),
      markPassageReturned: (passageId) => set((state) => ({
        lastReturnedPassageId: passageId,
        returnedPassages: state.returnedPassages.includes(passageId)
          ? state.returnedPassages
          : [...state.returnedPassages, passageId],
      })),
      collectWorldEcho: (movieId) => set((state) => ({
        worldEchoes: state.worldEchoes.includes(movieId)
          ? state.worldEchoes
          : [...state.worldEchoes, movieId],
      })),
    }),
    {
      name: 'ghibli-wind-journal',
      version: 1,
    },
  ),
);
