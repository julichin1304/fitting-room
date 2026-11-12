import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, HelpCircle } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import { useScreen } from '@/screens/ScreenContext';
import { QUIZ, type QuizOptionKey } from '@/data/characters';

interface QuizProps {
  answers: (QuizOptionKey | null)[];
  onChangeAnswers: (answers: (QuizOptionKey | null)[]) => void;
}

export default function Quiz({ answers, onChangeAnswers }: QuizProps) {
  const { go } = useScreen();
  const [step, setStep] = useState(0);
  const current = Math.min(step, QUIZ.length - 1);
  const question = QUIZ[current];
  const chosen = answers[current];
  const allAnswered = answers.every((a) => a !== null);

  const select = (key: QuizOptionKey) => {
    const next = [...answers];
    next[current] = key;
    onChangeAnswers(next);
  };

  const back = () => {
    if (current === 0) go({ id: 'welcome' });
    else setStep(current - 1);
  };

  const next = () => {
    if (!chosen) return;
    if (current < QUIZ.length - 1) setStep(current + 1);
    else go({ id: 'result' });
  };

  const progress = ((current + 1) / QUIZ.length) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf7f2] text-neutral-900">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-[380px] w-[380px] rounded-full bg-[#eee3d5] blur-3xl opacity-60" />
        <div className="absolute bottom-[-160px] right-[-100px] h-[420px] w-[420px] rounded-full bg-[#f0e7dc] blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10">
        <BrandHeader compact />

        <div className="mt-8 flex items-center justify-between">
          <span
            className="text-xs tracking-[0.35em] text-neutral-500"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {current + 1} / {QUIZ.length}
          </span>
          <div className="flex flex-1 items-center gap-3 px-6">
            <div className="h-[3px] w-full rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-neutral-900 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span
            className="text-xs tracking-[0.35em] text-neutral-400"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {Math.round(progress)}%
          </span>
        </div>

        <main className="mt-10 flex flex-1 flex-col justify-center pb-10">
          <h2
            className="text-2xl md:text-4xl leading-snug font-medium text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {question.heading}
          </h2>

          <div className="mt-10 grid gap-3">
            {question.options.map((option) => {
              const active = chosen === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => select(option.key)}
                  aria-pressed={active}
                  className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                    active
                      ? 'border-neutral-900 bg-neutral-900 text-[#faf7f2] shadow-lg'
                      : 'border-neutral-300 bg-white/80 text-neutral-800 hover:border-neutral-900 hover:shadow-md'
                  }`}
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs tracking-widest ${
                      active
                        ? 'border-[#faf7f2]/60 text-[#faf7f2]'
                        : 'border-neutral-400 text-neutral-500 group-hover:border-neutral-900 group-hover:text-neutral-900'
                    }`}
                  >
                    {option.key}
                  </span>
                  <span className="flex-1 text-sm md:text-base leading-relaxed">
                    {option.text}
                  </span>
                  {active && <Check size={18} className="flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </main>

        <div className="flex items-center justify-between gap-4 pb-6">
          <button
            onClick={back}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-xs tracking-[0.25em] uppercase text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            <ArrowLeft size={16} />
            Назад
          </button>

          {!chosen && (
            <span
              className="hidden items-center gap-2 text-xs text-neutral-400 sm:inline-flex"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              <HelpCircle size={14} />
              Выбери вариант, чтобы продолжить
            </span>
          )}

          <button
            onClick={next}
            disabled={!chosen}
            className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all duration-300 ${
              chosen
                ? 'bg-neutral-900 text-[#faf7f2] hover:bg-neutral-800 hover:shadow-lg'
                : 'cursor-not-allowed bg-neutral-200 text-neutral-400'
            }`}
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {current === QUIZ.length - 1 && allAnswered ? 'Результат' : 'Далее'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
