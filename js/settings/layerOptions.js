import { CANVAS_SETTINGS, LAYER_MAP } from './canvas';
import { CURRENT_PICKS } from '../globals';
import { g, $, q } from '../lib';

export default function buildInterface() {
  const inputX = $('#set-canvas-size #x');
  const inputY = $('#set-canvas-size #y');

  // Tamaño del Canvas
  g('set-canvas-size').addEventListener('submit', (e) => {
    const x = Number(inputX.value);
    const y = Number(inputY.value);

    CANVAS_SETTINGS.setSize(x, y);
    e.preventDefault();
  });

  // Barra de transparencia: Aplicar cambios al layer actual
  const transparency = g('transparency');
  const tValue = g('transparency-value');
  transparency.addEventListener('mousedown', (e) => {
    g(`layer-${CURRENT_PICKS.layer}`).style.opacity = e.target.value / 100;
    tValue.innerHTML = `${e.target.value}%`;
  });

  transparency.addEventListener('mousemove', (e) => {
    g(`layer-${CURRENT_PICKS.layer}`).style.opacity = e.target.value / 100;
    tValue.innerHTML = `${e.target.value}%`;
  });

  transparency.addEventListener('mouseup', (e) => {
    g(`layer-${CURRENT_PICKS.layer}`).style.opacity = e.target.value / 100;
    tValue.innerHTML = `${e.target.value}%`;
  });

  // Agregar Layer
  g('add-layer').addEventListener('click', () => {
    addLayer();
  });

  // Crear y Actualizar Layers actuales en cada cambio sobre los mismos
  let containerHTML = '';
  LAYER_MAP.onChange('layers-options-container', (e) => {
    const n = Number(e.parentElement.getAttribute('n'));
    const size = LAYER_MAP.getSize();
    const canvasLayer = g(`layer-${n}`);

    // Limpiar texto HTML cada vez que se inicie el proceso.
    if (n === 0) containerHTML = '';

    // Generar Elemento
    containerHTML += `
      <div class="layers-options-container-item" n="${n}"
        ${CURRENT_PICKS.layer === n ? 'selected' : ''}
        ${canvasLayer.style.display === 'none' ? 'hide' : ''}
      >
        <span>${n + 1})</span>
        <div id="item-preview"></div>
        <button class="hide" n="${n}"></button>
        ${n !== 0 ? `<button class="remove" n="${n}"></button>` : ''}
      </div>

      <divider></divider>
    `;

    // Insertar en el HTML al haber recorrido todos los layers
    if (n === size - 1) {
      g('layers-options-container').innerHTML = containerHTML;

      // Aplicar eventos a cada item
      q('.layers-options-container-item', (e, k) => {
        const hideBtn = e.children[2];
        const removeBtn = e.children[3];
        const n = Number(e.getAttribute('n'));

        // Boton mostrar / ocultar.
        hideBtn.addEventListener('click', () => {
          toggleLayer(n, e);
        });

        // Boton eliminar.
        if (k !== 0) {
          removeBtn.addEventListener('click', () => {
            removeLayer(n);
          });
        }

        // Cambiar layer
        e.addEventListener('click', (a) => {
          /*
            RULES

          */
          let valid = true;

          // El layer seleccionado no esta oculto
          if (e.getAttribute('hide') !== null) {
            valid = false;
          }

          // El click no fue en eliminar u ocultar
          if (a.target.localName === 'button') {
            valid = false;
          }

          // Aplicar si todo es correcto
          if (valid) CURRENT_PICKS.layer = n;
        });
      });
    }
  });

  // Aplicar CSS al layer actualmente seleccionado & barra de transparencia en el panel
  CURRENT_PICKS.onLayerChange('layers-options-container', (e) => {
    const prevLayer = $(`.layers-options-container-item[n="${CURRENT_PICKS.layer}"]`);
    const newLayer = $(`.layers-options-container-item[n="${e}"]`);

    // Remover seleccion al layer anteriormente seleccionado
    if (prevLayer !== null) {
      prevLayer.removeAttribute('selected');
    }

    // Añadir seleccion al layer seleccionado & mostrar transparencia actual
    if (newLayer !== null) {
      const cssValue = getComputedStyle(g(`layer-${e}`)).opacity * 100;

      newLayer.setAttribute('selected', '');

      transparency.removeAttribute('disabled');
      transparency.value = cssValue;
      tValue.innerHTML = `${cssValue}%`;

      g('canvas').removeAttribute('invalid');
    }
    // Si el nuevo layer es nulo, bloquear barra de transparencia & informar en el canvas.
    else {
      g('canvas').setAttribute('invalid', '');

      transparency.setAttribute('disabled', '');
      tValue.innerHTML = '--%';
    }
  });

  // Sincronizar cambios del tamaño del canvas en los inputs X, Y
  CANVAS_SETTINGS.onSizeChange('set-canvas-size', (x, y) => {
    inputX.value = x;
    inputY.value = y;
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

function removeLayer(e) {
  const { width, height } = CANVAS_SETTINGS.getSize();
  let found = false;

  // Buscar el numero del Layer a eliminar
  q('table[n]', (a) => {
    const n = Number(a.getAttribute('n'));

    // Organizar despues de haber eliminado
    if (found) {
      const newIndex = n - 1;

      // Reorganizar el mapa de pixeles
      LAYER_MAP.layerList[`layer-${newIndex}`] = LAYER_MAP.layerList[a.id];
      delete LAYER_MAP.layerList[a.id];

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

      if (n === CURRENT_PICKS.layer) {
        CURRENT_PICKS.layer = null;
      }
    }
  });

  CANVAS_SETTINGS.setSize(width, height);
}

function toggleLayer(n, item) {
  const state = item.getAttribute('hide');

  if (state === null) {
    g(`layer-${n}`).style.display = 'none';
    item.setAttribute('hide', '');

    if (n === CURRENT_PICKS.layer) {
      CURRENT_PICKS.layer = null;
    }
  } else {
    g(`layer-${n}`).style.display = 'block';
    item.removeAttribute('hide');
  }
}
