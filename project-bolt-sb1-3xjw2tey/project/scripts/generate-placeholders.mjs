/**
 * Generates the image-asset slot system for MEDIA VOGUE — THE FITTING ROOM.
 *
 * It writes:
 *   public/assets/characters/<char>/base.png                — full-body base slot (600x900)
 *   public/assets/characters/<char>/clothing/<item>.png     — clothing slots (transparent PNG)
 *   src/data/wardrobe.generated.ts                          — typed manifest (positions, layers, names)
 *   public/assets/README.md                                 — slot table with expected dimensions
 *
 * Replace any placeholder PNG with a final illustration using the SAME file name
 * and the SAME pixel dimensions and everything stays perfectly aligned.
 */
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const ASSETS = path.join(ROOT, 'public', 'assets');
const STAGE_W = 600;
const STAGE_H = 900;

/* ---------- minimal PNG encoder (RGBA, no dependencies) ---------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function pngEncode(width, height, pixels) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- tiny canvas ---------- */

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function canvas(width, height) {
  const data = Buffer.alloc(width * height * 4);
  const blend = (x, y, rgb, alpha) => {
    if (x < 0 || y < 0 || x >= width || y >= height || alpha <= 0) return;
    const i = (y * width + x) * 4;
    const srcA = alpha / 255;
    const dstA = data[i + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA <= 0) return;
    data[i] = Math.round((rgb[0] * srcA + data[i] * dstA * (1 - srcA)) / outA);
    data[i + 1] = Math.round((rgb[1] * srcA + data[i + 1] * dstA * (1 - srcA)) / outA);
    data[i + 2] = Math.round((rgb[2] * srcA + data[i + 2] * dstA * (1 - srcA)) / outA);
    data[i + 3] = Math.round(outA * 255);
  };
  const fill = (x, y, w, h, hex, alpha) => {
    const rgb = hexToRgb(hex);
    const x0 = Math.max(0, x), y0 = Math.max(0, y);
    const x1 = Math.min(width, x + w), y1 = Math.min(height, y + h);
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) blend(xx, yy, rgb, alpha);
  };
  const frame = (x, y, w, h, t, hex, alpha) => {
    fill(x, y, w, t, hex, alpha);
    fill(x, y + h - t, w, t, hex, alpha);
    fill(x, y, t, h, hex, alpha);
    fill(x + w - t, y, t, h, hex, alpha);
  };
  return { width, height, data, fill, frame, save: () => pngEncode(width, height, data) };
}

/** Draws a clearly-labeled SLOT placeholder: tinted panel + double frame. */
function slotPng(w, h, color) {
  const c = canvas(w, h);
  c.fill(0, 0, w, h, color, 34);
  c.frame(0, 0, w, h, Math.min(8, Math.max(4, Math.round(Math.min(w, h) / 45))), color, 210);
  const inset = Math.round(Math.min(w, h) / 9);
  c.frame(inset, inset, w - inset * 2, h - inset * 2, 2, color, 90);
  return c.save();
}

function basePng(color) {
  const c = canvas(STAGE_W, STAGE_H);
  c.fill(0, 0, STAGE_W, STAGE_H, color, 16);
  c.frame(10, 10, STAGE_W - 20, STAGE_H - 20, 6, color, 200);
  c.frame(34, 34, STAGE_W - 68, STAGE_H - 68, 2, color, 80);
  return c.save();
}

/* ---------- wardrobe data (single source of truth) ---------- */

const DEFAULT_POS = {
  tops: [170, 280, 260, 230],
  bottoms: [180, 470, 240, 300],
  dresses: [155, 280, 290, 500],
  shoes: [175, 760, 250, 110],
};

const CATEGORY_META = {
  tops: { ru: 'ВЕРХ', z: 30 },
  bottoms: { ru: 'НИЗ', z: 20 },
  dresses: { ru: 'ПЛАТЬЯ', z: 25 },
  shoes: { ru: 'ОБУВЬ', z: 10 },
  accessories: { ru: 'АКСЕССУАРЫ', z: 40 },
};

