/**
 * @class CanvasBase - Абстрактный класс  предназначенный для наследования. Является родителем
 * для холстов Canvas во всем этом проекте. Устанавливает контекст, заданную ширину и высоту
*/
export default class CanvasBase {
  /**
   * @param {DOMElement} canvasElement - DOM-элемент холста .
   * @param {number} width - ширина холста
   * @param {number} height - высота холста
   */
  constructor(canvasElement, width, height) {
    [canvasElement.width, canvasElement.height] = [width, height];
    this.el = canvasElement;
    [this.width, this.height] = [width, height];
    this.ctx = canvasElement.getContext('2d');
  }
}
