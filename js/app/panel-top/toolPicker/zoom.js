import { CURRENT_PICKS } from '../../../globals';
import { event } from './_toolPicker';
import { $, c, g } from '../../../lib';

const css = $(':root');
const cssVar = c(css);

g('tool-zoom').addEventListener('click', () => {
  // Declarar Herramienta
  CURRENT_PICKS.tool = 'zoom';

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
