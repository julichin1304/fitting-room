import type { CharacterId } from './characters';

const palettes = {
  catwoman: { skin: '#d9a98f', hair: '#17151b', main: '#17151b', accent: '#c6a15b' },
  barbie: { skin: '#f0c3a7', hair: '#d8a34c', main: '#ed72a2', accent: '#f5c7d8' },
  wednesday: { skin: '#e3c5b5', hair: '#17171b', main: '#25262c', accent: '#aeb8c6' },
};

function svgUrl(body: string, viewBox = '0 0 600 900'): string {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '">' + body + '</svg>'
  );
}

export function characterArt(id: CharacterId): string {
  const p = palettes[id];
  const backdrop = '<rect width="600" height="900" fill="' + (id === 'barbie' ? '#fff5f8' : '#f2efeb') + '"/><ellipse cx="300" cy="855" rx="165" ry="20" fill="#000" opacity=".08"/>';
  const hair = id === 'barbie'
    ? '<path d="M205 190 Q185 75 300 65 Q420 65 402 205 L420 440 Q385 510 360 420 L355 220 Q300 175 245 225 L240 440 Q195 500 175 420Z" fill="' + p.hair + '"/>'
    : '<path d="M205 180 Q190 65 300 65 Q410 65 395 180 L410 470 Q380 520 350 430 L350 230 Q300 190 250 230 L250 430 Q220 520 190 470Z" fill="' + p.hair + '"/>';
  const catEars = id === 'catwoman' ? '<path d="M210 148 L225 60 L270 110 Q300 92 330 110 L375 60 L390 148Z" fill="#17151b"/>' : '';
  const legs = '<path d="M230 600 L292 600 L285 805 Q280 835 260 835 L230 835 Q220 825 225 805Z M308 600 L370 600 L375 805 Q380 835 360 835 L330 835 Q320 825 315 805Z" fill="' + p.skin + '" stroke="#b98576" stroke-width="3"/>';
  const shoes = '<path d="M228 810 Q250 825 282 812 L292 855 Q270 870 220 858Z M318 812 Q350 825 372 810 L380 858 Q330 870 308 855Z" fill="' + p.main + '" stroke="' + p.accent + '" stroke-width="4"/>';
  const arms = '<path d="M238 350 Q205 375 190 500 L160 650 Q158 680 178 680 Q198 680 205 650 L270 430Z M362 350 Q395 375 410 500 L440 650 Q442 680 422 680 Q402 680 395 650 L330 430Z" fill="' + p.skin + '" stroke="#b98576" stroke-width="3"/>';
  const dress = id === 'barbie'
    ? '<path d="M238 345 Q300 325 362 345 L388 610 Q300 655 212 610Z" fill="#f4d4e0" stroke="#d46d98" stroke-width="5"/><path d="M250 350 L300 405 L350 350" fill="none" stroke="#fff" stroke-width="8"/>'
    : id === 'wednesday'
    ? '<path d="M238 345 Q300 325 362 345 L390 625 L210 625Z" fill="#25262c" stroke="#15151a" stroke-width="5"/><path d="M250 345 L300 410 L350 345 L333 465 L267 465Z" fill="#f1f0ed" stroke="#b8bbc3" stroke-width="4"/>'
    : '<path d="M238 345 Q300 325 362 345 L390 625 L210 625Z" fill="#17151b" stroke="#c6a15b" stroke-width="5"/><path d="M270 350 L300 410 L330 350" fill="none" stroke="#c6a15b" stroke-width="5"/>';
  const face = '<ellipse cx="300" cy="205" rx="79" ry="100" fill="' + p.skin + '"/><path d="M260 205 Q275 195 286 205 M314 205 Q328 195 340 205" stroke="#292329" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M287 255 Q300 265 313 255" stroke="#a65e68" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M220 205 Q232 110 300 105 Q368 110 380 205 Q355 155 300 155 Q245 155 220 205Z" fill="' + p.hair + '"/>';
  return svgUrl(backdrop + hair + catEars + legs + shoes + arms + dress + face);
}

