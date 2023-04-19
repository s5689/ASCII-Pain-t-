import { CURRENT_PICKS } from '../globals';
import { event } from '.';
import { g } from '../lib';

g('tool-pencil').addEventListener('click', () => {
  let prevPixel = { style: { color: '', background: '' } };
  let pressed = false;

  // Declarar Herramienta
  CURRENT_PICKS.tool = 'pencil';

  // Asignar Eventos
  event.unbindAll();

  event.mousedown = ({ target }) => {
    pressed = true;
    renderLayer(target);
  };

  event.mouseover = ({ target, preview }) => {
    // Renderizar en el Layer
    if (pressed) {
      renderLayer(target);
    }
    // Renderizar en el Preview, y limpiar el pixel anterior
    else {
      cleanPrev();
      renderPrev(preview);

      prevPixel = preview;
    }
  };

  event.mouseup = () => {
    pressed = false;
  };

  event.canvas_mouseleave = () => {
    cleanPrev();
  };

  CURRENT_PICKS.onToolChange('tool-pencil', () => {
    cleanPrev();
  });

  // Funciones Internas
  function renderLayer(e) {
    e.innerHTML = CURRENT_PICKS.char;
    e.style.color = CURRENT_PICKS.color;
    e.style.background = CURRENT_PICKS.background;
  }

  function renderPrev(e) {
    e.innerHTML = CURRENT_PICKS.char;
    e.style.color = CURRENT_PICKS.color;
    e.style.background = CURRENT_PICKS.background;
  }

  function cleanPrev() {
    prevPixel.innerHTML = '';
    prevPixel.style.color = '';
    prevPixel.style.background = '';
  }
});
