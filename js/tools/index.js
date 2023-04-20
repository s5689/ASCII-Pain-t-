import { CURRENT_PICKS } from '../globals';
import { $, g, q } from '../lib';
import './pencil';
import './eraser';
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
    document.addEventListener('contextmenu', (e) => event.global_contextmenu(getParams(e)));
    document.addEventListener('mousedown', (e) => event.global_mousedown(getParams(e)));
    document.addEventListener('mousemove', (e) => event.global_mousemove(getParams(e)));
    document.addEventListener('mouseup', (e) => event.mouseup(getParams(e)));

    // Asignar atributo de la herramienta donde se requiera en el DOM.
    CURRENT_PICKS.onToolChange('tool-declaration', (e) => {
      g('canvas').setAttribute('tool', e);
      g('tool-picker').setAttribute('tool', e);
    });

    init = true;
  }
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
