import BrandHeader from '@/components/BrandHeader';
import { useScreen } from '@/screens/ScreenContext';
import { CHARACTERS } from '@/data/characters';
import { ArrowRight } from 'lucide-react';

export default function Characters() {
  const { go } = useScreen();
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf7f2] text-neutral-900">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-1/4 h-[420px] w-[420px] rounded-full bg-[#eee3d5] blur-3xl opacity-60" />
        <div className="absolute bottom-[-140px] left-[-120px] h-[420px] w-[420px] rounded-full bg-[#f0e7dc] blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-10">
        <BrandHeader />

        <main className="mx-auto mt-6 flex w-full max-w-6xl flex-1 flex-col">
          <p
            className="text-center text-xs tracking-[0.4em] text-neutral-500 uppercase"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Три героини · одна примерочная
          </p>
          <h2
            className="mt-4 text-center text-3xl md:text-5xl font-medium leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Выбери своего fashion-персонажа
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {CHARACTERS.map((character) => (
              <button
                key={character.id}
                onClick={() => go({ id: 'fitting-room', characterId: character.id })}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '2 / 3' }}>
                  <img
                    src={`assets/characters/${character.id}/base.png`}
                    alt={character.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 py-2 text-center text-[10px] tracking-[0.35em] uppercase text-white/90"
                    style={{ backgroundColor: 'rgba(20,18,16,0.7)', fontFamily: "'Jost', sans-serif" }}
                  >
                    {character.title}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3
                    className="text-2xl font-medium"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {character.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {character.description}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-neutral-900"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    Открыть примерочную
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 pb-8 text-center">
            <button
              onClick={() => go({ id: 'result' })}
              className="text-xs tracking-[0.3em] uppercase text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Вернуться к результату теста
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
