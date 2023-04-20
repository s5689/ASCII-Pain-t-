import { COLORS, CURRENT_PICKS } from './globals';
import { buildCanvas, CANVAS_SETTINGS } from './settings/canvas';
import buildInterface, { addLayer } from './settings/layerOptions';
import buildColorPicker from './settings/colorPicker';
import buildCharPicker from './settings/charPicker';
import charPreview from './misc/charPreview';
import './inputs';

document.fonts.ready.then(() => {
  buildCanvas();
  buildInterface();
  buildColorPicker();
  buildCharPicker();
  charPreview();
  addLayer();

  CURRENT_PICKS.char = '';
  CURRENT_PICKS.color = COLORS[15];
  CURRENT_PICKS.background = COLORS[16];
  CURRENT_PICKS.layer = 0;
  CANVAS_SETTINGS.setSize(80, 25);
});
