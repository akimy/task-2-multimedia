/**
 * @class CanvasBase - Абстрактный класс  предназначенный для наследования. Является родителем
 * для холстов Canvas во всем этом проекте. Устанавливает контекст, заданную ширину и высоту,
 * шрифт OCR-A, ширину линии карандаша
 */
export default class CanvasBase {
  /**
   * @param {DOMElement} canvasElement - DOM-элемент холста .
   * @param {number} width - ширина холста
   * @param {number} height - высота холста
   */
  constructor(canvasElement, width, height) {
    [canvasElement.width, canvasElement.height] = [width, height];
    [this.width, this.height] = [width, height];

    const ctx = canvasElement.getContext('2d');
    ctx.lineWidth = 2;
    ctx.font = '20px OCR-A';
    this.ctx = ctx;
  }
}
