import { COLORS, CURRENT_PICKS } from '../../globals';
import { g, q } from '../../lib';

const chars = [
  {
    name: 'Todo',
    value: [
      '0ØΘ°ºª∞ø  ',
      '1¹      ¼½',
      '2²        ',
      '3ЭЗ³эз   ¾',
      '4         ',
      '56789     ',
      '          ',
      '          ',
      'AÀÁÂÃÄÅĂĄÆ',
      'aàáâãäåăąæ',
      'ДЛ        ',
      'дл        ',
      'BБßЪЫЬ    ',
      'bбвъыь    ',
      'CĆČÇ©     ',
      'cćčç¢     ',
      'DĎÐ       ',
      'dďđ       ',
      'EÈÉÊËЁĚĘΣЄ',
      'eèéêëёěęεє',
      '@£€       ',
      'F         ',
      'fƒ        ',
      'G         ',
      'g         ',
      'HН        ',
      'hн        ',
      'IÌÍÎÏЇІ   ',
      'iìíîïїі   ',
      'J         ',
      'j         ',
      'K         ',
      'kк        ',
      'LĹĽŁ      ',
      'lĺľłı     ',
      'M         ',
      'mм        ',
      'NŃŇÑИЙП∩№¶',
      'nńňñийпⁿ  ',
      'OÒÓÔÕÖŐ δΦ',
      'oòóôõöőðσφ',
      'PФÞ ₧     ',
      'pфþр      ',
      'Q         ',
      'q         ',
      'RŔŘ Я®­    ',
      'rŕřτя     ',
      'SЅŚŠŞ$§   ',
      'sѕśšş     ',
      'TТŢŤГΓ    ',
      'tтţťг     ',
      'UÙÚÛÜŮŰЦµ ',
      'uùúûüůűц  ',
      'V         ',
      'v         ',
      'WШЩ       ',
      'wшщ       ',
      'XЖх       ',
      'xж×¤      ',
      'YЧУЎÝ ¥   ',
      'yчуўýÿ    ',
      'ZŹŻŽ      ',
      'zźżž      ',
      'ЮΩπ       ',
      'ю         ',
      '          ',
      '          ',
      '▲↑^⌂      ',
      '▼↓ˇ       ',
      '►→>≥»     ',
      '◄←<≤«     ',
      '↕↨↔       ',
      '¡!|‼#&    ',
      '¿?        ',
      '+÷±†‡     ',
      '-¯_       ',
      '=≡‗       ',
      '~≈        ',
      '"`´‘’“”¨˘˝',
      ':;….,˛¸   ',
      '([{⌠/%    ',
      ')]}⌡\\    ',
      '☺☻♠♣♥♦♫♪  ',
      '◘◙☼*○•∙·  ',
      '♀♂√¬⌐∟    ',
      '          ',
      '          ',
      '░▒▓█▄▌▐▀■▬',
      '─┤├┌┐└┘┴┬┼',
      '│╡╞╒╕╘╛╧╤╪',
      '║╢╟╓╖╙╜╨╥╫',
      '═╣╠╔╗╚╝╩╦╬',
    ],
  },
  {
    name: 'Abecedario',
    value: [
      'ABCDEFGHIJ',
      'KLMNÑOPQRS',
      'TUVWXYZ   ',
      '          ',
      'abcdefghij',
      'klmnñopqrs',
      'tuvwxyz   ',
    ],
  },
  {
    name: 'Letras Acentuadas',
    value: [
      'ÀÁÂÃÄÅĂĄÆ ',
      'ÈÉÊËĘĚ    ',
      'ÌÍÎÏ      ',
      'ÒÓÔÕŐÖ    ',
      'ÙÚÛÜŰŮ    ',
      '          ',
      'àáâãäåăąæ ',
      'èéêëęě    ',
      'ìíîï      ',
      'òóôõőö    ',
      'ùúûüűů    ',
      '          ',
      'ÇĆČĎÐĐĹĽŁ ',
      'ŃŇŔŘŚŠŞŢŤÝ',
      'ŹŻŽ       ',
      '          ',
      'çćčďðđĺľł ',
      'ńňŕřśšşţťý',
      'źżž      ÿ',
    ],
  },
  {
    name: 'Griego - Ruso',
    value: [
      'ΓΘΩΣΦ     ',
      'αδεσφτπ   ',
      '          ',
      'АБВГДЕЖЗИЙ',
      'КЛМНОПРСТУ',
      'ФХЦЧШЩЪЫЬЭ',
      'ЮЯЁЄЅІЇЈЎ ',
      '          ',
      'абвгдежзий',
      'клмнопрсту',
      'фхцчшщъыьэ',
      'юяёєѕіїјў ',
    ],
  },
  {
    name: 'Simbolos',
    value: [
      '☺☻♠♣♥♦♫♪♀♂',
      '◘◙○☼•     ',
      '§£€¥$¢    ',
      '¡!|‼#&¿?†‡',
      '+-×÷%=≡~≈ ',
      '↑↓→←↕↨↔   ',
      '▲▼►◄      ',
      '<>√⌂∞∟⌐   ',
      '≤≥        ',
    ],
  },
  {
    name: 'Bloques',
    value: [
      '░▒▓█      ',
      '▄▌▐▀■▬    ',
      '          ',
      '┌──┬──┬──┐',
      '│  │  │  │',
      '├──┼──┼──┤',
      '│  │  │  │',
      '└──┴──┴──┘',
      '┌┐└┘┴┬    ',
      '─│┤┼├     ',
      '          ',
      '╔══╦══╦══╗',
      '║  ║  ║  ║',
      '╠══╬══╬══╣',
      '║  ║  ║  ║',
      '╚══╩══╩══╝',
      '╔╗╚╝╩╦    ',
      '═║╣╬╠     ',
      '          ',
      '╒══╤══╤══╕',
      '│  │  │  │',
      '╞══╪══╪══╡',
      '│  │  │  │',
      '╘══╧══╧══╛',
      '╒╕╘╛╧╤    ',
      '═│╡╪╞     ',
      '          ',
      '╓──╥──╥──╖',
      '║  ║  ║  ║',
      '╟──╫──╫──╢',
      '║  ║  ║  ║',
      '╙──╨──╨──╜',
      '╓╖╙╜╨╥    ',
      '─║╢╫╟     ',
    ],
  },
];

