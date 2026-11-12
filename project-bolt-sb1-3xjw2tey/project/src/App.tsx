import { useMemo, useState } from 'react';

type Persona = 'barbie' | 'catwoman' | 'wednesday';
type Choice = { label: string; detail: string; persona: Persona };
type Question = { eyebrow: string; title: string; note: string; choices: Choice[] };

const personas: Record<Persona, { name: string; tagline: string; description: string; style: string; palette: string; temperament: string; mediaTitle: string; channels: string; advertising: string; image: string; fallback: string; quote: string; }> = {
  barbie: {
    name: 'BARBIE', tagline: 'The main character energy',
    temperament: 'Сангвиник — открытая, общительная, эмоциональная, легко увлекает за собой.',
    mediaTitle: 'Широкий охват и эмоциональное вовлечение',
    channels: 'Telegram-каналы о моде и lifestyle · соцсети · блогеры и инфлюенсеры · digital-реклама · наружные размещения',
    advertising: 'Внешняя: рекламные интеграции у блогеров, digital-баннеры, наружная реклама. Внутренняя: собственные соцсети бренда, Telegram, рассылки и активности для подписчиков.',
    description: 'Ты умеешь превращать повседневность в маленькое событие. Тебе близки яркие впечатления, открытость и смелое самовыражение. Ты не ждёшь повода сиять — ты сама его создаёшь.',
    style: 'Glamour · Pink accents · Statement details',
    palette: 'Розовый / молочный / сияющий',
    image: 'https://ilarge.lisimg.com/image/30171030/740full-barbie-screenshot.jpg',
    fallback: './assets/characters/barbie/pngtree-barbie-doll-in-pink-dress-png-image_18178448.webp',
    quote: 'Жизнь — твой личный подиум. Не забывай занимать центральное место.'
  },
  catwoman: {
    name: 'ЖЕНЩИНА-КОШКА', tagline: 'The art of independence',
    temperament: 'Холерик — решительная, самостоятельная, уверенная, действует целенаправленно.',
    mediaTitle: 'Точное позиционирование и сильный визуальный образ',
    channels: 'Таргетированная digital-реклама · fashion-медиа · тематические сообщества · имиджевые спецпроекты · наружная реклама в точках контакта с целевой аудиторией',
    advertising: 'Внешняя: размещения в fashion-медиа, таргет, имиджевые digital-форматы и наружная реклама. Внутренняя: сайт и приложение бренда, собственные визуальные рубрики и специальные проекты.',
    description: 'Ты ценишь свободу, личные границы и право выбирать собственный маршрут. Твоя уверенность не нуждается в громких заявлениях: в ней есть спокойствие, точность и немного загадки.',
    style: 'Power dressing · Total black · Sharp silhouettes',
    palette: 'Чёрный / графит / винный',
    image: 'https://media.stylist.co.uk/app/uploads/2019/04/02105155/gettyimages-607408330-crop-1554198732-1120x1120.jpg',
    fallback: './assets/characters/catwoman/catwoman-logo-png_seeklogo-27216.png',
    quote: 'Самое сильное заявление — оставаться верной себе.'
  },
  wednesday: {
    name: 'УЭНСДЭЙ', tagline: 'A beautiful contradiction',
    temperament: 'Меланхолик — наблюдательная, вдумчивая, сдержанная, ценит глубину и смысл.',
    mediaTitle: 'Нишевое продвижение и содержательная коммуникация',
    channels: 'Тематические Telegram-каналы · редакционные и нативные публикации · блоги о культуре и искусстве · подкасты · собственные digital-площадки бренда',
    advertising: 'Внешняя: нативные статьи, тематические Telegram-размещения, интеграции в подкастах и профильных медиа. Внутренняя: редакционные материалы бренда, блог, Telegram и другие собственные площадки.',
    description: 'Ты замечаешь то, что другие пропускают, и не стремишься быть удобной или понятной всем. Тебя привлекают глубина, ирония и необычные решения. Твоя индивидуальность — твоя суперсила.',
    style: 'Dark academia · Monochrome · Unusual accents',
    palette: 'Чёрный / белый / холодный серый',
    image: 'https://images2.minutemediacdn.com/image/upload/c_fill%2Cw_1200%2Car_4%3A3%2Cf_auto%2Cq_auto%2Cg_auto/images/ImageExchange/mmsport/385/01k1kr2fjjjfc670rdjs.jpg',
    fallback: './assets/characters/wednesday/Wednesdayaddamscharacterclipartpng_wednesdaytheaddamsfamilypng.jpg',
    quote: 'Быть не как все — не стратегия. Это твоя естественная настройка.'
  }
};

