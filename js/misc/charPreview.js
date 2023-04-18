import { COLORS, CURRENT_PICKS } from '../globals';
import { g } from '../lib';

export default function charPreview() {
  CURRENT_PICKS.onCharChange('charPreview', (e) => {
    g('char-preview').innerHTML = e;
  });

  CURRENT_PICKS.onColorChange('charPreview', (e) => {
    g('char-preview').style.color = e;
  });

  CURRENT_PICKS.onBackgroundChange('charPreview', (e) => {
    if (e !== COLORS[16]) {
      g('char-preview').style.background = 'none';
      g('char-preview').style.backgroundColor = e;
    } else {
      g('char-preview').style.background = 'url("../assets/transparency.png")';
      g('char-preview').style.backgroundColor = COLORS[0];
    }
  });
}
