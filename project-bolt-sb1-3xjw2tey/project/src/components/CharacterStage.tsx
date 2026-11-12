import { memo, useMemo } from 'react';
import type { WardrobeItem } from '@/data/wardrobe.generated';
import { CHARACTER_BASE } from '@/data/wardrobe.generated';
import type { CharacterId } from '@/data/characters';

interface StageProps {
  characterId: CharacterId;
  worn: { item: WardrobeItem; slot: number }[];
}

function CharacterStage({ characterId, worn }: StageProps) {
  const sorted = useMemo(
    () => [...worn].sort((a, b) => a.item.z - b.item.z),
    [worn]
  );

  return (
    <div className="absolute inset-0">
      <img
        src={CHARACTER_BASE[characterId]}
        alt="Персонаж"
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />
      {sorted.map(({ item }) => (
        <img
          key={item.id}
          src={item.src}
          alt={item.name}
          className="absolute"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            width: `${item.width}%`,
            height: `${item.height}%`,
            zIndex: item.z,
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}

export const MemoizedCharacterStage = memo(CharacterStage);
