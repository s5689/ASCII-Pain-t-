import { CURRENT_PICKS } from '../globals';
import { LAYER_MAP } from '../settings/canvas';
import { declareTool, event } from '.';
import { g } from '../lib';

export const eraserSize = {
  value: 0,
  onChange: function () {},

  set(e) {
    this.value = e;
  },

  increase() {
    this.onChange('+');
  },

  decrease() {
    if (this.value !== 0) {
      this.onChange('-');
    }
  },
};

g('tool-eraser').addEventListener('click', () => {
  let prevPixel = { id: '', removeAttribute: () => null };
  let pressed = false;
  let onCanvas = false;

  // Declarar Herramienta en el DOM
  declareTool('eraser');

  //Asignar Eventos
  event.unbindAll();

  event.mousedown = ({ target }) => {
    pressed = true;
    renderLayer(target);
  };

  event.mouseover = ({ target, preview }) => {
    // Renderizar en el Layer
    if (pressed) {
      cleanPrev();
      renderLayer(target);
    }
    // Renderizar en el Preview, y limpiar el pixel anterior
    else {
      cleanPrev();
      renderPrev(preview);
    }

    onCanvas = true;
    prevPixel = preview;
  };

  event.mouseup = ({ preview }) => {
    if (preview !== null) renderPrev(preview);
    pressed = false;
  };

  event.canvas_mouseleave = () => {
    cleanPrev();
    onCanvas = false;
  };

  eraserSize.onChange = (e) => {
    if (e === '+') {
      eraserSize.set(eraserSize.value + 1);

      cleanPrev();
      if (onCanvas) event.mouseover({ preview: prevPixel });
    }

    if (e === '-') {
      cleanPrev();

      eraserSize.set(eraserSize.value - 1);
      if (onCanvas) event.mouseover({ preview: prevPixel });
    }
  };

  // Funciones Internas
  function renderLayer(e) {
    const layer = LAYER_MAP[`layer-${CURRENT_PICKS.layer}`];
    const area = getArea(e);

    area.forEach(({ x, y }) => {
      if (typeof layer[y] !== 'undefined') {
        if (typeof layer[y][x] !== 'undefined') {
          layer[y][x].innerHTML = '';
          layer[y][x].style.color = '';
          layer[y][x].style.background = '';
        }
      }
    });
  }

  function renderPrev(e) {
    const layer = LAYER_MAP['preview-layer'];
    const area = getArea(e);

    area.forEach(({ x, y }) => {
      if (typeof layer[y] !== 'undefined') {
        if (typeof layer[y][x] !== 'undefined') {
          layer[y][x].innerHTML = '█';
          layer[y][x].setAttribute('hover', '');
        }
      }
    });
  }

  function cleanPrev() {
    const layer = LAYER_MAP['preview-layer'];
    const area = getArea(prevPixel);

    area.forEach(({ x, y }) => {
      if (typeof layer[y] !== 'undefined') {
        if (typeof layer[y][x] !== 'undefined') {
          layer[y][x].innerHTML = '';
          layer[y][x].removeAttribute('hover');
        }
      }
    });
  }

  function getArea(e) {
    const txt = e.id;
    const x = Number(txt.slice(1, txt.indexOf('-')));
    const y = Number(txt.slice(txt.indexOf('-') + 1, txt.length));
    const area = [];

    let k = eraserSize.value;
    if (k !== 0) {
      while (k !== 0) {
        for (let _y = y - k; _y < y + k * 2; _y++) {
          for (let _x = x - k; _x < x + k * 2; _x++) {
            area.push({ x: _x, y: _y });
          }
        }

        k--;
      }
    } else {
      area.push({ x, y });
    }

    return area;
  }
});
