import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw, Shuffle, Check } from 'lucide-react';
import { MemoizedCharacterStage } from '@/components/CharacterStage';
import { CHARACTER_MAP, type CharacterId } from '@/data/characters';
import {
  WARDROBE,
  CATEGORY_LABELS,
  type Category,
  type WardrobeItem,
} from '@/data/wardrobe.generated';
import { useScreen } from '@/screens/ScreenContext';

const CATEGORY_ORDER: Category[] = [
  'tops',
  'bottoms',
  'dresses',
  'shoes',
  'accessories',
];

const ACCESSORY_SLOTS = 4;

type Selection = Record<Category, (string | null)[]>;

const EMPTY_SELECTION: Selection = {
  tops: [null],
  bottoms: [null],
  dresses: [null],
  shoes: [null],
  accessories: [null, null, null, null],
};

interface FittingRoomProps {
  characterId: CharacterId;
}

export default function FittingRoom({ characterId }: FittingRoomProps) {
  const { go } = useScreen();
  const character = CHARACTER_MAP[characterId];

  const [activeCategory, setActiveCategory] = useState<Category>('tops');
  const [selected, setSelected] = useState<Selection>(EMPTY_SELECTION);

  const itemsByCategory = useMemo(() => {
    const map = {} as Record<Category, WardrobeItem[]>;
    for (const cat of CATEGORY_ORDER) {
      map[cat] = WARDROBE.filter(
        (i) => i.character === characterId && i.category === cat
      );
    }
    return map;
  }, [characterId]);

  const wornItems = useMemo(() => {
    const worn: { item: WardrobeItem; slot: number }[] = [];
    for (const cat of CATEGORY_ORDER) {
      selected[cat].forEach((id, slot) => {
        if (!id) return;
        const item = itemsByCategory[cat].find((i) => i.id === id);
        if (item) worn.push({ item, slot });
      });
    }
    return worn;
  }, [selected, itemsByCategory]);

  const pick = useCallback((category: Category, itemId: string, slot: number) => {
    setSelected((prev) => {
      const slots = prev[category];
      // tapping the worn item again removes it
      const nextValue = slots[slot] === itemId ? null : itemId;
      if (slots[slot] === nextValue) return prev;
      const next = [...slots];
      next[slot] = nextValue;
      return { ...prev, [category]: next };
    });
  }, []);

  const clearCategory = useCallback((category: Category) => {
    setSelected((prev) => {
      if (prev[category].every((v) => v === null)) return prev;
      return {
        ...prev,
        [category]: prev[category].map(() => null),
      };
    });
  }, []);

  const resetOutfit = useCallback(() => setSelected(EMPTY_SELECTION), []);

  const randomOutfit = useCallback(() => {
    const rand = (arr: WardrobeItem[]) =>
      arr.length ? arr[Math.floor(Math.random() * arr.length)].id : null;
    setSelected({
      tops: [rand(itemsByCategory.tops)],
      bottoms: [rand(itemsByCategory.bottoms)],
      dresses: [rand(itemsByCategory.dresses)],
      shoes: [rand(itemsByCategory.shoes)],
      accessories: Array.from({ length: ACCESSORY_SLOTS }, (_, i) =>
        itemsByCategory.accessories[i]
          ? itemsByCategory.accessories[i].id
          : null
      ),
    });
  }, [itemsByCategory]);

  const switchCategory = useCallback((cat: Category) => {
    setActiveCategory(cat);
  }, []);

  const items = itemsByCategory[activeCategory];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf7f2] text-neutral-900">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-[-120px] left-1/3 h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
          style={{ backgroundColor: character.colors.accent }}
        />
        <div className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#efe6da] blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 md:px-8">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => go({ id: 'characters' })}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/70 px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            <ArrowLeft size={14} />
            Назад к персонажам
          </button>

          <div className="order-first w-full text-center sm:order-none sm:w-auto">
            <p
              className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Media Vogue
            </p>
            <h2
              className="text-lg md:text-2xl font-medium leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Примерочная · {character.name}
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={randomOutfit}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase text-[#faf7f2] transition hover:bg-neutral-800 md:px-5"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              <Shuffle size={14} />
              <span className="hidden md:inline">Случайный образ</span>
            </button>
            <button
              onClick={resetOutfit}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/70 px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 md:px-5"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Сбросить образ</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-1 flex-col gap-8 lg:flex-row">
          {/* character stage */}
          <div className="flex flex-1 items-start justify-center">
            <div
              className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
              style={{ aspectRatio: '2 / 3' }}
            >
              <MemoizedCharacterStage characterId={characterId} worn={wornItems} />
            </div>
          </div>

          {/* wardrobe panel */}
          <aside className="w-full flex-shrink-0 rounded-3xl border border-neutral-200 bg-white/80 p-5 shadow-lg backdrop-blur lg:w-[420px]">
            <p
              className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Гардероб
            </p>

            <div className="mt-4 flex flex-wrap gap-2" role="tablist">
              {CATEGORY_ORDER.map((cat) => {
                const active = activeCategory === cat;
                const wornCount = selected[cat].filter(Boolean).length;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchCategory(cat)}
                    className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 ${
                      active
                        ? 'border-neutral-900 bg-neutral-900 text-[#faf7f2]'
                        : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
                    }`}
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {CATEGORY_LABELS[cat]}
                    {wornCount > 0 && (
                      <span
                        className={`ml-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full text-[9px] ${
                          active
                            ? 'bg-[#faf7f2]/25 text-[#faf7f2]'
                            : 'bg-neutral-900 text-white'
                        }`}
                      >
                        {wornCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid max-h-[52vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:max-h-[58vh] lg:grid-cols-2">
              {items.map((item) => {
                const isWorn =
                  item.category === 'accessories'
                    ? selected.accessories.includes(item.id)
                    : selected[item.category][0] === item.id;

                const handleClick = () => {
                  if (item.category === 'accessories') {
                    let slot = selected.accessories.indexOf(item.id);
                    if (slot !== -1) {
                      pick('accessories', item.id, slot); // toggles off
                      return;
                    }
                    const free = selected.accessories.indexOf(null);
                    if (free === -1) return; // all 4 accessory slots filled
                    slot = free;
                    pick('accessories', item.id, slot);
                  } else {
                    pick(item.category, item.id, 0);
                  }
                };

                return (
                  <button
                    key={item.id}
                    onClick={handleClick}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                      isWorn
                        ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                        : 'border-neutral-200 hover:border-neutral-900'
                    }`}
                    style={{ backgroundColor: '#fbf8f4' }}
                  >
                    <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                      <img
                        src={item.src}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      {isWorn && (
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[#faf7f2]">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <p
                      className="border-t border-neutral-200 px-2 py-2 text-[11px] leading-snug text-neutral-700"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {item.name}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => clearCategory(activeCategory)}
              className="mt-4 w-full rounded-full border border-dashed border-neutral-300 px-4 py-2.5 text-[11px] tracking-[0.25em] uppercase text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Снять всё · {CATEGORY_LABELS[activeCategory].toLowerCase()}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
