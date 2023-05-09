import { CANVAS_SETTINGS, COLORS, CURRENT_PICKS, LAYER_MAP } from '../../../globals';
import { $, c, g, q } from '../../../lib';

// Eventos dinamicos compartidos entre los diferentes layers
let onmousemove = () => null;
let onmouseup = () => null;

export default function buildContainer() {
  let containerHTML = '';

  // Crear y Actualizar Layers actuales en cada cambio sobre los mismos
  LAYER_MAP.onChange('layers-options-container', (e) => {
    // Aplicar solo si no es el preview-layer.
    if (e.parentElement.id !== 'preview-layer') {
      const n = Number(e.parentElement.getAttribute('n'));
      const size = LAYER_MAP.getSize();
      const canvasLayer = g(`layer-${n}`);

      // Limpiar texto HTML cada vez que se inicie el proceso.
      if (n === 0) containerHTML = '';

      // Generar Elemento
      containerHTML += `
        <div
          n="${n}"
          class="layers-options-container-item" 
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
        setEvents();
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

  // Escuchar mouse al mover los layers & al ser necesario actualizar el preview.
  document.addEventListener('mousemove', (e) => onmousemove(e));

  let onCanvas;
  document.addEventListener('mousedown', (e) => {
    if (e.target.offsetParent !== null) {
      if (e.target.offsetParent.id === 'preview-layer') {
        onCanvas = true;
      }
    }
  });

  document.addEventListener('mouseup', (e) => {
    onmouseup(e);

    if (onCanvas) {
      itemPreview(e);
      onCanvas = false;
    }
  });
}

function setEvents() {
  // Aplicar eventos a cada item
  q('.layers-options-container-item', (e, k) => {
    const hideBtn = e.children[2];
    const removeBtn = e.children[3];
    const n = Number(e.getAttribute('n'));

    // Preparar preview del layer
    itemPreview(n, e);

    // Boton mostrar / ocultar.
    hideBtn.addEventListener('click', () => {
      toggleLayer(n, e);
    });

    // Boton eliminar.
    if (k !== 0) {
      removeBtn.addEventListener('click', () => {
        removeLayer(n);
        CANVAS_SETTINGS.applyChanges();
      });
    }

    // Seleccionar layer
    e.addEventListener('click', (a) => {
      selectLayer(n, e, a);
    });

    // Mover Layer
    moveLayer(n, e);
  });
}

function itemPreview(e, item) {
  const canvasX = CANVAS_SETTINGS.size.x;
  const canvasY = CANVAS_SETTINGS.size.y;

  // Si el item existe, preparar preview
  if (typeof item !== 'undefined') {
    const canvas = document.createElement('canvas');
    let setX = canvasX;
    let setY = canvasY;
    let scale = 0;

    // Calcular escala de pixeles a usar
    while (true) {
      const calcX = 125 / (scale + 1);
      const calcY = 60 / (scale + 1);

      if (calcX < canvasX || calcY < canvasY) break;

      scale++;
    }

    // Generar Canvas
    if (scale !== 0) {
      canvas.setAttribute('width', setX * scale);
      canvas.setAttribute('height', setY * scale);
      canvas.setAttribute('scale', scale);

      item.children[1].replaceChildren(canvas);
    }

    // Renderizar el preview
    render(e);
  }
  // De lo contrario, dibujar el preview del layer que corresponda.
  else {
    if (CURRENT_PICKS.layer !== null) {
      render(CURRENT_PICKS.layer);
    }
  }

  function render(n) {
    const canvas = $(`.layers-options-container-item[n="${n}"] canvas`);
    const scale = Number(canvas.getAttribute('scale'));
    const ctx = canvas.getContext('2d');

    // Limpiar canvas en cada renderizado
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Recorrer todo el layer
    LAYER_MAP.layerList[`layer-${n}`].forEach((y, posY) => {
      y.forEach((x, posX) => {
        const { color, backgroundColor } = c(x);
        const content = x.innerHTML;
        let fill;

        // Si el pixel contiene un caracter y no es transparente, usar el color del caracter
        if (content !== '' && content !== ' ' && color !== COLORS[16]) {
          fill = color;
        }
        // De lo contrario, usar el color del background
        else {
          fill = backgroundColor;
        }

        ctx.fillStyle = fill;
        ctx.fillRect(posX * scale, posY * scale, scale, scale);
      });
    });
  }
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

function removeLayer(e) {
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

  // Aplicar cambios en todo el sistema de layers
  CANVAS_SETTINGS.applyChanges();
}

function selectLayer(n, item, e) {
  let valid = true;

  // El layer seleccionado no esta oculto
  if (item.getAttribute('hide') !== null) {
    valid = false;
  }

  // El click no fue en eliminar u ocultar
  if (e.target.localName === 'button') {
    valid = false;
  }

  // Aplicar si todo es correcto
  if (valid) CURRENT_PICKS.layer = n;
}

function moveLayer(n, item) {
  const itemCss = c(item);
  const ghostItem = buildGhost();
  const container = g('layers-options-container');
  const foundDivs = document.getElementsByTagName('divider');
  let dividers = [];
  let moveTo;

  item.addEventListener('mousedown', (e) => {
    // Asignar funciones a los eventos si no es el click en los botones
    if (e.target.localName !== 'button') {
      onmousemove = handleMove;
      onmouseup = handleUp;
      moveTo = null;
    }
  });

  function handleMove(e) {
    const top = Number(itemCss.top.slice(0, itemCss.top.length - 2));
    const y = top + e.movementY;

    // Inicializar Elementos
    if (item.getAttribute('moving') === null) {
      // Insertar atributos
      item.setAttribute('moving', '');
      item.setAttribute('style', `top: ${item.offsetTop}px`);
      container.setAttribute('moving', '');

      // Generar Ghost Item
      item.parentNode.insertBefore(ghostItem, item);

      // Construir posiciones de los dividers
      for (let k = 0; k < foundDivs.length; k++) {
        dividers.push({
          e: foundDivs.item(k),
          start: k !== 0 ? foundDivs.item(k).offsetTop : 0,
          end: k !== foundDivs.length - 1 ? foundDivs.item(k + 1).offsetTop : 99999,
        });
      }
    }

    // Bloquear movimiento si sobrepasa el header
    if (y >= 40) {
      item.style.top = `${y}px`;
    }

    // Reflejar posicion actual con los dividers
    dividers.map((value, k) => {
      const _y = y + 115;

      if (_y >= value.start && _y < value.end) {
        value.e.setAttribute('target', '');
        moveTo = k;
      } else {
        value.e.removeAttribute('target');
      }
    });
  }

  function handleUp() {
    // Limpiar funciones & atributos
    item.removeAttribute('moving');
    item.removeAttribute('style');
    container.removeAttribute('moving');
    ghostItem.remove();

    dividers.forEach((value) => value.e.removeAttribute('target'));
    dividers = [];

    onmousemove = () => null;
    onmouseup = () => null;

    // Si se realizo un cambio en el orden, reorganizar
    if (moveTo !== null && moveTo !== n) {
      const nodeList = document.querySelectorAll('table[n]');
      let newPick = CURRENT_PICKS.layer;

      nodeList.forEach((e) => {
        const k = Number(e.getAttribute('n'));

        // Si se intenta bajar el layer
        if (moveTo - n > 0) {
          // Si la posicion del elemento actual del foreach es mayor que la del elemento seleccionado && no sobrepasa la posicion donde se movera
          // (para evitar mover layers que deberian quedarse iguales)
          if (k > n && k <= moveTo) {
            const newIndex = k - 1;

            e.id = `layer-${newIndex}`;
            e.setAttribute('n', newIndex);
            e.style.zIndex = newIndex * -1;

            e.parentNode.insertBefore(e, nodeList[k]);

            // Mantener la seleccion del layer aun despues de haberle movido
            if (CURRENT_PICKS.layer === k) newPick = newIndex;
          }

          // Si es el elemento a mover
          if (k === n) {
            e.id = `layer-${moveTo}`;
            e.setAttribute('n', moveTo);
            e.style.zIndex = moveTo * -1;

            e.parentNode.insertBefore(e, nodeList[moveTo + 1]);

            // Seleccionar el layer movido en su nueva posicion
            if (CURRENT_PICKS.layer === k) newPick = moveTo;
          }
        }

        // Si se intenta subir el layer
        if (moveTo - n < 0) {
          // Si la posicion del elemento actual del foreach es menor que la del elemento seleccionado && no sobrepasa la posicion donde se movera
          // (para evitar mover layers que deberian quedarse iguales)
          if (k < n && k >= moveTo) {
            const newIndex = k + 1;
            // console.log(`${k}: ${newIndex}`);

            e.id = `layer-${newIndex}`;
            e.setAttribute('n', newIndex);
            e.style.zIndex = newIndex * -1;

            e.parentNode.insertBefore(e, nodeList[newIndex]);

            // Mantener la seleccion del layer aun despues de haberle movido
            if (CURRENT_PICKS.layer === k) newPick = newIndex;
          }

          // Si es el elemento a mover
          if (k === n) {
            // console.log(`${k}: ${moveTo}`);
            e.id = `layer-${moveTo}`;
            e.setAttribute('n', moveTo);
            e.style.zIndex = moveTo * -1;

            e.parentNode.insertBefore(e, nodeList[moveTo]);

            // Seleccionar el layer movido en su nueva posicion
            if (CURRENT_PICKS.layer === k) newPick = moveTo;
          }
        }
      });

      CURRENT_PICKS.layer = newPick;
      CANVAS_SETTINGS.applyChanges();
    }
  }

  function buildGhost() {
    const temp = document.createElement('div');
    temp.className = 'layers-options-container-ghost-item';

    return temp;
  }
}
