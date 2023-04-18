import { CURRENT_PICKS } from '../globals';
import { g, q } from '../lib';
import './pencil';
import './eraser';
import './zoom';

export const event = {
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

let init = false;
export default function buildToolEvents() {
  // Eventos solo en el canvas
  q(`#preview-layer td`, (pixel) => {
    pixel.addEventListener('mouseover', (e) => event.mouseover(getParams(e)));
    pixel.addEventListener('mousedown', (e) => event.mousedown(getParams(e)));
    pixel.addEventListener('click', (e) => event.click(getParams(e)));
    pixel.addEventListener('contextmenu', (e) => event.contextmenu(getParams(e)));
  });

  // Eventos generales (Solo asignar una vez)
  if (!init) {
    g('canvas').addEventListener('mouseleave', (e) => event.canvas_mouseleave(getParams(e)));
    document.addEventListener('mouseup', (e) => event.mouseup(getParams(e)));

    init = true;
  }
}

// Asignar atributo de la herramienta donde se requiera en el DOM.
export function declareTool(e) {
  g('canvas').setAttribute('tool', e);
  g('tool-picker').setAttribute('tool', e);
}

function getParams(e) {
  let target = null;
  let preview = null;

  // Si el evento ocurrio en el Canvas, enviar como objetivo la celda del Layer actualmente seleccionado
  if (e.target.offsetParent !== null) {
    if (e.target.offsetParent.id === 'preview-layer') {
      target = document.querySelector(`.layer[n="${CURRENT_PICKS.layer}"] #${e.target.id}`);
      preview = e.target;
    }
  }

  return {
    event: e,
    preview,
    target,
  };
}
