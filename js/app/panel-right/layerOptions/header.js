import { CANVAS_SETTINGS, CURRENT_PICKS } from '../../../globals';
import { g } from '../../../lib';

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
      const cssValue = getComputedStyle(g(`layer-${e}`)).opacity * 100;

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
