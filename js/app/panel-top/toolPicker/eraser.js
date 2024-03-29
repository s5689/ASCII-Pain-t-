import { COLORS, CURRENT_PICKS, LAYER_MAP } from '../../../globals';
import { event, getXY } from './_toolPicker';
import { g } from '../../../lib';

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

  // Declarar Herramienta
  CURRENT_PICKS.tool = 'eraser';

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

  CURRENT_PICKS.onToolChange('tool-eraser', () => {
    cleanPrev();

    CURRENT_PICKS.offToolChange('tool-eraser');
  });

  // Funciones Internas
  function renderLayer(e) {
    const layer = LAYER_MAP.layerList[`layer-${CURRENT_PICKS.layer}`];
    const area = getArea(e);

    area.forEach(({ x, y }) => {
      if (typeof layer[y] !== 'undefined') {
        if (typeof layer[y][x] !== 'undefined') {
          layer[y][x].innerHTML = '';
          layer[y][x].removeAttribute('style');
        }
      }
    });
  }

  function renderPrev(e) {
    const layer = LAYER_MAP.layerList['preview-layer'];
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
    const layer = LAYER_MAP.layerList['preview-layer'];
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
    const { x, y } = getXY(e);
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
