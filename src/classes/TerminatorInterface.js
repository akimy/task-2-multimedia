import CanvasBase from './CanvasBase';

export default class TerminatorInterface extends CanvasBase {
  constructor(canvasElement, width, height) {
    super(canvasElement, width, height);
    this.bufferLength = 2048;
  }

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

  valToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  rgbToHex(r, g, b) {
    return `#${this.valToHex(r)}${this.valToHex(g)}${this.valToHex(b)}`;
  }

  drawDetected() {
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillText('MOVEMENT_DETECTED', 10, 125);
  }

  animate() {
    const rgb = this.scene.getRGB();
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.ctx.clearRect(0, 0, 400, 400);
    this.ctx.fillStyle = 'rgb(200, 200, 200)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'rgb(204, 255, 255)';
    this.ctx.beginPath();

    const sliceWidth = 320 * 1.0 / this.bufferLength;
    let x = 10;
    for (let i = 0; i < this.bufferLength; i += 1) {
      const v = this.dataArray[i] / 128.0;
      const y = 180 + v * 120 / 2;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.ctx.stroke();
    this.ctx.font = '20px OCR-A';
    this.ctx.fillStyle = 'white';
    const hexColor = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    this.ctx.fillText(`AVERAGE_COLOR: ${hexColor}`, 10, 50);
    this.ctx.fillText(`CURR_TIME: ${new Date().getTime()}`, 10, 75);
    this.ctx.fillText(`T_4_HUMAN: ${new Date().toDateString()}`, 10, 100);
    this.ctx.fillStyle = hexColor;
    this.ctx.fillRect(10, 140, 320, 30);
    this.ctx.strokeStyle = '#fff';
    this.ctx.strokeRect(10, 140, 320, 30);
    if (this.scene.getDetected()) {
      this.drawDetected();
    }
    this.scene.detectMove();
    requestAnimationFrame(this.animate.bind(this));
  }
}
