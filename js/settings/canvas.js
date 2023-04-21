import buildToolEvents from '../tools/_index';
import { q } from '../lib';

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
  /*
    LayerList
  
  */
  layerList: {},
  callbacks: {},

  getSize() {
    return Object.keys(this.layerList).length - 1;
  },

  save(e) {
    const name = e.parentElement.id;
    const foundYs = document.querySelectorAll(`#${name} tr`);

    this.layerList[name] = [];

    foundYs.forEach((value) => {
      const temp = [];

      for (let k = 0; k < value.children.length; k++) {
        temp.push(value.children[k]);
      }

      this.layerList[name].push(temp);
    });

    // Conectar celdas del preview con las herramientas
    if (name === 'preview-layer') buildToolEvents();
    // Notificar cambios realizados sobre los layers a los eventos conectados
    else Object.values(this.callbacks).forEach((value) => value(e));
  },

  remove(e) {
    delete this.layerList[e];
  },

  onChange(id, e) {
    this.callbacks[id] = e;
  },

  offChange(id) {
    delete this.callbacks[id];
  },
};

export function buildCanvas() {
  // Redimensionar todos los layers al cambiar el tamaño
  CANVAS_SETTINGS.onSizeChange('layers-resize', (newWidth, newHeight) => {
    const oldWidth = CANVAS_SETTINGS.getSize().width;
    const oldHeight = CANVAS_SETTINGS.getSize().height;

    // Aplicar cambios a cada layer
    q('#canvas table tbody', (e) => {
      const widthDiff = newWidth - oldWidth;
      const heightDiff = newHeight - oldHeight;

      let widthAction = () => null;
      let heightAction = () => null;

      if (widthDiff > 0) widthAction = widthExpand;
      if (widthDiff < 0) widthAction = widthReduce;

      if (heightDiff > 0) heightAction = heightExpand;
      if (heightDiff < 0) heightAction = heightReduce;

      heightAction(e, heightDiff);
      widthAction(e, widthDiff);

      // Almacenar celdas en el mapa
      LAYER_MAP.save(e);
    });

    // Acciones en la Altura
    function heightExpand(e, n) {
      const size = e.getElementsByTagName('tr').length;

      for (let k = 0; k < n; k++) {
        let txt = `<tr id="y${k + size}">`;

        for (let j = 0; j < oldWidth; j++) {
          txt += `<td id="p${j}-${k + size}" class="pixel"></td>`;
        }

        txt += '</tr>';
        e.innerHTML += txt;
      }
    }

    function heightReduce(e, n) {
      const foundYs = e.getElementsByTagName('tr');
      const size = foundYs.length;
      const target = size + n;

      for (let k = 0; k < n * -1; k++) {
        foundYs[target].remove();
      }
    }

    // Acciones en la Anchura
    function widthExpand(e, n) {
      const foundYs = e.getElementsByTagName('tr');
      const size = foundYs[0].getElementsByTagName('td').length;

      const foundYs_length = foundYs.length;
      for (let k = 0; k < foundYs_length; k++) {
        for (let j = 0; j < n; j++) {
          foundYs[k].innerHTML += `<td id="p${j + size}-${k}" class="pixel"></td>`;
        }
      }
    }

    function widthReduce(e, n) {
      const foundYs = e.getElementsByTagName('tr');
      const size = foundYs[0].getElementsByTagName('td').length;
      const target = size + n;

      const foundYs_length = foundYs.length;
      for (let k = 0; k < foundYs_length; k++) {
        for (let j = 0; j < n * -1; j++) {
          foundYs[k].children[target].remove();
        }
      }
    }
  });
}