const questions: Question[] = [
  { eyebrow: '01 / FIRST IMPRESSION', title: 'Как ты обычно входишь в новую компанию?', note: 'Выбирай то, что ближе именно тебе.', choices: [
    { label: 'С улыбкой и энергией', detail: 'Легко знакомлюсь и задаю настроение', persona: 'barbie' },
    { label: 'Спокойно оцениваю обстановку', detail: 'Сначала присматриваюсь к людям', persona: 'catwoman' },
    { label: 'Держусь особняком', detail: 'Мне комфортно быть наблюдателем', persona: 'wednesday' }
  ]},
  { eyebrow: '02 / YOUR RULES', title: 'Что для тебя важнее всего?', note: 'Нет правильных или неправильных ответов.', choices: [
    { label: 'Самовыражение', detail: 'Хочу жить ярко и быть заметной', persona: 'barbie' },
    { label: 'Независимость', detail: 'Сама решаю, что мне подходит', persona: 'catwoman' },
    { label: 'Индивидуальность', detail: 'Не хочу подстраиваться под ожидания', persona: 'wednesday' }
  ]},
  { eyebrow: '03 / SOCIAL ENERGY', title: 'Идеальный вечер — это…', note: 'Представь, что завтра никуда не нужно.', choices: [
    { label: 'Встреча, музыка и новые впечатления', detail: 'Чем больше эмоций, тем лучше', persona: 'barbie' },
    { label: 'Стильное место и близкий круг', detail: 'Качество важнее количества', persona: 'catwoman' },
    { label: 'Книга, кино или прогулка наедине', detail: 'Тишина тоже может быть роскошью', persona: 'wednesday' }
  ]},
  { eyebrow: '04 / STYLE DNA', title: 'Как ты выбираешь образ?', note: 'Твой стиль — ещё один способ говорить о себе.', choices: [
    { label: 'Добавляю акцент и настроение', detail: 'Цвет, детали, эффектный выход', persona: 'barbie' },
    { label: 'Выбираю чёткий силуэт', detail: 'Минимализм и уверенная подача', persona: 'catwoman' },
    { label: 'Ищу необычное сочетание', detail: 'Люблю характерные и немного странные вещи', persona: 'wednesday' }
  ]},
  { eyebrow: '05 / UNDER PRESSURE', title: 'Если возникает конфликт, ты…', note: 'Первая естественная реакция.', choices: [
    { label: 'Стараюсь всё обсудить', detail: 'Мне важно восстановить контакт', persona: 'barbie' },
    { label: 'Чётко обозначаю границы', detail: 'Не позволяю нарушать мои правила', persona: 'catwoman' },
    { label: 'Сначала анализирую ситуацию', detail: 'Эмоции не должны мешать выводам', persona: 'wednesday' }
  ]},
  { eyebrow: '06 / INSPIRATION', title: 'Что тебя вдохновляет?', note: 'Выбирай свой источник энергии.', choices: [
    { label: 'Люди, события и новые места', detail: 'Мир полон возможностей', persona: 'barbie' },
    { label: 'Цели и ощущение контроля', detail: 'Мне нравится самой выбирать направление', persona: 'catwoman' },
    { label: 'Искусство, идеи и необычные истории', detail: 'Люблю искать скрытые смыслы', persona: 'wednesday' }
  ]},
  { eyebrow: '07 / YOUR SIGNATURE', title: 'Какое описание тебе ближе?', note: 'Последний штрих — и узнаем твой archetype.', choices: [
    { label: 'Солнечная и открытая', detail: 'Моя энергия объединяет людей', persona: 'barbie' },
    { label: 'Самостоятельная и уверенная', detail: 'Я выбираю себя и свой путь', persona: 'catwoman' },
    { label: 'Наблюдательная и необычная', detail: 'Мне не нужно всеобщее одобрение', persona: 'wednesday' }
  ]}
];

