import { eraserSize } from './tools/eraser';
import { g } from './lib';

document.addEventListener('keydown', (e) => {
  // console.log(e.key);

  switch (e.key) {
    case '+': {
      if (g('canvas').getAttribute('tool') === 'eraser') {
        eraserSize.increase();
      }

      break;
    }

    case '-': {
      if (g('canvas').getAttribute('tool') === 'eraser') {
        eraserSize.decrease();
      }

      break;
    }
  }
});
