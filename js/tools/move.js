import { declareTool, event } from '.';
import { c, g } from '../lib';

const canvas = g('canvas');
const canvasCss = c('canvas');

g('tool-move').addEventListener('click', () => triggerMove());

export function triggerMove(e = true) {
  let pressed = false;

  // Declarar Herramienta en el DOM
  declareTool('move');

  // Asignar Eventos
  event.unbindAll();

  event.mousedown = () => {
    pressed = true;
    declareTool('moving');
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
    if (e) {
      declareTool('move');
      pressed = false;
    } else {
      event.unbindAll();
    }
  };
}