const CHARACTERS = [
  {
    id: 'catwoman',
    name: 'Женщина-кошка',
    color: '#1c1b19',
    items: {
      tops: [
        ['cat-top-1', 'Кожаный топ со шнуровкой'],
        ['cat-top-2', 'Корсетный топ'],
        ['cat-top-3', 'Шёлковый топ с V-вырезом'],
      ],
      bottoms: [
        ['cat-bottom-1', 'Кожаные брюки'],
        ['cat-bottom-2', 'Юбка-карандаш'],
        ['cat-bottom-3', 'Брюки со стрелками'],
      ],
      dresses: [
        ['cat-dress-1', 'Маленькое чёрное платье'],
        ['cat-dress-2', 'Вечернее платье с разрезом'],
        ['cat-dress-3', 'Платье-комбинация'],
      ],
      shoes: [
        ['cat-shoes-1', 'Лодочки на шпильке'],
        ['cat-shoes-2', 'Ботильоны на каблуке'],
        ['cat-shoes-3', 'Сапоги с высоким голенищем'],
      ],
      accessories: [
        ['cat-acc-1', 'Чокер с подвеской', [215, 250, 170, 110]],
        ['cat-acc-2', 'Очки-кошачий глаз', [190, 95, 220, 95]],
        ['cat-acc-3', 'Клатч с цепочкой', [395, 505, 150, 195]],
        ['cat-acc-4', 'Пояс с золотой пряжкой', [180, 455, 240, 75], 32],
      ],
    },
  },
  {
    id: 'barbie',
    name: 'Барби',
    color: '#d4718c',
    items: {
      tops: [
        ['bar-top-1', 'Розовый шёлковый топ'],
        ['bar-top-2', 'Топ с бантом'],
        ['bar-top-3', 'Топ с пайетками'],
      ],
      bottoms: [
        ['bar-bottom-1', 'Юбка-мини'],
        ['bar-bottom-2', 'Прямые джинсы'],
        ['bar-bottom-3', 'Юбка-солнце'],
      ],
      dresses: [
        ['bar-dress-1', 'Платье-бюстье'],
        ['bar-dress-2', 'Коктейльное платье'],
        ['bar-dress-3', 'Платье с блёстками'],
      ],
      shoes: [
        ['bar-shoes-1', 'Розовые лодочки'],
        ['bar-shoes-2', 'Босоножки на платформе'],
        ['bar-shoes-3', 'Слингбэки'],
      ],
      accessories: [
        ['bar-acc-1', 'Жемчужное ожерелье', [215, 250, 170, 110]],
        ['bar-acc-2', 'Обруч с бантом', [185, 60, 230, 85]],
        ['bar-acc-3', 'Сумочка на цепочке', [395, 505, 150, 195]],
        ['bar-acc-4', 'Солнечные очки', [190, 95, 220, 95]],
      ],
    },
  },
  {
    id: 'wednesday',
    name: 'Уэнсдэй',
    color: '#4a4a52',
    items: {
      tops: [
        ['wed-top-1', 'Чёрная блуза'],
        ['wed-top-2', 'Полосатый свитер'],
        ['wed-top-3', 'Трикотажный топ'],
      ],
      bottoms: [
        ['wed-bottom-1', 'Чёрная юбка-миди'],
        ['wed-bottom-2', 'Прямые брюки'],
        ['wed-bottom-3', 'Плиссированная юбка'],
      ],
      dresses: [
        ['wed-dress-1', 'Платье с белым воротником'],
        ['wed-dress-2', 'Платье с кружевом'],
        ['wed-dress-3', 'Платье-футляр'],
      ],
      shoes: [
        ['wed-shoes-1', 'Чёрные ботинки'],
        ['wed-shoes-2', 'Туфли Мэри Джейн'],
        ['wed-shoes-3', 'Ботинки на шнуровке'],
      ],
      accessories: [
        ['wed-acc-1', 'Белый воротник', [210, 255, 180, 115]],
        ['wed-acc-2', 'Полосатые гольфы', [185, 690, 230, 160], 9],
        ['wed-acc-3', 'Сумка-почтальон', [395, 505, 150, 195]],
        ['wed-acc-4', 'Тёмные очки', [190, 95, 220, 95]],
      ],
    },
  },
];

/* ---------- write PNGs ---------- */

const manifest = [];
const readmeRows = [];

