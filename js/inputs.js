import { CURRENT_PICKS } from './globals';
import { eraserSize } from './app/panel-top/toolPicker/eraser';
import { event } from './app/panel-top/toolPicker/_toolPicker';
import { g } from './lib';

let prevAction = null;

document.addEventListener('keydown', (e) => {
  // console.log(e.key);

  if (!e.repeat) {
    switch (e.key) {
      case '+': {
        if (CURRENT_PICKS.tool === 'eraser') {
          eraserSize.increase();
        }

        break;
      }

      case '-': {
        if (CURRENT_PICKS.tool === 'eraser') {
          eraserSize.decrease();
        }

        break;
      }

      case ' ': {
        if (prevAction !== 'move' && prevAction !== 'moving') {
          prevAction = CURRENT_PICKS.tool;
          g(`tool-move`).click();
        }

        break;
      }
    }
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case ' ': {
      if (prevAction !== null) {
        g(`tool-${prevAction}`).click();
      } else {
        g('canvas').removeAttribute('tool');
        g('tool-picker').removeAttribute('tool');

        CURRENT_PICKS.tool = null;
        event.unbindAll();
      }

      prevAction = null;
      break;
    }
  }
});
