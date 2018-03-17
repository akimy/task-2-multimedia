import CanvasBase from './CanvasBase';

export default class VideoScene extends CanvasBase {
  constructor(videoElement, audioCtx, canvasElement, width, height, voiceInstance) {
    super(canvasElement, width, height);

    this.constraints = { audio: true, video: { width, height } };
    this.video = videoElement;
    this.audioCtx = audioCtx;
    this.detected = false;
    this.detectingInProcess = false;
    this.speaker = voiceInstance;
  }

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

  getDataArray() {
    return this.dataArray;
  }

  getAnalyser() {
    return this.analyser;
  }

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

  setDetected(bool) {
    this.detected = bool;
  }

  getDetected() {
    return this.detected;
  }

  setDetectedInProcess(bool) {
    this.detectingInProcess = bool;
  }

  setRGB(newRGB) {
    this.rgb = newRGB;
  }

  setOldRGB(newOldRGB) {
    this.oldRgb = newOldRGB;
  }

  getRGB() {
    return this.rgb;
  }

  animate() {
    const rgb = { r: 0, g: 0, b: 0 };
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);

    const { data } = imageData;
    const { length } = data;
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

    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    this.setRGB(rgb);
    requestAnimationFrame(this.animate.bind(this));
  }
}
