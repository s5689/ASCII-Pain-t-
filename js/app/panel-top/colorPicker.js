import { COLORS, CURRENT_PICKS } from '../../globals';
import { g, q } from '../../lib';

export default function buildColorPicker() {
  generate();
  setEvents();
}

function generate() {
  const col = [
    [
      'black',
      'rgba(0, 0, 128, 1)',
      'rgba(0, 128, 0, 1)',
      'rgba(0, 128, 128, 1)',
      'rgba(128, 0, 0, 1)',
      'rgba(128, 0, 128, 1)',
      'rgba(128, 128, 0, 1)',
      'rgba(192, 192, 192, 1)',
    ],
    [
      'rgba(128, 128, 128, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 255, 0, 1)',
      'rgba(0, 255, 255, 1)',
      'rgba(255, 0, 0, 1)',
      'rgba(255, 0, 255, 1)',
      'rgba(255, 255, 0, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(0 ,0 ,0 ,0)',
    ],
  ];

  let txt = '<table><tbody><tr>';

  col[0].map((value, k) => (txt += `<td pos="${k}" style="background-color: ${value}"></td>`));

  txt += '</tr><tr>';

  col[1].map((value, k) => (txt += `<td pos="${8 + k}" style="background-color: ${value}"></td>`));

  txt += '</tr></tbody></table>';

  g('color-picker').innerHTML = txt;
}

function setEvents() {
  q('#color-picker td', (e) => {
    e.addEventListener('click', () => {
      const n = e.getAttribute('pos');

      CURRENT_PICKS.color = COLORS[n];
    });

    e.addEventListener('contextmenu', (a) => {
      const n = e.getAttribute('pos');

      CURRENT_PICKS.background = COLORS[n];
      a.preventDefault();
    });
  });
}
