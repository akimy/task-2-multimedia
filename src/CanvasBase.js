export default class CanvasBase {
  constructor(canvasElement, width, height) {
    [canvasElement.width, canvasElement.height] = [width, height];
    this.el = canvasElement;
    [this.width, this.height] = [width, height];
    this.ctx = canvasElement.getContext('2d');
    this.number = 2;
  }
}
