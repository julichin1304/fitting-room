import BrandHeader from '@/components/BrandHeader';
import { useScreen } from '@/screens/ScreenContext';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

const LINES = [
  'Листай образы, как страницы глянцевого журнала',
  'Пройди стилизацию под редакцию модного издания',
  'Найди того, кто отражает твой характер',
  'Собери лук и сохрани его в своей финт-коллекции',
];

export default function Welcome() {
  const { go } = useScreen();
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(
      () => setIndex((i) => (i + 1) % LINES.length),
      3200
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf7f2] text-neutral-900">
      {/* soft editorial background shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full bg-[#e9dfd2] blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-40 h-[520px] w-[520px] rounded-full bg-[#f3e8dc] blur-3xl opacity-70" />
        <div className="absolute bottom-[-180px] right-1/4 h-[420px] w-[420px] rounded-full bg-[#eadfd0] blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-14 text-center">
        <BrandHeader />

        <div className="mt-14 md:mt-20 max-w-3xl">
          <p
            className="text-xs md:text-sm tracking-[0.4em] text-neutral-500 uppercase"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Твой стиль. Твои правила.
          </p>
          <h2
            className="mt-6 text-4xl md:text-6xl lg:text-7xl leading-[1.05] font-medium text-neutral-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ТВОЙ СТИЛЬ.
            <br />
            ТВОИ ПРАВИЛА.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base md:text-lg leading-relaxed text-neutral-600">
            Пройди небольшой тест, узнай своего fashion-персонажа и создай для
            него идеальный образ.
          </p>

          <div
            className="mt-10 h-6 text-neutral-500 text-sm md:text-base transition-opacity duration-700"
            style={{ fontFamily: "'Jost', sans-serif" }}
            key={index}
          >
            {LINES[index]}
          </div>

          <button
            onClick={() => go({ id: 'quiz' })}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-neutral-900 px-10 py-4 text-sm md:text-base tracking-[0.25em] uppercase text-[#faf7f2] transition-all duration-300 hover:bg-neutral-800 hover:gap-5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            <Sparkles size={18} className="opacity-80" />
            Начать тест
            <ChevronRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <p
            className="mt-6 text-xs tracking-[0.3em] text-neutral-400 uppercase"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            5 вопросов · 3 персонажа · примерочная
          </p>
        </div>

        <div className="mt-auto pt-16 w-full max-w-4xl">
          <div className="grid grid-cols-3 divide-x divide-neutral-300 border-t border-neutral-300 pt-6 text-neutral-600">
            {[
              ['01', 'Тест'],
              ['02', 'Персонаж'],
              ['03', 'Образ'],
            ].map(([n, label]) => (
              <div key={n} className="px-2">
                <p
                  className="text-[10px] tracking-[0.35em] text-neutral-400"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {n}
                </p>
                <p
                  className="mt-1 text-sm md:text-base text-neutral-800"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
