export type PassageKind = 'magic-door' | 'wind-route' | 'water-train' | 'recommendation' | 'world-map';

export interface JourneyPassage {
  id: string;
  kind: PassageKind;
  eyebrow: string;
  title: string;
  description: string;
  returnLabel: string;
  returnPath: string;
  returnAnchor: string;
}

export interface JourneyLocationState {
  scrollTo?: 'top' | string;
  passage?: JourneyPassage;
}
