import { CURRENT_PICKS, LAYER_MAP } from '../../../globals';
import { event, getXY } from './_toolPicker';
import { g } from '../../../lib';

g('tool-select').addEventListener('click', () => {
  let area = [];
  let point = { start: { x: null, y: null }, end: { x: null, y: null } };
  let prevPoint = [{ e: { removeAttribute: () => null } }];
  let prevPixel = { removeAttribute: () => null };
  let pressed = false;

  // Declarar Herramienta
  CURRENT_PICKS.tool = 'select';

  // Asignar Eventos
  event.unbindAll();

  event.mousedown = ({ preview }) => {
    // Asignar punto de inicio
    point.start = getXY(preview);
    point.end = getXY(preview);
    pressed = true;

    cleanArea();
    cleanSelect();
    renderSelect();
  };

  event.mouseover = ({ preview }) => {
    if (pressed) {
      // Asignar punto de cierre al mover el mouse
      point.end = getXY(preview);

      cleanSelect();
      renderSelect();
    } else {
      if (preview.getAttribute('selected') === null) {
        cleanHover();
        renderHover(preview);

        prevPixel = preview;
      } else {
        prevPixel = { removeAttribute: () => null };
      }
    }
  };

  event.mouseup = () => {
    pressed = false;

    if (point.start !== null) {
      renderArea();

      console.log(point.start, point.end);
    }

    // Limpiar puntos al finalizar el click
    point.start = null;
    point.end = null;
  };

  event.canvas_mouseleave = () => {
    if (!pressed) {
      cleanHover();
    }
  };

  CURRENT_PICKS.onToolChange('tool-select', () => {
    cleanHover();
    cleanSelect();

    CURRENT_PICKS.offToolChange('tool-select');
  });

  // Funciones Internas
  function renderArea() {
    const layer = LAYER_MAP.layerList['preview-layer'];

    // Organizar puntos de inicio <s> y final <e>
    const sX = point.start.x <= point.end.x ? point.start.x : point.end.x;
    const sY = point.start.y <= point.end.y ? point.start.y : point.end.y;
    const eX = point.start.x >= point.end.x ? point.start.x : point.end.x;
    const eY = point.start.y >= point.end.y ? point.start.y : point.end.y;

    for (let y = sY; y <= eY; y++) {
      for (let x = sX; x <= eX; x++) {
        area.push(layer[y][x]);
      }
    }

    area.forEach((value) => {
      value.setAttribute('selected', '');
    });
  }

  function cleanArea() {
    area.forEach((value) => {
      value.removeAtribute('selected');
    });

    area = [];
  }

  function renderSelect() {
    const layer = LAYER_MAP.layerList['preview-layer'];

    // Organizar puntos de inicio <s> y final <e>
    const sX = point.start.x <= point.end.x ? point.start.x : point.end.x;
    const sY = point.start.y <= point.end.y ? point.start.y : point.end.y;
    const eX = point.start.x >= point.end.x ? point.start.x : point.end.x;
    const eY = point.start.y >= point.end.y ? point.start.y : point.end.y;

    /*
      <e>: HTML del elemento
      <s>: Estilo a aplicar (█┌┴┐├┘┬└┤║═)
      <x>: Punto X del pixel
      <y>: Punto Y del pixel
    */
    const pointMap = [];

    // Si todos los puntos son exactamente iguales
    if (sX === eX && sY === eY) {
      pointMap.push({ e: layer[sY][sX], s: '█', x: sX, y: sY });
    }
    // De lo contrario, Generar Mapa
    else {
      let x = sX;
      let y = sY;
      let phase = 0;

      // Recorrer todo el recuadro
      while (phase !== 4) {
        let s = null;

        /*
          Generar Estilos

        */
        if (phase === 0) {
          if (x === sX) {
            s = '┌';
          }

          if (x !== sX && x !== eX) {
            s = '┴';
          }
        }

        if (phase === 1) {
          if (y === sY) {
            s = '┐';
          }

          if (y !== sY && y !== eY) {
            s = '├';
          }
        }

        if (phase === 2) {
          if (x === eX) {
            s = '┘';
          }

          if (x !== sX && x !== eX) {
            s = '┬';
          }
        }

        if (phase === 3) {
          if (y === eY) {
            s = '└';
          }

          if (y !== sY && y !== eY) {
            s = '┤';
          }
        }

        // Si se debe aplicar algun estilo
        if (s !== null) {
          // Introducirles en sus respectivos puntos
          const foundPoint = pointMap.find((value) => value.x === x && value.y === y);

          // De no existir anteriormente el punto, agregar
          if (!foundPoint) {
            pointMap.push({ e: layer[y][x], s, x, y });
          }
          // De lo contrario, sumar el estilo
          else {
            foundPoint.s += s;
          }
        }

        // Manipulacion de las fases del algoritmo
        switch (phase) {
          case 0: {
            if (x === eX) phase++;
            else x++;

            break;
          }

          case 1: {
            if (y === eY) phase++;
            else y++;

            break;
          }

          case 2: {
            if (x === sX) phase++;
            else x--;

            break;
          }

          case 3: {
            if (y === sY) phase++;
            else y--;

            break;
          }
        }
      }
    }

    // Aplicar estilos
    pointMap.forEach(({ e, s }) => {
      // offset-x | offset-y | blur-radius | spread-radius | color
      let style = '';

      if (s.indexOf('█') !== -1) style += '0 0 0 1px white,';
      if (s.indexOf('┌') !== -1) style += '-1px 0 0 0 white, 0 -1px 0 0 white,';
      if (s.indexOf('┴') !== -1) style += '0 -1px 0 0 white,';
      if (s.indexOf('┐') !== -1) style += '1px 0 0 0 white, 0 -1px 0 0 white,';
      if (s.indexOf('├') !== -1) style += '1px 0 0 0 white,';
      if (s.indexOf('┘') !== -1) style += '1px 0 0 0 white, 0 1px 0 0 white,';
      if (s.indexOf('┬') !== -1) style += '0 1px 0 0 white,';
      if (s.indexOf('└') !== -1) style += '-1px 0 0 white, 0 1px 0 0 white,';
      if (s.indexOf('┤') !== -1) style += '-1px 0 0 0 white,';

      // Eliminar la <,> al final del texto
      style = style.slice(0, style.length - 1);

      e.style.boxShadow = style;
    });

    prevPoint = pointMap;
  }

  function cleanSelect() {
    prevPoint.forEach(({ e }) => {
      e.removeAttribute('style');
    });
  }

  function renderHover(e) {
    e.style.boxShadow = '0 0 0 1px white';
  }

  function cleanHover() {
    prevPixel.removeAttribute('style');
  }
});
