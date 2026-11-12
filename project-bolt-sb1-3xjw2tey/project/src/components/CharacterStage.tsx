import { memo, useMemo } from 'react';
import type { WardrobeItem } from '@/data/wardrobe.generated';
import { CHARACTER_BASE } from '@/data/wardrobe.generated';
import type { CharacterId } from '@/data/characters';

interface StageProps {
  characterId: CharacterId;
  worn: { item: WardrobeItem; slot: number }[];
}

function placement(item: WardrobeItem) {
  switch (item.category) {
    case 'tops': return { left: '24%', top: '32%', width: '52%', height: '25%' };
    case 'bottoms': return { left: '27%', top: '53%', width: '46%', height: '39%' };
    case 'dresses': return { left: '18%', top: '30%', width: '64%', height: '53%' };
    case 'shoes': return { left: '25%', top: '82%', width: '50%', height: '16%' };
    case 'accessories': return { left: '25%', top: '29%', width: '50%', height: '20%' };
  }
}

function CharacterStage({ characterId, worn }: StageProps) {
  const sorted = useMemo(() => [...worn].sort((a, b) => a.item.z - b.item.z), [worn]);
  return (
    <div className="absolute inset-0">
      <img src={CHARACTER_BASE[characterId]} alt="Персонаж" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      {sorted.map(({ item }) => (
        <img key={item.id} src={item.src} alt={item.name}
          className="absolute object-contain pointer-events-none"
          style={{ ...placement(item), zIndex: item.z }} draggable={false} />
      ))}
    </div>
  );
}
export const MemoizedCharacterStage = memo(CharacterStage);
