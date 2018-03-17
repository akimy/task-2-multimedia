import CanvasBase from './CanvasBase';

/**
 * @class VideoScene - класс отвечающий за рисование видеопотока на холсте canvas
 * а также за рассчет среднего цвета на холсте и детектор движение. Аудио
 * хранится также в области видимости этого класса. Были созданы публичные методы
 * для работы с источником звука.
 */
export default class VideoScene extends CanvasBase {
  /**
   *
   * @param {DOMElement} videoElement - элемент с тега video
   * @param {AudioContext} audioCtx - интерфейс для работы с audio - нодами
   * @param {DOMElement} canvasElement - элемент холста canvas
   * @param {number} width - ширина холста
   * @param {number} height - высота холста
   * @param {SynteticSpeech} voiceInstance - экземпляр класса для проигрывания голоса
   */
  constructor(videoElement, audioCtx, canvasElement, width, height, voiceInstance) {
    super(canvasElement, width, height);
    this.constraints = { audio: true, video: { width, height } }; // желаемое разрешение с камеры
    this.video = videoElement;
    this.audioCtx = audioCtx;
    this.detected = false;
    this.detectingInProcess = false;
    this.speaker = voiceInstance;

    // Установка начальных значений для детектирования
    this.rgb = { r: 0, g: 0, b: 0 };
    this.oldRgb = { r: 0, g: 0, b: 0 };
  }

  /**
   * Метод выполняющий загрузку аудио и видеопотока в класс
   * магические константы в методе - работа с WebAudio API (установка размера буфера,
   *  сглаживание, e.t.c.) по авершению загрузки начинается анимация отрисовки буфера видео
  */
  load() {
    const { audioCtx } = this;
    const analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -80;
    analyser.maxDecibels = -8;
    analyser.smoothingTimeConstant = 0.4;
    analyser.fftSize = 2048;
    this.analyser = analyser;

    navigator.mediaDevices.getUserMedia(this.constraints)
      .then((stream) => {
        this.video.src = URL.createObjectURL(stream);
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        this.animate();
      });
  }

  /**
   * Публичный метод для связи с интерфейсом
   * @returns analyser - возвращает ноду анализатора
  */
  getAnalyser() {
    return this.analyser;
  }

  /**
   * Метод для фиксации движения на камере, сравнивает суммарную разницу цветов на разных
   * состояниях. Флайтайм - 2,5 секунды. Разница значений в 7 единиц вызывает детект.
   */
  detectMove() {
    const {
      detectingInProcess, oldRgb, rgb, speaker,
    } = this;

    if (!detectingInProcess) {
      const diff = Math.abs(oldRgb.r - rgb.r) + Math.abs(oldRgb.g - rgb.g)
         + Math.abs(oldRgb.b - rgb.b);
      if (diff > 7) {
        speaker.speak();
        this.setDetected(true);
        this.setDetectedInProcess(true);
        setTimeout(() => {
          this.setDetectedInProcess(false);
          this.setOldRGB(rgb);
        }, 2500);
      } else {
        this.setDetected(false);
      }
    }
  }

  /**
   * Устанавливает значение детекта. Если True - значит в данный момент зафиксированно
   * движение
   * @param {bool} bool
   */
  setDetected(bool) {
    this.detected = bool;
  }

  /**
   * Возвращает значение детекта для связи с интерфейсом терминатора.
   * @returns {bool} detected - возвращает текущее значение детекта.
   */
  getDetected() {
    return this.detected;
  }

  /**
   * Устанавливает значение процесса детекта (необходимо для флайтайма)
   * @param {bool} bool
   */
  setDetectedInProcess(bool) {
    this.detectingInProcess = bool;
  }

  /**
   * Устанавливает текущее значение RGB
   * @param {Object} newRGB - объект вида {r, g, b} - трехканальный формат цвета
   */
  setRGB(newRGB) {
    this.rgb = newRGB;
  }

  /**
   * Устанавливает новое-старое значение RGB (для сравнения)
   * @param {Object} newOldRGB - объект вида {r, g, b} - трехканальный формат цвета
   */
  setOldRGB(newOldRGB) {
    this.oldRgb = newOldRGB;
  }

  /**
   * Возвращает текущий RGB
   * @returns {Object} rgb - объект вида {r, g, b} - трехканальный формат цвета
  */
  getRGB() {
    return this.rgb;
  }

  /**
   * Рисует изображение с видеопотока
   */
  drawVideo() {
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
  }

  /**
   * Добавляет шум и рассчитывает средний цвет пиксела для детектора движения и отображения
   * в интерфейса
  */
  drawNoiseAndComputeAvarageColor() {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const rgb = { r: 0, g: 0, b: 0 };
    const { data } = imageData;
    const { length } = data;

    /* Используется while для оптимизации в производительности, переменные вынесены
     * наружу чтобы избежать предекларирования и сэкономить память структура данных
     * массива data, линейный массив. Каждые четыре значения это один пиксел (красный канал,
     * зеленый, синийи etc). Происходит итерация по каждому 15-му пикселу и в красный канал
     * вносим шум (т.к фильтр все равно красный), остальную информацию вносим в rgb объект
     *  и делим на кол-во пикселов (находим среднее)
    */
    let i = 0;
    let rand = 0;
    let count = 0;
    while (i < length) {
      count += 1;
      rgb.r += data[i];
      rgb.g += data[i + 1];
      rgb.b += data[i + 2];
      rand = (0.5 - Math.random());
      data[i] += rand * 255;
      data[i + 1] += rand * 255;
      data[i + 2] += rand * 255;
      i += 60;
    }
    this.ctx.putImageData(imageData, 0, 0);

    rgb.r = Math.round(rgb.r / count);
    rgb.g = Math.round(rgb.g / count);
    rgb.b = Math.round(rgb.b / count);

    this.setRGB(rgb);
  }

  animate() {
    this.drawVideo();
    this.drawNoiseAndComputeAvarageColor();
    requestAnimationFrame(this.animate.bind(this));
  }
}
