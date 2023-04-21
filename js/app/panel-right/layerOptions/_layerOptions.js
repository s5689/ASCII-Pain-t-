import buildHeader from './header';
import buildContainer from './contianer';
import { g } from '../../../lib';

export default function buildLayerOptions() {
  buildHeader();
  buildContainer();

  g('add-layer').click();
}
