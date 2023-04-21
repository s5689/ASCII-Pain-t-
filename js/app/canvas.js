import { CANVAS_SETTINGS, CURRENT_PICKS, LAYER_MAP } from '../globals';
import { g, q } from '../lib';

export default function canvas() {
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

  // Cursor <No Permitido> al seleccionar un layer nulo.
  CURRENT_PICKS.onLayerChange('canvas', (e) => {
    if (e === null) {
      g('canvas').setAttribute('invalid', '');
    } else {
      g('canvas').removeAttribute('invalid');
    }
  });
}