for (const character of CHARACTERS) {
  const charDir = path.join(ASSETS, 'characters', character.id);
  const clothDir = path.join(charDir, 'clothing');
  fs.mkdirSync(clothDir, { recursive: true });

  fs.writeFileSync(path.join(charDir, 'base.png'), basePng(character.color));
  readmeRows.push([
    character.id,
    'base',
    'Базовый персонаж (полный рост)',
    'base.png',
    `${STAGE_W}x${STAGE_H}`,
  ]);

  for (const [category, items] of Object.entries(character.items)) {
    for (const entry of items) {
      const [id, name, customPos, zOverride] = entry;
      const pos = customPos || DEFAULT_POS[category];
      const [x, y, w, h] = pos;
      const file = path.join(clothDir, `${id}.png`);
      fs.writeFileSync(file, slotPng(w, h, character.color));
      manifest.push({
        id,
        character: character.id,
        category,
        name,
        src: `assets/characters/${character.id}/clothing/${id}.png`,
        left: +((x / STAGE_W) * 100).toFixed(2),
        top: +((y / STAGE_H) * 100).toFixed(2),
        width: +((w / STAGE_W) * 100).toFixed(2),
        height: +((h / STAGE_H) * 100).toFixed(2),
        z: zOverride ?? CATEGORY_META[category].z,
      });
      readmeRows.push([
        character.id,
        CATEGORY_META[category].ru,
        name,
        `clothing/${id}.png`,
        `${w}x${h}`,
      ]);
    }
  }
}

/* ---------- write typed manifest ---------- */

const ts = `// AUTO-GENERATED by scripts/generate-placeholders.mjs — do not edit by hand.
// Regenerate with: node scripts/generate-placeholders.mjs

import type { CharacterId } from './characters';

export type Category = 'tops' | 'bottoms' | 'dresses' | 'shoes' | 'accessories';

export interface WardrobeItem {
  id: string;
  character: CharacterId;
  category: Category;
  name: string;
  src: string;
  /** Position and size as a percentage of the 2:3 character stage. */
  left: number;
  top: number;
  width: number;
  height: number;
  /** Layer order: shoes 10 < bottoms 20 < dresses 25 < tops 30 < accessories 40. */
  z: number;
}

export const STAGE = { width: ${STAGE_W}, height: ${STAGE_H} };

export const CHARACTER_BASE: Record<CharacterId, string> = {
${CHARACTERS.map((c) => `  ${c.id}: 'assets/characters/${c.id}/base.png',`).join('\n')}
};

export const CATEGORY_LABELS: Record<Category, string> = {
${Object.entries(CATEGORY_META)
  .map(([k, v]) => `  ${k}: '${v.ru}',`)
  .join('\n')}
};

export const WARDROBE: WardrobeItem[] = ${JSON.stringify(manifest, null, 2)};
`;

fs.mkdirSync(path.join(ROOT, 'src', 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'wardrobe.generated.ts'), ts);

/* ---------- write slot README ---------- */

const readme = `# MEDIA VOGUE — THE FITTING ROOM · Слоты иллюстраций

Каждый файл ниже — прозрачный PNG-слот с точным именем и размером.
Замени placeholder на финальную иллюстрацию, сохранив **то же имя файла**
и **те же размеры в пикселях** — позиционирование и слои применятся автоматически.

Сцена персонажа: ${STAGE_W}x${STAGE_H} px (соотношение 2:3).
Порядок слоёв: обувь (z10) → низ (z20) → платья (z25) → верх (z30) → аксессуары (z40).

| Персонаж | Категория | Предмет | Файл (public/assets/characters/...) | Размер px |
| --- | --- | --- | --- | --- |
${readmeRows.map((r) => `| ${r.join(' | ')} |`).join('\n')}

## Требования к финальным иллюстрациям

- base.png — персонаж в полный рост, фронтально, статичная поза, фон прозрачный.
- Одежда рисуется точно под эту позу и натягивается на силуэт без искажений.
- Формат PNG с альфа-прозрачностью (или WebP с альфа-каналом — тогда обнови
  расширение файла в src/data/wardrobe.generated.ts).
`;

fs.writeFileSync(path.join(ASSETS, 'README.md'), readme);

console.log(
  `Generated ${manifest.length} clothing slots + ${CHARACTERS.length} base slots, manifest and README.`
);
