import { CURRENT_PICKS } from '../globals';
import { event } from './_index';
import { c, g } from '../lib';

const canvas = g('canvas');
const canvasCss = c('canvas');

g('tool-move').addEventListener('click', () => {
  let pressed = false;

  // Declarar Herramienta
  CURRENT_PICKS.tool = 'move';

  // Asignar Eventos
  event.unbindAll();

  event.mousedown = () => {
    CURRENT_PICKS.tool = 'moving';
    pressed = true;
  };

  event.global_mousemove = ({ event }) => {
    if (pressed) {
      const top = Number(canvasCss.top.slice(0, canvasCss.top.length - 2));
      const left = Number(canvasCss.left.slice(0, canvasCss.left.length - 2));
      const x = event.movementX;
      const y = event.movementY;

      canvas.style.top = `${top + y}px`;
      canvas.style.left = `${left + x}px`;
    }
  };

  event.mouseup = () => {
    CURRENT_PICKS.tool = 'move';
    pressed = false;
  };
});
