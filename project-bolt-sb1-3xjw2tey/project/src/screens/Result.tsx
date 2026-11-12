import { useMemo } from 'react';
import { ArrowRight, Shuffle } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';
import { useScreen } from '@/screens/ScreenContext';
import {
  CHARACTERS,
  CHARACTER_MAP,
  QUIZ,
  REASON_BY_CHARACTER,
  calculateRecommendation,
  type CharacterId,
} from '@/data/characters';
import { CHARACTER_BASE } from '@/data/wardrobe.generated';

export default function Result({
  answers,
}: {
  answers: ('A' | 'B' | 'C' | 'D' | 'E' | null)[];
}) {
  const { go } = useScreen();

  const { winner, breakdown } = useMemo(() => {
    const totals: Record<CharacterId, number> = {
      catwoman: 0,
      barbie: 0,
      wednesday: 0,
    };
    QUIZ.forEach((q, i) => {
      const chosen = answers[i];
      if (!chosen) return;
      const option = q.options.find((o) => o.key === chosen);
      if (!option) return;
      for (const [id, pts] of Object.entries(option.scores)) {
        totals[id as CharacterId] += pts;
      }
    });
    const order = (Object.keys(totals) as CharacterId[]).sort(
      (a, b) => totals[b] - totals[a]
    );
    return { winner: order[0], breakdown: totals };
  }, [answers]);

  const character = CHARACTER_MAP[winner];
  const max = Math.max(1, ...Object.values(breakdown));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf7f2] text-neutral-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full blur-3xl opacity-50"
          style={{ backgroundColor: character.colors.accent }}
        />
        <div className="absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-[#efe6da] blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-12">
        <BrandHeader compact />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 py-10 lg:flex-row lg:items-stretch lg:gap-16">
          {/* character preview */}
          <div className="w-full max-w-[300px] flex-shrink-0">
            <div
              className="relative overflow-hidden border border-neutral-200 bg-[#faf7f2] shadow-xl"
              style={{ aspectRatio: '2 / 3' }}
            >
              <img
                src={CHARACTER_BASE[winner]}
                alt={character.name}
                className={`h-full w-full ${winner === 'wednesday' ? 'object-cover object-top scale-[1.08]' : winner === 'barbie' ? 'object-contain mix-blend-multiply' : 'object-contain'}`}
                loading="eager"
              />
              <div
                className="absolute inset-x-0 bottom-0 py-2 text-center text-[11px] tracking-[0.35em] uppercase text-white/95"
                style={{ backgroundColor: 'rgba(20,18,16,0.75)', fontFamily: "'Jost', sans-serif" }}
              >
                Твой персонаж
              </div>
            </div>
          </div>

          {/* text + score */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <p
              className="text-xs tracking-[0.4em] text-neutral-500 uppercase"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Результат теста
            </p>
            <h2
              className="mt-4 text-3xl md:text-5xl leading-[1.1] font-medium"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Твой Fashion-персонаж —<br />
              <span style={{ color: character.colors.accent }}>
                {character.name}
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-base md:text-lg leading-relaxed text-neutral-700">
              {REASON_BY_CHARACTER[winner]}
            </p>

            <div className="mt-8 w-full max-w-md space-y-3">
              {(Object.keys(breakdown) as CharacterId[]).map((id) => {
                const info = CHARACTER_MAP[id];
                const pct = Math.round((breakdown[id] / max) * 100);
                return (
                  <div key={id}>
                    <div className="flex justify-between text-xs text-neutral-500" style={{ fontFamily: "'Jost', sans-serif" }}>
                      <span>{info.name}</span>
                      <span>{breakdown[id]}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: info.colors.accent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => go({ id: 'fitting-room', characterId: winner })}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-neutral-900 px-8 py-4 text-sm tracking-[0.25em] uppercase text-[#faf7f2] transition-all duration-300 hover:bg-neutral-800 hover:shadow-xl"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Перейти в примерочную
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => go({ id: 'characters' })}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-neutral-900 px-8 py-4 text-sm tracking-[0.25em] uppercase text-neutral-900 transition-colors duration-300 hover:bg-neutral-900 hover:text-[#faf7f2]"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                <Shuffle size={16} />
                Выбрать другого персонажа
              </button>
            </div>

            <p className="mt-6 text-xs text-neutral-500" style={{ fontFamily: "'Jost', sans-serif" }}>
              Три других персонажа тоже ждут тебя в примерочной — можно примерить образы каждой.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