function Masthead() {
  return <header className="masthead">
    <div className="masthead-top"><span>THE DIGITAL FASHION ISSUE</span><span>VOL. 01 — SPECIAL PROJECT</span><span>EST. 2026</span></div>
    <div className="masthead-logo">VOGUE<span className="logo-dot">.</span></div>
    <div className="masthead-bottom"><span>FASHION × PERSONALITY</span><span>МОЙ СТИЛЬ. МОЙ ХАРАКТЕР.</span><span>MEDIA PROJECT</span></div>
  </header>;
}

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Persona[]>([]);
  const [imageFailed, setImageFailed] = useState(false);

  const result = useMemo<Persona>(() => {
    const counts: Record<Persona, number> = { barbie: 0, catwoman: 0, wednesday: 0 };
    answers.forEach(a => counts[a]++);
    const max = Math.max(counts.barbie, counts.catwoman, counts.wednesday);
    const tied = (Object.keys(counts) as Persona[]).filter(k => counts[k] === max);
    return tied.length === 1 ? tied[0] : (answers.slice().reverse().find(a => tied.includes(a)) || 'barbie');
  }, [answers]);

  const start = () => { setAnswers([]); setStep(0); setImageFailed(false); setScreen('quiz'); };
  const choose = (persona: Persona) => {
    const next = [...answers, persona];
    setAnswers(next);
    if (step === questions.length - 1) { setImageFailed(false); setScreen('result'); }
    else setStep(step + 1);
  };
  const current = questions[step];
  const profile = personas[result];

  return <main className="site-shell">
    <Masthead />
    {screen === 'welcome' && <section className="cover-layout">
      <div className="cover-copy">
        <p className="kicker">VOGUE PRESENTS · INTERACTIVE EDITION</p>
        <h1>WHO<br/><em>ARE</em><br/>YOU?</h1>
        <div className="cover-rule"/>
        <p className="cover-lead">ТВОЙ ХАРАКТЕР — ТВОЙ СТИЛЬ</p>
        <p className="cover-text">Три fashion-иконы. Семь вопросов. Один archetype, который отражает твою индивидуальность.</p>
        <button className="primary-button" onClick={start}>ПРОЙТИ ТЕСТ <span>↗</span></button>
        <p className="cover-foot">7 ВОПРОСОВ <i>·</i> 2 МИНУТЫ <i>·</i> 3 РЕЗУЛЬТАТА</p>
      </div>
      <div className="cover-visual cover-trio">
        <div className="cover-character barbie-cover"><img src={personas.barbie.image} onError={e => { e.currentTarget.style.display = "none"; }} alt="Барби"/><span>01 / BARBIE</span></div>
        <div className="cover-character catwoman-cover"><img src={personas.catwoman.image} onError={e => { e.currentTarget.style.display = "none"; }} alt="Женщина-кошка"/><span>02 / CATWOMAN</span></div>
        <div className="cover-character wednesday-cover"><img src={personas.wednesday.image} onError={e => { e.currentTarget.style.display = "none"; }} alt="Уэнсдэй"/><span>03 / WEDNESDAY</span></div>
        <div className="cover-stamp">WHO<br/>ARE<br/><b>YOU?</b></div>
        <div className="cover-caption"><span>THREE ICONS<br/>ONE PERSONALITY TEST</span><span>ISSUE № 01<br/>2026</span></div>
      </div>
      <div className="cover-side-note">A STUDY IN PERSONALITY — 2026</div>
      <div className="character-intro"><p className="kicker">MEET YOUR THREE ARCHETYPES</p><h2>Кто из них <em>ты?</em></h2><div className="character-intro-grid"><article><b>БАРБИ</b><span>Открытость · оптимизм · яркость</span></article><article><b>ЖЕНЩИНА-КОШКА</b><span>Независимость · смелость · контроль</span></article><article><b>УЭНСДЭЙ</b><span>Наблюдательность · ирония · самобытность</span></article></div></div>
    </section>}

    {screen === 'quiz' && <section className="quiz-wrap">
      <div className="quiz-intro"><p className="kicker">THE PERSONALITY EDIT / {String(step + 1).padStart(2,'0')} OF 07</p><h1>Найди свой <em>образ.</em></h1><p>Отвечай интуитивно — здесь нет неправильных вариантов.</p></div>
      <div className="progress-track"><span style={{ width: ((step + 1) / questions.length * 100) + '%' }}/></div>
      <article className="question-card">
        <div className="question-number">QUESTION {String(step + 1).padStart(2,'0')}</div>
        <h2>{current.title}</h2><p className="question-note">{current.note}</p>
        <div className="choices">{current.choices.map((choice, i) => <button className="choice" key={choice.persona} onClick={() => choose(choice.persona)}>
          <span className="choice-index">0{i + 1}</span><span className="choice-text"><b>{choice.label}</b><small>{choice.detail}</small></span><span className="choice-arrow">↗</span>
        </button>)}</div>
        <div className="quiz-bottom"><button className="text-button" onClick={() => step === 0 ? setScreen('welcome') : (setStep(step - 1), setAnswers(answers.slice(0,-1)))}>← НАЗАД</button><span>{step + 1} / {questions.length}</span></div>
      </article>
      <p className="quiz-disclaimer">VOGUE DIGITAL SPECIAL · РАЗВЛЕКАТЕЛЬНЫЙ ТЕСТ НА ОСНОВЕ СТИЛЕВЫХ АРХЕТИПОВ</p>
    </section>}

    {screen === 'result' && <section className="result-wrap">
      <div className="result-heading"><p className="kicker">YOUR PERSONALITY, YOUR EDITION</p><h1>ТВОЙ FASHION-<em>ПОРТРЕТ</em></h1></div>
      <div className="result-grid">
        <div className="result-image">
          <img src={profile.image} alt={profile.name} onError={e => { e.currentTarget.style.display = "none"; }} />
          <span className="image-credit">EDITORIAL MOODBOARD · VOGUE DIGITAL</span>
        </div>
        <div className="result-copy">
          <p className="kicker">YOUR ARCHETYPE IS</p>
          <h2>{profile.name}</h2>
          <p className="result-tagline">{profile.tagline}</p>
          <div className="result-line"/>
          <p className="result-description">{profile.description}</p>
          <div className="style-box"><span>ТВОЙ ТЕМПЕРАМЕНТ</span><b>{profile.temperament}</b></div>
          <div className="style-box"><span>МЕДИАПОДХОД</span><b>{profile.mediaTitle}</b><small>{profile.channels}</small></div>
          <div className="style-box"><span>РЕКЛАМНЫЕ ИНСТРУМЕНТЫ</span><b>{profile.advertising}</b></div>
          <div className="style-box"><span>YOUR STYLE CODE</span><b>{profile.style}</b><small>COLOR STORY: {profile.palette}</small></div>
          <blockquote>“{profile.quote}”</blockquote>
          <button className="primary-button" onClick={start}>ПРОЙТИ ЕЩЁ РАЗ <span>↗</span></button>
        </div>
      </div>
      <div className="result-footer"><span>VOGUE — THE DIGITAL FASHION ISSUE</span><span>STYLE IS PERSONAL. MAKE IT YOURS.</span></div>
    </section>}

    <footer className="site-footer"><span>VOGUE DIGITAL SPECIAL PROJECT</span><span>FASHION × MEDIA × YOU</span><span>© 2026</span></footer>
  </main>;
}
