import CanvasBase from './CanvasBase';

/**
 * @class TerminatorInterface - класс отвечающий за рисование на холсте интерфейса
 * (гистограммы звука, среднего цвета, текущей даты в двух форматах, цвета в HEX и
 * надпись детектора движения, имеет сильную связь с инстансом VideoScene, т.к. берет
 * оттуда аудиопоток)
 * @extends CanvasBase
*/
export default class TerminatorInterface extends CanvasBase {
  constructor(canvasElement, width, height) {
    super(canvasElement, width, height);
    this.bufferLength = 2048;
  }

  /**
   * Подключает к инстансу аудиопоток из экземпляра VideoScene
   * @param {VideoScene} scene
   * @returns {Promise}
   */
  connectScene(scene) {
    return new Promise((resolve) => {
      this.scene = scene;
      const analyser = scene.getAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      [this.analyser, this.bufferLength, this.dataArray] = [analyser, bufferLength, dataArray];
      resolve(this);
    });
  }

  /**
   * Переводит число из 10-тичной системы в 16-ную
   * @param {number} c - число от 0 до 255
   * @returns {string} - возвращает 16-ное число
   */
  valToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  /**
   * Переводит RGB цвет в HEX
   * @param {number} r - красный канал
   * @param {number} g - зеленый канал
   * @param {number} b - синий канал
   * @returns {string} - возвращает HEX значение цвета
   */
  rgbToHex(r, g, b) {
    return `#${this.valToHex(r)}${this.valToHex(g)}${this.valToHex(b)}`;
  }

  /**
   * Рисует надпись детектора о движении на холсте интерфейса
   */
  drawDetected() {
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillText('MOVEMENT_DETECTED', 10, 125);
  }

  /**
   * Очищает холст интерфейса
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Устанавливает цвет заливки
   * @returns {Promise}
   */
  setFillStyle(value) {
    this.ctx.fillStyle = value;
  }

  /**
   * Устанавливает цвет линий
   * @param {string} value - rgb значение цвета
   */
  setStrokeStyle(value) {
    this.ctx.strokeStyle = value;
  }

  /** Рисует гистограмму звуковой волны (Waveshape) на координате 10, 180
   * Графика рисуется посредством итерации по буферу данных из аудиопотока, так же рисует среднюю
   * громкость в аудиопотоке
   */
  drawHistogramm() {
    this.setFillStyle('rgb(200, 200, 200)');
    this.setStrokeStyle('rgb(204, 255, 255)');
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.ctx.beginPath();
    const sliceWidth = 320 / this.bufferLength;
    let x = 10;
    let waveVolumeValues = 0;
    for (let i = 0; i < this.bufferLength; i += 1) {
      const v = this.dataArray[i] / 128 * 60;
      waveVolumeValues += Math.abs(this.dataArray[i] - 128);
      const y = 180 + v;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.ctx.stroke();
    this.drawAverageVolume(waveVolumeValues);
  }

  /**
   * Рисует цветной столб громкости в правом-нижнем углу
   * @param {number} waveVolumeValues - сумма громкостей из аудио буфера
   */
  drawAverageVolume(waveVolumeValues) {
    const averageVolume = (waveVolumeValues / this.bufferLength) * 15 + 20;
    const fragments = Math.min(Math.round(averageVolume / 5), 75);

    for (let i = 0; i <= fragments; i += 1) {
      this.setFillStyle(`rgb(${Math.min(i * 5, 255)}, ${Math.max(255 - i * 3, 0)}, 50)`);
      this.ctx.fillRect(this.width - 35, this.height - 5 - i * 5, 30, -3);
    }
  }

  /**
   * Рисует весь буквенный интерфейс терминатора (кроме надписи детектора движения)
   * @param {string} hexColor - цвет в HEX
   */
  drawTexts(hexColor) {
    this.setFillStyle('#FFFFFF');
    this.ctx.fillText(`AVERAGE_COLOR: ${hexColor}`, 10, 50);
    this.ctx.fillText(`CURR_TIME: ${new Date().getTime()}`, 10, 75);
    this.ctx.fillText(`T_4_HUMAN: ${new Date().toDateString()}`, 10, 100);
  }

  /**
   * Рисует квадрат с аппроксимированным цветом со всего видеопотока (средний цвет)
   * @param {string} hexColor - цвет в HEX
   */
  drawAvarageColorRect(hexColor) {
    this.ctx.fillStyle = hexColor;
    this.ctx.fillRect(10, 140, 320, 30);
    this.ctx.strokeStyle = '#fff';
    this.ctx.strokeRect(10, 140, 320, 30);
  }

  /**
   * Запускает рекурсивный цикл с анимацией для обновления всего холста
   */
  animate() {
    const rgb = this.scene.getRGB();
    const hexColor = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    this.clearCanvas();
    this.drawHistogramm();
    this.drawTexts(hexColor);
    this.drawAvarageColorRect(hexColor);
    if (this.scene.getDetected()) {
      this.drawDetected();
    }

    // Попытка детектора обратиться в инстанс VideoScene для фиксации движения
    this.scene.detectMove();

    requestAnimationFrame(this.animate.bind(this));
  }
}
