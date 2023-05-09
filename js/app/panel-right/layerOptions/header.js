import { CANVAS_SETTINGS, CURRENT_PICKS } from '../../../globals';
import { c, g } from '../../../lib';

export default function buildHeader() {
  const transparency = g('transparency');
  const tValue = g('transparency-value');

  /* 
    Barra de transparencia

  */
  // Aplicar cambios al layer actual
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

  // Actualizar valores al cambiar de layer
  CURRENT_PICKS.onLayerChange('transparency', (e) => {
    const currentLayer = g(`layer-${e}`);

    // Aplicar si el nuevo layer no es nulo.
    if (currentLayer !== null) {
      const cssValue = c(g(`layer-${e}`)).opacity * 100;

      transparency.removeAttribute('disabled');
      transparency.value = cssValue;
      tValue.innerHTML = `${cssValue}%`;
    }
    // Si el nuevo layer es nulo, bloquear barra de transparencia
    else {
      transparency.setAttribute('disabled', '');
      tValue.innerHTML = '--%';
    }
  });

  /*
    Agregar Layer
  
  */
  g('add-layer').addEventListener('click', () => {
    addLayer();
  });
}

function addLayer() {
  const width = CANVAS_SETTINGS.size.x;
  const height = CANVAS_SETTINGS.size.y;
  const k = document.querySelectorAll('.layer').length;

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  table.id = `layer-${k}`;
  table.className = 'layer';
  table.setAttribute('n', k);
  table.setAttribute('style', `z-index: ${k * -1};`);

  for (let y = 0; y < height; y++) {
    const tr = document.createElement('tr');
    tr.id = `y${y}`;

    for (let x = 0; x < width; x++) {
      const td = document.createElement('td');
      td.id = `p${x}-${y}`;
      td.className = 'pixel';

      tr.append(td);
    }

    tbody.append(tr);
  }

  table.append(tbody);
  g('canvas').append(table);

  // Aplicar cambios en el nuevo layer
  CANVAS_SETTINGS.applyChanges();
}
