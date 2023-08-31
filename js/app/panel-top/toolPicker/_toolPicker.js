import { CANVAS_SETTINGS, CURRENT_PICKS, LAYER_MAP } from '../../../globals';
import { $, g, q } from '../../../lib';
import './pencil';
import './eraser';
import './fill';
import './select';
import './zoom';
import './move';

export const event = {
  global_contextmenu: function () {},
  global_mousedown: function () {},
  global_mousemove: function () {},
  canvas_mouseleave: function () {},
  mouseover: function () {},
  mousedown: function () {},
  mouseup: function () {},
  click: function () {},
  contextmenu: function () {},

  unbindAll() {
    const eventObj = Object.entries(this);

    for (const [key] of eventObj) {
      if (key !== 'unbindAll') this[key] = function () {};
    }
  },
};

export default function buildToolPicker() {
  let oldSize = { x: null, y: null };
  let newSize = { x: null, y: null };

  // Almacenar tamaño del canvas al aplicar cambios sobre el mismo
  CANVAS_SETTINGS.onSizeChange('tool-picker', (e) => {
    newSize = e;
  });

  LAYER_MAP.onChange('tool-picker', (e) => {
    // Si el layer reescrito es el preview, y
    if (e.parentElement.id === 'preview-layer') {
      // Si el tamaño del canvas cambio en alguna forma, aplicar eventos.
      if (newSize.x !== oldSize.x || newSize.y !== oldSize.y) {
        oldSize = newSize;
        setToolEvents();
      }
    }
  });
}

let init = false;
function setToolEvents() {
  // Eventos solo en el canvas
  q(`#preview-layer td`, (pixel) => {
    setEvent({ element: pixel, e: 'mouseover', f: 'mouseover' });
    setEvent({ element: pixel, e: 'mousedown', f: 'mousedown' });
    setEvent({ element: pixel, e: 'click', f: 'click' });
    setEvent({ element: pixel, e: 'contextmenu', f: 'contextmenu' });
  });

  // Eventos generales (Solo asignar una vez)
  if (!init) {
    setEvent({ element: g('canvas'), e: 'mouseleave', f: 'canvas_mouseleave' });
    setEvent({ element: document, e: 'contextmenu', f: 'global_contextmenu' });
    setEvent({ element: document, e: 'mousedown', f: 'global_mousedown' });
    setEvent({ element: document, e: 'mousemove', f: 'global_mousemove' });
    setEvent({ element: document, e: 'mouseup', f: 'mouseup' });

    // Asignar atributo de la herramienta donde se requiera en el DOM.
    CURRENT_PICKS.onToolChange('tool-declaration', (e) => {
      g('preview-layer').setAttribute('tool', e);
      g('tool-picker').setAttribute('tool', e);
    });

    init = true;
  }
}

// Interfaz de asignacion de todos los eventos.
// { Elemento, Evento, Funcion a ejecutar }
function setEvent({ element, e, f }) {
  element.addEventListener(e, (a) => {
    if (CURRENT_PICKS.layer !== null) {
      event[f](getParams(a));
    }
  });
}

function getParams(e) {
  let target = null;
  let preview = null;

  // Si el evento ocurrio en el Canvas, enviar como objetivo la celda del Layer actualmente seleccionado
  if (e.target.offsetParent !== null) {
    if (e.target.offsetParent.id === 'preview-layer') {
      target = $(`.layer[n="${CURRENT_PICKS.layer}"] #${e.target.id}`);
      preview = e.target;
    }
  }

  return {
    event: e,
    preview,
    target,
  };
}

export function getXY(e) {
  const txt = e.id;
  const x = Number(txt.slice(1, txt.indexOf('-')));
  const y = Number(txt.slice(txt.indexOf('-') + 1, txt.length));

  return { x, y };
}