function garmentSvg(id: string): string {
  const parts = id.split('-');
  const who = parts[0] as CharacterId;
  const kind = parts[1];
  const v = Number(parts[2]) || 1;
  const p = palettes[who] || palettes.barbie;
  const colors = who === 'barbie' ? ['#ef79a8', '#f5d4e1', '#c93e82'] : who === 'wednesday' ? ['#24242b', '#454955', '#111116'] : ['#17151b', '#38323b', '#252027'];
  const c = colors[(v - 1) % colors.length];
  const t = p.accent;
  let shape = '';
  if (kind === 'top') {
    shape = '<path d="M125 155 L220 90 L265 125 L335 125 L380 90 L475 155 L430 260 L390 235 L380 490 L220 490 L210 235 L170 260Z" fill="' + c + '" stroke="' + t + '" stroke-width="9" stroke-linejoin="round"/><path d="M265 125 Q300 205 335 125" fill="none" stroke="' + t + '" stroke-width="10"/>';
    if (v === 2) shape += '<path d="M270 130 Q250 60 220 95 Q250 145 300 155 Q350 145 380 95 Q350 60 330 130Z" fill="' + t + '"/>';
    if (v === 3) shape += '<path d="M235 220 H365 M235 260 H365 M235 300 H365" stroke="' + t + '" stroke-width="7"/>';
  } else if (kind === 'bottom') {
    shape = v === 2
      ? '<path d="M150 100 L450 100 L425 210 L390 490 L330 490 L300 260 L270 490 L210 490 L175 210Z" fill="' + c + '" stroke="' + t + '" stroke-width="9"/><path d="M150 150 H450" stroke="' + t + '" stroke-width="9"/>'
      : '<path d="M150 100 L450 100 L430 205 Q410 330 475 490 L325 490 L300 260 L275 490 L125 490 Q190 330 170 205Z" fill="' + c + '" stroke="' + t + '" stroke-width="9"/><path d="M150 150 H450" stroke="' + t + '" stroke-width="9"/>';
  } else if (kind === 'dress') {
    shape = '<path d="M210 90 L265 65 L335 65 L390 90 L365 205 L470 500 Q300 560 130 500 L235 205Z" fill="' + c + '" stroke="' + t + '" stroke-width="10" stroke-linejoin="round"/><path d="M265 65 Q300 145 335 65" fill="none" stroke="' + t + '" stroke-width="10"/>';
    if (v === 2) shape += '<path d="M300 215 L350 500" stroke="' + t + '" stroke-width="8"/>';
    if (v === 3) shape += '<path d="M235 210 H365" stroke="' + t + '" stroke-width="9"/>';
  } else if (kind === 'shoes') {
    shape = '<path d="M90 285 Q155 265 205 205 L245 260 Q235 330 145 350 L85 345Z M355 260 L395 205 Q445 265 510 285 L515 345 L455 350 Q365 330 355 260Z" fill="' + c + '" stroke="' + t + '" stroke-width="10" stroke-linejoin="round"/><path d="M95 345 H145 M455 350 H510" stroke="' + t + '" stroke-width="8"/>';
  } else {
    shape = v === 1
      ? '<path d="M150 190 Q300 95 450 190 L430 225 Q300 155 170 225Z" fill="none" stroke="' + t + '" stroke-width="18"/><circle cx="300" cy="205" r="35" fill="' + c + '" stroke="' + t + '" stroke-width="9"/>'
      : v === 2
      ? '<path d="M135 175 Q300 65 465 175 L430 210 Q300 125 170 210Z" fill="none" stroke="' + c + '" stroke-width="25"/><path d="M300 90 Q250 25 220 90 Q250 140 300 120 Q350 140 380 90 Q350 25 300 90Z" fill="' + t + '"/>'
      : v === 3
      ? '<path d="M175 170 Q300 120 425 170 L465 330 L365 370 L335 245 L265 245 L235 370 L135 330Z" fill="' + c + '" stroke="' + t + '" stroke-width="10"/>'
      : '<path d="M110 190 Q300 80 490 190 L455 240 Q300 150 145 240Z" fill="' + c + '" stroke="' + t + '" stroke-width="9"/><circle cx="300" cy="205" r="55" fill="none" stroke="' + t + '" stroke-width="12"/>';
  }
  return svgUrl(shape, '0 0 600 600');
}

export function wardrobeArt(id: string): string {
  return garmentSvg(id);
}
