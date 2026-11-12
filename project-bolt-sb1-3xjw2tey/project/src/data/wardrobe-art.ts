import type { CharacterId } from './characters';

type Palette = { skin: string; hair: string; main: string; accent: string; shadow: string };
const palettes: Record<CharacterId, Palette> = {
  catwoman: { skin: '#d9a98f', hair: '#17151b', main: '#17151b', accent: '#c6a15b', shadow: '#6e4b43' },
  barbie: { skin: '#efc1a8', hair: '#d8a34c', main: '#ed72a2', accent: '#f7d8e5', shadow: '#a86d64' },
  wednesday: { skin: '#e3c5b5', hair: '#17171b', main: '#25262c', accent: '#c8cbd1', shadow: '#82665f' },
};

function svgUrl(body: string): string {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900">' + body + '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

export function characterArt(id: CharacterId): string {
  const p = palettes[id];
  const bg = id === 'barbie' ? '#fff4f8' : id === 'wednesday' ? '#f0eff1' : '#f2eee9';
  const hair = id === 'barbie'
    ? '<path d="M205 205 Q170 65 300 55 Q430 65 395 205 L425 485 Q400 535 370 450 L365 230 Q300 165 235 230 L230 450 Q200 535 175 485Z" fill="' + p.hair + '"/><path d="M370 110 Q445 185 405 360" fill="none" stroke="#f1c77f" stroke-width="13" opacity=".6"/>'
    : '<path d="M205 205 Q175 65 300 55 Q425 65 395 205 L420 500 Q390 545 360 455 L360 225 Q300 165 240 225 L240 455 Q210 545 180 500Z" fill="' + p.hair + '"/>';
  const ears = id === 'catwoman' ? '<path d="M205 155 L215 55 L275 120 Q300 105 325 120 L385 55 L395 155Z" fill="#17151b"/>' : '';
  const body = '<path d="M245 330 Q300 310 355 330 L380 515 Q365 585 360 610 L370 810 Q372 840 350 842 L325 842 Q310 835 312 810 L300 630 L288 810 Q290 835 270 842 L245 842 Q225 840 230 810 L240 610 Q235 585 220 515Z" fill="' + p.skin + '" stroke="' + p.shadow + '" stroke-width="3"/>';
  const baseLook = id === 'catwoman'
    ? '<path d="M238 335 Q300 315 362 335 L350 525 Q370 620 390 805 L325 815 L300 610 L275 815 L210 805 Q230 620 250 525Z" fill="#17151b" stroke="#c6a15b" stroke-width="5"/>'
    : id === 'barbie'
    ? '<path d="M238 335 Q300 315 362 335 L350 520 Q375 590 365 650 L235 650 Q225 590 250 520Z" fill="#ed72a2" stroke="#f7d8e5" stroke-width="5"/><path d="M260 340 L300 395 L340 340" fill="none" stroke="#fff2f7" stroke-width="7"/>'
    : '<path d="M238 335 Q300 315 362 335 L350 520 Q395 625 390 700 Q300 730 210 700 Q205 625 250 520Z" fill="#25262c" stroke="#aeb4c0" stroke-width="5"/>';
  const arms = '<path d="M245 345 Q220 350 207 405 L170 625 Q165 650 183 657 Q200 662 208 640 L270 430Z M355 345 Q380 350 393 405 L430 625 Q435 650 417 657 Q400 662 392 640 L330 430Z" fill="' + p.skin + '" stroke="' + p.shadow + '" stroke-width="3"/>';
  const face = '<ellipse cx="300" cy="205" rx="76" ry="96" fill="' + p.skin + '"/><path d="M265 207 Q278 198 289 207 M311 207 Q322 198 335 207" stroke="#292329" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M288 255 Q300 263 312 255" stroke="#a65e68" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M224 205 Q230 95 300 95 Q370 95 376 205 Q350 155 300 155 Q250 155 224 205Z" fill="' + p.hair + '"/>';
  const collar = id === 'wednesday' ? '<path d="M260 330 L300 390 L340 330 L330 435 L270 435Z" fill="#f6f5f2" stroke="#c4c5ca" stroke-width="4"/>' : '';
  const background = '<rect width="600" height="900" fill="' + bg + '"/><ellipse cx="300" cy="860" rx="155" ry="17" fill="#211c20" opacity=".10"/>';
  const accents = id === 'catwoman' ? '<path d="M230 260 Q300 290 370 260" fill="none" stroke="#17151b" stroke-width="5"/>' : id === 'barbie' ? '<path d="M265 260 Q300 280 335 260" fill="none" stroke="#d56c94" stroke-width="4"/>' : '<path d="M260 260 H340" stroke="#25262c" stroke-width="4"/>';
  return svgUrl(background + hair + ears + body + baseLook + arms + collar + face + accents);
}

function garmentSvg(id: string): string {
  const [whoRaw, kind, numberRaw] = id.split('-');
  const who = whoRaw === 'cat' ? 'catwoman' : whoRaw === 'bar' ? 'barbie' : 'wednesday';
  const p = palettes[who];
  const n = Number(numberRaw) || 1;
  const palette = who === 'barbie' ? ['#e96e9f', '#f5d5e2', '#c53e83'] : who === 'wednesday' ? ['#25252d', '#4c505b', '#17171c'] : ['#17151b', '#38323b', '#242027'];
  const c = palette[(n - 1) % palette.length];
  const gold = who === 'catwoman' ? '#c6a15b' : who === 'barbie' ? '#f4c9d9' : '#aeb4c0';
  let shape = '';

  if (kind === 'top') {
    const sleeve = n === 2
      ? '<path d="M238 340 L205 365 L190 455 L225 465 L260 395 M362 340 L395 365 L410 455 L375 465 L340 395Z" fill="' + c + '" stroke="' + gold + '" stroke-width="5"/>'
      : '<path d="M238 340 L205 365 L220 435 L250 415 M362 340 L395 365 L380 435 L350 415Z" fill="' + c + '" stroke="' + gold + '" stroke-width="5"/>';
    const bodice = n === 1
      ? '<path d="M238 337 Q267 325 280 350 L300 368 L320 350 Q333 325 362 337 L350 515 Q300 540 250 515Z" fill="' + c + '" stroke="' + gold + '" stroke-width="6"/><path d="M280 355 L300 390 L320 355" fill="none" stroke="' + gold + '" stroke-width="5"/>'
      : n === 2
      ? '<path d="M245 340 Q270 325 285 350 L300 370 L315 350 Q330 325 355 340 L350 520 L250 520Z" fill="' + c + '" stroke="' + gold + '" stroke-width="6"/><path d="M280 380 L300 400 L320 380 M300 400 V505" stroke="' + gold + '" stroke-width="5" fill="none"/>'
      : '<path d="M240 340 Q270 325 285 350 L300 370 L315 350 Q330 325 360 340 L350 520 L250 520Z" fill="' + c + '" stroke="' + gold + '" stroke-width="6"/><path d="M260 420 H340 M255 450 H345 M255 480 H345" stroke="' + gold + '" stroke-width="4"/>';
    shape = sleeve + bodice;
  } else if (kind === 'bottom') {
    if (n === 1) {
      shape = '<path d="M225 505 L375 505 L365 585 Q355 630 390 815 L325 820 L300 620 L275 820 L210 815 Q245 630 235 585Z" fill="' + c + '" stroke="' + gold + '" stroke-width="6"/><path d="M225 530 H375" stroke="' + gold + '" stroke-width="7"/>';
    } else if (n === 2) {
      shape = '<path d="M225 505 L375 505 L360 590 L345 820 L305 820 L300 625 L295 820 L255 820 L240 590Z" fill="' + c + '" stroke="' + gold + '" stroke-width="6"/><path d="M225 535 H375 M300 535 V610" stroke="' + gold + '" stroke-width="5" fill="none"/>';
    } else {
      shape = '<path d="M220 505 L380 505 L395 690 Q300 735 205 690Z" fill="' + c + '" stroke="' + gold + '" stroke-width="6"/><path d="M245 520 L230 685 M275 520 L270 700 M325 520 L330 700 M355 520 L370 685" stroke="' + gold + '" stroke-width="4" opacity=".8"/>';
    }
  } else if (kind === 'dress') {
    shape = n === 1
      ? '<path d="M238 337 Q270 320 285 350 L300 370 L315 350 Q330 320 362 337 L350 515 Q395 635 420 690 Q300 745 180 690 Q205 635 250 515Z" fill="' + c + '" stroke="' + gold + '" stroke-width="7"/><path d="M280 355 L300 395 L320 355" fill="none" stroke="' + gold + '" stroke-width="5"/>'
      : n === 2
      ? '<path d="M238 337 Q270 320 285 350 L300 370 L315 350 Q330 320 362 337 L350 515 Q400 650 410 735 Q300 770 190 735 Q200 650 250 515Z" fill="' + c + '" stroke="' + gold + '" stroke-width="7"/><path d="M320 540 L355 730" stroke="' + gold + '" stroke-width="7"/>'
      : '<path d="M238 337 Q270 320 285 350 L300 370 L315 350 Q330 320 362 337 L350 515 L385 700 Q300 735 215 700 L250 515Z" fill="' + c + '" stroke="' + gold + '" stroke-width="7"/><path d="M250 515 H350" stroke="' + gold + '" stroke-width="6"/>';
  } else if (kind === 'shoes') {
    shape = n === 1
      ? '<path d="M230 805 Q260 825 290 805 L300 840 Q270 865 215 852 L215 838Z M310 805 Q340 825 370 805 L385 838 L385 852 Q330 865 300 840Z" fill="' + c + '" stroke="' + gold + '" stroke-width="5"/><path d="M245 850 L235 875 M355 850 L365 875" stroke="' + gold + '" stroke-width="5"/>'
      : n === 2
      ? '<path d="M225 800 L285 800 L295 850 Q260 870 210 855Z M315 800 L375 800 L390 855 Q340 870 305 850Z" fill="' + c + '" stroke="' + gold + '" stroke-width="5"/><path d="M230 825 H285 M315 825 H370" stroke="' + gold + '" stroke-width="5"/>'
      : '<path d="M220 755 L285 755 L292 850 Q255 870 210 855 L210 815Z M315 755 L380 755 L390 815 L390 855 Q345 870 308 850Z" fill="' + c + '" stroke="' + gold + '" stroke-width="5"/><path d="M240 785 L275 785 M325 785 L360 785" stroke="' + gold + '" stroke-width="5"/>';
  } else {
    if (n === 1) {
      shape = '<path d="M250 330 Q300 390 350 330" fill="none" stroke="' + gold + '" stroke-width="9"/><circle cx="300" cy="390" r="13" fill="' + c + '" stroke="' + gold + '" stroke-width="5"/>';
    } else if (n === 2) {
      shape = '<path d="M220 190 Q300 125 380 190" fill="none" stroke="' + c + '" stroke-width="20"/><path d="M300 150 Q265 105 245 145 Q270 185 300 170 Q330 185 355 145 Q335 105 300 150Z" fill="' + gold + '"/>';
    } else if (n === 3) {
      shape = '<path d="M365 470 Q420 445 445 500 L430 610 Q385 625 360 590Z" fill="' + c + '" stroke="' + gold + '" stroke-width="6"/><path d="M370 475 Q400 430 430 470" fill="none" stroke="' + gold + '" stroke-width="5"/>';
    } else {
      shape = '<path d="M230 205 Q300 165 370 205 L360 235 Q300 205 240 235Z" fill="' + c + '" stroke="' + gold + '" stroke-width="5"/><path d="M250 205 L265 225 M335 225 L350 205" stroke="' + gold + '" stroke-width="5"/>';
    }
  }
  return svgUrl(shape);
}

const realClothingPng = {
  blueDress: 'https://purepng.com/download/kr7rwBwLJxsAqGeWcNoRRsDmWPcNCP54u4bt21KTYHUbf5RUvRFodJWpe9SPRCxVshv7FZ0OUJbpq6OyJL98pCZeWG3jSciDji15UoofoFvbylWO1L13waJDMMwTUg5jxiGv3qAeX3nBgmipz2KITqxdjXvS7gkTRoNcMF5sO0cww1D0NS3Gxfzl2smNnP7gs9jVGjbZ/small',
  redDress: 'https://purepng.com/download/4QIkj9hQhQQjtV2ffYGfVUwfvGbbZzli1iKyW27GLrqM8RY1K24vPLCAj7Q5LOTU6rJgveDoErBObhGTutoZm1cLlvuBGoVOwDLcwUHMFFQcEKwOCmubvlW3422lOGK7VHvgmodl84EIEKIWDrIB0hrQeRz7D6JwdHQGAKubHeQcrkf88caoYVm1NSkKMKNj91YKRYMX/small',
  jeans: 'https://purepng.com/download/4AoLHAduwnGHmZLbz4CToZT1YbV5i7bXWW5U9SRQklX96XGe14v5uhgaWYKtcy6W23Avm0vMilymtn5x5usBAJtL0dHug4SXHNtDav3SxtM8vtbpGARt9F3vWcNDMg6znO1rNbuQFje1KpyPY4WUmsRTyat3p49NWbEGXcL2iEufiV5fnFtkyjPBlf33pWYHtQ3Vqm7v/small',
  blackShirt: 'https://purepng.com/download/z4eh7haaUcyVeBLfCQoqTZeSc7Ja9mQqddnfGuiqFKP5MyzmHT96yFa4zVeohyT6reILTc1wWsNNTWJUZsgxMTAFBVpVnRDdsMgy9ncuL9RaKsaZu3Oc88vNHpq3QP0cx4HmorE8rReoF6BMHStL1r2VbTkylOHxM6a5V3u5GZ8RLcebs0f0rj8zRaK6qC0cJHqK4Cse/small',
  checkShirt: 'https://purepng.com/download/HEybpiucuXvD5xFg6fLzW2jNknTMCDEji1zFTweGZmg47WvMpRDRsH19xCYEyJWfJHKCdHe0Bpm788vJbi3MBebs8AELrWvUiV9v7Zj98VgF92EwXc07WLcbwG5LvMW4d8oYzAgeYbwngl6djdUDw4EPAtQ6uQHufox75t8CVRyQ7YbpF7LYsVPgthzOnbLh86FOVNwJ/small',
  whiteShirt: 'https://purepng.com/download/6oOcyY69U4FkUYWAIzaKBL3Q0nwZLEFs4Cc3Ot32ctyOo6iRRJJArstKQ1Gy7NYz9g6ibLBFrLCqcdNgp4qx1WSeQ46re0e7MNJ3yPEhWRanYXckHKvaFRJ7G7C6nMbP6dc8hJHF0Gi2ACDiIZg0m6AuRpAU9KSuTf00Dh3L4ZNZ9XnHDK3B7xyFvNENqFH6YSgfSatY/small',
  greyShirt: 'https://purepng.com/download/OERuYbHi3x1LJWwd8lwJSur24np4r78Gqlet0rEOiBJmKofMsITQ8fW2d9uRxZiP7cFcZ6YibJF7jSsi0Zjw7BjzVx1IxLuKdm5zh5iACJrJkq7Hh671TJ1TY8rw6qkNo581WiStm87I5uhpZR8fQdK9Qb2We08KEAg2Omp52xK8Nans4QUTYmRp7Ay08PZ77QiMmVfp/small',
};

export function wardrobeArt(id: string): string {
  const [who, kind, numberRaw] = id.split('-');
  const n = Number(numberRaw) || 1;
  if (kind === 'dress') return n % 2 ? realClothingPng.blueDress : realClothingPng.redDress;
  if (kind === 'bottom') return realClothingPng.jeans;
  if (kind === 'top') {
    if (who === 'wed') return realClothingPng.whiteShirt;
    if (who === 'cat') return n % 2 ? realClothingPng.blackShirt : realClothingPng.checkShirt;
    return realClothingPng.greyShirt;
  }
  return garmentSvg(id);
}
