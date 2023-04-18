import { CANVAS_SETTINGS, LAYER_MAP } from '.';
import { g, q } from '../../lib';

export function setEvents() {
  // Conectar botones del HTML con el sistema
  document.querySelector('#set-canvas-size button').addEventListener('click', () => {
    const x = Number(document.querySelector('#set-canvas-size #x').value);
    const y = Number(document.querySelector('#set-canvas-size #y').value);

    CANVAS_SETTINGS.setSize(x, y);
  });

  g('add-layer').addEventListener('click', () => {
    addLayer();
  });

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

export function addLayer() {
  const { width, height } = CANVAS_SETTINGS.getSize();
  const k = document.querySelectorAll('.layer').length;

  let txt = `
    <table 
      id="layer-${k}" 
      class="layer"
      n="${k}" 
      style="z-index: ${k * -1};"
    ><tbody>`;

  for (let y = 0; y < height; y++) {
    txt += `<tr id="y${y}">`;

    for (let x = 0; x < width; x++) {
      txt += `<td id="p${x}-${y}" class="pixel"></td>`;
    }

    txt += '</tr>';
  }

  txt += '</tbody></table>';
  g('canvas').innerHTML += txt;

  // Triggerear almacenamiento de celdas en el mapa
  CANVAS_SETTINGS.setSize(width, height);
}

export function removeLayer(e) {
  let found = false;

  // Buscar el numero del Layer a eliminar
  q('table[n]', (a) => {
    const n = Number(a.getAttribute('n'));

    // Organizar despues de haber eliminado
    if (found) {
      const newIndex = n - 1;

      // Reorganizar el mapa de pixeles
      LAYER_MAP[`layer-${newIndex}`] = LAYER_MAP[a.id];
      delete LAYER_MAP[a.id];

      // Reorganizar el HTML
      a.id = `layer-${newIndex}`;
      a.setAttribute('n', newIndex);
      a.style.zIndex = newIndex * -1;
    }

    // Eliminar al encontrar el elemento
    if (n === e) {
      LAYER_MAP.remove(a.id);

      found = true;
      a.remove();
    }
  });
}
