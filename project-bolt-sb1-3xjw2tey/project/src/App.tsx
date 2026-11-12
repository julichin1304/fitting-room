import { useCallback, useEffect, useState } from 'react';
import Welcome from '@/screens/Welcome';
import Quiz from '@/screens/Quiz';
import Result from '@/screens/Result';
import Characters from '@/screens/Characters';
import FittingRoom from '@/screens/FittingRoom';
import { ScreenProvider, type Screen } from '@/screens/ScreenContext';
import type { QuizOptionKey } from '@/data/characters';

const EMPTY_ANSWERS: (QuizOptionKey | null)[] = [null, null, null, null, null];

export default function App() {
  const [screen, setScreen] = useState<Screen>({ id: 'welcome' });
  const [answers, setAnswers] = useState<(QuizOptionKey | null)[]>(EMPTY_ANSWERS);

  const go = useCallback((next: Screen) => {
    setScreen(next);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [screen]);

  return (
    <ScreenProvider value={{ screen, go }}>
      <div key={screen.id + (screen.id === 'fitting-room' ? screen.characterId : '')} className="screen-fade min-h-screen">
        {screen.id === 'welcome' && <Welcome />}
        {screen.id === 'quiz' && (
          <Quiz answers={answers} onChangeAnswers={setAnswers} />
        )}
        {screen.id === 'result' && <Result answers={answers} />}
        {screen.id === 'characters' && <Characters />}
        {screen.id === 'fitting-room' && (
          <FittingRoom characterId={screen.characterId} />
        )}
      </div>
    </ScreenProvider>
  );
}
