import { CANVAS_SETTINGS, CURRENT_PICKS, LAYER_MAP } from '../../../globals';
import { $, g, q } from '../../../lib';

export default function buildContainer() {
  let containerHTML = '';

  // Crear y Actualizar Layers actuales en cada cambio sobre los mismos
  LAYER_MAP.onChange('layers-options-container', (e) => {
    // Aplicar solo si no son el preview.
    if (e.parentElement.id !== 'preview-layer') {
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
    }
  });

  // Aplicar CSS al layer actualmente seleccionado
  CURRENT_PICKS.onLayerChange('layers-options-container', (e) => {
    const prevLayer = $(`.layers-options-container-item[n="${CURRENT_PICKS.layer}"]`);
    const newLayer = $(`.layers-options-container-item[n="${e}"]`);

    // Remover seleccion al layer anteriormente seleccionado
    if (prevLayer !== null) {
      prevLayer.removeAttribute('selected');
    }

    // Añadir seleccion al layer seleccionado
    if (newLayer !== null) {
      newLayer.setAttribute('selected', '');
    }
  });
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

      // Si el elemento eliminado es el layer seleccionado actualmente, anular el layer actual
      if (n === CURRENT_PICKS.layer) {
        CURRENT_PICKS.layer = null;
      }
    }
  });

  CANVAS_SETTINGS.setSize(width, height);
}

function toggleLayer(n, item) {
  const state = item.getAttribute('hide');

  // Si el item no posee el atributo <hide>, asignar el atributo y ocultar el layer real
  if (state === null) {
    g(`layer-${n}`).style.display = 'none';
    item.setAttribute('hide', '');

    // Si se oculto el layer seleccionado, anular el layer actual
    if (n === CURRENT_PICKS.layer) {
      CURRENT_PICKS.layer = null;
    }
  }
  // De lo contrario, eliminar atributo y mostrar el layer
  else {
    g(`layer-${n}`).style.display = 'block';
    item.removeAttribute('hide');

    // Si se esta mostrando un layer al estar el actual anulado, seleccionar el layer actual
    if (CURRENT_PICKS.layer === null) {
      CURRENT_PICKS.layer = n;
    }
  }
}
