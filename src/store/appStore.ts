import { create } from 'zustand';
import { Movie } from '../data/movies';

interface AppStore {
  currentMovie: Movie | null;
  isPlaying: boolean;
  volume: number;
  gestureEnabled: boolean;
  showAudioPlayer: boolean;
  setCurrentMovie: (movie: Movie) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleGesture: () => void;
  setShowAudioPlayer: (show: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentMovie: null,
  isPlaying: false,
  volume: 0.5,
  gestureEnabled: false,
  showAudioPlayer: false,
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  toggleGesture: () => set((state) => ({ gestureEnabled: !state.gestureEnabled })),
  setShowAudioPlayer: (show) => set({ showAudioPlayer: show }),
}));
