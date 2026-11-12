import { createContext, useContext } from 'react';

export type ScreenId =
  | 'welcome'
  | 'quiz'
  | 'result'
  | 'characters'
  | 'fitting-room';

export type Screen =
  | { id: 'welcome' }
  | { id: 'quiz' }
  | { id: 'result' }
  | { id: 'characters' }
  | { id: 'fitting-room'; characterId: CharacterId };

interface ScreenContextValue {
  screen: Screen;
  go: (screen: Screen) => void;
}

import type { CharacterId } from '@/data/characters';

const ScreenContext = createContext<ScreenContextValue | null>(null);

export function ScreenProvider({
  value,
  children,
}: {
  value: ScreenContextValue;
  children: React.ReactNode;
}) {
  return <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>;
}

export function useScreen(): ScreenContextValue {
  const ctx = useContext(ScreenContext);
  if (!ctx) throw new Error('useScreen must be used within ScreenProvider');
  return ctx;
}
