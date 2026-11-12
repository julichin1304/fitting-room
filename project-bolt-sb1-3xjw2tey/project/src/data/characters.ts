export type CharacterId = 'catwoman' | 'barbie' | 'wednesday';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  title: string;
  description: string;
  colors: { bg: string; accent: string; text: string };
}

export const CHARACTERS: CharacterInfo[] = [
  {
    id: 'catwoman',
    name: 'ЖЕНЩИНА-КОШКА',
    title: 'Дерзкая элегантность',
    description:
      'Смелая, независимая и загадочная. Чёрная кожа, точёные силуэты и хищные детали — её фирменный стиль.',
    colors: { bg: '#16151a', accent: '#c9a227', text: '#f4efe6' },
  },
  {
    id: 'barbie',
    name: 'БАРБИ',
    title: 'Сияющий гламур',
    description:
      'Яркая, женственная и уверенная. Розовый во всех оттенках, блёстки, каблуки и безупречные аксессуары.',
    colors: { bg: '#fdf1f4', accent: '#d4567c', text: '#5a2436' },
  },
  {
    id: 'wednesday',
    name: 'УЭНСДЭЙ',
    title: 'Тёмная неординарность',
    description:
      'Ироничная, независимая и немного бунтарская. Строгий чёрный, готические детали и холодное спокойствие.',
    colors: { bg: '#15171a', accent: '#8f9aa8', text: '#e8eaee' },
  },
];

export const CHARACTER_MAP: Record<CharacterId, CharacterInfo> = CHARACTERS.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CharacterId, CharacterInfo>
);

/* ---------------- Quiz ---------------- */

export type QuizOptionKey = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuizOption {
  key: QuizOptionKey;
  text: string;
  /** Points added to each character for this answer. */
  scores: Partial<Record<CharacterId, number>>;
}

export interface QuizQuestion {
  id: number;
  heading: string;
  options: QuizOption[];
}

const A = (points: Partial<Record<CharacterId, number>>): QuizOption['scores'] => points;

