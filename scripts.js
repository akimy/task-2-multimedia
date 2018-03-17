const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const voiceSelect = 'distortion';

const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

const distortion = audioCtx.createWaveShaper();
const biquadFilter = audioCtx.createBiquadFilter();
const convolver = audioCtx.createConvolver();
const gainNode = audioCtx.createGain();

// set up canvas context for visualizer

const msg = new window.SpeechSynthesisUtterance('');
msg.rate = 1; // Скорость от 0 до 10
msg.pitch = 0.2; // Высота от 0 до 2
msg.text = 'Movement';
msg.lang = 'en-US';

let detected = false;
let detectingInProcess = false;
let oldRgb = { r: 0, g: 0, b: 0 };

const detectMove = () => {
  if (!detectingInProcess) {
    const diff = Math.abs(oldRgb.r - rgb.r) + Math.abs(oldRgb.g - rgb.g)
    + Math.abs(oldRgb.b - rgb.b);
    if (diff > 7) {
      window.speechSynthesis.speak(msg);
      detected = true;
      detectingInProcess = true;
      setTimeout(() => {
        detectingInProcess = false;
        oldRgb = rgb;
      }, 2500);
    } else {
      detected = false;
    }
  }
};

const player = document.querySelector('.video-instance');
const scene = document.querySelector('.scene');
const ui = document.querySelector('.interface');

let [width, height] = [770, 650];

// Responsive (для мобильных устройств)
if (window.innerWidth < 770) {
  [width, height] = [window.innerWidth, window.innerHeight];
}

// Определяем какие размеры для видеопотока с камеры нам нужны
const constraints = { audio: true, video: { width, height } };
navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    player.src = URL.createObjectURL(stream);
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(convolver);
    convolver.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  });

const ctx = scene.getContext('2d');
const ctxI = ui.getContext('2d');
[scene.width, scene.height] = [width, height];
[ui.width, ui.height] = [width, height];

let rgb = { r: 0, g: 0, b: 0 };

function drawScene() {
  rgb = { r: 0, g: 0, b: 0 };
  ctx.drawImage(player, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);

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
  ctx.putImageData(imageData, 0, 0);

  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);
  window.requestAnimationFrame(drawScene);
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

const drawDetected = () => {
  ctxI.fillStyle = '#00ffff';
  ctxI.fillText('MOVEMENT_DETECTED', 10, 125);
};


analyser.fftSize = 2048;
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);

function drawui() {
  analyser.getByteTimeDomainData(dataArray);
  ctxI.clearRect(0, 0, 400, 400);
  ctxI.fillStyle = 'rgb(200, 200, 200)';
  ctxI.lineWidth = 2;
  ctxI.strokeStyle = 'rgb(204, 255, 255)';
  ctxI.beginPath();

  const sliceWidth = 320 * 1.0 / bufferLength;
  let x = 10;

  for (let i = 0; i < bufferLength; i += 1) {
    const v = dataArray[i] / 128.0;
    const y = 180 + v * 120 / 2;
    if (i === 0) {
      ctxI.moveTo(x, y);
    } else {
      ctxI.lineTo(x, y);
    }

    x += sliceWidth;
  }
  ctxI.stroke();
  ctxI.font = '20px OCR-A';
  ctxI.fillStyle = 'white';
  const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
  ctxI.fillText(`AVERAGE_COLOR: ${hexColor}`, 10, 50);
  ctxI.fillText(`CURR_TIME: ${new Date().getTime()}`, 10, 75);
  ctxI.fillText(`T_4_HUMAN: ${new Date().toDateString()}`, 10, 100);
  ctxI.fillStyle = hexColor;
  ctxI.fillRect(10, 140, 320, 30);
  ctxI.strokeStyle = '#fff';
  ctxI.strokeRect(10, 140, 320, 30);
  if (detected) {
    drawDetected();
  }
  detectMove();
  window.requestAnimationFrame(drawui);
}

drawScene();
drawui();
