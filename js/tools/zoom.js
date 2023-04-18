import { declareTool, event } from '.';
import { g } from '../lib';

const css = document.querySelector(':root');
const cssVar = getComputedStyle(css);

g('tool-zoom').addEventListener('click', () => {
  // Declarar Herramienta en el DOM
  declareTool('zoom');

  // Asignar Eventos
  event.unbindAll();

  event.click = () => {
    const n = Number(cssVar.getPropertyValue('--zoomLevel'));
    css.style.setProperty('--zoomLevel', n + 1);
  };

  event.contextmenu = ({ event }) => {
    event.preventDefault();

    const n = Number(cssVar.getPropertyValue('--zoomLevel'));
    if (n !== 1) css.style.setProperty('--zoomLevel', n - 1);
  };
});
