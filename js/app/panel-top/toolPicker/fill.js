import { CANVAS_SETTINGS, CURRENT_PICKS, LAYER_MAP } from '../../../globals';
import { event, getXY } from './_toolPicker';
import { c, g } from '../../../lib';

g('tool-fill').addEventListener('click', () => {
  let prevPixel = { removeAttribute: () => null };

  // Declarar Herramienta
  CURRENT_PICKS.tool = 'fill';

  // Asignar Eventos
  event.unbindAll();

  event.mouseover = ({ preview }) => {
    cleanPrev();
    renderPrev(preview);

    prevPixel = preview;
  };

  event.mousedown = ({ target }) => {
    const iX = getXY(target).x;
    const iY = getXY(target).y;

    // Pixel a buscar y reemplazar
    const toReplace = {
      background: c(target).backgroundColor,
      color: c(target).color,
      char: target.innerHTML,
    };

    // Layer actual y Mapa de pixeles a llenar actualmente.
    const layer = LAYER_MAP.layerList[`layer-${CURRENT_PICKS.layer}`];
    let currentMap = [];

    // Ingresar pixel donde se realizo el click al mapa actual si no es igual a lo que ha de ser reemplazado
    if (differentPixel()) {
      currentMap.push({
        e: layer[iY][iX],
        x: iX,
        y: iY,
      });
    }

    // Recorrer y reemplazar el mapa hasta que este vacio
    while (currentMap.length !== 0) {
      const tempMap = [];

      currentMap.forEach(({ e, x, y }) => {
        // Generar los lados del pixel actual para los siguientes ciclos
        const sides = [
          { x: x - 1, y },
          { x: x + 1, y },
          { y: y - 1, x },
          { y: y + 1, x },
        ];

        // Comprobar si los lados de el pixel actual son aptos a reemplazar
        sides.forEach((value) => {
          const sideX = value.x;
          const sideY = value.y;

          // Si el lado no sale del canvas
          if (inCanvas(sideX, sideY)) {
            // Comprobar si existe el pixel en el siguiente ciclo
            const foundMap = tempMap.find((valua) => valua.x === sideX && valua.y === sideY);
            const foundPixel = layer[sideY][sideX];

            // Si es apto a reemplazar y no existe en el siguiente ciclo, ingresarle.
            if (checkSide(foundPixel) && typeof foundMap === 'undefined') {
              tempMap.push({ e: foundPixel, x: sideX, y: sideY });
            }
          }
        });

        renderLayer(e);
      });

      currentMap = tempMap;
    }

    function sleep(e) {
      return new Promise((resolve) => setTimeout(() => resolve(), e));
    }

    /*
      Funciones del Algoritmo
    
    */
    // Comprobar que el punto actual es diferente al punto seleccionado
    function differentPixel() {
      let { color, backgroundColor } = target.style;
      let isDifferent = false;

      // Convertir valores a RGBA de ser necesario
      color = toRGBA(color, 'f');
      backgroundColor = toRGBA(backgroundColor, 'b');

      // Buscar diferencias
      if (color !== CURRENT_PICKS.color) isDifferent = true;
      if (backgroundColor !== CURRENT_PICKS.background) isDifferent = true;
      if (target.innerHTML !== CURRENT_PICKS.char) isDifferent = true;

      // Retornar resultado
      if (isDifferent) return true;
      return false;

      function toRGBA(e, id) {
        // Buscar el patron <rgb(>
        const foundRGB = e.indexOf('rgb(');

        // De encontrarlo, convertir a RGBA
        if (foundRGB !== -1) {
          return e.replace('rgb(', 'rgba(').replace(')', ', 1)');
        }

        // Si esta en blanco, devolver valores de la seleccion actual
        if (e === '') {
          if (id === 'f') {
            return CURRENT_PICKS.color;
          }

          if (id === 'b') {
            return CURRENT_PICKS.background;
          }
        }

        // Si nunguno se aplica, devolver el mismo valor
        return e;
      }
    }

    // Comprobar que el punto se encuentra dentro de los limites del canvas
    function inCanvas(x, y) {
      return x >= 0 && x < CANVAS_SETTINGS.size.x && y >= 0 && y < CANVAS_SETTINGS.size.y;
    }

    // Comprobar que el pixel corresponde al que debe ser reemplazado
    function checkSide(e) {
      return (
        c(e).backgroundColor === toReplace.background &&
        c(e).color === toReplace.color &&
        e.innerHTML === toReplace.char
      );
    }
  };

  event.canvas_mouseleave = () => {
    cleanPrev();
  };

  CURRENT_PICKS.onToolChange('tool-fill', () => {
    cleanPrev();

    CURRENT_PICKS.offToolChange('tool-fill');
  });

  // Funciones Internas
  function renderLayer(e) {
    e.innerHTML = CURRENT_PICKS.char;
    e.style.color = CURRENT_PICKS.color;
    e.style.background = CURRENT_PICKS.background;
  }

  function renderPrev(e) {
    e.innerHTML = CURRENT_PICKS.char;
    e.style.color = CURRENT_PICKS.color;
    e.style.background = CURRENT_PICKS.background;
    e.style.opacity = c(`layer-${CURRENT_PICKS.layer}`).opacity;
  }

  function cleanPrev() {
    prevPixel.innerHTML = '';
    prevPixel.removeAttribute('style');
  }
});
