export const COLORS = [
  'black',
  'rgba(0, 0, 128, 1)',
  'rgba(0, 128, 0, 1)',
  'rgba(0, 128, 128, 1)',
  'rgba(128, 0, 0, 1)',
  'rgba(128, 0, 128, 1)',
  'rgba(128, 128, 0, 1)',
  'rgba(192, 192, 192, 1)',
  'rgba(128, 128, 128, 1)',
  'rgba(0, 0, 255, 1)',
  'rgba(0, 255, 0, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(255, 0, 0, 1)',
  'rgba(255, 0, 255, 1)',
  'rgba(255, 255, 0, 1)',
  'rgba(255, 255, 255, 1)',
  'rgba(0 ,0 ,0 ,0)',
];

export const CURRENT_PICKS = {
  /*
    Char

  */
  _char: '',
  charCallbacks: [],

  get char() {
    return this._char;
  },

  set char(e) {
    this._char = e;
    Object.values(this.charCallbacks).forEach((value) => value(e));
  },

  onCharChange(id, e) {
    this.charCallbacks[id] = e;
  },

  offCharChange(id) {
    delete this.charCallbacks[id];
  },

  /*
    Color

  */
  _color: '',
  colorCallbacks: {},

  get color() {
    return this._color;
  },

  set color(e) {
    this._color = e;
    Object.values(this.colorCallbacks).forEach((value) => value(e));
  },

  onColorChange(id, e) {
    this.colorCallbacks[id] = e;
  },

  offColorChange(id) {
    delete this.colorCallbacks[id];
  },

  /*
    Background

  */
  _background: '',
  backgroundCallbacks: {},

  get background() {
    return this._background;
  },

  set background(e) {
    this._background = e;
    Object.values(this.backgroundCallbacks).forEach((value) => value(e));
  },

  onBackgroundChange(id, e) {
    this.backgroundCallbacks[id] = e;
  },

  offBackgroundCallback(id) {
    delete this.backgroundCallbacks[id];
  },

  /*
    Layer
  
  */
  _layer: null,
  layerCallbacks: {},

  get layer() {
    return this._layer;
  },

  set layer(e) {
    Object.values(this.layerCallbacks).forEach((value) => value(e));
    this._layer = e;
  },

  onLayerChange(id, e) {
    this.layerCallbacks[id] = e;
  },

  offLayerCallback(id) {
    delete this.layerCallbacks[id];
  },

  /*
    Tool

  */
  _tool: null,
  toolCallbacks: {},

  get tool() {
    return this._tool;
  },

  set tool(e) {
    this._tool = e;
    Object.values(this.toolCallbacks).forEach((value) => value(e));
  },

  onToolChange(id, e) {
    this.toolCallbacks[id] = e;
  },

  offToolCallback(id) {
    delete this.toolCallbacks[id];
  },
};
