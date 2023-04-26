import { CURRENT_PICKS } from '../../../globals';
import { event } from './_toolPicker';
import { c, g } from '../../../lib';

g('tool-pencil').addEventListener('click', () => {
  let prevPixel = { style: { color: '', background: '' } };
  let pressed = false;

  // Declarar Herramienta
  CURRENT_PICKS.tool = 'pencil';

  // Asignar Eventos
  event.unbindAll();

  event.mousedown = ({ target }) => {
    pressed = true;
    cleanPrev();
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

  event.mouseup = ({ preview }) => {
    pressed = false;

    if (preview !== null) {
      renderPrev(preview);
      prevPixel = preview;
    }
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
    e.style.opacity = c(`layer-${CURRENT_PICKS.layer}`).opacity;
  }

  function cleanPrev() {
    prevPixel.innerHTML = '';
    prevPixel.style.color = '';
    prevPixel.style.background = '';
    prevPixel.style.opacity = 1;
  }
});
