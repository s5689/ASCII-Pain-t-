import buildCharPreview from './charPreview';
import buildColorPicker from './colorPicker';
import buildToolPicker from './toolPicker/_toolPicker';

export default function panelTop() {
  buildCharPreview();
  buildColorPicker();
  buildToolPicker();
}
