import { CANVAS_SETTINGS } from '../../globals';
import { $, g } from '../../lib';

export default function buildCanvasSize() {
  const inputX = $('#set-canvas-size #x');
  const inputY = $('#set-canvas-size #y');

  // Conectar formulario con los eventos
  g('set-canvas-size').addEventListener('submit', (e) => {
    const x = Number(inputX.value);
    const y = Number(inputY.value);

    CANVAS_SETTINGS.setSize(x, y);
    e.preventDefault();
  });

  // Sincronizar cambios del tamaño del canvas en los inputs X, Y
  CANVAS_SETTINGS.onSizeChange('set-canvas-size', (x, y) => {
    inputX.value = x;
    inputY.value = y;
  });
}
