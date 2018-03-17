import SynteticSpeech from './classes/SynteticSpeech';
import TerminatorInterface from './classes/TerminatorInterface';
import VideoScene from './classes/VideoScene';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Получаем дом
const videoElement = document.querySelector('.video-instance');
const sceneElement = document.querySelector('.scene');
const interfaceElement = document.querySelector('.interface');

let [width, height] = [770, 650];

// Responsive (для мобильных устройств)
if (window.innerWidth < 770) {
  [width, height] = [window.innerWidth, window.innerHeight];
}

const voice = new SynteticSpeech('en-US', window.speechSynthesis, window.SpeechSynthesisUtterance);
voice.setRate(1);
voice.setPitch(0.4);
voice.setText('Movement');

const videoScene = new VideoScene(videoElement, audioCtx, sceneElement, width, height, voice);
videoScene.setRGB({ r: 0, g: 0, b: 0 });
videoScene.setOldRGB({ r: 0, g: 0, b: 0 });
videoScene.load();

const ui = new TerminatorInterface(interfaceElement, width, height);
ui.connectScene(videoScene)
  .then(terminatorInterface => terminatorInterface.animate());
