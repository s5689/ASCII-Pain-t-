import { addLayer, setEvents } from './layers';
import buildToolEvents from '../../tools';

export const CANVAS_SETTINGS = {
  /*
    Size

  */
  _width: 0,
  _height: 0,
  sizeCallbacks: {},

  getSize() {
    return { width: this._width, height: this._height };
  },

  setSize(x, y) {
    Object.values(this.sizeCallbacks).forEach((value) => value(x, y));

    this._width = x;
    this._height = y;
  },

  onSizeChange(id, e) {
    this.sizeCallbacks[id] = e;
  },

  offSizeChange(id) {
    delete this.sizeCallbacks[id];
  },
};

export const LAYER_MAP = {
  save(e) {
    const name = e.offsetParent.id;
    const foundYs = document.querySelectorAll(`#${name} tr`);

    this[name] = [];

    foundYs.forEach((value) => {
      const temp = [];

      for (let k = 0; k < value.children.length; k++) {
        temp.push(value.children[k]);
      }

      this[name].push(temp);
    });

    // Conectar celdas del preview con las herramientas
    if (name === 'preview-layer') buildToolEvents();
  },

  remove(e) {
    delete this[e];
  },
};

export function buildCanvas() {
  setEvents();
  addLayer();

  CANVAS_SETTINGS.setSize(80, 25);
}
