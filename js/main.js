import { COLORS, CURRENT_PICKS } from './globals';
import { buildCanvas } from './settings/canvas';
import buildColorPicker from './settings/colorPicker';
import buildCharPicker from './settings/charPicker';
import charPreview from './misc/charPreview';
import './inputs';

document.fonts.ready.then(() => {
  buildCanvas();
  buildColorPicker();
  buildCharPicker();
  charPreview();

  CURRENT_PICKS.char = '';
  CURRENT_PICKS.color = COLORS[15];
  CURRENT_PICKS.background = COLORS[0];
});