export const QUIZ: QuizQuestion[] = [
  {
    id: 1,
    heading: 'Какой стиль одежды тебе ближе всего?',
    options: [
      {
        key: 'A',
        text: 'Элегантный и женственный.',
        scores: A({ barbie: 1, catwoman: 1 }),
      },
      {
        key: 'B',
        text: 'Яркий, гламурный и эффектный.',
        scores: A({ barbie: 2 }),
      },
      {
        key: 'C',
        text: 'Повседневный, комфортный и расслабленный.',
        scores: A({ wednesday: 1 }),
      },
      {
        key: 'D',
        text: 'Дерзкий, альтернативный и необычный.',
        scores: A({ wednesday: 1, catwoman: 1 }),
      },
      {
        key: 'E',
        text: 'Романтичный и нежный.',
        scores: A({ barbie: 1 }),
      },
    ],
  },
  {
    id: 2,
    heading: 'Какие цвета чаще всего привлекают тебя в одежде?',
    options: [
      {
        key: 'A',
        text: 'Чёрный, графитовый, глубокие оттенки.',
        scores: A({ catwoman: 1, wednesday: 1 }),
      },
      {
        key: 'B',
        text: 'Розовый, фуксия, яркие и насыщенные цвета.',
        scores: A({ barbie: 2 }),
      },
      {
        key: 'C',
        text: 'Бежевый, белый, коричневый, нейтральные оттенки.',
        scores: A({ wednesday: 1 }),
      },
      {
        key: 'D',
        text: 'Контрастные сочетания и необычные цвета.',
        scores: A({ wednesday: 1, catwoman: 1 }),
      },
      {
        key: 'E',
        text: 'Пастельные и нежные оттенки.',
        scores: A({ barbie: 1, wednesday: 1 }),
      },
    ],
  },
  {
    id: 3,
    heading: 'В каком образе ты чувствуешь себя максимально уверенно?',
    options: [
      {
        key: 'A',
        text: 'Эффектное платье и каблуки.',
        scores: A({ barbie: 2, catwoman: 1 }),
      },
      {
        key: 'B',
        text: 'Стильный total black с выразительными деталями.',
        scores: A({ catwoman: 2, wednesday: 1 }),
      },
      {
        key: 'C',
        text: 'Джинсы, удобный топ и модная обувь.',
        scores: A({ wednesday: 2 }),
      },
      {
        key: 'D',
        text: 'Необычный многослойный образ с интересными аксессуарами.',
        scores: A({ wednesday: 2, catwoman: 1 }),
      },
      {
        key: 'E',
        text: 'Романтичный образ с юбкой или красивым платьем.',
        scores: A({ barbie: 2 }),
      },
    ],
  },
  {
    id: 4,
    heading: 'Какие аксессуары ты выбираешь?',
    options: [
      {
        key: 'A',
        text: 'Массивные украшения и заметные детали.',
        scores: A({ catwoman: 2 }),
      },
      {
        key: 'B',
        text: 'Изящные украшения, сумочки и красивые очки.',
        scores: A({ barbie: 2 }),
      },
      {
        key: 'C',
        text: 'Минимум аксессуаров, только самое необходимое.',
        scores: A({ wednesday: 1, catwoman: 1 }),
      },
      {
        key: 'D',
        text: 'Необычные украшения, ремни, цепи и акцентные детали.',
        scores: A({ wednesday: 2, catwoman: 1 }),
      },
      {
        key: 'E',
        text: 'Деликатные украшения и романтичные аксессуары.',
        scores: A({ barbie: 1 }),
      },
    ],
  },
  {
    id: 5,
    heading: 'Какое описание больше всего тебе подходит?',
    options: [
      {
        key: 'A',
        text: 'Уверенная, независимая и загадочная.',
        scores: A({ catwoman: 3 }),
      },
      {
        key: 'B',
        text: 'Яркая, общительная и любящая внимание.',
        scores: A({ barbie: 3 }),
      },
      {
        key: 'C',
        text: 'Спокойная, свободная и практичная.',
        scores: A({ wednesday: 1, catwoman: 1 }),
      },
      {
        key: 'D',
        text: 'Неординарная, смелая и немного бунтарская.',
        scores: A({ wednesday: 3 }),
      },
      {
        key: 'E',
        text: 'Мечтательная, романтичная и эмоциональная.',
        scores: A({ barbie: 2, wednesday: 1 }),
      },
    ],
  },
];

/** Deterministic tie-break priority when scores are equal. */
const TIE_BREAK: CharacterId[] = ['barbie', 'wednesday', 'catwoman'];

export function calculateRecommendation(
  answers: (QuizOptionKey | null)[]
): CharacterId {
  const totals: Record<CharacterId, number> = {
    catwoman: 0,
    barbie: 0,
    wednesday: 0,
  };

  QUIZ.forEach((question, qIndex) => {
    const chosen = answers[qIndex];
    if (!chosen) return;
    const option = question.options.find((o) => o.key === chosen);
    if (!option) return;
    for (const [id, pts] of Object.entries(option.scores)) {
      totals[id as CharacterId] += pts as number;
    }
  });

  const order: CharacterId[] = [...TIE_BREAK].sort(
    (a, b) => totals[b] - totals[a] || TIE_BREAK.indexOf(a) - TIE_BREAK.indexOf(b)
  );
  return order[0];
}

export const REASON_BY_CHARACTER: Record<CharacterId, string> = {
  catwoman:
    'Тебе близки смелые силуэты, уверенность и выразительные детали. Твоя энергия — Женщина-кошка.',
  barbie:
    'Ты любишь яркость, женственность и эффектные образы. Твой персонаж — Барби.',
  wednesday:
    'Тебе нравятся необычные решения, тёмная эстетика и независимость. Твой персонаж — Уэнсдэй.',
};
