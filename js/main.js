import { CANVAS_SETTINGS, COLORS, CURRENT_PICKS } from './globals';
import panelLeft from './app/panel-left/_panel-left';
import panelTop from './app/panel-top/_panel-top';
import panelRight from './app/panel-right/_panel-right';
import canvas from './app/canvas';
import './inputs';

document.fonts.ready.then(() => {
  panelLeft();
  panelTop();
  panelRight();
  canvas();

  initVars();

  document.getElementById('tool-select').click();
  /*
  
  document.getElementById('test').addEventListener('click', () => {
    CANVAS_SETTINGS.applyChanges();
  });
  */
});

function initVars() {
  CURRENT_PICKS.char = '';
  CURRENT_PICKS.color = COLORS[15];
  CURRENT_PICKS.background = COLORS[16];
  CURRENT_PICKS.layer = 0;

  CANVAS_SETTINGS.setSize(80, 25);
}