export default function buildCharPicker() {
  generateSelect();
  generateTable(0);
}

function generateSelect() {
  const select = g('char-selector');

  chars.map((value, k) => {
    select.innerHTML += `<option value="${k}">${value.name}</option>`;
  });

  select.addEventListener('change', (e) => generateTable(e.target.value));
}

function generateTable(e) {
  let txt = `<table><tbody>`;

  chars[e].value.forEach((value) => {
    txt += '<tr>';

    const value_length = value.length;
    for (let k = 0; k < value_length; k++) {
      txt += `<td>${value[k]}</td>`;
    }

    txt += '</tr>';
  });

  txt += '</tbody></table>';
  g('char-picker').innerHTML = txt;

  // Conectar eventos a la tabla generada
  setEvents();
}

function setEvents() {
  // Tabla
  CURRENT_PICKS.onColorChange('charPicker', (e) => {
    g('char-picker').style.color = e;
  });

  CURRENT_PICKS.onBackgroundChange('charPicker', (e) => {
    if (e !== COLORS[16]) {
      g('char-picker').style.background = 'none';
      g('char-picker').style.backgroundColor = e;
    } else {
      g('char-picker').style.background = 'url("../assets/transparency.png")';
      g('char-picker').style.backgroundColor = COLORS[0];
    }
  });

  CURRENT_PICKS.onBackgroundChange('charPicker-Hover', (e) => {
    const n = COLORS.findIndex((value) => value === e);
    const dark = [7, 8, 10, 11, 14, 15];

    if (dark.includes(n)) {
      g('char-picker').setAttribute('dark', '');
    } else {
      g('char-picker').removeAttribute('dark', '');
    }
  });

  // Celdas
  let prevChar = null;

  q('#char-picker td', (e) => {
    // Seleccionar caracter al dar click sobre este.
    e.addEventListener('click', () => {
      if (prevChar !== null) prevChar.removeAttribute('selected');
      e.setAttribute('selected', '');

      CURRENT_PICKS.char = e.innerHTML;
      prevChar = e;
    });
  });
}

// Todos los caracteres.
/* 
  !"#$%&'()*+,-./
  0123456789:;<=>?
  @ABCDEFGHIJKLMNO
  PQRSTUVWXYZ[\]^_
  `abcdefghijklmno
  pqrstuvwxyz{|}~
  ¡¢£¤¥¦§¨©ª«¬­®¯
  °±²³´µ¶·¸¹º»¼½¾¿
  ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏ
  ÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞß
  àáâãäåæçèéêëìíîï
  ðñòóôõö÷øùúûüýþÿ
  ĂăĄąĆćČčĎď
  ĐđĘęĚě
  ıĹĺĽľ
  ŁłŃńŇň
  ŐőŔŕŘřŚśŞş
  ŠšŢţŤťŮů
  ŰűŹźŻżŽž
  ƒ
  ˇ
  ˘˙˛˝
  ΓΘ
  ΣΦΩ
  αδε
  πστφ
  ЁЄЅІЇЈЎ
  АБВГДЕЖЗИЙКЛМНОП
  РСТУФХЦЧШЩЪЫЬЭЮЯ
  абвгдежзийклмноп
  рстуфхцчшщъыьэюя
  ёєѕіїјў
  –—‗‘’“”
  †‡•…
  ‰‹›‼
  ⁿ
  ₧€
  №
  ←↑→↓↔↕
  ↨
  ∙√∞∟
  ∩
  ≈
  ≡≤≥
  ⌂
  ⌐
  ⌠⌡
  ─│┌
  ┐└┘├
  ┤┬
  ┴┼
  ═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟
  ╠╡╢╣╤╥╦╧╨╩╪╫╬
  ▀▄█▌
  ▐░▒▓
  ■▬
  ▲►▼
  ◄○
  ◘◙
  ☺☻☼
  ♀♂
  ♠♣♥♦♪♫ 
*/
